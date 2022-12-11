# Changelog

## v1.8.1

### 🚀 Enhancements
- **user:** Change the variant of name field (6475cdf1)

### 🩹 Fixes
- **post:** Allow menu to be shown (3793cc43)
- **user:** Add random ID to prevent caching (116ae9fb)

### 🎨 Styles
- **user:** Add basis for schedule picker group (d82e796b)
- **user:** Ensure correct spacing of schedules (8f6916e6)

### ❤️  Contributors
- Kenneth Trecy Tobias

## v1.8.0

### 🚀 Enhancements
- **component:** Make the existence filters in proper case (07ead219)
- **user:** Allow deans to edit the schedule of other employees (ec106f22)
- **server:** Register route to get a random image (bd063a68)
- **server:** Change the background URL of log in page (7c30a65c)
- **profanity filter:** ⚠️  Remove profanity filter routes (69931791)
- **asynchronous file:** Remove routes for asynchronous file (3935a7dc)
- **home:** Show the posts (cc50ef4c)
- **home:** Show the posts (0034e6cd)
- **component:** Add field to search for tags (d119c448)
- **consultation:** Allow urgent submission (bdaa48a4)
- **consultation:** Disable if urgent (aecbbe4f)
- **home:** Show the teaser even if authenticated (eeba9f84)
- **consultation:** Allow forceful start (f136623c)
- **consultation:** Set urgent reason (eb90c318)
- **consultation:** Display urgency in details (15ed53fd)

### 🩹 Fixes
- **user:** Correct the casing of the name (e67095cf)
- **consultation:** Use all IDs (09b10967)
- **manager:** Limit the count to existing users (b5914e7a)
- **manager:** Limit the count to existing users (27e74873)
- **consultation:** Find activities of consultation (4fd16bcf)
- **manager:** Limit the count to existing attached users (b5db48bf)
- **consultation:** Find activities of consultation (efeaee48)
- **server:** Reorder to override the user read route (21624967)
- **consultation:** Correct conditioning (f666a05b)
- **server:** Remove asynchronous operation in catching errors (d3f50551)
- **server:** Ensure random ID changes every reload (75a4503b)
- **post:** Correct the data passed to the client (0cda8e66)
- **consultation:** Set `chosenTime` if urgent (dffa9bf5)
- **consultation:** Hide time field if urgent (7cb5072e)
- **consultation:** Allow colons in reason (623ffbbf)
- **consultation:** Use `isUrgent` state (9d2491af)
- **consultation:** Update with urgency (87097a5b)
- **consultation:** Allow ending if urgent (43fe413b)
- **consultation:** Select first date if urgent (89b49e0d)
- **consultation:** Clear date and time (21bd3f9e)

### 💅 Refactors
- **server:** Make image count into a constant (4ab337cc)

### 🏡 Chore
- **consultation:** Replace with proper words (91bf498a)
- **consultation:** Change letter of a word (45c08310)
- **consultation:** Replace with proper words (807ac16d)
- **component:** Remove unused variable (442f91d4)
- **consultation:** Replace with proper word (c0d626ef)
- **revert:** Unupdate with urgency (54096fd3)
- **revert:** Unadd urgent badge (3831fa82)
- **revert:** Unuse `isUrgent` state (cf02d13a)
- **revert:** Undisplay urgency in details (cca50b49)
- **revert:** Unmake urgent state (7ef270fa)
- **revert:** Unset urgent reason (f1f9ef61)
- **revert:** Unensure urgent reason field (53de92c5)
- **revert:** Unallow colons in reason (bdc440c7)

### ✅ Tests
- **factory:** ⚠️  Remove factory for asynchronous file (cd2c441e)

### 🌊 Types
- **server:** Add property to get the force confirmation pointer (3bfd4d11)
- **server:** Make type to filter by tags (ba4b8fbc)
- **server:** Make tag IDs be number or string (db3e9db5)
- **server:** Allow asterisk to be passed as tag ID (bc7bfcba)
- **share:** Remove document types for found comment word (cbd7e2ee)
- **share:** Remove document types for found post word (bd8248aa)
- **share:** Remove document types for profanity filter (d04829b2)
- **share:** ⚠️  Remove document types for asynchronous file (916559bf)
- **server:** Remove asynchronous operation manager (8ed1259b)
- **back-end:** Remove asynchronous operation types (ac32a9ce)

