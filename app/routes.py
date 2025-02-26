from flask import render_template, jsonify, request
from app import app, mongo
from app.database import get_filter_options
import logging

logger = logging.getLogger(__name__)

@app.route('/')
def dashboard():
    try:
        filters = get_filter_options()
        return render_template('dashboard.html', filters=filters)
    except Exception as e:
        logger.error(f"Error loading dashboard: {e}")
        return f"Error: {str(e)}", 500

@app.route('/api/data')
def get_data():
    try:
        query = {}
        
        # Handle multiple values for each filter
        for key in ['end_year', 'topic', 'sector', 'region', 'pestle', 'source', 'country', 'city']:
            values = request.args.getlist(key)
            if values:
                # If there are multiple values, use $in operator
                if len(values) > 1:
                    query[key] = {'$in': values}
                else:
                    query[key] = values[0]
        
        data = list(mongo.db.insights.find(query, {'_id': 0}))
        return jsonify(data)
    except Exception as e:
        logger.error(f"Error getting data: {e}")
        return jsonify({"error": str(e)}), 500 