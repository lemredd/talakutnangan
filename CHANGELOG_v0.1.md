# Changelog

## v0.1.3

### 🚀 Enhancements

#### Database
- 300dd8a Limit the usage of SQLite in memory to unit test
- e27d32f Allow database not to be initialized immediately
- 90c969e Add data source to use for migration
- 6526cb7 Use camel case in columns of the model
- a407e1b Register the path where to look for migrations
- dadce65 Add migration to create user
- 3ab916b Prevent synchronization for database that use files
- 680ec0f Run migrations after initialization
- 34aea05 Specify missing properties
- 5b4ea0c Use timestamp for better compatibility
- 4b37a5b Remove column type as it may differ per database
- 1647723 Create function to create enum columns in tables
- 93ccd9c Add new migration of user kind
- b224686 Add kind column on user model
- a623dfd Add accessor to cast the value to proper value
- 72daeb5 Ensure all types of data source will run migrations
- 3e6b3ca Specify explicitly that kind is required
- 7b187f1 Add other methods to modify the kind of user
- 5e2fc7d Make function to create file column
- 45df2d3 Add column for signatures
- d64d60f Use term "make" to allow usage of "create" in columns
- 66f381a Change the type used to receive column options
- 811df11 Use string to retrieve the signature

#### Server
- 340611a Initiate the connection with the database first
- b185687 Redo the registration of routes
- 2d47be9 Rewrite route managers
- d0c3360 Allow testing to use production mode of page renderer
- 8fca474 Limit the use of production mode to integration test
- 82a4720 Add getters for common values being used
- 34f4bcf Return `null` if request environment is not yet initialize
- cdd49a3 Add initial code for class-based controller
- b326f66 Add initial code for class-based middleware
- 9b3850c Add initial code for class-based router
- 8aea185 Improve to naming and code of middleware base
- 46b118f Allow middleware to be stand-alone
- 9508a19 Generate route information on controllers
- 3025175 Improve the naming of method of base middleware
- ca09857 Add methods to append or prepend middlewares
- 241d816 Improve the code of router
- 2d54c3b Allow environment to be available to child classes
- 78ae0bf Create a class-based version of guest page guard
- 22684ea Prepare a list of commonly-used middleware
- d730722 Create a class-based version of authenticated page guard
- b1fb056 Ensure methods of retain context
- fbe106a Add basic authenticated page guard
- 91f9aef Include HTTP method to use on controllers
- c318298 Use the specified HTTP method in router
- cdd2f70 Create a class-based version of JSON body parser
- 7b6db21 Create separate middleware for log in
- 38f846f Fix the syntax of base controller
- 65442c2 Improve the code of base router
- 6e9a7a9 Update the class-based middlewares
- c378ca8 Initialize the request environment and common middleware
- 3ed1eb4 Create guest form middleware
- 0742366 Allow the controller handler to asynchronous
- ae424c7 Transform sample create route into class
- 359abc0 Transform sample update route into class
- 3e67fcc Transform global middlewares into class-based
- 61b8cbd Store a single instance of page renderer
- 53cf92c Return the router of Vite instead of using callback
- 9b1cf34 Change the declaration to initialize list for uniformity
- 6223ee6 Change the method of getting the routers
- 01fc38d Allow base router to be used independently
- cbec094 Add method to combine the two sub-routers
- 8c865f5 Ensure to initialize middleware list once
- ba60e74 Integrate class-based routers main manager
- d87472a Transform chat routes into class-based
- 9520c38 Use class-based routing in index
- c76e052 Make intermediates and handles public for better testing

#### Authentication
- cc2ce22 Create route to log in
- 66da1e8 Create initial code in managing the session
- 6540aa0 Add password column in user model
- 0b8549d Integrate authentication management to application
- f970344 Add log in page from previous set up
- c85370c Add body parser in user routes
- ff10ff1 Add sample password
- d9393d6 Add leading slash
- d27b416 Add example email
- 64644a7 Register middleware to allow authentication
- 18fbf71 Create middleware to allow logged-in users only
- 5f0174c Create middleware to allow guests only
- e1f3aad Integrate guest guard in user routes
- 7fd94da Create route to log out
- 56bf7db Integrate route to log out
- afaae49 Add route to handle registration
- b2bb862 Integrate route to register
- 3836ae7 Add other columns necessary for registration
- 3275d60 Make route to list unconfirmed users
- 6e5bb40 Make route to admit users
- 74ff040 Redirect on failure and use standard
- df4048a Change the code to guard against authenticated
- 84644dc Put auto log in handler as middleware
- e2250d8 Wait for user to be saved

