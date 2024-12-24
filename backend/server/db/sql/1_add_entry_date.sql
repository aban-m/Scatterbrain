-- Check if the 'created_at' column already exists in the 'users' table.
PRAGMA foreign_keys=off;

CREATE TABLE Entries_new (
    user_id VARCHAR(255),
    entry_id INT NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,       -- text, either just a text or a description of the image

    is_image BOOLEAN DEFAULT false,
    width INT,
    height INT,
    image_mini_base64 TEXT,
    embedding TEXT,
    pca TEXT,

    PRIMARY KEY (user_id, entry_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO Entries_new(
user_id, entry_id, content, is_image,
width, height, image_mini_base64, embedding, pca)
SELECT * FROM Entries;

-- Step 3: Drop the old table
DROP TABLE Entries;

-- Step 4: Rename the new table to the original table name
ALTER TABLE Entries_new RENAME TO Entries;

PRAGMA foreign_keys=on;