### 🎨 Styles
- **consultation:** Center message (77eef41b)
- **consultation:** Use `@apply` directive (47a7ef72)
- **profile:** Remove extra spaces (a89b2d62)
- **consultation:** Customize color for a status (4f796959)
- **consultation:** Lessen margin (9b9d52f9)
- **consultation:** Reorganize styles (857230e1)
- **consultation:** Flex dynamically (7f348871)
- **consultation:** Style consultor fields (0b29f5dc)
- **consultation:** Adjust margin (c1a2f6ef)
- **consultation:** Override margin (e52fdc48)
- **consultation:** Compress date and time fields (7e62f6de)
- **consultation:** Center vertically (8d69b2a0)
- **user:** Flex schedule pickers (d5bc591b)
- **page:** Tint the image (67b91944)
- **consultation:** Compress details (c9db13f8)
- **page:** Add compatible styles (f3e7bd7f)
- **home:** Add guidelines to distinguish instructions and posts (f513682a)
- **user:** Flex schedule groups (03da0cd2)
- **user:** Display schedules in column (ede3486b)
- **user:** Limit height (5e047fca)
- **user:** Limit width (0b7a362c)
- **user:** Flex buttons (d576e20f)
- **consultation:** Attempt to put the chat in next page (3da4881e)
- **consultation:** Override flex display (f5815c63)

### 👓 Reformed Templates
- **consultation:** Rename consultant and consulter (e932e158)
- **consultation:** Rename consultant and consulter (382da295)
- **consultation:** Relocate error message (054c7e21)
- **consultation:** Add urgent badge (40ee4ae2)
- **consultation:** Add urgent badge (8a1bcf3c)

### 🔩 Internals
- **validator:** Make validator to ensure there are no user (11d5ca47)
- **department:** Prevent deletion if there are users associated (62d29e8d)
- **server:** Add links to try the images (82ff6115)
- **server:** Add constant to form the link (62ad04a4)
- **server:** Make route to get a random image (1abb69bd)
- **server:** Make the URL more distinguishable (7f36cb84)
- **validator:** Ignore the schedules if permitted (d97c13fc)
- **consultation:** Add pointer to force the start (5b68bde9)
- **consultation:** Add pointer to force start (864033c0)
- **validator:** Remove dependence on external libraries (331f3a88)
- **query:** Make query to sift by tags (66eacd0d)
- **manager:** Add query to sift by tags (94b4c15d)
- **rule set:** Allow setting constraints for initial pipes (6d15fb0e)
- **post:** Add rule to validate tag IDs (f20bc526)
- **post:** Add missing tag IDs (7116c110)
- **manager:** ⚠️  Remove found comment word manager (1712ca3c)
- **manager:** ⚠️  Remove found post word manager (1359fa29)
- **manager:** ⚠️  Remove profanity filter manager (3903a6b7)
- **transformer:** ⚠️  Remove found comment word transformer (9d221205)
- **transformer:** ⚠️  Remove found post word transformer (133602eb)
- **transformer:** ⚠️  Remove profanity filter transformer (cf8e97b7)
- **model:** Remove model for found comment word (25d02842)
- **model:** Remove model for found post word (4e6a30c3)
- **model:** Remove model for profanity filter (b96d3f2a)
- **manager:** ⚠️  Remove asynchronous file manager (e7b0a102)
- **transformer:** ⚠️  Remove asynchronous file transformer (34fd2b69)
- **model:** ⚠️  Remove asynchronous file model (0eb9a174)
- **migration:** ⚠️  Make migration to remove asynchronous file table (e2d20e16)
- **middleware:** ⚠️  Remove asynchronous operation initializer (97b79336)
- **fetcher:** ⚠️  Remove fetcher for asynchronous fetcher (8c2afe42)
- **server:** Add new image file IDs (66399843)
- **user:** Select ID randomly (c67662e6)
- **home:** Pass the posts to home if authenticated (b9ee2fa4)
- **post:** Allow search by tag post (ded7f174)
- **manager:** Override required tag post (92cc85ac)
- **post:** ⚠️  Add requirement if post menu should be shown or not (3ad47bed)
- **home:** Remove unnecessary listeners (832bac48)
- **consultation:** Make urgent state (27574b25)
- **consultation:** Set milliseconds if urgent (865b2f79)
- **constants:** Make new constant (9f398015)
- **consultation:** Determine custom millisecond (6f169c37)
- **consultation:** Make `isUrgent` state (86a3c8bf)
- **user:** Clear errors and messages on change (b0781983)
- **user:** Unfill success message (608ebf99)
- **user:** Clear messages on `toggleAdding` (78096cad)
- **user:** `clearMessages` when editing (f98c527f)

