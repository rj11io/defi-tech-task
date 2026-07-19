# Setup

## Requirements

- Docker Desktop with Docker Compose
- Node.js 20.x and npm, if running services outside Docker

## Run with Docker

From the repository root:

```sh
docker compose up -d --build
```

Open [http://localhost](http://localhost). The seeded test account is:

- Email: `test@meblabs.com`
- Password: `testtest`

The API runs on port `4000`, the frontend is served on port `80`, and MongoDB is available to the Compose services. To stop the stack:

```sh
docker compose down
```

## Local development

Install dependencies in both applications:

```sh
cd Api && npm install
cd ../FrontEnd && npm install
```

The frontend expects the API at the configured Vite proxy URL. Start the API and frontend with `npm start` in their respective directories.

## Verification

Run the API test suite with:

```sh
cd Api && npm test
```

Build the frontend with:

```sh
cd FrontEnd && npm run build
```

For non-local environments, replace the placeholder values in `Api/.env`, especially `JWT_SECRET` and `CHANGE_PASSWORD_SECRET`, with strong secrets and configure the allowed CORS origin.
