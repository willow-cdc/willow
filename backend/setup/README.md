https://debezium.io/documentation/reference/stable/tutorial.html

# Build image and start containers
docker compose up --build

# Start PostgreSQL service
sudo service postgresql start

# Expose PostgreSQL's port 5432 using ngrok
ngrok tcp 5432

# Update register-postgres.json with ngrok connection information
Will need to update database.hostname and database.port

# Build image and start containers
docker compose up --build

# Start Postgres connector
curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -d '@register-postgres.json'

# Consume messages from a Debezium topic
docker compose -f compose.yaml exec kafka /kafka/bin/kafka-console-consumer.sh \
    --bootstrap-server kafka:9092 \
    --from-beginning \
    --property print.key=true \
    --topic dbserver1.public.demo

# Delete a connector
curl -X DELETE http://localhost:8083/connectors/<connector-name>

# PostgreSQL commands

## Insert data
INSERT INTO demo (data) VALUES ('hello!');

UPDATE demo SET data='updated data!' WHERE data='hello!';

DELETE FROM demo WHERE data='updated data!';