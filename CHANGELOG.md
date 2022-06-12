# Changelog

## v0.2.0

### 🚀 Enhancements

#### Server
- ⚠️  0207b85 Make the request environment purely static
- 3b7e957 Make some methods of environment accessible in instances
- 534a415 Make base middleware access request environment directly
- ⚠️  6a9e3f9 Restructure middleware to be declarative
- ⚠️  b787de2 Update the requirements of guest form controller
- 1a3a633 Update the declarations of controllers
- 8cc52e4 Initialize singletons with data source
- 26b096b Embed constant status codes in request environment
- 7008e48 Make router extend request environment
- 8cb72d5 Create router for development only
- 55a8ae1 Add controller to view the email verification template
- 8442e02 Remove parameter for parent prefix in development routes
- f65ead0 Make prefix to originate from method
- 962607d Add methods to use multiple controllers or routers
- 77e20b2 Update the routers
- 7b76ce3 Add method to get root in request environment
- 53769a7 Add base class for post controllers
- 2fb54b4 Make controller to handle POST requests with JSON body
- c5efb95 Rearrange the validation errors usable for client
- f574334 Add validation on log in controller
- a9c6763 Include validation as middleware instead
- d60b788 Add validation for register controller
- 63aa596 Indicate the return type of hash function
- cddca50 Convert the text into HTML
- a056c25 Make helper function to specialize the template
- 25e8678 Make helper to create specialize content from file
- dff4e3f Make helper to convert markdown to HTML
- 7d7e92f Make method to check if the app is currently in test
- 0ce9df0 Make middleware to send verification email
- 5c1d8a3 Add email verification sender middleware in common list
- 0b9aad6 Add route to verify user account

#### Database
- fcbd9f2 Specify the configuration to be used for migrations
- 676afb3 Enhance the method signatures of user manager
- c569f00 Add create method in manager
- 1e6ce76 Specify the return type of create method
- 808bc84 Add method to list some users depending on criteria
- 302de1e Add method to admit user
- 6c850d7 Break the database URL into parts to configure properly
- e0af6f9 Wait to retrieve all records
- 7b27dfe Add default values on certain columns
- cd2b070 Update the attributes in model
- 1cf671a Add method to verify the user

#### Authentication
- 0b346f5 Make function to encrypt passwords
- f5cb23e Make function to compare hashed passwords
- cee991e Compare hashes when finding with user credentials
- 7db5368 Hash password before creating user
- f73a98c Integrate email verification in registration

#### Email
- 645a69c Make email verification template
- fc266c9 Read the email template
- fc6d10f Replace variables in template
- e1af8c7 Make transport and double check if it is successful
- 0262800 Add code to send mail
- 3e44cbb Create singleton for email transport
- dd213fe Add method to send e-mail to others
- dbdb073 Use stream transport for testing

### 🩹 Fixes

#### Unit
- 300ac22 Fix the test on converting Markdown to HTML

#### Chat
- cc79b47 Obtain uuid properly using routeParams

#### Database
- a4c5f5c Ensure database port is a number
- 44e0ae4 Ensure to pass the type of database to create
- 9ba2929 Add missing name attribute in user model
- bbe16d9 Ensure name does not contain null value
- 337a814 Return the database URL for PostgreSQL database
- f53bcd0 Slice the path name to remove the leading slash
- 9953fa4 Use string for the kind attribute of user model
- dbeafe0 Verify a user using the email

#### Test
- 3ebf9d4 Correct the boolean value to make email unverified

#### Server
- 08a8fca Ensure there are no errors when handling validated body
- 211c194 Include validation as middleware
- e12c24e Fix the return data upon specializing a file

#### General
- 048f620 Restore previous name of method handling the request

#### Configuration
- de5f638 Remove extra dashes since nesting has been reduced

#### CI
- 0d854e1 Use single quotes to specify paths of files to hash

### 💅 Refactors

#### General
- da6f044 Reduce the code guest form controller
- 2213b4d Simplify request environment and related components

#### Server
- 8e86045 Use square bracket instead of array object on types

### 📖 Documentation

#### Change log
- 5b894ce Separate the change log for v0.1.x

### 🏡 Chore

