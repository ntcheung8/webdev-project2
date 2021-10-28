DROP TABLE IF EXISTS plants;

CREATE TABLE plant (
  id SERIAL PRIMARY KEY,
  nickname TEXT,
  type TEXT,
  description TEXT,
  height INT,
  is_deleted INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
