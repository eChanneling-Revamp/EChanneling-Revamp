# How to Run Kafka + Kafka UI Containers

This guide explains how to run the Kafka and Kafka UI containers using Docker Compose.

---

## 📋 Prerequisites

- Install [Docker](https://docs.docker.com/get-docker/)
- Install [Docker Compose](https://docs.docker.com/compose/)

Verify installation:

```bash
docker --version
docker-compose --version
```

## ▶️ Steps to Run

Clone or download the repository (or create a docker-compose.yml file with the provided configuration).

Start the containers:

```bash
docker-compose up -d
```

Check running containers:

```bash
docker ps
```

Access Kafka UI in your browser:

```arduino
http://localhost:8080
```

## 🛑 Stopping Containers

To stop the containers:

```bash
docker-compose down
```

To stop and remove all volumes (clean slate):

```bash
docker-compose down -v
```