### 🔦 Developer Experience
- **command:** Ensure package version is also updated (0b3830ec)

### 🦠 Unit Tests
- **consultation:** Set on going consultation (0b516818)
- **consultation:** Prepare profile picture test (d7f05ed1)
- **manager:** Ensure counting of users is limited to existing users (022b40de)
- **consultation:** Ensure equality of IDs (8473c59c)
- **manager:** Make test to exclude archived model from count (c65d6686)
- **department:** Ensure department cannot be deleted with existing user (a9cf2b58)
- **consultation:** Ensure consultation is not yet finished (b08080f9)
- **consultation:** Rename props (ce3b6381)
- **validator:** Prepare test to ignore the schedules (2ac7face)
- **consultation:** Ensure there are necessary confirmation (61a8ed7d)
- **query:** Make query to sift by tags (3bfa9c8e)
- **consultation:** Move unit test (a3456ad2)
- **consultation:** Unstub some components (f6f4d007)
- **consultation:** Mock emission (c5f925e1)
- **consultation:** Use proper selector (1a89303c)
- **consultation:** Ensure request on submit (226c1bac)
- **consultation:** Ensure urgent submission (476ba079)
- **consultation:** Prepare forceful start test (443fe51f)
- **component:** Fix multiviewer test (daf35632)
- **consultation:** Ensure datetime fill if urgent (ac0e53cc)
- **consultation:** Ensure force start button text (7a025b1b)
- **consultation:** Ensure forceful start emission (7b7b6015)
- **consultation:** Ensure urgent reason field (dd919e27)
- **consultation:** Ensure custom milliseconds (4844eabe)
- **consultation:** Ensure custom milliseconds (e2b52d19)
- **consultation:** Provide schedule on props (9485eca2)

### 🕷 Integration Tests
- **user:** Remove old code (644f85b6)
- **semester:** Remove passwword confirmation (421ee653)
- **tag:** Remove password confirmation (b59ab348)
- **department:** Add missing department (c0bca7c9)
- **consultation:** Ensure normal start is confirmed (41f49bbf)

#### ⚠️  Breaking Changes
- **profanity filter:** ⚠️  Remove profanity filter routes (69931791)
- **factory:** ⚠️  Remove factory for asynchronous file (cd2c441e)
- **share:** ⚠️  Remove document types for asynchronous file (916559bf)
- **manager:** ⚠️  Remove found comment word manager (1712ca3c)
- **manager:** ⚠️  Remove found post word manager (1359fa29)
- **manager:** ⚠️  Remove profanity filter manager (3903a6b7)
- **transformer:** ⚠️  Remove found comment word transformer (9d221205)
- **transformer:** ⚠️  Remove found post word transformer (133602eb)
- **transformer:** ⚠️  Remove profanity filter transformer (cf8e97b7)
- **manager:** ⚠️  Remove asynchronous file manager (e7b0a102)
- **transformer:** ⚠️  Remove asynchronous file transformer (34fd2b69)
- **model:** ⚠️  Remove asynchronous file model (0eb9a174)
- **migration:** ⚠️  Make migration to remove asynchronous file table (e2d20e16)
- **middleware:** ⚠️  Remove asynchronous operation initializer (97b79336)
- **fetcher:** ⚠️  Remove fetcher for asynchronous fetcher (8c2afe42)
- **post:** ⚠️  Add requirement if post menu should be shown or not (3ad47bed)

### ❤️  Contributors
- Angelo Magtoto
- Ardrin Gregorio
- Jarlem Red De Peralta
- Kenneth Trecy Tobias
