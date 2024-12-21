import os
import sqlite3
from flask import g

base_dir = os.path.dirname(os.path.abspath(__file__))


DATABASE = os.path.join(base_dir, 'main.db')
SCHEMA = os.path.join(base_dir, 'schema.sql')

def init_db():
    conn = sqlite3.connect(DATABASE)
    fp = open(SCHEMA, 'r')
    conn.executescript(fp.read())
    conn.close()

def connect():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def get_db():
    if 'db' not in g:
        g.db = connect()
    return g.db

def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()