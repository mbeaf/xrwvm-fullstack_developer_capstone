import requests
import os

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None

if load_dotenv is not None:
    load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")


def get_request(endpoint, **kwargs):
    """GET a backend endpoint, passing keyword arguments as URL parameters."""
    response = requests.get(
        f"{backend_url.rstrip('/')}/{endpoint.lstrip('/')}",
        params=kwargs,
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def post_review(data_dict):
    """Submit a review to the backend review endpoint."""
    response = requests.post(
        f"{backend_url.rstrip('/')}/insert_review",
        json=data_dict,
        timeout=10,
    )
    response.raise_for_status()
    return response.json()
