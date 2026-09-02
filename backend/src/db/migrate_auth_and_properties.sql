-- Migración para bases creadas con una versión anterior del proyecto.
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
UPDATE usuarios
SET password_hash = '$2b$12$SXZ9Mr5mWYDAOaDE7ia56O9rOKyIkfZ7xeDxBO/4DQWhJ5oUDZfwW'
WHERE password_hash IS NULL;
ALTER TABLE usuarios ALTER COLUMN password_hash SET NOT NULL;

ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS descripcion VARCHAR(1000);
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS imagen_url VARCHAR(500);
