DROP DATABASE IF EXISTS leafletimagedb;

CREATE DATABASE leafletimagedb;

\c leafletimagedb;

CREATE TABLE markers (
  ID SERIAL PRIMARY KEY,
  owner text,
  imagename text,
  opacity double precision,
  lat double precision,
  lng double precision,
  icon jsonb,
  draggable boolean,
  isonline boolean,
  iconangle integer,
  sharewith  text[]
);

