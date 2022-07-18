# Changelog

## v0.7.0

### 🚀 Enhancements
- **database:** Make class to build API link addresses (1bb208b)
- **database:** Add methods to add pagination links (f996aa5)
- **consultation:** Started template for the consultation chat page (f85bb32)
- **server:** Integrate catch-all error handler (f838513)
- **server:** Make test route for testing error handler (0da8760)
- **server:** Redirect clients on some errors if they accept HTML (ef72baf)
- **chat:** Display consultations (c38b2bd)
- **chat:** Allow consultation selection (9c2a345)

### 🩹 Fixes
- **user:** Readd code to show users (3cc183e)
- **user:** Remove import of search icon (ac0f144)
- **server:** Output the error with correct media type (f9bbdf5)
- **test:** Correct the structure to be expected from server (d08c178)
- **server:** Redirect properly for caught errors (66df171)
- **client:** Fix the incorrect spelling of permission group (bb62cc4)
- **client:** Rearrange the conditions implement the exclusive-or (cb3a869)
- **client:** Ensure kinds and permission combinations are empty array (d26501b)
- **client:** Correct the property name of roles after deserialization (98e0ae5)
- **client:** Correct the name of roles after deserialization in tests (97c892d)
- Upsert an attached mock role for mock admin user (6d8689c)

### 💅 Refactors
- **back-end:** Use the request environment status for readability (fbcb437)
- **styles:** Relocate variables to properly (24ae804)
- **styles:** Rename all variables properly (0c86521)
- **shell:** Use the injected page context as basis of links (65f45fe)

### 📖 Documentation
- Reformat the change log (fac5710)
- **command:** Update the documentation of some parameters of script (c91a721)

### 🏡 Chore
- Remove unused page (cf55d51)
- **back-end:** Move authorization error class to dedicated folder (5e132d9)
- **back-end:** Make dedicated subdirectory for common back-end helpers (0ee4a07)
- **test:** Document the purpose of mock requester (354fc96)
- Correct the misspelling (292f577)
- Move API link creator to common back-end (654d2cd)
- **back-end:** ⚠️  Treat helper function to get root as common back-end (f94a33d)
- **back-end:** ⚠️  Treat request environment as common back-end (62858fa)
- Rename API link to URL maker (fdd048e)
- **command:** Prepare structure for custom run of scripts (af03ea5)
- Add period to error messages (e7db3b7)
- **component:** ⚠️  Rename the directory to page shell components (0ed74c9)
- Add general todos for others (e1d10a3)
- **client:** Rename the test for filtration of link information (884c16b)
- Add additional dummy data (7512a30)
- Specify scopes of todos (5af11d4)

### ✅ Tests
- **unit:** Test the creation of pagination links (ad9646e)
- **set-up:** Add new methods to customize and check response (0c08bec)
- **set-up:** Add new methods to run error handlers (8871b2e)
- **server:** Ensure catch-all error handler works properly (eacfdec)
- **set-up:** Make method to check for next function (de2285a)
- Disable tests involving e-mail because of SMTP server problems (8c2ce62)

### 🌊 Types
- **server:** Add error interface to be output from server (021eab7)
- **server:** Make constants for media types (5fc2835)
- **renderer:** Allow passing parsed error to page props (6246f08)
- **client:** Dedicate a file for conditional link info type (aaf1dea)
- **client:** Add types for deserialized page props (cf7cb99)
- **client:** Return the correct type of deserialized page context (a482755)
- **client:** Type the roles as array (ddba416)
- **client:** Consider the kind in conditional link information (1c1576c)
- **client:** Use array to allow links to multiple kinds (904b3f1)

### 🎨 Styles
- **shell:** Remove box-shadow (f40b50a)
- **shell:** Use transparent border (4f6764a)
- Generalize getting content base height (9c98e6c)
- Generalize calcs to mixins (de79936)
- **mixins:** Rename to content base height (2f33461)
- Use general mixin (0dadfdd)
- **chat:** Apply flex growth to left section (b71d832)
- **chat:** Remove redundant flexbox (e4e110d)
- **chat:** Use variables and some @apply directive (a7ccc3f)
- **chat:** Apply styles for mobile viewport (b144350)
- **chat:** Apply non-mobile viewport styles (4c9065c)

### 🤖 CI
- Use custom script to execute back-end unit tests in CI (3c97cd8)
- Include the workflow itself to run the back-end unit tests (f4cc557)
- Include common front-end directory for detecting changes in tests (1bb6f01)
- Include common back-end directory for detecting changes in tests (53d39bb)

