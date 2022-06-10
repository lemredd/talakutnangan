# Talakutnangan
A capstone project aim to create a consultation chat platform for MCC.

## Keywords
The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT",
"RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as
described in [BCP 14] \[[RFC2119]\] \[[RFC8174]\] when, and only when, they appear in all capitals,
as shown here.

## Installation

### Prerequisites
- [Node.js and NPM]. LTS version is recommended
- [Docker]
- [PostgreSQL]. [v14.3] is recommended.

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
     - **Note**: Re-run `docker-compose up -d --build` every time you change one of the following
       variables in your *.env*:
       - `DATABASE_PASSWORD`
       - `DATABASE_PORT`
       - `DATABASE_NAME`
   - PostgreSQL (local)
     - Change the `DATABASE_TYPE` variable in your *.env* to `pgsql`
     - Download the [installer] for the latest version.
     - Install and just click next. You may customize the installation and data directory. Stack
       Builder is not required. Default port should be 5432. Remember your password. If you want to
       use the password the same as to the example, use *root* password.
     - Wait for the installation to complete.
     - Search using keyword *pgAdmin 4* and run the matched application. Its purpose is similar to MySQL
       workbench and MongoDB Compass. This may be needed for troubleshooting.
   - PostgreSQL (deployment) [slowest to set]
     - Change the `DATABASE_TYPE` variable in your *.env* to `pgsql`
     - Change the `DATABASE_URL` variable in your *.env* to URL provided by your host
4. Run `npm run migrate:first` if it is the database server is newly installed; and chosen database
   is `mysql` or `pgsql`.
5. Set the empty email variables. They may vary depending per team.
   - `EMAIL_USER`. This e-mail address will be used to log in to the SMTP server and will be the
     sender of e-mail messages  in the app (i.e. e-mail verification).
   - `EMAIL_PASS`. This is the password of e-mail address above and will be used to log in to the
     SMTP server. It is recommended to use an app password.
6. Run `npm run dev`
7. Visit http://localhost:16000

## Conventional Commits
The purpose of this documentation is to guide collaborators of this project on commiting according
to the type of change.

### Primary types
These are the general types of commit that repository has. There MAY be other types that will be
proposed in the future.

Type        | Description
--- | ---
*feat:*     | This commit focuses on the project's enhancement by implementing a new feature.
*test:*     | This focuses on any kinds of test scripts.
*style:*    | This focuses on any kinds of changes in UI.
*config:*   | This focuses on changes in the configuration files of the project.
*ci:*       | A *config:* type where it focuses on changes in configurations of workflows.
*fix:*      | This focuses on debugging and solving problems in features, tests, or configurations.
*refactor:* | This focuses on refactored code.
*perf:*     | A *refactor:* type where it focuses on optimizing code.
*docs:*     | This focuses on additions or changes in any of the documentation files.
*chore:*    | Any other commits that are still uncategorized falls into this commit.

For more information, please visit the [specification].

### Scoped types
If a commit type has multiple types, it is possible to nest it under a primary type. For instance, a
"Test" commit can be classified as either unit or integration. To further specify the type of
commit, one can use "test(unit):" or "test(integration):". Below are scoped types usually used
during development.

Scope          | Description | Remarks
--- | --- | ---
server         |  For commits which affect server's mechanism (middlewares, routing, etc...).      | -
database       |  For commits which affect the communication between the app server and database.  | -
authentication |  For commits which affect authentication components.                              | -
email          |  For commits which affect email components or communication to SMTP server.       | -
call           |  For commits which affect call components or peer communication                   | -
deps           |  For commits which add, remove, or change dependencies                            | Strictly for *chore:* types only and are excluded in logs.
unit           |  For commits which affect the unit tests                                          | Strictly for *test:* types only
integration    |  For commits which affect the integration tests                                   | Strictly for *test:* types only

Note that some of the scopes are only recommendations. It is up to the developer's discretion on
what name would the scoped commit be given, as long as it lines up to the focus of the commit and is
appropriate.

### Guidelines
- When specifying scopes, complete spelling of the type is a MUST.
- Lowercase SHOULD be used for the scopes. The tool will properly capitalize the first letter upon
  generating the change log.
- Uppercase SHOULD be used if the scope is an acronym.
- It is best to follow the current scopes before the next release. Upon releasing the new version,
  developers SHOULD apply the new spellings of the labels.
- New scopes MAY be committed immediately.

### Further Reading
There is also a good [article] to read about the Conventional Commits.

### Contributors
- Angelo Magtoto
- Jarlem Red De Peralta
- Kenneth Trecy Tobias

[specification]: https://www.conventionalcommits.org/en/v1.0.0/
[article]: https://medium.com/neudesic-innovation/conventional-commits-a-better-way-78d6785c2e08
[BCP 14]: https://www.rfc-editor.org/info/bcp14
[RFC2119]: https://datatracker.ietf.org/doc/html/rfc2119
[RFC8174]: https://datatracker.ietf.org/doc/html/rfc8174
[Node.js and NPM]: https://nodejs.org/en/
[Docker]: https://www.docker.com/get-started/
[PostgreSQL]: https://www.postgresql.org/download/windows/
[v14.3]: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
[installer]: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
