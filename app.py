from flask import Flask, render_template, request
import re

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        # validate form values
        if not request.form.get("username") or not request.form.get("password") or not request.form.get("confirm"):
            return render_template("error.html", error="Invalid Form Submission")
    else:
        return render_template("signup.html")


if __name__ == "__main__":
    app.run(debug=True)