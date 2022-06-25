# Changelog

## v0.4.0

### 🚀 Enhancements

#### User
  - 4767f05 Add dean's user list

#### Guest
  - 4a7a4ac Make Opening Component
  - a89538e Make Footer Component
  - 81a4cd7 Add instruction in homepage

#### Navigation
  - 5907e5e Make navigation link for mobile
  - 77b078f Use dropdown component for nav menu
  - 3650b6d Disable scrolling if navigation menu is open
  - bb153dd Add unscrollable class to body classes
  - 8b87293 Implement viewport identifier
  - e0d8a16 Separate navigation by viewport
  - 1d9b98a Separate settings for desktop

#### Server
  - ⚠️  1c28261 Make controller-like classes to follow an optional policy
  - e33e4c3 Remove null middlewares and controllers
  - ⚠️  5b3d080 Make controller-like classes to have optional validations
  - ⚠️  7303900 Make controller-like classes have an optional body parser
  - ⚠️  32c7732 Redefine the signature of middlewares and post jobs
  - 92daef7 Make middleware and post jobs public
  - 6818c94 Rewrite JSON controller
  - 82eec44 Rewrite page middleware
  - 92f4976 Make validation middleware for route parameter
  - ba8c2fa Make validation middleware for queries
  - 338d83e Make query controller
  - 0ccfb2e Add validation and policy to list user route
  - 2a403cf Add policy to log in failure route
  - 3d57000 Add policy to log in route
  - 1dd7c1c Add policy to log out route
  - 074299a Remove register route
  - e4a43f1 Make bound controller
  - 27b1b50 Make model bound controller
  - bc6d895 Add validation to reset password route
  - fdcc8f8 Rewrite user update route to only update user details
  - ⚠️  ca06771 Change the HTTP method to use to update the user
  - 7ba8db2 Add validation and policy to verify user route
  - 1ddebe5 Remove immediate termination of writing to response
  - 6e74e0f Write nothing to after deletion
  - 882ac3d Rewrite the department route to restore
  - 68d1b33 Rewrite the department route to update
  - 49588fa Add policy to join chat room
  - 835de10 Make specialized controller for development routes
  - 8a64481 Enhance typing of form middleware
  - 5360722 Rename the file for `multipart/form-data` body parser
  - cf0c08a Add `multipart/form-data` body parser to common list
  - 7567412 Make multipart controller
  - da0cb57 Add policy to import user route
  - 08fbc33 Terminate if one of the e-mail variables is not defined
  - 9410e0b Include server logger in initialization
  - 3283f3e Initialize the singletons before data source creation
  - 476ec17 Allow passing multiple permission names
  - 8767f56 Change the available department permissions
  - a9fef78 Add method to get payload data
  - 0c97523 Make page middleware for index page
  - 9b5ae50 Create a sample payload in the index page middleware
  - 408410e Pass the client payload as page props
  - 45ebed7 Register index page middleware
  - 681829c Remove the *index* suffix keyword for page enhancers
  - 2429298 Treat common permission flags as constants for readability
  - d6aca81 Initialize database singletons
  - 9705b24 Make create role controller
  - c370695 Make router for role API routes
  - ffc35bb Register role router to API router
  - a0e7bb8 Make update role controller
  - fe29c0f Make archive role controller
  - 163e3fa Make restore role controller

#### Database
  - 63cf7b5 Acknowledge that attributes of model will be initialized
  - 02924ca Add new migration for role table
  - f806313 Make ID columns use big integer type
  - d09ea47 Make email column unique
  - e647225 Add new migration for attached role table
  - 5cb1ab8 Make foreign updates cascade to user table
  - 6c82924 Make role model
  - 80a93b3 Create role manager
  - e5d9679 Re-declare the method for searching roles
  - e91da1c Include role in models of source
  - f725d66 Add model for attached roles
  - 8f2fd24 Link user and role models
  - 90a6113 Include attached role in model of source
  - 5167622 Restore the code to truncate all models
  - f5411bc Include related models upon finding with credentials
  - 265974c Update code for listing the users
  - 6471b12 Remove method for admission of users
  - c7a749e Make a base manager
  - 2956f0b Rename some methods in base manager
  - a8162dc Make class to build the query conditions
  - 1be0060 Make the condition builder to be fluent
  - 2fb181c Use base manager for user manager
  - 83a1f15 Base the role manager from the base manager
  - 03faaa3 Make limit pipe
  - e87cde1 Make a method to search for specific string on a column
  - a06d6e1 Make search name pipe
  - 4ea92a6 Simplify the role model manager
  - 35cd296 Base the department manager from the base manager
  - e7c0bef Make a function that will run the data through pipeline
  - 85ebf5d Allow users to be searched by name and have limits
  - 75796f7 Remove logging from creation of the configuration
  - 3416c76 Make a singleton for the source
  - e4f03c4 Allow source to be retrieved

