from flask import Flask, request, jsonify, make_response
from customer import Customer
import structlog
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# configure logging
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
            return jsonify({"error": "All fields are required"}), 400
        
        # Generate a new ID
        customer_id = max((c.id for c in customer_list), default=0) + 1
        
        new_customer = Customer(customer_id, first_name, last_name, email, phone)
        customer_list.append(new_customer)
        return jsonify(new_customer.to_dict()), 201
    return jsonify([customer.to_dict() for customer in customer_list]), 200

@app.route("/customers/<int:id>", methods=["GET", "PUT", "DELETE"])
def customer(id):
    customer = next((c for c in customer_list if c.id == id), None)
    if not customer:
        return jsonify({"error": "Customer not found"}), 404
    if request.method == "GET":
        return jsonify(customer.to_dict()), 200
    elif request.method == "PUT":
        data = request.get_json()
        customer.first_name = data.get("firstName", customer.first_name)
        customer.last_name = data.get("lastName", customer.last_name)
        customer.email = data.get("email", customer.email)
        customer.phone = data.get("phone", customer.phone)
        return jsonify(customer.to_dict()), 200
    elif request.method == "DELETE":
        customer_list.remove(customer)
        return jsonify({"message": "Customer deleted successfully"}), 200

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    response = make_response(
        jsonify({"message": "Login successful", "email": email, "status": "authenticated"}),
        200
    )
    response.set_cookie("logged_in", "true")
    response.set_cookie("theme", "dark")
    response.set_cookie("username", "erick_mongare")
    response.set_cookie("email", email, max_age=3600)
    return response

@app.route("/cookies", methods=["GET"])
def get_cookies():
    username = request.cookies.get("username")
    logged_in = request.cookies.get("logged_in")
    theme = request.cookies.get("theme")
    email = request.cookies.get("email")
    return jsonify({
        "username": username,
        "logged_in": logged_in,
        "theme": theme,
        "email": email
    }), 200

@app.route("/logout", methods=["POST"])
def logout():
    response = make_response(
        jsonify({"message": "Logged out successfully"}),
        200
    )
    response.set_cookie("logged_in", "", expires=0)
    response.set_cookie("theme", "", expires=0)
    response.set_cookie("username", "", expires=0)
    response.set_cookie("email", "", expires=0)
    return response

# ⚠️ THIS MUST BE THE LAST LINE ⚠️
if __name__ == "__main__":
    app.run(debug=True, port=5000)