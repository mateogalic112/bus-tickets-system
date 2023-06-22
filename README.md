# Bus Tickets System

## Frontend

React.js with Typescript

## Backend

Node.js with Express

## Running app

### Starting postgres DB

```
docker run -d \
    --name pg \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_DB=bus-tickets-db \
    postgres
```

### DB seed

```
npx prisma db seed
```