#### Viewport
  - 0312d8d Make window accessible anywhere

#### Permissions
  - b6a5cee Apply operation permission to department permissions
  - 2b72138 Apply common flags to department permissions
  - 5c2478d Make role permission group
  - ad77430 Make semester permission group
  - 5e354d3 Make tag permission group
  - 9fff361 Make post permission group
  - 3129966 Make comment permission group
  - 062c76d Make profanity permission group
  - 5b33644 Make profile permission group
  - 31f2ba5 Make audit trail permission group

#### General
  - 9dd1500 Use the page props in index page

#### Pipeline
  - e5d5102 Make criteria filter
  - 94d32e5 Rename the pipe for sifting by criteria
  - 6fdd9ff Make offset pipe
  - 9047a58 Use the options interface directly from package

#### Dropdown
  - b3b97f9 Close on click outside

#### Forum
  - 4f73660 Initial setup
  - 41f5eb0 Implement vote counting
  - 3f33499 Implement profanity filter in each post
  - f59c14d Determine secluded post and user vote
  - ed4f2d9 Add profanity filter method
  - 236e374 Modified dummy data
  - 3503516 Added downvote
  - e0898f2 Seperated post fucntions
  - 02ab878 Added secluded posts
  - eb6f04b Added blank user icons
  - dd70922 Added any for variables
  - a23eecc Added dropdown for posts
  - 19692a4 Removed dummy data
  - bfe96cb Added post creation

#### Logger
  - 739e5bc Make a server logger
  - 6086fbd Log the initialization of web socket as successful
  - 54c4322 Use lowercase for the area
  - cb80a6d Format the message to log
  - 8f4b3cc Log the initialization of HTTP server as successful
  - 41d5b13 Separate a method to output the original error
  - 088b437 Log details about connecting to e-mail server
  - e2e45da Log details about connecting to database server
  - 14835e7 Log the queries to server logger
  - 6694905 Make the formatter private to ensure passed area exists
  - 0a74b20 Force passed error is the expected type

### 🩹 Fixes

#### Server
  - 97240a7 Guarantee that raw handlers are request handlers
  - e87f5b2 Filter the null middleware or post jobs early
  - c30342a Fix the path to register department route for modification
  - af39967 Correct some values to update departments
  - a2014f9 Correct the path to page middleware base to guard chat room
  - de882e2 Change the mechanism of checking e-mail variables
  - fc4dbd5 Initialize middleware regardless of variables' existence
  - 41a4fd6 Include previously combined mask in mask generation
  - 3f48970 Update the criteria in list user route
  - fc75d05 Remove trailing slashes unless it is the root
  - 06f40cf Rename router file
  - da365be Correct the path to role manager
  - 098b21e Use the server-only request environment for middleware

#### Test
  - d776297 Guarantee that validation middlewares are present
  - 03f9d14 Correct the function to compare from
  - 298b191 Update the criteria in integration test
  - dd83e28 Update the path to department permissions

#### General
  - ed9b55f Remove the invalid syntax

#### Types
  - 368f90e Correct the types of route handlers
  - c9df8c9 Make compatible types for session
  - 915998c Make the criteria array as constant
  - c160dde Fix the page request type

#### Database
  - d1499ab Correct the name of the model of role
  - 957b0e9 Remake create method to ensure hashing of password

#### Logger
  - 06f2297 Correct some identifiers in logger

### 💅 Refactors

#### Person
  - a5bb92b Rename prop type to variant

#### Guest
  - 28ded61 Refactor person component
  - d33001a Refactor description component
  - 613659f Adjust overall design

#### Dropdown
  - cad6ccb Make customizable dropdowns
  - 57b6c52 Change button id
  - 5ee6c7d Remove unused emit

#### Navigation
  - d3da792 Hide dropdown instead of rendering conditionally
  - 1052805 Temporarily disable body tag injection
  - 6547bb8 Revert conditional rendering
  - 27e87fd Separate scroll disabling to a method
  - 7c92ca1 Arrange by component's slots

#### Window
  - a822f38 Provide window from shell
  - 0352d68 Unuse custom window identifier

#### Database
  - 4e56b7e Apply pipeline runner in construction of options

#### Shell
  - a8940e5 Watch changes in body classes
  - 8e4273d Enforce referencing of body tag
  - 7e53058 Reference default body classes

