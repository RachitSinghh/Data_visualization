from app import app
from app.database import load_data

if __name__ == '__main__':
    load_data()  # Load data into MongoDB if not already loaded
    app.run(debug=True, port = 5001) 