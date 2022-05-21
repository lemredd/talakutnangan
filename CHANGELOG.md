# Changelog

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
