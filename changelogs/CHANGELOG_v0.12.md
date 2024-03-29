# Changelog

## v0.12.0

### 🚀 Enhancements
- **department:** Require password to update (bea5e266)
- **role:** Require password to update (6d075d45)
- **role:** Make route to update the assigned roles to user (6be8fe53)
- **employee schedule:** Make route to create schedule (a81f1b2a)
- **employee schedule:** Make route to update schedule (74e9f66f)
- **employee schedule:** Make route to archive schedule (a92c0eef)
- **employee schedule:** Make route to restore schedules (9b800caa)
- **employee schedule:** Register employee schedule routes (f0ab6e01)
- **employee schedule:** Make route to list the employee schedules (ef64132d)
- **employee schedule:** Register route to list the employee schedules (876cdfc9)
- **user:** Record user log in (24e4b25c)
- **user:** Record user reset password (54b51992)
- **user:** Record user import (87bc2c53)
- **user:** Record user archive (3e5e5e56)
- **user:** Record user restore (049764fb)
- **role:** Record role archive (a9ec5711)
- **role:** Record role restore (0d848576)
- **role:** Record department archive (5eaefaab)
- **role:** Record department restore (49a55aa4)
- **consultation:** Prepare route to create consultation completely (aa622aa2)
- **consultation:** Apply rule set maker to archive consultation (756eb47f)
- **role:** Prevent user to self-edit the attached role(s) (fd462529)
- **role:** Enhance the error message (2e4ac9b4)
- **consultation:** Add functionality to toggle consultation form (e76859a7)

### 🩹 Fixes
- **role:** Extract the role IDs properly to update attached roles (5d5d6261)
- **employee schedule:** Rename the controller for schedule creation (b590597b)
- **factory:** Correct the attribute to fill (c8e6aee2)
- **employee schedule:** Correct the controller to use to create (7c7c5855)
- **employee schedule:** Add ID parameter to update (d9a1254c)
- **employee schedule:** Allow anyone to list the schedules of employee (6d832e72)
- **fetcher:** Make deserialization optional (dd933eb9)
- **employee schedule:** Correct the type passed to exclude relationships (3bb12367)
- **middleware:** Wait for the creation of audit trail before proceeding (2cbe441f)
- **transformer:** Access the linkage to process them properly (4cc03ef5)
- **transformer:** Correct the type of new included array (82963ee6)
- **transformer:** Ensure resource object is not null before finalizing (0bd5cc4d)
- **transformer:** Put the resource in data so to allow sub-processing (ca2d5c9a)
- **transformer:** Correct the comparison operator to find the resource (09dc1af4)
- **consultation:** Update the format of options for document rule maker (1586bc99)
- **transformer:** Fix the value to search for consultation (9fcb45e5)
- **transformer:** Ensure indexes are greater than -1 to indicate match (0b7b9fc3)
- **front-end:** Fix independent front-end types (38ce2688)
- **front-end:** Fix base fetcher type parameters (6e27f7ce)
- **front-end:** Add required type parameters (ad85d68f)
- **server:** Cast the session duration properly (10d0895e)
- **component:** Correct the path to overlay component (b6684f75)
- **front-end:** Add required type parameters (3eb3569f)
- **server:** Cast the session duration properly (9d6f408e)
- **types:** Add required type parameters (144bb940)
- **share:** Add required type parameters (a2a53758)

### 💅 Refactors
- **transformer:** Rearrange to allow easier logging of resource (94a956c7)
- **component:** Use array sanitizer (b31e5f1c)
- **component:** Use `UserFetcher` to log in (1ce260ab)
- **component:** Get `role` from `userProfile` (bc88cbcd)
- **component:** Separate code for consultation form (bcce6911)
- **component:** Remove quotes in props to receive the attribute (456d0cca)

### 📖 Documentation
- Change the markup of co-author trails (59ff3ed6)

