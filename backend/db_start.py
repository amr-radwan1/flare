import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os

load_dotenv()

# Database connection settings
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

# SQL queries for creating tables
DROP_TABLES = """
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS replies CASCADE;
DROP TABLE IF EXISTS prompts CASCADE;
"""

CREATE_PROMPTS_TABLE = """
CREATE TABLE IF NOT EXISTS prompts (
    promptid SERIAL PRIMARY KEY,
    prompt_text TEXT,
    Category TEXT
);
"""

CREATE_USERS_TABLE = """
CREATE TABLE IF NOT EXISTS users (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255),
    password VARCHAR(128),
    profile_picture VARCHAR(200),
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bio TEXT,
    reply_points INTEGER DEFAULT 0,
    followers INTEGER[] DEFAULT '{}'  -- Array of follower IDs
);
"""

CREATE_POSTS_TABLE = """
CREATE TABLE IF NOT EXISTS posts (
    postid SERIAL PRIMARY KEY,
    prompt_id INTEGER REFERENCES prompts (promptid) ON DELETE SET NULL,
    user_id INTEGER NOT NULL REFERENCES users (userid) ON DELETE CASCADE,
    upvote_count INTEGER DEFAULT 0,
    downvote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    posttext TEXT 
);
"""

CREATE_REPLIES_TABLE = """
CREATE TABLE IF NOT EXISTS replies (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts (postid) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users (userid) ON DELETE CASCADE,
    reply_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isAgree BOOLEAN DEFAULT NULL
);
"""

# Sample data insertion queries
INSERT_SAMPLE_USER = """
INSERT INTO users (username, email, password, bio, reply_points, followers)
VALUES (%s, %s, %s, %s, %s, %s)
RETURNING userid;
"""

INSERT_SAMPLE_POST = """
INSERT INTO posts (user_id, upvote_count, downvote_count, posttext)
VALUES (%s, %s, %s, %s)
RETURNING postid;
"""

INSERT_SAMPLE_REPLY = """
INSERT INTO replies (post_id, user_id, reply_text)
VALUES (%s, %s, %s)
RETURNING id;
"""

# Function to connect to the database
def connect_to_db():
    return psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )

# Main script
def main():
    try:
        # Connect to the database
        conn = connect_to_db()
        cursor = conn.cursor()

        # Drop existing tables if they exist
        print("Dropping existing tables...")
        cursor.execute(DROP_TABLES)

        # Create tables
        print("Creating tables...")
        cursor.execute(CREATE_PROMPTS_TABLE)
        cursor.execute(CREATE_USERS_TABLE)
        cursor.execute(CREATE_POSTS_TABLE)
        cursor.execute(CREATE_REPLIES_TABLE)

        # Insert sample user
        print("Inserting sample user...")
        cursor.execute(INSERT_SAMPLE_USER, (
            "johndoe",  # username
            "johndoe@example.com",  # email
            "securepassword",  # password
            "I love sharing opinions!",  # bio
            100,  # reply_points
            '{}'  # Empty array for followers
        ))
        user_id = cursor.fetchone()[0]  # Get the new user's ID

        # Insert sample post
        print("Inserting sample post...")
        cursor.execute(INSERT_SAMPLE_POST, (
            user_id,  # user_id
            10,  # upvote_count
            2,  # downvote_count
            "This is John's first post!"  # post_text
        ))
        post_id = cursor.fetchone()[0]  # Get the new post's ID

        # Insert sample follower
        print("Inserting sample follower...")
        cursor.execute(INSERT_SAMPLE_USER, (
            "janedoe",  # username
            "janedoe@example.com",  # email
            "securepassword2",  # password
            "I like replying to posts!",  # bio
            50,  # reply_points
            '{}'  # Empty array for followers
        ))
        follower_id = cursor.fetchone()[0]  # Get the follower's ID

        # Update the user to add the follower to the followers array
        print("Adding follower to user's followers array...")
        cursor.execute("""
        UPDATE users
        SET followers = array_append(followers, %s)
        WHERE userid = %s;
        """, (follower_id, user_id))

        # Insert sample reply
        print("Inserting sample reply...")
        cursor.execute(INSERT_SAMPLE_REPLY, (
            post_id,  # post_id
            follower_id,  # user_id
            "This is a reply to John's post!",  # reply_text
        ))
        reply_id = cursor.fetchone()[0]  # Get the reply's ID

        # Commit changes
        conn.commit()

        print(f"Sample user inserted with ID: {user_id}")
        print(f"Sample post inserted with ID: {post_id}")
        print(f"Sample follower relation added to user with ID: {user_id}")
        print(f"Sample reply inserted with ID: {reply_id}")

    except Exception as e:
        print("An error occurred:", e)
    finally:
        # Close the connection
        if conn:
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()