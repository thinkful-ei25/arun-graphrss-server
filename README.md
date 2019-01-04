# GraphRSS Server

The backend GraphQL endpoint for
[GraphRSS](https://github.com/thinkful-ei25/arun-graphrss-client). See the
[client repository](https://github.com/thinkful-ei25/arun-graphrss-client)
for full details about this project.

## Installation

### Requirements

- PostgreSQL
- Node.js

### Instructions

1. Clone repository and run

```bash
$ yarn
```

2. Create a new database and update `/knexfile.js` with the URI for the database.

3. Use knex.js to set up the database tables:

```bash
$ npx knex [--env production] migrate:latest
```

4. Launch the server

```bash
$ yarn start
```

or

```bash
$ node src/index.js
```