### 🏡 Chore
- **revert:** Accept integer ID to update resources (96980f73)
- **server:** ⚠️  Move enhancers to a dedicated directory (a376450e)
- **model:** Correct the file name of consulter model (599e979d)
- **manager:** Apply lint rules (0871dd75)
- **lint:** Apply lint rules (ceb05590)
- **model:** Remove some finished tasks (d8b38ceb)
- **database:** Rename foreign attributes to relationships (fc2fc189)
- **consultation:** Apply lint rules in consultations page (44d874bd)
- **page:** Rename the folder containing consultation (5831ebac)
- **component:** Move overlay to helper components (4b4fa7a5)
- **server:** Apply lint rules (577931d4)
- **validator:** Reorder the comment lines to turn off some lint rules (9685af3d)
- **revert:** Add explicit set of an ID in attached role (c2597e16)
- **lint:** Adhere to linting rules (4467b7b2)
- Rename component properly (e2f8ffdb)
- **lint:** Adhere to linting rules (f50866b9)
- **lint:** Adhere to some linting rules (4238955b)
- Move components to folder (d188aa86)
- Remove unnecessary response mocks (d1703bfa)
- **lint:** Adhere to linting rules (18763efd)

### ✅ Tests
- **factory:** Allow serializer and deserializer use another transformer (8ec19250)
- **factory:** Add method to create a profile (1d3b89b7)
- **factory:** Use alphabets to reduce test failures (5caa123d)
- **factory:** Make factory for employee schedule (b4bfec1c)
- **factory:** Ensure the schedules are numbers (1118a7c3)
- **factory:** Add consulter generator in consultation factory (cc7edcf0)
- **factory:** Make attachment of children become asynchronous (3a934e33)
- **factory:** Pluralize consulters (3f846029)
- **factory:** Attach consulters in factory (18097ed2)
- **factory:** Attach consultant information in factory (9a16b4d8)
- **factory:** ⚠️  Allow serialization of created models (5ddc18e8)
- **factory:** Make factory for chat message activity (7028669c)
- **factory:** Add required type parameters (13c353da)

### 🌊 Types
- **share:** Make types for some updated documents (02f6a97a)
- **database:** Make type for segregated IDs (175ba3e2)
- **share:** Add metadata for the count of resources (1035353c)
- **share:** Make resource count optional (d653247b)
- **share:** ⚠️  Allow identifier documents to customize ID property type (26d21b85)
- **share:** Allow employee schedule resource have optional properties (8053c11a)
- **share:** Allow employee schedule to cast the user identifier (d0d96910)
- **share:** Make type for query parameters of employee schedule (d8dc5433)
- **share:** Make a base relationship type (78fc1a76)
- **share:** Allow relationship property to be toggled (ae4c70bd)
- **share:** Ensure the identifier is in the data field (c038e9ca)
- **share:** Make type for external permission dependencies (c973db60)
- **database:** Separate the sub-transformer types (c5c91e3b)
- **database:** Separate the type for included foreign attributes (9a506168)
- **database:** Accept optional sub-transformer list in base (b28855c2)
- **share:** Make document types for chat message activity (fc9f5fa3)
- Add required type parameters (03feb6d5)
- **server:** Add required generic arguments (777e2d56)

### 🗒️ Configurations
- Turn off a lint rule to ignore `require` (90e6dfb0)
- **lint:** Exempt some bitwise operators for permissions (8240690a)
- **lint:** Warn some error (6e9d2052)
- **lint:** Warn on multi-word component names (b664d3a3)
- Force the host to be `localhost` for proxied development (b51e7521)
- Prevent using request environment since path alias does not work (350d3487)

### 👓 Reformed Templates
- **component:** Use `log_out_btn` component (f6ace756)

