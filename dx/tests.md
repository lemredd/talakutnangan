# Tests
The codebase has been guided by different unit tests and integration tests. These tests enable to
detect logical, syntax, or any kind of errors early.

There are tests for front-end and back-end mechanisms. For each frame, they can be divided further
to unit and integration tests. The frames may have dedicated suite variants for CI and local
environments.

## Shared tests (`./execute -test unit:share`)
Shareable code can be run on any test environment and safe to use for both frames. If there are
mechanisms common to both server and client, make them shareable. Changing the mechanism of a
shareable code needs to be careful the front-end and back-end.

## Front-end Tests

### Local Tests

#### Common front-end unit tests (`./execute -test unit:front`)
Code for common front-end can be run only on clients and may use browser-specific APIs. They can be
used by pages and components.

#### Component unit tests (`./execute -test unit:component`)
Components are reusable codes to be used by web pages. They may have independent styles or affect
other styles of other components or whole page. Components should use few tags (custom or native) as
much as possible. Therefore, tests for components should use factory rarely as much as possible for
faster test execution tests. It is also recommended mounting them shallowly.

#### Page integration tests (`./execute -test intg:front`)
Pages can be considered integration tests because they use different components and common front-end
codes. Pages in tests these should use data from factories and mount them fully. Tests can also be
used for CI environment.

### CI Tests

#### Front-end unit tests (`./execute -test unit_ci:front`)
Tests both common front-end codes and components.

## Back-end tests

### Local tests

#### Common back-end unit tests (`./execute -test unit:back`)
Code for common front-end can be run only on servers and may use NodeJS-specific APIs. They can be
used by pages and components.

#### Route unit tests (`./execute -test unit:route`)
API controllers are mostly tested for their validation mechanism. However, page middlewares are not tested as they only provide preloaded data from server to client to reduce HTTP calls.

#### Server unit tests (`./execute -test unit:server`)
Server codes are provides classes and helper function to be used by routes. They are usually middlewares which can be tested if it continues or halts the request-response cycle. Server is responsible for providing parsers, policies, and validators. It is also responsible for running the servers (HTTP, WS, Peer) themselves.

### Database unit tests (`./execute -test unit:database`)
Database code is responsible for communication to database and how the data is transformed for clients to use. Tests should ensure that mechanisms should work and there are no sensitive data exposed.

### Back-end integration tests (`./execute -test intg:back`)
Tests create a test HTTP server with only the route being tested (aside from `POST
/api/user/log_in`). They should ensure that tests are accessible to certain users. If a test fails,
it means that a middleware, controller or, database code has a problem or not integrated properly.
The tests can be used for CI.

### CI tests

### Tests which use database rarely (`./execute -test unit_ci:back`)
Tests for common back-end codes and server codes.

### Tests which necessarily use database (`./execute -test unit_ci:back_database`)
Tests for route codes and database codes.
