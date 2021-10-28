-- Remove any existing database and user.
DROP DATABASE IF EXISTS spruceup;
DROP USER IF EXISTS spruceup_user@localhost;

-- Create Unforget database and user. Ensure Unicode is fully supported.
CREATE DATABASE spruceup CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER spruceup_user@localhost IDENTIFIED WITH mysql_native_password BY 'Spruceup8!';
GRANT ALL PRIVILEGES ON spruceup.* TO spruceup_user@localhost;
