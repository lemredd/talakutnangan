# Changelog

## v1.7.0

### 🚀 Enhancements
- **page:** Suspense all buttons (0ca07a36)
- **semester:** Suspense all buttons (b5150113)
- **chat:** Suspend controller when sending (97b46e29)
- **component:** Disable button while operating (ea877a3b)
- **chat:** Disable input while sending (3de375a5)
- **component:** Limit date by given values (f99c06f3)
- **tag:** Update name field status (a6910d80)
- **chat:** Disable buttons while sending (5d429fbc)

### 🩹 Fixes
- **share:** Revert helper property (6e429baa)
- **department:** Give proper resource type (198345cf)
- **page:** Clear success messages on error (d00fd7f1)
- **tag:** Add missing filter (c5272857)
- **component:** Cancel on close (b95379f1)
- **page:** Import missing component (06d2bf95)
- **role:** Ensure undeleted state (9a668040)
- **manager:** Cast IDs to number (377a95b5)
- **department:** Use helper (21b7a9c0)
- **component:** Modify classes on method call (cff36523)
- **chat:** Show seen status on the latest message (afb08647)
- **component:** Clear success messages on error (ad521d40)
- **component:** Continue editing after adding schedule (3edc3fba)
- **component:** Use max range (604de273)
- **component:** Watch for range value changes (8a53ace2)
- **user:** Correct the method to be called (b862afac)
- **page:** Hide button if archived (bdaec070)
- **user:** Correct the manager used in reading users (3ea78e55)
- **post:** Handle empty tags (5bd03b5e)
- **post:** Handle empty tags in updating post (1945dffa)
- **call:** Style others' track containers (82168cba)
- **manager:** Ensure unfinished consultation (9e68ffc4)
- **server:** Validate ongoing consultation (a35c6818)
- **back-end:** Correct the quantifier (3b722e77)
- **query:** Include deleted roles or attachment for posts (fb379e8e)
- **department:** Stop retrieving departments in a loop (ba19185d)
- **user:** Show the file name that was selected for uploading (0c32639e)
- **comment:** Add meta info to show counters for votes (22276718)
- **role:** Update only if not deleted (e11138b1)
- **tag:** Update only if not deleted (0c8a9515)
- **page:** Update only if not deleted (5e29c0fc)
- **page:** Disable fields conditionally (7a738aa3)
- **consultation:** Rephrase error detail (26c54fe0)
- **user:** Remove conditioning of department field (e16cc1e1)
- **post:** Prevent showing add post button if not permitted (e1ae5ece)
- **consultation:** Fix double names (e046f360)
- **consultation:** Set the value to trigger changes (b120a59a)
- **consultation:** Show the selected file (c232ba50)
- **consultation:** Clear the previously uploaded file (43471258)
- **user:** Correct the mechanism to accept image files (1b13d399)
- **user:** Allow any image files (a463585d)
- **user:** Allow any dark mode to toggle (c3b86257)
- **user:** Check with other permission combinations (9296ab03)
- **user:** Disable editable field for name if not permitted (e332cbd4)
- **consultation:** Correct the casing of consultation (9380ba04)
- **consultation:** Correct the state to use (7d7a3cd2)
- **call:** Fix duplicating names in message (b5fc420f)
- **chat:** Suspend preview of file (84f53548)
- **page:** Add missing property (2ec9a177)
- **user:** Make methods asynchronous (0ec8a750)
- **tag:** Revert state after updating (3a276664)

### 💅 Refactors
- **component:** Use helper (007b5ddf)
- **post:** Remove duplicate code (f445eec5)
- **post:** Receive the current department instead (bfde76d3)

### 🏡 Chore
- **call:** Rephrase messages (9f2a8a51)
- **revert:** Unflex a controls container (cd09cde5)
- **revert:** Unsuspend controller when sending (59f0c911)
- **component:** Generalize helper (e1e0a816)
- **page:** Remove unused import (f358863d)
- **validator:** Clone consultation validator (a621393f)
- **revert:** Undo searching for verified user (64a49006)
- **component:** Add missing deleted at in read and create (156191ee)
- **database:** Correct the spelling of segregate (72b41e9b)
- **semester:** Clean the code (cf3b4825)
- **department:** Clean the code (3e6b30da)
- **user:** Parenthesize condition (d81639bc)
- **user:** Add phrase in success message (63b16484)

### ✅ Tests
- **factory:** Ensure end date is different from start date (b95e7499)

