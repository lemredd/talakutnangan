# Changelog

## v0.3.0

### 🚀 Enhancements

#### Server
- d75f67c Add base class for validation
- e20ba4e Add body validation middleware
- 4943a79 Add base class for policy
- d12aa48 Add helper to generate some route info using file name
- 2c1fa26 Enhance helper to detect the route purpose
- be3a80b Match the path exactly
- ⚠️  315e483 Remove handler generation of middlewares
- 35ad257 Rewrite base controller to derive route info from path
- ⚠️  b020585 Rename the name for middlewares and post jobs
- ⚠️  f525d00 Rewrite some base controllers
- ⚠️  9b1268f Rewrite all controllers
- 0b35e1f Add controller in route handler
- ⚠️  1544ee2 Rewrite the handlers for controllers
- 6074ce5 Differentiate handlers types
- a4a55c7 Create two variants of controllers
- c78ffc0 Rewrite router
- f8f983e Copy the elements of the usable routes
- ⚠️  11e15e7 Make middleware handler to be asynchronous
- 2d1f993 Rewrite all declarations of middleware handler
- 6a5f704 Rewrite the route registration in application
- 47516e1 Remove the prefixes in routers
- 596ba13 Make checking of user asynchronous
- e77743b Make comparison asynchronous
- 668da67 Derive route parameters from path
- fe04bf1 Rename controller for patching user details
- 8aa628c Ensure policies utilize the base class
- d851238 Add variants of known only policy
- db2c45e Allow client to directly log on server's console
- 9326a3b Add department router
- f619ca6 Add route to read department info
- 31f9eb1 Validate the body of read department route
- c535d53 Register custom validators
- 86f91ae Add route to create department
- 0b266ee Add route to update department
- 06abfcc Add route to archive department
- b25bb11 Change the HTTP method to use for updating department info
- 1dec62d Add route to restore department
- e540bfe Allow salt rounds to be configurable
- 80609d3 Create authentication-based policy
- 4043bcc Reuse previous known only policy as kind-based policy
- d620b30 Make base class for permission group
- 0ee24f8 Rename the method to get the name of the permission group
- 64b33ce Accept unions in permission groups for validation
- 66f6e13 Check passed role object statically
- 5981ae8 Check property statically
- 68e7a79 Add method to generate mask of permission
- b3c5a31 Ensure generated mask is correct
- 8d2a4be Implement method to check role has a permission
- 03baa8f Make department permission group
- b7ae4bb Mark some classes safe to use in client-side
- 4d89f5e Prepare permission-based policy
- e548e3f Make request handler to end request
- 356c6dd Delegate the termination of request
- 84f78b1 Make base class for controller-like classes
- 198125f Make end handler optional
- a7296cc Allow end handler to be customized by child classes
- d962b26 Make base class for enhancers
- db02f78 Accept controller-like classes in routers
- 631d16c Enhance chat room page route
- 7e54cb0 Rename enhancer as page middleware
- d702827 Rename method to return the policy
- 74cb756 Make skeleton for reset password route
- 9c95786 Complete the handling of password reset
- 63d7ae2 Create middleware to parse multipart form
- 9bea560 Create skeleton for import user route
- 8961872 Register user routes for importing and resetting password

#### Database
- 46645d8 Add migration for departments
- c35a6f0 Add model for departments
- d17e7ff Link the department table to user table
- b7d07e6 Link department model to user model
- 7017894 Create initial department manager
- 5fd0ec8 Include department in models of source
- a24d54c Ensure not to allow null on some attributes of model
- fd698a4 Add basic operations to manage departments
- dea9dad Make logging SQL commands configurable
- f113be2 Ensure department name is unique
- 8acead2 Link the user and department tables properly
- fcf7df2 Add method to reset the password

#### Shell
- 6dd899c Restructure shell and use windiCSS classes
- 5d8bbdb Unset navigation background color
- 9eec477 Create role specific links component
- 7629924 Define component props
- 3b307d5 Import components and required vue features
- c8329f1 Define and determine role specifiers
- 266a8db Use prop as class
- 69cbe7c Provide specifiers for new roles
- 4be5cff Add general non-guest nav items
- 5f4aef4 Add admin in dummy roles
- 4d7e79e Restructure markup with dummy data
- a6dc12e Provide specifier for admin role
- 9efbd56 Implement toggling of dropdown
- 803e3b7 Render component for non-guest users
- fb1ec5b Reorder links
- 5e35b10 Display link name beside icon
- 96e9e9d Make user settings as role link
- ca18210 Show role links manually in mobile
- 803c7d9 Use Notifications beside Role Links

#### General
- 1d5c3cc Add device userMedia on call
- 2bf9360 Add dummy image
- 7064f7d Create dropdown component

#### Call
- 1460cf4 Implement and provide addVideoStream
- 7455a69 Create new Peer instance
- c9a41e4 Use provided method once userMedia is retrieved
- 10a6f59 Implement peer calling
- 73703e3 Handle event emitted when client initiates call
- 952aa4e Handle client's call event emission
- f5ae578 Instantiate Document to allow element creation
- 2663bcc Refactor group calling methods to properly communicate with peer

