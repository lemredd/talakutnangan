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
4. Run `./execute -database -initialize` if it is the database server is newly installed; and chosen
   database is `mysql` or `pgsql` or `./execute -database -upgrade` (if there are no breaking
   changes in database migrations) or `./execute -database -reset` (if there are breaking changes in
   database migrations).
5. Run `npm run seed:up:all` (if there are no breaking changes in database migrations) or `npm run
   seed:redo:all` (if there are breaking changes in database migrations).
6. Set the empty email variables. They may vary depending on per team.
   - `EMAIL_USER`. This e-mail address will be used to log in to the SMTP server and will be the
     sender of e-mail messages in the app (i.e. e-mail verification).
   - `EMAIL_PASS`. This is the password of e-mail address above and will be used to log in to the
     SMTP server. It is recommended to use an app password.
7. Run `npm run dev`
8. Visit http://localhost:16000
