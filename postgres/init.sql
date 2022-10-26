CREATE TABLE IF NOT EXISTS sample_posts (
  id  SERIAL,
  title VARCHAR(255),
  content VARCHAR(255),
  inserted_at TIMESTAMP NOT NULL  DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL  DEFAULT NOW(),
  PRIMARY KEY( id )
)
