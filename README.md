# GameRack

Personal Game Library Tracker — a full stack web app that lets you search for video games, add them to a personal shelf, track your status, leave ratings and reviews, and view insights about your gaming habits.

Built with Flask, PostgreSQL, and vanilla HTML/CSS/JavaScript.

## Live Demo

https://gamerack.up.railway.app/

## Screenshots

![Home page](screenshots/home.jpeg)
![Library](screenshots/library.jpeg)
![Edit Screen](screenshots/edit-screen.jpeg)

## Features

- Auth — sign up, log in, and stay logged in via Flask sessions
- Game search — search the RAWG API by title and get back cover art, genre, and release year
- Library management — add games to your shelf with a status: Wanted, Owned, Playing, or Finished
- Ratings & reviews — rate games out of 10 and write personal reviews
- Delete games — remove games from your library
- Home dashboard — see your 3 most recently added games and your 3 top rated games at a glance
- Insights — see your favourite and least played genre, favourite and least played decade

## Tech Stack

| Layer        | Technology                            |
| ------------ | ------------------------------------- |
| Backend      | Python, Flask                         |
| Database     | PostgreSQL, psycopg2                  |
| Frontend     | HTML, CSS, JavaScript (no frameworks) |
| Auth         | Flask sessions, flask-bcrypt          |
| External API | RAWG Video Games Database API         |
| Config       | python-dotenv                         |

## Local Setup

### Prerequisites

- Python 3.10+
- PostgreSQL
- A free [RAWG API key](https://rawg.io/apidocs)

### 1. Clone the repository

```bash
git clone https://github.com/IcedPeppermintTea/GameRack.git
cd GameRack
```

### 2. Create and activate a virtual environment

**macOS / Linux**

```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows**

```bash
.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up environment variables

Create a `.env` file in the root of the project and add the following:

```
SECRET_KEY=secret_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/gamerack
RAWG_API_KEY=rawg_api_key_here
```

- `SECRET_KEY` — any random string, used by Flask to sign session cookies
- `DATABASE_URL` — your PostgreSQL connection string
- `RAWG_API_KEY` — get yours free at [rawg.io/apidocs](https://rawg.io/apidocs)

### 5. Set up the database

Create a PostgreSQL database, then run the schema:

```bash
psql -d gamerack -f schema.sql
```

### 6. Run the app

```bash
python app.py
```

Visit `http://127.0.0.1:5000` in your browser.

---

## Database Schema

See schema [here](schema.sql).

## API Routes

| Method | Route              | Description                   | Auth             |
| ------ | ------------------ | ----------------------------- | ---------------- |
| GET    | `/`                | Login page                    | Public           |
| POST   | `/`                | Submit login                  | Public           |
| GET    | `/signup`          | Signup page                   | Public           |
| POST   | `/signup`          | Create account                | Public           |
| GET    | `/home`            | Home dashboard                | Session required |
| GET    | `/search?q=`       | Search RAWG for games         | Session required |
| POST   | `/library/add`     | Add game to library           | Session required |
| GET    | `/library`         | View user's library           | Session required |
| POST   | `/library/update`  | Update status, rating, review | Session required |
| DELETE | `/library/delete`  | Remove game from library      | Session required |
| GET    | `/library/summary` | Recently added + top rated    | Session required |
| GET    | `/insights`        | Genre and decade insights     | Session required |
| GET    | `/logout`          | Clear session and log out     | Session required |

---

## Known Limitations & Future Improvements

- **Game identifier** — games are currently identified by title in some operations rather than `rawg_id` or `library.id`. A future refactor should pass `library.id` through the frontend for all update and delete operations to avoid edge cases with duplicate titles.
- **Single genre** — each game stores only its primary genre. A proper many-to-many `genres` table would allow more accurate insights.
- **Connection pooling** — the app opens a new database connection on every request. SQLAlchemy or psycopg2's connection pool would be more efficient at scale.
- **Error pages** — errors currently return JSON or basic messages. A proper error page template would improve the user experience.
- **Responsiveness** — the app is designed for desktop browsers and has not been
  optimised for mobile or tablet viewports. A responsive layout using CSS media
  queries would be a good addition in the future.

---

## FAQs

### How do I delete my virtual environment?

```bash
rm -rf venv
```

### The app won't start — what's wrong?

Check that your `.env` file exists and contains all three required variables. Check that your PostgreSQL database is running and the `DATABASE_URL` connection string is correct.

### I get a RAWG API error — why?

Make sure your `RAWG_API_KEY` in `.env` is valid. You can test it by visiting this URL in your browser:

```
https://api.rawg.io/api/games?key=YOUR_KEY&search=zelda
```

If JSON comes back, the key works.