#### General
  - 078f551 Rewrite the archive department route
  - b97ab29 Rewrite the department route to create
  - 32fbdba Rewrite the department route to read
  - cfe2827 Rewrite development route for testing emails
  - 0cc489f Provide body tag from page shell

### 🏡 Chore

#### General
  - 19eee60 Cluster controller-like classes
  - b98398e Document class for controller-like base class
  - 78e26b0 Document the controller-like classes
  - 7fa03a9 Import the custom request instead of importing from package
  - aac45cc Import the custom request instead of importing from package
  - c99b3c9 Dedicate directory for specialized classes
  - d47c0ac Delete unit test for user update route
  - 527e774 Rename directory for common controllers
  - ef9ecfb Remove test for register user route
  - ba2bed6 Add some required types
  - 591e029 Ignore or force some types
  - 6e4bcff Change the basis of or force some types
  - 568ff17 Make creation of database as asynchronous
  - 2dd2544 Make flag columns into camel case
  - d38ce4d Correct or force some types
  - fa76d02 Apply dependent types to pipes
  - 6bbac1b Document base manager class
  - daa05ae Remove excess brackets
  - 42886c0 Remove unused controller
  - 37f802d Refer to client payload as page props
  - faff40e Rename the properties which are named as client payload
  - fd4c150 Update the subdirectory for specialized filter
  - a8dcfc1 Move notes of escaping queries to method of condition builder
  - 50a1ca4 Move the base factory
  - 0f05099 Apply type for generated data in base
  - 71f2512 Make initialization of database to be asynchronous
  - a7b5e23 Put independent server types to shared directory
  - f7bd319 Put independent server types to shareable directory
  - 3e8533b Put independent database types to shareable directory
  - 2253355 Correct the misspelling of "originally"
  - f45dd16 Put permissions to shareable directory
  - 7127ff1 Enhance the pull request template
  - c1c2781 Remove empty line
  - 2d2d3cb Put pipeline to shareable directory
  - 290a11f Improve the phrase if it must be merged or not
  - 3ab4d0a Add completion state in merge instructions
  - 889473d Capitalize the "None" keyword
  - f56781a Share some server helpers

#### Test
  - 2c8f3fa Make some fields the same line column for readability

#### Permissions
  - 248de7e Rename the columns of the flags to use camel case

#### Server
  - 8b090fc Rename the method to get body validation rules
  - 8da8405 Rename the file names of the model managers

#### Notifications
  - 803a064 Temporarily disable component

#### Database
  - ⚠️  f4b8c15 Treat the database type file as independent

#### Forum
  - 0f194ed Restructure dummy post data


### ✅ Tests

#### Dropdown
  - f463f06 Test close event
  - ee3c909 Ensure dropdown elements exist
  - 4d40841 Ensure dropdown element occurence

#### Navigation
  - 1c158be Adjust link specification test case
  - 1fa5c4f Localize wrappers
  - 3348e66 Provide reference of body classes
  - ef6cfc0 Separate tests for specific roles
  - 33d1c83 Provide viewport identifier and test on desktop viewport
  - 77a6ebd Emit toggle event
  - ed84f97 Remove unused injected values
  - 082e9e7 Expect proper emission from nav button
  - e8950ba Remove redundant triggers
  - 38f0a8b Test dropdown button click

#### Integration
  - bb9ec7f Rewrite list user route
  - 71a6b46 Force updated student to be present
  - a069eef Skip test for update user route
  - 70c867d Rewrite the department route tests
  - 49ada28 Update the paths to managers in integration_tests
  - 39765ae Ensure create role route works
  - 931a670 Ensure update role route works
  - 88b1e05 Ensure archive role route works
  - 097087b Ensure restore role route works

#### Guest
  - cf4b47b Test person component

#### General
  - 11de2b3 Rewrite app singleton
  - 9be2972 Reverse the order or set up files to initialize logger first
  - 896c95e Make role factory
  - 0189eaa Rewrite the general factory
  - f5c1613 Allow data generator to be asynchronous
  - 24b7652 Apply base factory to other factories
  - 9c46351 Add method to make or insert multiple models
  - aa81867 Specialize some methods for user factory
  - db9e080 Add method to user factory to control the generation of names
  - 1bd9e45 Include all attributes in test of update department
  - d2aa888 Update the set-up files in test

