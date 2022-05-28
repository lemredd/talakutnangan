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

### Contributors
- Angelo Magtoto
- Jarlem Red De Peralta
- Kenneth Trecy Tobias

[Node.js and NPM]: https://nodejs.org/en/
[Docker]: https://www.docker.com/get-started/

## Conventional Commits
The purpose of this documentation is to guide collaborators of this project on commiting according to the type of change.

### Primary types
These are the gneral types of commit that repository has. There may be other types that may be proposed in the future.

Type		| Description
--- | ---
*feat:*	| This commit focuses on the project's enhancement by implementing a new feature.
*fix:*	| This focuses on debugging and solving problems in features.
*test:*	| This focuses on any kinds of test scripts.
*config:*| This focuses on changes in the configuration files of the project.
*docs:*	| This focuses on additions or changes in any of the documentation files.
*chore:*	| Any other commits that are still uncategorized falls into this commit.

For more information, please visit the [specification].

### Scoped types
If a commit type has multiple types, it is possible to nest it under a primary type. For instance, a
"Test" commit can be classified as either unit or integration. To further specify the type of
commit, one can use "fix(unit):" or "fix(integration):". Below are scoped types usually used during
development.

Scope       | Description | Remarks
--- | --- | ---
server      |  For commits which affect server's mechanism (middlewares, routing, etc...).      | -
database    |  For commits which affect the communication between the app server and database.  | -
unit        |  For commits which affect the unit tests                                          | Strictly for *test:* types only
integration |  For commits which affect the integration tests                                   | Strictly for *test:* types only

Note that some the scopes are only recommendations.

### Guidelines
- When specifying scopes, complete spelling of the type is a must.
- Use lowercase for the scopes as much as possible. The tool will properly capitalize the first letter upon generating the change log.
- Use uppercase if the scope is an acronym.
- It is best to follow the current scopes before the next release. Upon releasing the new version, developers may apply the new spellings of the labels.
- New scopes may be committed immediately.

### Further Reading
There is also a good [article] to read about the Conventional Commits.

[specification]: https://www.conventionalcommits.org/en/v1.0.0/
[article]: https://medium.com/neudesic-innovation/conventional-commits-a-better-way-78d6785c2e08
