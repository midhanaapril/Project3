from flask import Flask, render_template, redirect, jsonify, Response
from flask_pymongo import PyMongo
import pymongo as mongo
#import data_initialization
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


# Route to render index.html template
@app.route("/")
def home():
    return render_template("index.html")


# API call to get all data 
@app.route("/beer_api", methods=['GET', 'POST'])
def beer_api():
    data = dumps(list(brewery.find()))
    return data


#API to get specific brewery based on brewery name
@app.route("/beer_api/<indv_brewery>", methods=['GET', 'POST'])
def one_brewery(indv_brewery):

    #query the mongoDB for indv_brewery and return info  
    data = db.brewery.find({'company_name' : indv_brewery})
    return dumps(list(data))

#API to get list of brewery information based on membership
@app.route("/beer_api/member/<membership>", methods=['GET','POST'])
def membership_status(membership): 
    data = db.brewery.find({'member_type':membership})
    return dumps(list(data))

#API to get a list of just the brewery names 
@app.route("/beer_api/brewery_names", methods=['GET','POST'])
def brewery_list(): 
    data = brewery.distinct('company_name')
    return jsonify(data)

#API to get brewery information based on brewery types 
@app.route("/beer_api/type/<brewery_type>", methods=['GET','POST'])
def brewerType(brewery_type): 
    data = db.brewery.find({'company_type':brewery_type})
    return dumps(list(data))

if __name__ == "__main__":
    app.run(debug=True, port=5500) #restrict port to 5500 which is same as the live server for JS 
