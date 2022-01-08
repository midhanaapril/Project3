import pandas as pd
import pymongo as mongo


def loadData(): 
    #read scraped data csv from data folder 
    data = pd.read_csv('Data/beer_association_scrape.csv')
          
    data = data.to_dict('records')

    # Use PyMongo to establish Mongo connection
    #create connection variable
    conn = 'mongodb://localhost:27017'
    # Pass connection to pymongo instance 
    client = mongo.MongoClient(conn)
    #connect to a database. 
    db = client.beer_data
    brewery = db.brewery
    brewery.insert_many(data)

    print("data loaded!")

"""def loadJson(): 
    data = pd.read_csv('Data/beer_association_scrape.csv')
    data = data.to_json(orient='records')
    
    return data
"""