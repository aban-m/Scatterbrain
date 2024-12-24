import os
import sqlite3
from flask import g

base_dir = os.path.dirname(os.path.abspath(__file__))
SCHEMA_DIR = os.path.join(base_dir, 'sql')

DEFAULT_DATABASE = os.path.join(base_dir, '../main.db')
DATABASE = os.getenv('DATABASE', DEFAULT_DATABASE)

def connect(path=None):
    if path is None:
        path = DATABASE
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn
