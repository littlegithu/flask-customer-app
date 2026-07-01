from flask import Flask, request, jsonify, make_response
from customer import Customer
import structlog
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

log = structlog.get_logger()

customer_list = [
    Customer(1, "Jack", "Sparrow", "jack@email.com", "0712345678"),
    Customer(2, "Michael", "Scofield", "michael@email.com", "0712345678"),
    Customer(3, "Lincoln", "Burrows", "lincoln@email.com", "0712345678"),
    Customer(4, "Sara", "Tancredi", "sara@email.com", "0712345678"),
]

@app.before_request
def log_request():
    log.info("request", method=request.method, content_type=request.headers.get("Content-Type"), user_agent=request.headers.get("User-Agent"))

@app.route("/customers", methods=["GET", "POST"])
def customers():
    if request.method == "POST":
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400
        first_name = data.get("firstName")
        last_name = data.get("lastName")
        email = data.get("email")
        phone = data.get("phone")
        if not all([first_name, last_name, email, phone]):
            return jsonify({"error": "All fields required"}), 400
        cid = max((c.id for c in customer_list), default=0) + 1
        new_c = Customer(cid, first_name, last_name, email, phone)
        customer_list.append(new_c)
        return jsonify(new_c.to_dict()), 201
    return jsonify([c.to_dict() for c in customer_list]), 200

@app.route("/customers/<int:id>", methods=["GET", "PUT", "DELETE"])
def customer(id):
    c = next((c for c in customer_list if c.id == id), None)
    if not c:
        return jsonify({"error": "Not found"}), 404
    if request.method == "GET":
        return jsonify(c.to_dict()), 200
    elif request.method == "PUT":
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400
        c.first_name = data.get("firstName", c.first_name)
        c.last_name = data.get("lastName", c.last_name)
        c.email = data.get("email", c.email)
        c.phone = data.get("phone", c.phone)
        return jsonify(c.to_dict()), 200
    elif request.method == "DELETE":
        customer_list.remove(c)
        return jsonify({"message": "Deleted"}), 200

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    resp = make_response(jsonify({"message": "Login successful", "email": email}), 200)
    resp.set_cookie("logged_in", "true")
    resp.set_cookie("username", "user_demo")
    resp.set_cookie("email", email, max_age=3600)
    return resp

@app.route("/cookies", methods=["GET"])
def get_cookies():
    return jsonify({
        "logged_in": request.cookies.get("logged_in"),
        "username": request.cookies.get("username"),
        "email": request.cookies.get("email"),
    }), 200

@app.route("/logout", methods=["POST"])
def logout():
    resp = make_response(jsonify({"message": "Logged out"}), 200)
    for key in ["logged_in", "username", "email"]:
        resp.set_cookie(key, "", expires=0)
    return resp

@app.route('/')
def home():
    return jsonify({
        "message": "Customer API running",
        "endpoints": ["/customers (GET,POST)", "/customers/<id> (GET,PUT,DELETE)", "/login (POST)", "/cookies (GET)", "/logout (POST)"]
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