#### General
- 91ddd25 Update the environment keywords to look for
- 32daca5 Use other database server for integration tests

#### Components
- f71de03 Create initial textual field
- 550f30f Make required prop optional

#### Session
- 9367193 Create initial mechanism to simulate sessions
- 89c115e Register session middleware with initial configuration

### 🩹 Fixes

#### General
- fe33b95 Return the created model after insertion
- 3fd65e4 Update the path to log in form
- 13e2b7f Ensure the name of the imported file has the same casing
- cf88fe8 Ensure the name of the imported file has the same casing in test
- f5e49a8 Update the column names on some scripts
- e046172 Compare user property with undefined
- a828206 Correct the operator to se to select for unadmitted users
- 19efe0b Correct the HTTP method to be used to update the profile
- d3f983e Use private keyword instead of pound sign
- 10b0bfc Remove complicated and improper code from base middleware
- 68f38a4 Remove extra parameter due to direct access of the handler
- 18b6330 Declare property properly to support SQLite too
- 8b3eb7c Declare kind simply to avid other issues
- 910f578 Add missing attribute to create user from sample route

#### SSR
- 87047b1 Pass routeParams to client

#### Test
- 76221e5 Insert a model instead of creating an instance
- e37ee62 Add break on the case of *pgsql* database type
- 2304e26 Check the status codes properly
- 3e55a2c Ensure the test for getting the list is correct
- 4cb8c19 Correct the path to guest page guard to test

#### Server
- a919f5e Correct the type to return the environment
- f7e58e9 Fix the declarations and mechanism of base controller

#### Authentication
- 2bc7747 Rewrite log in route to return intended data
- 7ebe389 Fix the authorization guard
- 87b3777 Return status code when updating profile
- e7d3246 De/serialize user model properly

#### Database
- 0af5c96 Fix the driver type passed to data source

#### Configuration
- 7c51b73 Fix the commands to run the unit tests

### 💅 Refactors

#### General
- 84f3a0e Separate the creation of Vite dev server
- 467a19c Separate the registration of global middlewares
- 18690b9 Use textual component in log in form
- 9359284 Separate the creation of request handler
- e87cffe Put middlewares closer to the controllers
- 79ef6c4 Make method to create authenticated cookie
- 0745b05 Reduce the syntax by collecting the constraints first
- 2b3b1c6 Reduce the database operations to admit a user
- 52b0bfb Move authentication management closer to app creation
- 528cf14 Move page renderer closer to app creation
- 6da67ba Separate some declaration of routes
- 946d527 Change the order of some code
- e5248e2 Make app handler accept a router
- 9719096 Separate the initialization of singletons
- edb159f Separate the creation of ID column to specify the correct type
- 30437dd Create the date column directly
- d6da727 Make columns for audits

#### Integration
- 9f14ec6 Refactor the post log in route

#### Server
- 4c9ba8d Refactor the registration of chat events
- 2e6028f Reorganize server initialization
- b1306f4 Reduce the parameters needed when creating app handler

### 🏀 Examples

#### General
- 33041f2 Demonstrate that functions can be passed to page context

### 📖 Documentation

#### General
- 7a776ba Add information about the keywords
- 3434533 Enhance the document
- 336aeca Reduce the line length of the paragraph
- ec05826 Minor grammar fix and content adjustment

#### Guides
- 2a0e1a7 Document conventional commits
- 75d4482 Mention discretion in scoped commits
- abf607c Arrange the primary types in table format
- a1efff8 Elaborate the current scopes
- 8f9135a Add more guidelines and links to read

### 🏡 Chore

#### General
- e3e4281 Add to-do for authentication
- e7fdaeb Replace the path to components
- 9f6bb5f Remove demonstration of passing functions to page context
- 28d8980 Add link to documentation of the package
- 85188ea Replace raw status codes for readability
- bdb85f8 Remove unnecessary test
- 9eb88ca Remove extra import
- 463fc4f Move the file that creates data source
- 07dbe9a Remove excess imports
- d2e4e3c Remove user logger
- 43dbf7b Repurpose the request environment set up as set up of singletons
- 2d5dcc1 Prevent singletons to be initialized again
- f9d0724 Remove unused import

#### Server
- 6aed3d4 Remove transformed middlewares

### ✅ Tests

