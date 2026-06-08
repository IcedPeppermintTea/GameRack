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

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))
    

if __name__ == "__main__":
    app.run(debug=True)


