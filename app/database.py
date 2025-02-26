import json
from app import mongo
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_data():
    try:
        # Check if data already exists
        if mongo.db.insights.count_documents({}) == 0:
            logger.info("Loading data into MongoDB...")
            with open('jsondata.json', 'r') as file:
                data = json.load(file)
                mongo.db.insights.insert_many(data)
            logger.info("Data loaded successfully!")
        else:
            logger.info("Data already exists in MongoDB")
    except Exception as e:
        logger.error(f"Error loading data: {e}")

def get_filter_options():
    try:
        return {
            'end_year': sorted(list(set(x['end_year'] for x in mongo.db.insights.find({}, {'end_year': 1})))),
            'topics': sorted(list(set(x['topic'] for x in mongo.db.insights.find({}, {'topic': 1})))),
            'sectors': sorted(list(set(x['sector'] for x in mongo.db.insights.find({}, {'sector': 1})))),
            'regions': sorted(list(set(x['region'] for x in mongo.db.insights.find({}, {'region': 1})))),
            'pestle': sorted(list(set(x['pestle'] for x in mongo.db.insights.find({}, {'pestle': 1})))),
            'source': sorted(list(set(x['source'] for x in mongo.db.insights.find({}, {'source': 1})))),
            'countries': sorted(list(set(x['country'] for x in mongo.db.insights.find({}, {'country': 1})))),
            'cities': sorted(list(set(x['city'] for x in mongo.db.insights.find({}, {'city': 1}))))
        }
    except Exception as e:
        logger.error(f"Error getting filter options: {e}")
        return {} 