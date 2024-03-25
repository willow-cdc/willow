-- create sources table
CREATE TABLE sources (
    id serial PRIMARY KEY,
    name varchar UNIQUE NOT NULL,
    db varchar NOT NULL,
    tables varchar,
    host varchar NOT NULL,
    port integer NOT NULL,
    dbUser varchar NOT NULL
);

-- create sinks table
CREATE TABLE sinks (
    id serial PRIMARY KEY,
    name varchar UNIQUE NOT NULL,
    url varchar NOT NULL,
    username varchar NOT NULL,
    topics varchar NOT NULL
);

-- create pipeline table
CREATE TABLE sourceSink (
    id serial PRIMARY KEY,
    source_name varchar UNIQUE NOT NULL REFERENCES sources(name) ON DELETE CASCADE,
    sink_name varchar UNIQUE NOT NULL REFERENCES sinks(name) ON DELETE CASCADE
);
