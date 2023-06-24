# Bus Tickets System

**Frontend** - _React with Vite and Typescript_

**Backend** - _Express with Typescript, Prisma and Docker_

## Running app

You need Node.js and Docker installed on your machine.

### Backend

Position yourself in **/backend** folder.

1. Install packages

```
yarn install
```

2. Starting postgres DB

```
docker run -d \
    --name pg \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_DB=bus-tickets-db \
    postgres
```

3. Apply migrations

```
npx prisma migrate dev
```

4. Seed database

```
npx prisma db seed
```

5. Run backend

```
yarn dev
```

### Frontend

Position yourself in **/frontend** folder.

1. Install packages

```
yarn install
```

2. Run frontend

```
yarn dev
```

Login with user credentials

- **Email:** user1@gmail.com
- **Password:** abb
