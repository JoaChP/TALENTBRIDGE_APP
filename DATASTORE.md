DATASTORE (MariaDB / JSON fallback)

This project includes a simple datastore strategy:

- By default, seed data lives in `src/mocks/api.ts` and the server exposes it at `/api/data`.
- The server tries to use MariaDB when `DATABASE_URL` is set and `mysql2` is installed. If not available it falls back to a JSON file stored at `data/store.json`.
- When deployed to a platform with a read-only filesystem (e.g. Vercel), the server automatically keeps a mutable in-memory copy instead of writing files. You can opt into this behaviour locally by setting `DISABLE_FS_STORE=true`.
- There are convenience API endpoints under `/api/practices`, `/api/threads` and `/api/messages` which proxy to the store and persist changes.

Local MariaDB setup (quick)

1) Install MariaDB or run Docker:

Docker:

```
# start mariadb with root password 'secret'
docker run --name mariadb -e MYSQL_ROOT_PASSWORD=secret -p 3306:3306 -d mariadb:10.11
```

2) Create database and run migration:

```
mysql -uroot -psecret -e "CREATE DATABASE IF NOT EXISTS talentbridge;"
mysql -uroot -psecret talentbridge < data/migrations/init.sql
```

3) Install project dependency:

```
pnpm add mysql2
```

4) Set DATABASE_URL (example):

```
# for local dev
export DATABASE_URL="mysql://root:secret@127.0.0.1:3306/talentbridge"
```

5) Restart the dev server and test endpoints:

- GET /api/data
- POST /api/data (to persist a new store)
- GET /api/practices
- POST /api/practices

Notes

- The DB-backed store is a convenience for development and small demos. For production use a proper schema and migration tool.
- The `app/api/*` endpoints in this repo act on the whole store for simplicity. They are not optimized for concurrency or large datasets.