#### General
- f9cb1a6 Create initial user factory
- 2bdfa15 Test searching user by credentials
- 0bdbb7d Test searching non-existent user by credentials
- b4db3ab Ensure guest guard works
- 2367318 Add initial tests for authorization guard
- 31169e0 Rename the folder of test helpers
- b541ac0 Rename the set-up for database
- d1e3f6f Create test helper to set up the app
- 61b8497 Prevent running migrations for unit tests
- 398c544 Ensure data source is defined
- 93a26c4 Cache the creation of app
- ae99902 Add method to destroy the request environment for testing
- def935a Add set up file for request environment
- 0ce721b Ensure to use log in controller before doing authenticated request
- e482964 Restore the optional destroy in tests

#### Database
- c28095b Create a resolved promise when testing a database
- 9baaf93 Log to confirm that database connection has been created
- d0c2a7c Use private for the initializer of test database

#### Integration
- dad173b Build the production app before testing
- 1b24727 Create first working integration test
- 90792ed Add test for relogging in
- 4047f00 Test register route
- bf62352 Ensure admission of users works
- 60318b6 Remove set up of application
- 490841f Use combined router for the integration test
- b08ea08 Ensure singletons are run only once
- f0c9822 Create different app per route

#### Unit
- 568db59 Test the base controller
- c2f04fd Test the URL generation of base controller
- 327e6af Test the generation of handlers on base controller
- 766a4fd Skip untestable case

#### Server
- 9cbf9ce Test the creation of request environment

#### Authentication
- 55c8405 Ensure admission route works

### 🌊 Types

#### General
- b09bd29 Create type of textual fields
- 7fa78a0 Add interface to get session from request
- c102732 Add new interfaces for authentication
- 6695e33 Enhance the documentation of types in server
- 2615658 Add type to return by route managers
- cfb6034 Make special routers optional
- 571020e Simplify the object to return by route managers
- 7c2d8e3 Add type for authenticated requests
- 79981fe Add type for registration requests
- 9ba7ead Add type of environment
- e4466b4 Make test environment more specific
- a8aa488 Add another property for requests with possible user
- 2e64b29 Add type for route information
- fd008da Add method type
- 14e3521 Specify the string values of certain enumerations
- f68ba02 Add type for partial table column

#### SSR
- f051f18 Add object type for routeParams

#### Authentication
- e68398d Improve the types of update route

### 🎨 Styles

#### General
- 6a1e26a Make field elements stretch 1 column

### 🤖 CI

#### General
- 03b5df1 Update the commands to run tests
- 234b589 Run back-end integration tests
- d5262c2 Start a database in the CI
- b8cd15a Destroy only if the data source exists

#### Configuration
- 8e1d16d Separate the jobs for unit and integration tests

### 🕊️ Migrations

#### General
- b208796 Remove authentication scripts from previous set up
- 08ed8c8 Rewrite log in form
- d383766 Rewrite log in mechanism

### 🗒️ Configurations

#### General
- f4728eb Add another custom commit type
- 6ed546a Add session variables in example environment file
- 5372889 Change the path "@/*" represents
- 2fdcdc6 Make path "@/*" more specific
- 10ee931 Include *components* directory on detecting tests
- 32e6e37 Make path "@/*" more loose
- 5c5cbd3 Opt-in to experimental feature to allow default values on props
- a8ab00f Refresh the HTTP server in development environment every change
- 04ad85e Shorten the names of scripts
- cca1c95 Move the database server files to deeper directory
- 6058ba9 Add command to create migrations
- 67edd75 Add commands to create migrations and run other sub-commands

#### Test
- a5e4897 Register set up for the application for integration
- 69c9d01 Enhance commands to watch back-end properly
- 78274c8 Rename the configuration files for tests
- ac5c29f Specify the test environment
- e9f7259 Increase the test timeout of integration tests
- 02e895c Reincrease the test timeout of integration tests
- 222bd31 Remove custom test timeout
- 296e073 Detect the open handles in integration tests
- f0f8a5b Register the set up file for request environment

#### CI
- 59b9d1b Add environment file for CI

#### Tests
- da56062 Add configuration to do integration tests

### ❤️  Contributors
- Jarlem Red De Peralta
- Kenneth Trecy Tobias

## v0.1.2

### 🚀 Enhancements

#### Database
- 8bbc2d7 Allow configuration of databases for different purposes
- c0d4ce8 Ensure email is unique to be compatible with SQLite

#### Authentication
- e0d1504 Create composable function to connect to database
- 64003f4 Create sample user upon visiting '/api/user/create'
- 9d43f38 Integrate API handlers to root

### 🩹 Fixes

#### General
- 910b093 Terminate the function properly
- eca108c Correct the path to log in route
- d4c81cf Ensure data source will be returned
- c32243f Ensure imports matches casing of filenames

