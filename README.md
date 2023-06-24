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

2. Create **.env** file in **/backend** folder and copy/paste content from **.env.example** file.

3. Starting postgres DB

```
docker run -d \
    --name pg \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_DB=bus-tickets-db \
    postgres
```

4. Apply migrations

```
npx prisma migrate dev
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

2. Create **.env** file in **/frontend** folder and copy/paste content from **.env.example** file.

3. Run frontend

```
yarn dev
```