### 🗒️ Configurations
- Add namespace for common back-end code (e336016)
- Rearrange the order of module name mappers (ace2fbd)
- Add configuration for common back-end tests (41ab895)
- Show the logs up to level 3 in CI (08e7d08)
- Add new alias path for common front-end code (b309a04)
- **git:** Remove unnecessary exclusion (a181281)

### 👓 Reformed Templates
- **chat:** Rename page folder (c597dd7)
- **chat:** Give sections distinct classes (3f7eec0)
- **chat:** Restructure left section with classes (1275208)

### 🔩 Internals
- **error:** Make a simple error class for unauthorized clients (3296428)
- **back-end:** Make base class for back-end errors (46aaa62)
- **back-end:** Make error class for authorization (b3fa5a2)
- **server:** Make catch-all error handler (4edb20f)
- **server:** End the response if headers were already sent (10e8b9e)
- **server:** Redirect the errors from handler to error handler (3f91f50)
- **back-end:** Allow supplying the redirect URL (91be13c)
- **server:** Initialize the URL maker (daaa33e)
- **server:** Pass the parsed unit error to client (55565cc)
- **renderer:** Modify the page to show for errors (ac252dc)
- **renderer:** Pass the error status to override the status code (a6b7457)
- **renderer:** Ensure the rendered error page remains after hydration (936140c)
- **renderer:** Render the page props temporarily (719697f)
- **server:** Make dev route output error from server (118d79f)
- **server:** ⚠️  Require policies to throw error instead (926793b)
- **server:** Throw authorization error in authentication-based policy (aa8cdfd)
- **server:** Throw authorization error in kind-based policy (6075e4e)
- **server:** Throw authorization error in permission-based policy (af10fad)
- **shell:** Add new prop to receive the page props (9726a69)
- **shell:** Prepare the shape of conditional link info (3761414)
- **shell:** Prepare link info array (459fddb)
- **shell:** Add property to indicate the permitted links (4e97118)
- **shell:** Restructure the link info for log in page (e41d24e)
- **shell:** Restructure some authenticated-only link information (e181d36)
- **client:** Restructure some authenticated-only link information (87c767e)
- **client:** Make helper function to deserialize object from server (cac8761)
- **client:** Pass through the null values from deserialization (5767330)
- **client:** Make funciton to deserialize page props (53abcb3)
- **client:** Prepare funciton to filter link information (ea56111)
- **client:** Complete the filter for link information (48f146d)
- **client:** Restructure some kind-only link information (c776bfa)
- **client:** Include kind as criteria for filtration of link info (b83ac13)
- **client:** Ensure filtering link information by kind works correctly (dbf9fdf)
- **client:** Restructure manage user link (3dd8790)
- **client:** ⚠️  Deserialize page props before providing to components (ee932fc)

### 🌐 Shareables
- **permission:** Share the logic of searching for one allowed role (40aacff)

### 🔦 Developer Experience
- **command:** Add mechanism to run the unit tests (b153706)
- **command:** Add mechanism to run the integration tests (a6a8ba8)

### 🦠 Unit Tests
- **server:** Update tests to assert for successful response (13248f4)
- **server:** Test redirection if client accepts HTML (bf99e95)
- **server:** Test the thrown-based policy mechanism (1959b40)
- **server:** Test the thrown-based authentication-based policy (9440de0)
- **server:** Test the thrown-based kind-based policy (fd7960d)
- **server:** Test the thrown-based permission-based policy (b7260ee)
- **server:** Update tests that check with policy (d048bce)
- **shell:** Mock the page props to prepare generation of links (ed71200)
- **client:** Ensure deserialized values are correct (2e6bb47)
- **client:** Ensure deserialized page context is correct (585aa24)
- **permission:** Ensure searching for one allowed role works correctly (a7358ea)
- **client:** Ensure filtration of link info works correctly (3522a11)
- **shell:** Update the tests for role specific links (154489f)
- **client:** Test for authenticated-only link information (41cf61e)

### 🕷 Integration Tests
- **server:** Check if the error handler works as expected (8d69ed5)
- **user:** Specify the media type to accept of user tests (9c19d2a)
- **role:** Specify the media type to accept for role tests (62e21c8)
- **department:** Correct media type of the department tests to accept (15b8f96)

#### ⚠️  Breaking Changes
- **back-end:** ⚠️  Treat helper function to get root as common back-end (f94a33d)
- **back-end:** ⚠️  Treat request environment as common back-end (62858fa)
- **component:** ⚠️  Rename the directory to page shell components (0ed74c9)
- **server:** ⚠️  Require policies to throw error instead (926793b)
- **client:** ⚠️  Deserialize page props before providing to components (ee932fc)

### ❤️  Contributors
- IKnightSKyI
- Jarlem Red De Peralta
- Kenneth Trecy Tobias
