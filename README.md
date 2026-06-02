# GameRack
Personal Game Library Tracker

## Database Setup
This application uses PostgresSQL.

## Setup 
### Set up Session Secret Key
To successfully use Flask's Sessions to store and maintain a user's logging information, you will need to set up your application's secret key.
1. Create a `.env` file and add it to  `.gitignore`
2. Add your secret key: ```SECRET_KEY=yoursecretkey```

## FAQs
### How to run a virtual environment in MacOs
1. run ```python3 -m venv venv```
2. run ```source venv/bin/activate```
3. run ```pip install -r requirements.txt```

If needed, delete your virtual environment by running ```-rf venv```

### How to run a virtual environment in Windows
1. run ```.venv\Scripts\Activate.ps1```
