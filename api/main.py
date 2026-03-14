import os
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
load_dotenv()

UNSPLASH_URL = "https://api.unsplash.com/search/photos"
UNSPLASH_KEY = os.environ.get("UNSPLASH_KEY")

DEBUG = os.environ.get("DEBUG", "True").lower() == "true"

if not UNSPLASH_KEY:
    raise EnvironmentError("UNSPLASH_KEY is missing in .env")

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = DEBUG


@app.route("/")
def home():
    return "API Running"


@app.route("/get_images")
def get_images():
    search = request.args.get("query")
    if not search:
        return jsonify({"error": "Query parameter is required"}), 400
    headers = {
        "Authorization": f"Client-ID {UNSPLASH_KEY}",
        "Accept-Version": "v1"
    }
    params = {"query": search, "per_page": 10}
    try:
        response = requests.get(UNSPLASH_URL, headers=headers, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)