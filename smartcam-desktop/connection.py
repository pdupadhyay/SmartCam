import os
from dotenv import load_dotenv, dotenv_values 
# loading variables from .env file
load_dotenv() 
from pymongo import MongoClient
client = MongoClient(os.getenv("ATLAS_URI"))
db = client.get_database('smartcam')