### 🔩 Internals
- **validator:** Make validator for matching password (55b5c9cd)
- **migration:** Add migration to prevent null in signatures (a711a5ef)
- **manager:** Prevent locking when finding with credentials (3a470997)
- **database:** Make helper function to segregate IDs (182b5eb7)
- **manager:** Make method to update the attached roles (d09331a8)
- **controller:** Separate the controller for bound JSON (e83b3e48)
- **manager:** Move the method to reattach roles (3f86aa63)
- **manager:** Add count to metadata of serialized list (d0a3f457)
- **manager:** Accept string ID to update resources (3a9c3210)
- **manager:** Use number as the default type of primary key (0daa5e55)
- **manager:** ⚠️  Receive integer to reattach roles (48eebf2a)
- **server:** ⚠️  Process enhancer paths from a dedicated directory (82504902)
- **transformer:** Make a transformer for employee schedule (44f4ec3e)
- **transformer:** Link employee schedule transformer to user (0b92dd7d)
- **manager:** Make employee schedule manager (a699603d)
- **manager:** Accept employee schedule attributes with user ID (c22b139c)
- **fetcher:** Allow fetcher to send other data fields to create (9146beb4)
- **query:** Make query pipe to filter employee schedule by user ID (ef7e9912)
- **manager:** Integrate pipe to sift employee schedules by user (d035f050)
- **fetcher:** Allow to customize the type of other data fields (afe14629)
- **fetcher:** Make fetcher for employee schedule (d3ab21e7)
- **shell:** Require permission for forum link (e7507726)
- **permission:** Include the approval of other permission groups (e2cc2a35)
- **permission:** Make comment permissions depend on post ones (90b48345)
- **middleware:** Make middleware to force redirection (bc1812a1)
- **server:** Apply the force redirector to some routes (c651efd4)
- **server:** Generalize the mechanism to redirect forcefully (f81f1e9c)
- **middleware:** Make post job to audit actions (66ca5cbe)
- **migration:** Make consulter table (c89091b1)
- **model:** Make consulter model (3298d1aa)
- **model:** ⚠️  Redo some parts of consultation model (5d9b0b07)
- **model:** Link consulter model to consultation (11bf4696)
- **model:** Expose consultant and consultant's role through getters (09ec1731)
- **database:** Make helper to iterate possible compound data (9b27fe58)
- **database:** Make function to be procedural style (f71055db)
- **transformer:** ⚠️  Change how transformer does the finalization (62dc9146)
- **database:** Register consulter model (6d8c26ed)
- **database:** Register consulter model (7c97939c)
- **transformer:** Make method to generalize the search for transformer (818689cb)
- **transformer:** Make method to generalize the search for transformer (8345fab8)
- **transformer:** Attach the relationships automatically (478f5b38)
- **transformer:** Represent sub-transformers in array (9bcf0d37)
- **transformer:** Allow included data to be transformed (5fd40d99)
- **transformer:** Sort included data to hide the effect of mechanism (34723eb4)
- **model:** Include ID for junction model (aad4d2fc)
- **model:** Allow consultant info to be optional (0907b446)
- **consultation:** Update the unit tests for consultation (07af0bc6)
- **validator:** Accept not validator (6e7e5f17)
- **validator:** Unique employee schedule validator (adaa6597)
- **validator:** Loose the comparison of same validator (9ae86b84)
- **rule set:** ⚠️  Redo the resource document rule maker (a65ac92f)
- **policy:** Make permission based policy more-generalized (cd4bcd66)
- **migration:** Make migration of chat message activity (196c2aa7)
- **migration:** Allow seen message date time to be null (62afd617)
- **model:** Make model for chat message activity (72a12488)
- **transformer:** Make transformer for chat message activity (f636bda7)
- **model:** Link chat message activity to consultation model (f3e7fdd8)
- **transformer:** Allow conditional transformers to prevent recursion (e1ace677)
- **transformer:** Make sub-transformer list optional in consultation (afce6ef8)
- **transformer:** Link chat message activities in consultation (248ceb77)
- **database:** Add chat message activity model in source (51587f6a)
- **manager:** Make manager for chat message activity (39bab155)
- **middleware:** Use the database as a storage for session details (2784f18a)
- **validator:** Include check for new schedule containing existing schedule (5955b348)
- **middleware:** Set session with database store upon instantiation (381f27b7)
- **middleware:** Use session on database to development and production (9edafc4b)
- **migration:** Add migration for sessions (cf6f9b6c)
- **middleware:** Indicate the table for sessions (af3337cc)
- **model:** Remove explicit set of an ID in attached role (4bb167e0)
- **front-end:** Add `logOut` method (53e7e6a8)
- **component:** Use `logOut` method (e2f34f40)
- **component:** ⚠️  Do the conditional rendering in overlay (ac0e4922)
- **component:** Make component to select from options (d2278177)
- **component:** Allow custom placeholder in selectable options (db0455fd)
- **component:** Allow model value to be optional in selectable options (534fdef0)
- **component:** Read the options only in selectable options (31bc21dd)
- **component:** Ensure model value is not optional to allow `v-model` (41c362af)
- **renderer:** Disable the loading of external script temporarily (aefea5b1)
- **component:** Utilize selectable options to choose kind of reason (7a830080)
- **component:** Allow inputting other reason (0b65ffbf)
- **component:** Make a state that can get the real reason (785e2280)
- **component:** Make a non-sensitive text field (179cd29a)
- **component:** Integrate non-sensitive field to consultation form (bc13c566)
- **component:** Make log out button (5752790d)

