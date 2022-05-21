# Talakutnangan
A capstone project aim to create a consultation chat platform for MCC.

## Installation

### Prerequisites
- [Node.js and NPM]. LTS version is recommended
- [Docker]

### General Development Instruction
1. Run `npm install`
2. Copy *.env.example* file as *.env* to *root*. Values may change according to your chosen
   database.
3. Choose the database to be used:
   - SQLite (using memory) [fastest to set]
     - Change the `DATABASE_TYPE` variable in your *.env* to `memoried_sqlite`
   - SQLite (using SQL file)
     - Change the `DATABASE_TYPE` variable in your *.env* to `filed_sqlite`
     - Create an empty file named *sqlite.sql* in *database*
     - Change the `DATABASE_PATH` variable in your *.env* to `database/sqlite.sql`
   - MySQL (container)
     - Change the `DATABASE_TYPE` variable in your *.env* to `mysql`
     - Run `docker-compose up -d --build`
       - It will run too long for the first build only. Subsequent builds will be fast. This will
         create the database server.
     - **Note**: Re-run `docker-compose up -d --build` every time you change one of the following variables in your *.env*:
       - `DATABASE_PASSWORD`
       - `DATABASE_PORT`
       - `DATABASE_NAME`
   - PostgreSQL (deployment) [slowest to set]
     - Change the `DATABASE_TYPE` variable in your *.env* to `pgsql`
     - Change the `DATABASE_URL` variable in your *.env* to URL provided by your host
4. Run `npm run dev`
5. Visit http://localhost:16000

### Author
Coded by Kenneth Trecy Tobias.

[Node.js and NPM]: https://nodejs.org/en/
[Docker]: https://www.docker.com/get-started/
