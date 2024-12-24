import argparse
import os
import os.path
import sqlite3

import sys
base_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, base_dir)        # hack!
from base import DATABASE, SCHEMA_DIR

SCHEMA = os.path.join(SCHEMA_DIR, 'schema.sql')

def list_migrations():
    migrations = []
    for f in os.listdir(SCHEMA_DIR):
        if f.lower().endswith('.sql') and '_' in f:
            try:
                id = int(f.split('_')[0])  # Ensure ID is an integer
                migrations.append((id, os.path.join(SCHEMA_DIR, f)))
            except ValueError:
                print(f'Skipping invalid migration file: {f}')
    return sorted(migrations, key=lambda pair: pair[0])  # Sort by ID                   # sort by the id

def execute_script(conn, path):
    _, name = os.path.split(path)
    print(f'Executing {name}...')
    with open(path) as fp:
        conn.executescript(fp.read())
        
def init_db(conn):
    execute_script(conn, SCHEMA)
    conn.commit()
    
def latest_migration(conn, show=False):
    row = conn.execute('SELECT id, description FROM migrations ORDER BY id DESC LIMIT 1;').fetchone()
    last_id, description = row if row else (0, 'Initial version.')
    
    if show:
        print(f'Latest applied: #{last_id}\n{description}')

    return last_id, description

def migrate_db(conn):
    last_id, description = latest_migration(conn, show=True)
    
    migrations = list_migrations()
    print(f'Found {len(migrations)} migrations. Now applying the latest {len(migrations)-last_id}.')
    
    for id, path in migrations:
        if id <= last_id:
            print(f'Skipping #{id}.')
            continue
        execute_script(conn, path)

        desc = os.path.splitext(os.path.split(path)[1])[1].replace('_', ' ')[0].capitalize()
        conn.execute('INSERT INTO migrations (id, description) VALUES (?, ?)', (id, desc))

    print('Done.')
    conn.commit()

def main():
    parser = argparse.ArgumentParser(description='Database management.')
    parser.add_argument('action', choices=['init', 'migrate', 'status', 'list'],
                        help='Action to perform.')
    parser.add_argument('-d', '--database', type=str, 
        default='<default>', help='Path to the SQLite database file.')
    
    args = parser.parse_args()
    args.database = args.database if args.database != '<default>' else DATABASE

    print(f'[CURRENT DATABASE: {DATABASE}]\n')

    with sqlite3.connect(args.database) as conn:
        if args.action == 'init':
            if os.path.exists(args.database):
                out = input(f'WARNING: Database {args.database} already exists. Overwrite it (y/N)? ').lower()
                if out[:1] != 'y':
                    print('Aborting.')
                    return
            init_db(conn)
            
        elif args.action == 'migrate':
            migrate_db(conn)
            
        elif args.action == 'status':
            last_id, description = latest_migration(conn, show=True)
            migrations = list_migrations()
            print(f'Found {len(migrations)} migrations in total.\n{len(migrations)-last_id} unapplied.')
            
        elif args.action == 'list':
            print('\n'.join(f'{os.path.split(p[1])[-1]}' for p in list_migrations()))

if __name__ == '__main__':
    main()
