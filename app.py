from flask import Flask, render_template, redirect, jsonify, Response
from flask_pymongo import PyMongo
import pymongo as mongo
import data_initialization
from bson.json_util import dumps

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
#create connection variable
conn = 'mongodb://localhost:27017'
# Pass connection to pymongo instance 
client = mongo.MongoClient(conn)
#connect to a database. 
db = client.beer_data
brewery = db.brewery

#mongo = PyMongo(app, uri="mongodb://localhost:27017/beer_data")




# Route to render index.html template using data from Mongo
@app.route("/")
def home():

    # Find one record of data from the mongo database
    #beer_data = mongo.db.collection.find_one()

    # Return template and data
    #return render_template("index.html" , beer = beer_data)
    return render_template("index.html")


# Route that will trigger the DB loading function
@app.route("/data")
def initData():

    # load scraped data into pyMongo
    data_initialization.loadData()  

    # Redirect back to home page
    return redirect("/")

# API call to get all data 
@app.route("/beer_api", methods=['GET', 'POST'])
def beer_api():
    data = dumps(list(brewery.find()))
    #print(data)
    # a = [
    #     {
    #         "n": 2,
    #         "e": 1
    #     },
    #     {
    #         "from": 1,
    #         "to": 2
    #     },
    #     {
    #         "from": 2,
    #         "to": 3
    #     },
    #     {
    #         "from": 3,
    #         "to": 4
    #     }
    # ]

    return jsonify(data)

@app.route("/beer_api/<indv_brewery>")
def one_brewery(indv_brewery):
    """Fetch the brewery information that matches the name 
       the path variable supplied by the user, or a 404 if not."""

    #query the mongoDB for indv_brewery and return info 
    try: 
        print("I ran")
        print(indv_brewery)
        data = db.brewery.find({'company_name' : indv_brewery})
        return dumps(list(data))
    except: 
        print("no I ran")
        return jsonify({"error": f"{indv_brewery} not found."}), 404

@app.route('/get-json', methods=['GET', 'POST'])
def get_json():
    ''' Send JSON data to Javascript '''
    # Import Data
    data = dumps(list(brewery.find()))
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True, port=5500)
