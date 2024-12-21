import json

marshal_array = json.dumps
unmarshal_array = json.loads

def read_latest_id(conn, user_id: str):
    resp = conn.execute('SELECT MAX(entry_id) FROM entries WHERE user_id = ?;', (user_id,))
    ans = resp.fetchone()[0]
    return ans if ans else 0

def _read_user(conn, user_id: str):
    resp = conn.execute('SELECT * FROM Users WHERE user_id = ?;', (user_id, )).fetchone()
    return resp if resp else {'total_entries': 0}

def _update_user(conn, user_id: str, total_entries: int, pca_synced: bool):
    conn.execute('''INSERT OR REPLACE INTO Users
(user_id, total_entries, pca_synced) VALUES
(?, ?, ?);''', (user_id, total_entries, pca_synced))

def set_synced(conn, user_id, val):
    conn.execute('UPDATE Users SET pca_synced = ? WHERE user_id = ?;', (val, user_id,))
def get_synced(conn, user_id):
    row = conn.execute('SELECT pca_synced FROM Users WHERE user_id = ?;', (user_id,)).fetchone()
    if not row: return True
    return row[0]

def is_image(conn, user_id, entry_id):
    row = conn.execute('SELECT FROM Entries WHERE user_id = ? AND entity_id = ?;', (user_id, entity_id)).fetchone()
    if row is None:
        raise ValueError('Entry not found.')
    return row['width'] or row['height']

def get_image(conn, user_id: str, entry_id: int) -> str:
    row = conn.execute('SELECT image_mini_base64 FROM entries WHERE user_id = ? AND entry_id = ?;',
                       (user_id, entry_id)).fetchone()
    if not row: return None
    return row[0]

    

def create_text_entry(conn, user_id: str, text: str, embedding: list):
    # find latest id
    latest = read_latest_id(conn, user_id) + 1

    # insert entry
    conn.execute('''INSERT INTO entries
(user_id, entry_id, content, embedding) VALUES (?, ?, ?, ?);''',
                 (user_id, latest, text, marshal_array(embedding)))

    # invalidate pca
    user = _read_user(conn, user_id)
    _update_user(conn, user_id, user['total_entries'] + 1, False)

    # commit changes
    conn.commit()

def create_image_entry(conn, user_id: str, mini_b64: str, width: int, height:int,
                       description: str, embedding: list):
    latest = read_latest_id(conn, user_id) + 1

    conn.execute('''INSERT INTO entries
(user_id, entry_id, image_mini_base64, width, height, content, embedding, is_image) VALUES
(?, ?, ?, ?, ?, ?, ?, true);''',
(user_id, latest, mini_b64, width, height, description, marshal_array(embedding)))
    
    user = _read_user(conn, user_id)
    _update_user(conn, user_id, user['total_entries'] + 1, False)

    conn.commit()

def delete_entry(conn, user_id: str, entry_id: int):
    conn.execute('DELETE FROM entries WHERE entry_id = ? AND user_id = ?;',
                 (entry_id, user_id))
    user = _read_user(conn, user_id)
    _update_user(conn, user_id, user['total_entries'] - 1, False)
    conn.commit()
    
def delete_entries(conn, user_id: str):
    conn.execute('DELETE FROM entries WHERE user_id = ?;', (user_id,))
    _update_user(conn, user_id, 0, True)
    conn.commit()

def update_entry(conn, user_id: str, entry_id: int, new_text: str, new_embedding: str):
    conn.execute('''UPDATE entries SET content = ?, embedding = ? 
WHERE user_id = ? AND entry_id = ?;''', (new_text, marshal_array(new_embedding), user_id, entry_id))
    conn.commit()

def update_pcas(conn, user_id: str, pcas: list):
    current_ids = conn.execute('SELECT entry_id FROM entries WHERE user_id = ?;', (user_id, )).fetchall()

    if len(current_ids) != len(pcas):
        raise ValueError(f'Has {len(current_ids)} entries, got {len(pcas)} vectors.')

    conn.executemany('UPDATE entries SET pca = ? WHERE user_id = ? AND entry_id = ?;',
                     [(marshal_array(pca), user_id, row['entry_id']) for pca, row in zip(pcas, current_ids)])
    
    set_synced(conn, user_id, True)
    
    conn.commit()

def delete_pcas(conn, user_id: str):
    conn.execute('UPDATE entries SET pca = null WHERE user_id = ?;', (user_id,))
    set_synced(conn, user_id, True)
    conn.commit()

def read_matrix(conn, user_id: str, pca: bool):
    which = 'pca' if pca else 'embedding'

    try:
        data = [unmarshal_array(x[0]) for x in \
            conn.execute(f'SELECT {which} FROM Entries WHERE user_id = ?', (user_id,)).fetchall()]
    except TypeError as e:
        if not pca: raise e # weird
        raise ValueError('PCA matrix incomplete, and cannot be retrieved.')
    return data
    
def read_user(conn, user_id: str):
    data = conn.execute('SELECT is_image, entry_id, content FROM entries WHERE user_id = ?', (user_id,)).fetchall()
    return data if data else []