#### Management
- d628cf9 Implement basic user management page

#### Logo
- ac5f02f Create placeholder for logo

#### Navigation
- 0ee41f9 Apply flexbox styling

#### Icons
- 2cc53b3 Use material icons

#### Auth
- 1fdd015 Implement signup page

#### CLI
- 781ed30 Create script to list all registered routes
- 8535560 Style some texts

### 🩹 Fixes

#### Test
- f624b03 Correct the file name of the test
- 24814b0 Remove incorrect assertion
- 806184b Adapt the reorganized types in test of JSON controller
- 816829f Correct the field name in department factory
- 07e5ced Compare the properties directly rather than as a whole
- 1b68ab7 Allow cascade on truncation of user model
- 1c4faad Allow cascade on truncation of department model
- 29f4407 Use enumeration of user kind to generate user

#### Server
- ⚠️  2a1e843 Correct the name to generate handlers for the route
- ed9c787 Ensure that post jobs and middleware retain their context
- 6d45582 Pass the request to get the subject
- b51ddd4 Do path operations properly not based on POSIX
- daea5e2 Use controller as end if there are no post jobs
- 4eed255 Correct the logic to go to next middleware
- 0523abf Allow any user if kind is null
- 09a29c2 Accommodate six-letter HTTP methods
- 1408ea9 Add missing permission definition and correct flags
- a90edf3 Correct the response status if resetting password fails

#### Database
- 8ea9ce8 Put the modification of column inside the callback
- 674c3e6 Ensure user has a department
- 98131e6 Rename the method for resetting password

#### Call
- 12e2ea6 Import peerjs client as CDN

#### Chat
- a28c3cf Get generated id properly

### 💅 Refactors

#### General
- b2d687b Separate initializer and session middleware of authentication
- b0c1af6 Rewrite some global middlewares
- 24544b7 Rewrite router to collapse sub-routers
- 134d068 Redo the base controller base from controller-like class

#### Server
- 69eaba7 Rewrite the imports of middlewares

### 📖 Documentation

#### Installation
- 3e1579b Add step to modify the e-mail variables
- 940118f Add instruction for another local database
- cfd448f Add instruction to create the database
- 32c675a Remove redundant step
- 5c16c32 Correct command

#### General
- ce30302 Correct minor grammatical errors

#### Guides
- bae0d09 Add other primary types
- fde2713 Enhance scopes

### 🏡 Chore

#### General
- affdf11 Rename the module for dependent types
- 0198644 Remove unnecessary imports
- 8e699d1 Remove unused import
- d8cd545 Remove some files from previous ORM
- f89abb7 Remove sample route
- 4508a4c Rename policy for known only users
- 8a10522 Rename policy for guest only users
- 54a7409 Fix some spacing
- 1b9254a Fix some spacing
- 1f5b2fb Allow aliasing when importing components
- b12bd6c Improve the pull request template
- e72dd92 Replace the path to use the key for pages subdirectory
- c44d6bf Rename known only policy to kind-based policy
- 22436c1 Document the constructor of authentication-based policy
- 7b24638 Delete unused IDE configurations
- 9c4a455 Remove unnecessary import in controller-like base class
- e152d2f Improve pull request template

#### Shell
- 7f87ee0 Modify dummy roles
- 6312eb7 Make notification button a component
- 43d966c Properly rename method
- b37a865 Organize markup
- 5421d33 Temporarily add viewport-based classes To be fixed soon
- 29294a2 Capitalize link names
- 12aeb30 Capitalize other link names
- 5f65a92 Import vue features and fix spaces
- c1e906d Move to proper dir and fix import
- ba9fec4 Relocate & emit event for testing
- bef58d1 Relocate & unimport a component
- b0f382b Provide pageContext

#### Call
- 854128d Properly rename component
- cf2c312 Properly set participant id
- 24cb548 Relocate participant component
- 908f585 Properly rename component tag
- 72a9c0e Refactor div to component and provide necessary data
- 80f5596 Restructure markup
- 0cdbde0 Import additional necessary vue features
- 37f5500 Create classes for Peer and Call
- 9f9cc07 Inject provided method
- f01c432 Fix Peer type
- 5758147 Provide and inject clientWebSocket
- 9416b40 Properly emit call event
- 076a005 Provide and inject Participants element
- de61265 Move addVideoStream method to proper component
- e89d00f Import several used vue features

#### Server
- ⚠️  d8b75bf Move base classes on dedicated subdirectory
- ⚠️  eb53993 Move routes under app directory
- 6ed174b Rewrite post JSON middleware
- 4bb9795 Rewrite all reference to server types

#### Styles
- 6dfe951 Move Video styles to component

### ✅ Tests

#### Integration
- 3f18a17 Ensure admin is logged in upon admission
- 67bcde9 Skip integration tests for register route
- 43669c1 Ensure read department route works properly
- 5cfca45 Improve the test on read department route
- ba21420 Ensure create department route works properly
- d04deaa Ensure update department route works properly
- 4e8716e Ensure archive department route works properly
- d8e2b63 Ensure restore department route works properly
- dae97b4 Ensure reset password route works

