import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_home_page(client):
    response = client.get('/')
    assert response.status_code == 200


def test_submit_score_missing_fields(client):
    response = client.post('/scores', json={'score': 100})
    assert response.status_code == 400

def test_submit_score_wrong_type(client):
    response = client.post('/scores', json={'name': 'Jack', 'score': 'banana'})
    assert response.status_code == 400

def test_submit_score_valid(client):
    response = client.post('/scores', json={'name': 'TestUser', 'score': 50})
    assert response.status_code == 200

def test_leaderboard_returns_list(client):
    response = client.get('/leaderboard')
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)
