# Tests
The codebase has been guided by different unit tests and integration tests. These tests enable to
detect logical, syntax, or any kind of errors early.

There are tests for front-end and back-end mechanisms. For each frame, they can be divided further to unit and integration tests. The frames may have dedicated suite variants for CI and local environments.

## Shared tests (`./execute -test unit:share`)
Shareable code can be run on any test environment and safe to use for both frames. If there are
mechanisms common to both server and client, make them shareable. Changing the mechanism of a
shareable code needs to be careful the front-end and back-end.