#### General
- 7925a08 Group database-related files
- df51dd8 Move source type to types of database
- 488e350 Remove unnecessary test on request environment
- bf5dce2 Make email templates based on nouns
- e04773c Replace some long test guards with short property

#### Server
- 29b03a1 Move some base classes to route subdirectory
- 618b98b Remove unused imports
- a96db74 Rename the subdirectory for base classes
- c873523 Rename file name of hash function for proper semantics
- b277e3f Rewrite the router and controller for development routes
- 30da525 Rewrite email verification route with helper functions
- bc77139 Rewrite email verification with real values and singleton

#### Test
- bb0883e Remove logging after creation of test database

### ✅ Tests

#### Unit
- e468590 Test create method and other to-dos
- 6e6490f Test listing not yet admitted users
- 67288de Double check if the admitted date time has been updated
- bde8eb6 Assert if not null in the admitted date time
- 28b3a4f Test the controller for post requests with JSON body
- 8c9c640 Test post JSON body validation with multiple rules
- afb9536 Test the responded validation error
- 8971421 Test the new structure of post controller variant
- d46e8eb Test the validation middleware
- 4dd258d Test the generation of hashes
- 20dc87d Test password comparator
- 9b02d10 Ensure the template becomes specialize
- 8cabad9 Test the conversion of Markdown to HTML
- f8f8cfa Test user verification method
- ba289a8 Update the test of verification method

#### General
- efe92d1 Update unit test for base controller
- 43f0473 Update set up files for back-end
- 6280d22 Force resynchronization of database for tests
- ff6b33f Make verified user profiles by default
- fa5f062 Truncate records rather than dropping the tables
- 7d6af20 Force the deletion of records
- 9a36b7e Update the instantiation of test router
- a2ffbd0 Update paths to base classes in set up
- e005c55 Update test related to user manager
- 6ab7f2e Update set up as request environment does not need initialization

#### Integration
- 5b78279 Get the new expected values from the database

#### Database
- 5fa26e3 Ensure to handle database configuration for tests

### 🌊 Types

#### General
- 7d2111c Add type to give structure to raw route information
- a3ba9c7 Separate the interface for URL info
- ⚠️  2801576 Rename a part of type of databases supported
- c28cdb8 Add some database types for user
- bba85eb Create a type to receive user details as parameters
- a50527a Add type to specify search criteria
- 0dfa4a9 Add type for validation errors

### 🤖 CI

#### General
- 7216f21 Redo the commands to run integration tests in CI
- 528e629 Allow modules to be cached
- 642a114 Cache the node modules on other workflows

### 🕊️ Migrations

#### Database
- 374dd81 Create configuration file for migrations
- 1204c2f Add commands to do migration
- 29e113f Convert the database migrations
- 605111e Convert the user model
- fdd24d2 Rewrite the initializer
- 2a77e90 Rewrite user factory
- bcaeb04 Rewrite function to find user using credentials
- deac733 Add method to find using ID
- a398677 Rewrite database communication in authentication
- 401bcf0 Rewrite all routes' database instructions
- 62238b4 Rewrite all tests' database instructions

#### Test
- 0fee61a Rewrite the database in test set up
- 2503ebb Specify the new location of source type
- faaa1d8 Rewrite application handler in set up

#### Server
- 3c43483 Rewrite application handler

#### General
- 43e620f Rewrite data source creation

### 🗒️ Configurations

#### General
- efa9816 Run build script only when watching integration tests
- 7492bd6 Remove commands related to previous dependency
- 166448f Put related configuration directly to plugin
- 7c65dc9 Add new environment variables necessary for emails

#### Test
- 3bbba09 Temporarily change the regex of back-end unit test
- 51447b5 Re-include server paths on unit tests

#### Database
- 5c72938 Add path for database directory
- 795b11a Add configuration to customize the paths

#### ⚠️  Breaking Changes
- ⚠️  0207b85 Make the request environment purely static
- ⚠️  6a9e3f9 Restructure middleware to be declarative
- ⚠️  b787de2 Update the requirements of guest form controller
- ⚠️  2801576 Rename a part of type of databases supported

### ❤️  Contributors
- Jarlem Red De Peralta
- Kenneth Trecy Tobias