#### Unit
- 2eac28b Ensure route extractor works as expected
- 0d97dbe Rewrite test for new structure of base controller
- 20c7caf Test the route info extractor for real paths
- e682e57 Ensure route parameter is present
- 96ef0ae Rewrite the imports of the tests
- 8bd8d10 Test searching with ID through department manager
- 8effcc9 Test basic operations to manage departments
- 6446188 Ensure authentication-based policy works as expected
- 218ec3c Repurpose tests of known only policy for kind-based policy
- fea818f Ensure to throw error if group name is not found
- de2dd37 Update test to pass union on created class
- 37be41b Add tests to ensure permission group evaluates properly
- 7946e31 Ensure base classes for controller-related works properly
- 7744383 Update tests for controller-like base class
- 4a67805 Ensure enhancer base works properly
- 4065cf0 Update test to page middleware to utilize policy instead
- bf0a032 Ensure method for resetting password works

#### General
- 360c7ae Rewrite the set-up file to include routes immediately
- 271f75e Rewrite most tests
- eceb69b Ensure base policy works properly
- 9f15783 Fix some tests to adapt with organized types
- 863fa6a Use user kind in user factory
- ae08dee Create department factory
- 3e1fc6f Add method to associate a department to be used by user factory
- c5c533f Truncate the table manually to avoid foreign key check errors
- 4ded077 Remove the prefix on creating app
- 505c169 Enhance factory to generate user with specific kind
- 780721c Add names to mock permission groups

#### Shell
- 6121714 Create test file for shell components
- 2e2f68a Import necessary features
- e6c78f2 Make wrapper as global
- 7105b2b Define test cases & mount components
- 5de2d6a Test notification button click event
- af13387 Test notification footer link
- bcedbdb Test role links availability
- f2ca91e Test menu button click event
- 6b6c5dc De-globalize wrapper
- b9356e2 Test link activeness

### 🌊 Types

#### Server
- 0cf4b2c Accept unions in permission types for validation
- 9a796cc Handle the request handler only
- ada2c4d Allow end handler to be customizable
- 1a63d76 Allow end handler to be synchronous
- fd49a80 Make end handler optional instead

#### General
- 99c9a06 Make a module for dependent types
- e4a1b1a Make a module for some independent types
- fad1850 Move `Method` to independent
- 43e1ea4 Reexport `Method` properly
- 1c34821 Replace `web` with `dev` purpose
- 0328b08 Extend request handler for future compatibility
- 938bb02 Add new type to contain the route handlers
- 177395b Make a hybrid type to contain route handlers
- 4922808 Add interface to represent a usable route
- eb530a9 Move independent types to dedicated file
- 53bace4 Separate the different kind of server types
- 9c1b9e6 Add another types that are based on external packages
- fb0d417 Add type for raw department
- 7fb7806 Make type to structure info about a permission
- b78a9ff Make type to structure info about a group of permissions

### 🎨 Styles

#### Shell
- 821febb Style additional nav items
- c5bc656 Lighten background of dropdown
- 3007445 Make dropdown position as absolute
- 59cd84b Imitate Link styles
- 69c0376 Organize styles
- 3e9004e Remove styles merged from outdated branch

#### General
- 7435842 Maximize width and add minor styles
- 3ae3735 Improve user_list visual styles
- 924793e Make sure pageshell content has 100% width

### 🤖 CI

#### General
- 4577ff6 Ignore for synchronize events
- 59ee1f5 Reduce the event triggers to run the workflows

### 🗒️ Configurations

#### General
- 96dc509 Add command to list the registered routes
- 764cb21 Add command to redo all migrations
- 5bba945 Add new environment variables
- abebb57 Remove ignored patterns as they are not present anymore
- f9e8290 Set path for pages subdirectory
- 8c883c3 Add environment variable for security
- 42098e7 Update the variables for CI environment
- f32265d Update configuration for container
- de482cb Stop watching server files while running integration tests
- 622ef75 Install the latest package manager in container
- b33af1d Copy the database configuration file
- d8e406b Surrender on containerization of the app
- 68e0ff1 Remove duplicate pattern
- 46febed Correct the variable to be used for "pgsql" source type
- 009d9b5 Change the default username to be used for database connection
- 14ec15a Add command to migrate the database for the first time
- 0a87e7e Use correct user according to the environment

#### GIT
- 15efa52 Ignore .vscode directory

#### Windi
- b6c2483 Include various locations

#### ⚠️  Breaking Changes
- ⚠️  315e483 Remove handler generation of middlewares
- ⚠️  b020585 Rename the name for middlewares and post jobs
- ⚠️  f525d00 Rewrite some base controllers
- ⚠️  9b1268f Rewrite all controllers
- ⚠️  1544ee2 Rewrite the handlers for controllers
- ⚠️  11e15e7 Make middleware handler to be asynchronous
- ⚠️  2a1e843 Correct the name to generate handlers for the route
- ⚠️  d8b75bf Move base classes on dedicated subdirectory
- ⚠️  eb53993 Move routes under app directory

### ❤️  Contributors
- John Jerome Pertez
- Jarlem Red De Peralta
- Kenneth Trecy Tobias
