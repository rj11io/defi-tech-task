# Daybook setup

This guide covers the completed expense and income diary. The original repository README is intentionally unchanged.

## Requirements

- Docker Desktop with Docker Compose
- Node.js 20.19 or newer when running outside Docker
- npm

The application uses these local ports:

- Frontend: `http://localhost`
- API: `http://localhost:4000`
- MongoDB: available only to the Docker network

## Start with Docker

From the repository root:

```sh
docker compose up -d
docker compose ps
```

The first start installs API and frontend packages into Docker-managed `node_modules` volumes. Wait until `mongo`, `api`, and `frontend` report `healthy`.

Seed the demo data on a new database:

```sh
docker compose exec mongo /seed/seeder.sh
```

Open `http://localhost` and sign in with:

- Email: `test@meblabs.com`
- Password: `testtest`

Stop the stack without deleting its data:

```sh
docker compose down
```

## Run services locally

Start MongoDB first:

```sh
docker compose up -d mongo
```

In one terminal:

```sh
cd Api
npm ci
npm start
```

In another terminal:

```sh
cd FrontEnd
npm ci
npm start
```

The checked-in local environment files provide the assessment defaults. For any shared or deployed environment, replace all database, JWT, refresh-token, AWS, email, and CORS values with environment-specific secrets. Password-recovery email delivery requires `SEND_EMAIL=1`, a valid SES configuration, and a public `WEBSITE_URL`; otherwise delivery is deliberately skipped without logging the reset token.

## Quality checks

Run the API suite and gates:

```sh
cd Api
npm test -- --runInBand
npm run lint
npm audit --audit-level=high
```

Run the frontend gates:

```sh
cd FrontEnd
npm run lint
npm run stylelint
npm run build
npm audit --audit-level=high
```

Validate and inspect the Docker stack:

```sh
docker compose config --quiet
docker compose ps
curl -fsS http://localhost:4000/
curl -fsS http://localhost/
```

## Data notes

- Monetary amounts are stored as integer euro cents.
- Entries are scoped to the authenticated owner.
- The dashboard requests the selected calendar month and calculates its totals from the complete result.
- Re-running `/seed/seeder.sh` replaces the collections represented by seed JSON files. Treat it as a destructive development reset.
