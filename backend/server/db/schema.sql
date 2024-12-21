DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Entries;

CREATE TABLE Users (
    user_id VARCHAR(255) PRIMARY KEY,
    total_entries INT DEFAULT 0,
    pca_synced BOOLEAN DEFAULT true
);

CREATE TABLE Entries (
    user_id VARCHAR(255),
    entry_id INT NOT NULL,
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