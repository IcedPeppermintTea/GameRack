from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import psycopg2
from flask_bcrypt import Bcrypt
import re
import os
from dotenv import load_dotenv
import requests

load_dotenv() # load the .env file

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
RAWG_API_KEY = os.getenv("RAWG_API_KEY")
DATABASE_URL = os.getenv('DATABASE_URL')

bcrypt = Bcrypt(app)

@app.route("/", methods=["GET", "POST"])
def index():
    # variables
    error_msg = "" 

    if request.method == "POST":
        # validate login
        username = request.form.get("username")
        password = request.form.get("password")

        # connect to db
        with psycopg2.connect(os.getenv('DATABASE_URL')) as conn:
                    cursor = conn.cursor()
                    cursor.execute("SELECT username, password FROM users WHERE username = %s", (username,))
                    db_match = cursor.fetchone()
                    conn.commit()

        # does username exist in the db
        if db_match is None:
            error_msg="The Username entered matches no accounts. Please try again."
        else:
            is_pswd_valid = bcrypt.check_password_hash(db_match[1], password)
            if (is_pswd_valid):
                session["username"] = username
                return redirect(url_for("home"))
            else:
                error_msg="The Password entered is incorrect"
    
    return render_template("index.html", error_msg=error_msg)

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmed_password = request.form.get("confirmed_password")

        # validate form values exist
        if not request.form.get("username") or not request.form.get("password") or not request.form.get("confirmed_password"):
            flash("Invalid form submission") 
        else:
            # validate password matches criteria
            if re.search(r"[a-z]", password) and re.search(r"[A-Z]", password) and re.search(r"[0-9]", password) and len(password) >= 8:

                # validate confirmed password matches password
                if (password == confirmed_password):
                    # encrypt the password before adding it to the database
                    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
                    # create user account
                    with psycopg2.connect(os.getenv('DATABASE_URL')) as conn:
                        cursor = conn.cursor()

                        # validate username is not taken
                        cursor.execute("SELECT username FROM users WHERE username = %s", (username,))
                        db_match = cursor.fetchone()

                        if db_match:
                            flash("Username is already taken. Please try again")
                        else:
                            cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password))
                            conn.commit()   
                            session["username"] = username
                            return redirect(url_for("home"))  

                else:
                    flash("Password does not match, please try again")
            else:
                flash("Password does not meet minimal requirements")

        return redirect(url_for("signup"))
    else:
        return render_template("signup.html")

@app.route("/home")
def home():
    username = session.get('username')
    return render_template("home.html", username=username)

@app.route("/search", methods=["GET"])
def search():
    # read search term from url
    r = request.args.get("q")

    # call rawg api with search term
    response = requests.get("https://api.rawg.io/api/games", params={
        "key": RAWG_API_KEY,
        "search": r
    })

    # parse response from rawg
    data = response.json()

    # clean the response to only include necessary fields
    game_results = [
        {
        "rawg_id": game["id"],
        "title": game["name"],
        "cover_url": game["background_image"]
        }
    for game in data["results"]
    ]

    # return cleaned json data to browser
    return jsonify(game_results)



@app.route("/library/add", methods=["POST"])
def add_game():
    # access username cookie
    username = session.get("username")

    # get game details from the request body
    data = request.get_json()
    rawg_id = data["rawg_id"]
    title = data["title"]
    cover_url = data["cover_url"]

    # connect to database
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    # check if the game exists in the 'games' table, if not add it
    cursor.execute("SELECT * FROM games WHERE rawg_id = (%s)", (rawg_id,))
    game = cursor.fetchone()
    if (game == None):
        cursor.execute("INSERT INTO games (rawg_id, title, cover_url) VALUES (%s, %s, %s)", (rawg_id, title, cover_url))
        conn.commit()
        print("successfully added game to the database")
        # fetch game_id
        cursor.execute("SELECT * FROM games WHERE rawg_id = (%s)", (rawg_id,))
        game = cursor.fetchone()

    # fetch game_id
    game_id = game[0]

    # fetch user_id
    cursor.execute("SELECT id FROM users WHERE username = (%s)", (username,))
    user = cursor.fetchone()
    user_id = user[0]

    # add game to the library of this user
    cursor.execute("INSERT INTO library (user_id, game_id, state) VALUES (%s, %s, %s)", (user_id, game_id, "wanted"))

    conn.commit()
    conn.close()
    return jsonify({"success": True}) # send success response to the browser

@app.route("/library", methods=["GET"])
def library():

    username = session.get("username")

    # query for all the games in user's library
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    cursor.execute("""SELECT games.title, games.cover_url, library.state, 
    library.rating, library.review, library.date_added 
    FROM library 
    JOIN games ON library.game_id = games.id 
    JOIN users ON library.user_id = users.id 
    WHERE username = (%s)""", (username,))

    games = cursor.fetchall()

    return render_template("library.html", username=username, games=games)

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))
    

if __name__ == "__main__":
    app.run(debug=True)


