import sqlite3
from flask_cors import CORS

from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect('leaderboard.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            score INTEGER NOT NULL,
            date TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    try: 
        conn = sqlite3.connect('leaderboard.db')
        cursor = conn.cursor()
        cursor.execute('SELECT name, score FROM scores ORDER BY score DESC LIMIT 10')
        rows = cursor.fetchall()
        conn.close()

        leaderboard = []
        for row in rows:
            leaderboard.append({'name': row[0], 'score': row[1]})

        return jsonify(leaderboard)
    except Exception as e:
        return jsonify({'error': 'Database error occurred'}), 500


@app.route('/scores', methods=['POST'])
def submit_score():
    data = request.get_json()

    if not data or 'name' not in data or 'score' not in data:
        return jsonify({'error': 'Missing name or score'}), 400

    name = data['name']
    score = data['score']

    if not isinstance(name, str) or len(name.strip()) == 0:
        return jsonify({'error': 'Invalid name'}), 400

    if len(name) > 20:
        return jsonify({'error': 'Name too long'}), 400

    if not isinstance(score, int):
        return jsonify({'error': 'Score must be a number'}), 400

    try:
        conn = sqlite3.connect('leaderboard.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO scores (name, score) VALUES (?, ?)', (name, score))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Score Submitted Successfully'})
    except Exception as e:
        return jsonify({'error': 'Database error occurred'}), 500

@app.route('/')
def home():
    return "Jack's Candlestick Run API is running!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)