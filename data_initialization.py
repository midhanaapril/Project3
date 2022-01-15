import pandas as pd
import pymongo as mongo

#create connection variable
conn = 'mongodb://localhost:27017'

# Dropping table if it exists already 
client = mongo.MongoClient(conn)
db = client.beer_data
brewery = db.brewery
client.beer_data.brewery.drop()

#read scraped data csv from data folder 
data = pd.read_csv('Data/beer_association_scrape_clean.csv')
lat_long = pd.read_csv('Data/beer_association_lat_lng.csv')

combined_data = data
combined_data[['latitude', 'longitude','address']] = lat_long[['latitude', 'longitude','address']]

combined_data = combined_data.to_dict('records')

# Use PyMongo to establish Mongo connection

# Pass connection to pymongo instance 
client = mongo.MongoClient(conn)
#connect to a database. 
db = client.beer_data
brewery = db.brewery

brewery.insert_many(combined_data)


print("data loaded!")

