# Changelog

## v1.5.0

### 🚀 Enhancements
- **tag:** Show custom success messages (a6ec7140)
- **authentication:** List possible contacts (bdca344d)
- **consultation:** Reload after archiving (048b8cf2)
- **consultation:** Show canceled status badge (6ae35ade)
- **role:** Merge the role properly (9ea66221)

### 🩹 Fixes
- **consultation:** Retrieve the consultation even if archived (161c4889)
- **tag:** Add mechanism to manipulate the existence of the tag (6e8752e6)
- **tags:** Set resource attribute (2fceba65)
- **page:** Clear errors on refetch (86abf5bb)
- **resource management:** Renew to empty list (1de1d252)
- **page:** Update resource attribute on client (ee256d4c)
- **manager:** Check ownership for deleted resources (2f8675b9)
- **consultation:** Correct criterias for states (8d8f8ecc)
- **consultation:** Find regardless of existence (bc6d0b73)
- **consultation:** Set age to "canceled" (77176d24)
- **consultation:** Use values of states (c825b37a)
- **permission:** Allow imports to be used as values (68fe5173)
- **page:** Reset selected IDs (f2508caf)
- **role:** Unwatch filter when clearing offset (b8450224)
- **post:** Update tags on client (771df46c)
- **post:** Cast IDs to number (8fd9df0b)

### 💅 Refactors
- **manager:** Separate the mechanism to integrate count (cea31147)
- **page:** Use helper when refetching list (4089f758)

### 🏡 Chore
- **component:** Rename and remove some props (65f7e892)
- **revert:** Readd the filters for reconstruction (1641bb96)
- **component:** Rename method (0ccf897d)
- **component:** Relocate helper method (d01ff27e)
- **component:** Rename helper (ee336983)
- **component:** Rename variables (f612a0c2)
- **middleware:** Rename file for filling the IP (970baa3a)

### 🌊 Types
- **department:** Add missing property (3d6b164a)
- **share:** ⚠️  Remove profanity flags in role (8ab25913)

### 🎨 Styles
- **component:** Appear as column (e55799ca)
- **semester:** Adjust spaces (a7fddab7)
- **component:** Simplify text color (fd2be2b6)
- **component:** Use `:disabled` selector instead (93aa835e)

### 🤖 CI
- Remove profanity filter (6c04053b)

### 👓 Reformed Templates
- **role:** Add list redirector (f4b3e9e0)
- **page:** Add list redirector (ac4ea565)
- **login:** Add details for forget password (70604ef4)
- **semester:** Fix missing component (4654cf79)
- **post:** Hover on images (160160a7)

### 🔩 Internals
- **front-end:** Allow forced overriding messages (cd20a1cc)
- **policy:** Redirect user who is not permitted to access by kind (c8b202de)
- **policy:** Redirect user from resource which is not owned (c4d89017)
- **transformer:** Remove profanity flags from transformer (af604d2f)
- **user:** Pass admin emails to as page prop (7a4756ee)
- **consultation:** Find even if archived (989ac9cc)
- **manager:** Make method to find resetter emails (8b61b633)
- **manager:** Integrate the count in document (8e3b6e3a)
- **user:** Show the email of users who can reset password (a8a73214)
- **component:** Generalize resetting of resource (8107222e)
- **component:** Modify loaded state (2a7f65bb)
- **role:** Remove profanity filter (07b7806a)
- **middleware:** Add IP filler middleware (a920720a)
- **server:** Add IP filler as global middleware (cbed6f99)
- **server:** Add client IP (ad7448b2)
- **server:** Track IP (0b4982a6)

### 🔦 Developer Experience
- **server:** Change emails consistently (b6ee9cae)
- **authentication:** Add prefix to email (9e2a890e)

### 🦠 Unit Tests
- **front-end:** Ensure overriding messages (8486f64f)
- **call:** Ensure previewing video (d7013d56)
- **component:** Ensure listing of admin contacts (c0479b1c)
- **component:** Restructure list of emails (f3f64133)
- **component:** Mock provide on other test cases (b30efd69)
- **manager:** Ensure retrieval can be done (9a549269)
- **manager:** Allow to retrieve no user (5414e8d8)
- **front-end:** Add missing department (127eab6b)
- **authentication:** Ensure listing of admin emails works as expected (994f8756)
- **component:** Ensure cleared properties (a9e8c4f0)
- **fetcher:** Add missing variables (89323cee)
- **helper:** Add missing variables (2dea72f8)
- **fetcher:** Fix unit test for department fetcher (28328f48)
- **fetcher:** Add missing property (d5ed4845)
- **role:** Remove profanity flags from checkboxes (51d32d24)
- **role:** Remove profanity flags from submission (258a5673)
- **fetcher:** Add missing property (7519cc28)

### 🕷 Integration Tests
- **call:** Ensure joining tracks (2491c888)
- **semester:** Correct selectors (fe2433b0)

#### ⚠️  Breaking Changes
- **share:** ⚠️  Remove profanity flags in role (8ab25913)

### ❤️  Contributors
- Angelo Magtoto
- Ardrin Gregorio
- Jarlem Red De Peralta
- Kenneth Trecy Tobias