### 🌊 Types
- **back-end:** Add property for verification of email (cfd4fdf4)
- **database:** Add type for existentially segregated IDs (189ea847)

### 🎨 Styles
- **post:** Hyphen long dictionary words (07464e89)
- **component:** Style buttons and fields (ff4373cb)
- **chat:** Flex a controls container (f52f94a3)
- **comment:** Remove padding (a393468f)
- **form:** Seperate page of chat messages (d179a483)
- **form:** Seperate page of chat messages" (3d1768c4)
- **consultation:** Wrap and flex printed content (1fbd4b33)
- **consultation:** Reorder content on print (e18070d5)
- **user:** Style selected file (49419ad6)
- **post:** Style previewing of general file (5711a4d2)

### 👓 Reformed Templates
- **consultation:** Hide buttons conditionally (ca567b39)
- **consultation:** Hide buttons conditionally (4da79abb)
- **component:** Unnest container (b5cf550a)
- **consultation:** Put chat messages below (64158a7f)
- **chat:** State file size limit (36d6070a)

### 🔩 Internals
- **back-end:** Update to allow specific markdown syntaxes (e0c5b0df)
- **share:** Use all flavors (c146a673)
- **back-end:** Ensure initial table syntax (ab7b7295)
- **back-end:** Ensure blockquote syntax (219ff93e)
- **back-end:** Ensure image link syntax (2bf407e2)
- **page:** Remove redundant data (098849d8)
- **page:** Remove redundant data (6a3c3cda)
- **component:** Derive limitations from values (f0fca398)
- **route:** Fix user not able to log out (98745336)
- **semester:** Improve the validation of creating a semester (1b156bef)
- **semester:** Improve the validation of updating a semester (28c7c26e)
- **post:** Update the parent  values when submitted (8971b1c6)
- **post:** Use the contained post to prevent mismatch (a3648d9b)
- **manager:** Allow user verification (97e99876)
- **validator:** Find ongoing consultation (986a3e1b)
- **user:** Verify emails automatically recognized by the admin (22e76e19)
- **component:** Remove auto capitalization in department names (94cda6b8)
- **query:** Include archived users in audit trails (ff60eff4)
- **query:** Include archived users and roles in consultation (8e5d7684)
- **query:** Include archived users and activity in chat message (22ee97e9)
- **manager:** ⚠️  Retain attached role IDs (d0c19002)
- **tag:** Remove password confirmation in tag update (0693bf2b)
- **semester:** Remove password confirmation in semester update (e1184421)
- **component:** Capitalize labels in all of selectable radio (51355117)
- **database:** Make helper to segregate IDs by existence (ea057102)
- **database:** Allow attachments to be restored (ae527aa7)
- **component:** Use the original non-sensitive text (517f76a4)
- **component:** Revert changes (55679aa8)
- **component:** Temporarily revert capitalization of existence (fbd97885)
- **component:** Allow disabled state (163c047e)
- **user:** Allow components to be disabled (a4be5614)
- **component:** Allow optional disabling of close button (5d1fe310)
- **post:** Update tags only after submitting post (2e5c35de)
- **user:** Suspend fields when uploading (05402b37)

### 🔦 Developer Experience
- **component:** Set password on dev environment (ee75bb68)

### 🦠 Unit Tests
- **server:** Ensure specific markdown syntax (583894b8)
- **component:** Provide reactive body classes (0dec1fbc)
- **component:** Provide missing data (17a74602)
- **component:** Ensure limitations (95e675ca)
- **component:** Provide missing data (aa476773)
- **semester:** Make the submitted values to be string (227c0eeb)
- **manager:** Prepare validating consultation (7dc52548)
- **validator:** Ensure consultation is ongoing (7df87eb6)
- **validator:** Ensure error if model is finished (12a82bfb)
- **user:** Add verification date to emails (66c01d3a)
- **post:** Remove unnecessary test (c6e5e6f5)
- **database:** Prepare test to segregate IDs by their existence (a1e7c8a5)
- **database:** Expect roles to restore attachments (40d3577e)
- **chat:** Skip tests (6ee3d675)

### 🕷 Integration Tests
- **consultation:** Provide missing prop attributes (1d4fa656)
- **department:** Ensure request data attributes (0d14f307)
- **user:** Ensure updating of user data (fc22430b)

#### ⚠️  Breaking Changes
- **manager:** ⚠️  Retain attached role IDs (d0c19002)

### ❤️  Contributors
- Angelo Magtoto
- Ardrin Gregorio
- Jarlem Red De Peralta
- Kenneth Trecy Tobias
