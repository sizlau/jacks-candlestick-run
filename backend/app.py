import sqlite3

from flask import Flask, request, jsonify

app = Flask(__name__)

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

@app.route('/scores', methods=['POST'])
def submit_score():
    data = request.get_json()
    name = data['name']
    score = data['score']

    conn = sqlite3.connect('leaderboard.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO scores (name, score) VALUES (?, ?)', (name, score))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Score Submitted Successfully'})

@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    conn = sqlite3.connect('leaderboard.db')
    cursor = conn.cursor()
    cursor.execute('SELECT name, score FROM scores ORDER BY score DESC LIMIT 10')
    rows = cursor.fetchall()
    conn.close()

    leaderboard = []
    for row in rows:
        leaderboard.append({'name': row[0], 'score': row[1]})

    return jsonify(leaderboard)

@app.route('/')
def home():
    return "Jack's Candlestick Run API is running!"

if __name__ == '__main__':
    app.run(debug=True)