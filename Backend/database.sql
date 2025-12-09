CREATE DATABASE ccsw321_project;

CREATE TABLE booking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(100),
  mobile VARCHAR(10),
  email VARCHAR(100),
  dob DATE,
  campaign_selection VARCHAR(10),
  trip_type VARCHAR(5),
  guide_language VARCHAR(30),
  special_requests VARCHAR(255)
);

CREATE TABLE contact (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  gender VARCHAR(10),
  mobile VARCHAR(10),
  dob DATE,
  email VARCHAR(100),
  language VARCHAR(10),
  message TEXT
);
