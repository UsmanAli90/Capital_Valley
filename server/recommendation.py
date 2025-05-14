import sys
import json
import pandas as pd
from pymongo import MongoClient
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from bson import ObjectId
import os
from dotenv import load_dotenv
import logging

# Set up logging to stderr
logging.basicConfig(
    level=logging.INFO,
    format="PYLOG: %(message)s",
    stream=sys.stderr
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

def get_recommendations(user_id):
    try:
        # logger.info(f"Python script started with user_id: {user_id}")
        
        # Connect to MongoDB Atlas using the same connection string as Node.js
        mongo_uri = os.getenv("MONGO_URI")
        # logger.info(f"Connecting to MongoDB Atlas")
        
        client = MongoClient(mongo_uri)
        
        # Explicitly specify the database name
        db = client['test']
        
        # logger.info("Connected to MongoDB Atlas")
        # logger.info(f"Available collections: {', '.join(db.list_collection_names())}")
        
        # Get all posts
        posts = list(db.posts.find({}))
        logger.info(f"Found {len(posts)} total posts")
        
        if not posts:
            # logger.info("No posts found in database!")
            return []
        
        # Try to convert user_id to ObjectId if it's not already
        try:
            user_id_obj = ObjectId(user_id)
            # logger.info(f"Converted user_id to ObjectId: {user_id_obj}")
        except InvalidId:
            # logger.info(f"Could not convert user_id to ObjectId, using as is: {user_id}")
            user_id_obj = user_id
        
        # Check both string and ObjectId formats for upvotedBy
        user_likes = list(db.posts.find({
            '$or': [
                {'upvotedBy': user_id},
                {'upvotedBy': user_id_obj}
            ]
        }))
        
        # logger.info(f"Found {len(user_likes)} posts liked by user")
        liked_post_ids = [str(post['_id']) for post in user_likes]
        
        # If no likes, return posts sorted by creation date
        if not liked_post_ids:
            # logger.info("User has no likes, sorting by date")
            posts_sorted = sorted(posts, key=lambda x: x.get('createdAt', 0), reverse=True)
            return [str(post['_id']) for post in posts_sorted]
        
        # Create features from posts
        posts_df = pd.DataFrame([{
            '_id': str(post['_id']),
            'problem': post.get('problem', ''),
            'niches': ' '.join(post.get('niches', [])) if isinstance(post.get('niches'), list) else '',
            'companyName': post.get('companyName', ''),
            'companyLocation': post.get('companyLocation', ''),
            'upvotes': post.get('upvotes', 0)
        } for post in posts])
        
        # Example recommendation logic using cosine similarity on 'problem' and 'niches'
        tfidf = TfidfVectorizer(stop_words='english')
        posts_df['text'] = posts_df['problem'] + ' ' + posts_df['niches']
        tfidf_matrix = tfidf.fit_transform(posts_df['text'])
        
        # Get indices of liked posts
        liked_indices = posts_df[posts_df['_id'].isin(liked_post_ids)].index.tolist()
        if not liked_indices:
            # logger.info("No liked posts found in DataFrame, returning all posts")
            recommended_ids = posts_df['_id'].tolist()
        else:
            # Compute mean vector for liked posts
            liked_vectors = tfidf_matrix[liked_indices]
            mean_vector = liked_vectors.mean(axis=0)
            
            # Convert the mean_vector from matrix to array format
            mean_vector = np.asarray(mean_vector)
            
            similarities = cosine_similarity(mean_vector, tfidf_matrix).flatten()
            # Exclude liked posts from recommendations
            posts_df['similarity'] = similarities
            recommended_df = posts_df[~posts_df['_id'].isin(liked_post_ids)]
            recommended_df = recommended_df.sort_values(by='similarity', ascending=False)
            recommended_ids = recommended_df['_id'].tolist()
            
            # Add back the liked posts at the beginning
            recommended_ids = liked_post_ids + recommended_ids
        
        logger.info(f"Returning {len(recommended_ids)} recommended post IDs")
        return recommended_ids
        
    except Exception as e:
        logger.error(f"Error in Python recommendation script: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return {"error": str(e)}

if __name__ == "__main__":
    # Get user_id from command line argument
    if len(sys.argv) > 1:
        user_id = sys.argv[1]
        result = get_recommendations(user_id)
        # Print ONLY the JSON result to stdout
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "No user ID provided"}))