### 🌐 Shareables
- **helper:** ⚠️  Share sentence case text converter (08672116)
- **helper:** Make a time-minutes converter (e1ea6678)
- **permission:** Make permission combinations for post (24a8de27)
- **helper:** Generalize the helper to make arrays with unique values (679b720d)
- **permission:** Make method to generate external dependency info (7f0aa7b4)
- **permission:** Rename the method to identify external dependencies (877d3762)
- Add `string ( number` as parameter)

### 🦠 Unit Tests
- **role:** Ensure validation works as expected to update attached roles (4555c491)
- **employee schedule:** Ensure validation works to create (0872cee5)
- **employee schedule:** Remove the log (9e276316)
- **employee schedule:** Ensure route to update schedule works (7a65bcb2)
- **employee schedule:** Ensure route to archive schedule works (01c88cee)
- **employee schedule:** Ensure route to restore schedule works (896cdd5e)
- **manager:** Update the number of included resources (6da113de)
- **employee schedule:** Ensure route to list employee schedules works (b5494534)
- **permission:** Ensure identification of external dependencies works (191b975d)
- **helper:** Ensure generalized method delegator works (0bae14d0)
- **middleware:** Ensure force redirector works as expected (0298f1c1)
- **middleware:** Make action auditor works as expected (65b1b42c)
- **transformer:** Update the new order of included data (b14a0953)
- **manager:** Ensure included resources in tests are in order (fd9a298b)
- **consultation:** Skip the tests for consultation routes (0d194564)
- **validator:** Test for not validator (42c0a0c7)
- **validator:** Ensure unique employee schedule works (c9bf0dce)
- **validator:** Restore a portion of test code (71035a2e)
- **validator:** Correct the value to compare (a7d095fb)
- **role:** Ensure security for updating attached role works (ad2c0a8f)
- **role:** Correct the expected results in tests (b445287a)
- **validator:** Use `await` to return the lists of employee schedules (9024d6a1)
- **component:** Test and adjust component (1370676a)
- **component:** Ensure non-sensitive text field works (0565d6e8)
- **component:** Update the test code for overlay (144dad8c)
- **front-end:** Test `logOut` method (c8bec091)
- **component:** Use `v4` to generate dummy token (bbf12440)
- **component:** Test and adjust component (3a5d8200)
- **component:** Remove unused props (399fa7c4)

### 🕷 Integration Tests
- **role:** Ensure route works as expected to update attached roles (fabbd0cc)
- **employee schedule:** Ensure route to create schedule works wholly (23dbb207)
- **employee schedule:** Ensure route to update schedule works wholly (8bb6b186)
- **employee schedule:** Ensure route to archive schedules works wholly (1fc3abc6)
- **employee schedule:** Ensure route to restore schedules works wholly (1a451c59)
- **employee schedule:** Ensure route to list schedules works wholly (4c32da88)
- **audit trail:** Anticipate the recorded log in (833eba03)

#### ⚠️  Breaking Changes
- **server:** ⚠️  Move enhancers to a dedicated directory (a376450e)
- **factory:** ⚠️  Allow serialization of created models (5ddc18e8)
- **share:** ⚠️  Allow identifier documents to customize ID property type (26d21b85)
- **manager:** ⚠️  Receive integer to reattach roles (48eebf2a)
- **server:** ⚠️  Process enhancer paths from a dedicated directory (82504902)
- **model:** ⚠️  Redo some parts of consultation model (5d9b0b07)
- **transformer:** ⚠️  Change how transformer does the finalization (62dc9146)
- **rule set:** ⚠️  Redo the resource document rule maker (a65ac92f)
- **component:** ⚠️  Do the conditional rendering in overlay (ac0e4922)
- **helper:** ⚠️  Share sentence case text converter (08672116)

### ❤️  Contributors
- Angelo Magtoto
- Jarlem Red De Peralta
- Kenneth Trecy Tobias
