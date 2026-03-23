from flask import Flask, render_template, request
import re
import sqlite3
from flask_bcrypt import Bcrypt

app = Flask(__name__)

bcrypt = Bcrypt(app)

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmed_password = request.form.get("confirmed_password")

        # validate form values exist
        if not request.form.get("username") or not request.form.get("password") or not request.form.get("confirmed_password"):
            return render_template("error.html", error="Invalid Form Submission")
        else:
            # validate username is not taken

            # validate password matches criteria
            if re.search(r"[a-z]", password) and re.search(r"[A-Z]", password) and re.search(r"[0-9]", password) and len(password) >= 8:
                # validate confirmed password matches password
                if (password == confirmed_password):

                    # encrypt the password before adding it to the database
                    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

                    # create user account
                    with sqlite3.connect('gamesrack.db') as conn:
                        cursor = conn.cursor()
                        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
                        conn.commit()   

                    return render_template("home.html")  

                else:
                    return render_template("error.html", error="Password does not match, please try again")

            else:
                return render_template("error.html", error="Password does not meet minimal requirements")

    else:
        return render_template("signup.html")


if __name__ == "__main__":
    app.run(debug=True)

    