#### Database
- c25a580 Correct the property to use intended database

#### Configuration
- a473474 Ensure communication inside containers

### 💅 Refactors

#### General
- 2d7ac67 Separate initialization of database from entry
- 82066a3 Restructure the test of sample route

### 📖 Documentation

#### Installation
- d9ea546 Fix the instructions
- 71177ae Add new instruction for other database types

### 🏡 Chore

#### Configuration
- 5c485e2 Add new configuration key to get database URI
- 5f449d0 Bind other environment variables and directories
- 797a5ae Disable other services temporarily
- cd67e1f Install package to read the environment
- 5f64cd9 Add new environment variables for database and web
- 5e0c830 Ignore pnpm lockfile
- f7d7933 Allow JS path replacement
- 88a968f Improve configuration files for testing
- 815162a Register set up file
- e069dc0 Limit the resources for MySQL database
- 27617a1 Configure testing for Vue SFC
- a576a4e Separate the test configurations
- 7d454db Add plug-in to insert the CSS framework

#### General
- efaaf8f Formalize the model
- d3890e6 Update the environment variable to use as web port
- 2b8e34b Rename the path for models

### 📦 Build

#### General
- 88f8599 Specify engine version necessary on deployment

### ✅ Tests

#### General
- 07c7284 Add set up file
- 0fb023b Create types for mocking requests and responses
- ab916c9 Test the sample route
- e5aef45 Try sample counter component

#### Database
- f57d09e Simplify the creation of test database

#### Unit
- 68ecc69 Create sample unit test

#### Helper
- 057e7b9 Create database helper

### 🌊 Types

#### General
- 4235f61 Remove unused types

### 🎨 Styles

#### General
- 7e0201c Import virtual stylesheet
- 6eea13a Try some utility classes

### 🤖 CI

#### General
- 939f5e5 Specialize the CI configuration for the front-end tests
- 65499f6 Generalize CI configuration for unit tests
- e8382fb Separate the configuration for front-end and back-end tests

### 🕊️ Migrations

#### General
- 18804fe Rewrite most previous authentication APIs to new environment

### ❤️  Contributors
- Angelo Magtoto
- Jarlem Red De Peralta
- Kenneth Trecy Tobias

## v0.1.1

### 🚀 Enhancements

#### Chat
- b5c8a86 Create web socket server and listen for WS events
- e4c893a Link web socket server to HTTPS server
- abb6b6d Add simple route to create a room
- 6d13988 Implement simple chat completely
- a6997fa Integrate web socket server for chat
- 0439bd0 Intgrate chat routers to main file

### 🩹 Fixes

#### Chat
- 23eb8be Ensure to distribute the message in the room

### 🏡 Chore

#### General
- 410b740 Separate the renderer from the function
- c157185 Remove unused files from previous set ups

#### Configuration
- 955a751 Bind other environment variables and directories
- a084aaa Set path for server subdirectory
- cf8b590 Change the path to server subdirectory
- bce8579 Preserve the JSX
- 2fb6d9f Improve configuration for generation of change log
- 4f72784 Register other paths
- 2834f2f Add plugin to read paths from configuration
- ab872d4 Relax strict type checking
- 96be969 Organize the dependencies

#### Migration
- 69e6758 Move plugins to dedicated server folder

### 🕊️ Migrations

#### General
- 0407f4a Move all generated files from boilerplate
- 87ee88d Delete remaining plugin from previous HTTP package
- 0166c43 Rewrite the route for room creation
- ce2e9e9 Rewrite the script  o make chat work in new set up

#### Configuration
- 5d7e324 Merge configurations from renewal

### ❤️  Contributors
- Kenneth Trecy Tobias


## v0.1.0

### 📖 Documentation

#### Installation
- a95d66c Add more steps

#### General
- 73caadc Specialize the README

### 🏡 Chore

#### General
- 8ea9de4 Prepare the initial page
- 89b62ea Install the fullstack framework to start the development
- daf5d4c Install front-end framework to show the pages
- 723a1ba Specialize the some configurations
- b5fcc80 Remove unnecesary files
- 0160714 Install package to generate change log automatically
- f1746a7 Add configuration to generate change log
- 02458c7 Specialize the configuration to run the application locally
- 1527abd Remove unnecessary configuration
- f38de82 Specialize the container configuration
- 2f17771 Add runtime configuration
- 245080e Add local database
- 72662d1 Treat 'web' subdirectory as workspace
- a4d547e Merge the web directory to root

### ❤️  Contributors
- Kenneth Trecy Tobias
