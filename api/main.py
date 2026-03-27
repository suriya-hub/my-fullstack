import os
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
from mongo_client import mongo_client, test_doc


gallery = mongo_client.gallery
images_collection = gallery.images

load_dotenv()
UNSPLASH_URL = "https://api.unsplash.com/search/photos"
UNSPLASH_KEY = os.environ.get("UNSPLASH_KEY")
DEBUG = os.environ.get("DEBUG", "True").lower() == "true"
if not UNSPLASH_KEY:
    raise EnvironmentError("UNSPLASH_KEY is missing in .env")

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = DEBUG


test_doc()

@app.route("/")
def home():
    return "API Running"

@app.route("/get_images")
def get_images():
    search = request.args.get("query")
    if not search:
        return jsonify({"error": "Query parameter is required"}), 400
    headers = {"Authorization": f"Client-ID {UNSPLASH_KEY}", "Accept-Version": "v1"}
    params = {"query": search, "per_page": 5}
    try:
        response = requests.get(UNSPLASH_URL, headers=headers, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


@app.route("/images", methods=["GET", "POST"])
def images():
    if request.method == "GET":
        images = images_collection.find({})
        result = []
        for img in images:
            img["_id"] = str(img["_id"])
            result.append(img)
        return jsonify(result)

    if request.method == "POST":
        image = request.get_json()
        if not image:
            return jsonify({"error": "Invalid JSON"}), 400
        image["_id"] = image.get("id")
        try:
            images_collection.insert_one(image)
            return jsonify({"message": "Inserted successfully"})
        except Exception as e:
            if "duplicate key error" in str(e):
                return jsonify({"error": "Image already exists"}), 400
            return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True, use_reloader=False)
