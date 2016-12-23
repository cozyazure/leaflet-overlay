DROP DATABASE IF EXISTS leafletimagedb;

CREATE DATABASE leafletimagedb;

\c leafletimagedb;

CREATE TABLE leafletimage (
  ID SERIAL PRIMARY KEY,
  username VARCHAR,
  imageName VARCHAR,
  imageByte bytea
);