#### Unit
  - 5254fd1 Retest the controller-like base with more-defined abstract
  - 03d54e3 Test rewritten JSON controller
  - b79bbd3 Test rewritten page middleware
  - 275f81b Create base test controller to test the controller
  - 76ec200 Specialize the type of argument of mock response
  - 0094bae Test unit controller
  - ffe2dd2 Test bound controller
  - 7ca166f Test base controller
  - 246ea4c Ensure role manager works properly
  - 8dd87fa Test permission group for multiple arguments
  - 11ec725 Ensure user model has necessary linked models
  - f19f475 Update test for listing users according to criteria
  - e771333 Check base manager if it works
  - 90e9758 Ensure condition builder works properly
  - 08dcf3e Restructure the arguments to list the users
  - 0d8c833 Ensure that page middleware returns the page props
  - 060d3dd Enhance the tests on replacement of index routes
  - 86bdeda Remove trailing slash on path of the route information
  - f88913f Test the method to search for a condition
  - 7c975c8 Update the arguments to be received by role model manager
  - 9fc7cc3 Test if the pipeline runner works properly
  - 109a951 Ensure searching the user by name works
  - d18e4e1 Improve the test of user manager
  - 9264422 Find the updated department info

### 🌊 Types

#### Field
  - e9e610b Specify input field type

#### Server
  - d1ca295 Add type to make middleware optional
  - 6b7f96c Make specialized interface for authenticated requests
  - 760166b Allow other form of request handler
  - 7bc5faa Make type for requests expects ID route parameter
  - d1d3ca0 Organize types containing serializable types
  - 6d9ad57 Create types for operation permissions
  - e5fc7b3 Make types for level permissions
  - 7e1e47f Make type for setting values of common flags

#### Test
  - 7b3941d Make type for generated data
  - a3053c1 Make type for multiple generated data

#### General
  - bb09620 Separate type for mock response
  - da40a42 Separate the declaration for asynchronous handler
  - c880b8a Use undefined instead to comply with contraints of base request
  - b401dd8 Make token optional instead to comply with the contraints
  - 3195db6 Make some types to use to return static functions
  - 284c407 Remove unnecessary types
  - 0a94d51 Create type file for dependent types
  - db654c0 Make the template parameters of pipe more customizable
  - 0afbda1 Regeneralize pipe type
  - d6854b6 Separate the types from base manager
  - 97fc4f0 Use client payload type as basic of page props

#### Database
  - 15dcbcb Derive criteria from array
  - 577d817 Make type for raw role details
  - cb0ae36 Change criteria for listing users
  - f6f886d Make type to be used for base manager
  - 382389d Add type for common constraints in pipe
  - 79e9a02 Re-export used types from other packages
  - 7375124 Make safe types for user profile and roles
  - d68637a Make safe types for payload
  - 7977744 Make a similar interface for others to be serializable

#### Forum
  - 6e517da Properly typed functions and variables

### 🎨 Styles

#### Navigation
  - 8c7dae9 Adjust minor styles to links
  - 2ea56b3 De-scope to allow styling of body tag
  - 75efb59 Restructure and restyle links
  - 955a110 Adjust minor styles
  - a3c80e7 Use media query to display links
  - 1fea916 Re-enable media query styles
  - 967e5ea Hide notif link on desktop
  - 1b647b5 Hide settings link on desktop
  - 8fe423a Adjust notification list styles
  - 15d8fbd Put nav to front

#### Person
  - f07085c Add default variant styles

#### General
  - 06701ae Added design for instruction in guest home page

#### Shell
  - 164b25e Fix navigation position

#### Dropdown
  - a41c437 Declare position from parent component

### 🤖 CI

#### General
  - f1b9c7a Add workflow for testing shareable codes

### 🗒️ Configurations

#### Test
  - 64da120 Map server dir
  - 4ac72b0 Remove server directory for front-end unit tests

#### General
  - 22f67f4 Make compiler strict
  - f11ecef Change the command name for other package managers
  - d7ad0ba Add new environment variables for logging
  - 8317a9f Add command to reset the migrations
  - abe92c2 Add environment variable that dependency uses
  - c02133b Remove database variable for logging
  - 2ef1c4d Ensure shareable directory can be found
  - c23cd9a Make configuration to test for shareable codes
  - 8dc5ee8 Add command test for shareable codes

#### ⚠️  Breaking Changes
  - ⚠️  1c28261 Make controller-like classes to follow an optional policy
  - ⚠️  5b3d080 Make controller-like classes to have optional validations
  - ⚠️  7303900 Make controller-like classes have an optional body parser
  - ⚠️  32c7732 Redefine the signature of middlewares and post jobs
  - ⚠️  ca06771 Change the HTTP method to use to update the user
  - ⚠️  f4b8c15 Treat the database type file as independent

### ❤️  Contributors
- Angelo Magtoto
- AteKitty07
- IKnightSKyI
- Jarlem Red De Peralta
- Kenneth Trecy Tobias
