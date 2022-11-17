# Changelog

## v1.1.0

### 🚀 Enhancements
- **component:** Allow individual movement (0e0a99dc)
- **component:** Attempt to condense page length (d33115f1)
- **page:** Apply pagination (ccff781e)
- **consultation:** Show status badge (87676fbc)
- **user:** Add options to sort in descending order (ec6779f8)
- **user:** Show the kind instead of the role (1ef0d33f)
- **role:** Add options to sort in descending order (502cca59)
- **department:** Add options to sort in descending order (845b654c)
- **role:** Make the label sentence case (a2e6cd9e)
- **user:** Make the label sentence case (19383fdf)
- **semester:** Add options to sort in descending order (f6c68866)
- **tag:** Add options to sort in descending order (735b8052)
- **tag:** Add success messages upon tag creation (a29b1409)
- **semester:** Clear fields after creation (a408e533)
- **department:** Clear fields after creation (b64d9234)
- **role:** Clear fields after creation (f46da221)
- **audit trail:** Add options to sort in descending order (ef3062cf)

### 🩹 Fixes
- **call:** Check if consultation id exists (15b083c8)
- **page:** Fix dark mode not toggling (4803f238)
- **tag:** Correct the path for list redirector (dab5fe21)
- **component:** Use actual page length (087c74ff)
- **call:** Unplay audio track (e4910a4c)
- **user:** Include the chosen sort in watch (0c854223)
- **role:** Correct the value to pass (5e47c1fd)
- **role:** Watch the chosen sort (bd237db5)
- **semester:** Watch the chosen sort (0f08b800)
- **semester:** Correct the variables to mutate (6d522192)
- **tag:** Add missing component (c2ae7b8a)
- **tag:** Correct the column to sort (13610c4e)
- **tag:** Watch the chosen sort (b67c6f0d)
- **component:** Remove the pluralization of type (4265ea5a)
- **audit trail:** Watch the chosen sort (a25cc843)
- **audit trail:** Use the chosen sort (bcc25c80)
- **user:** Reset the offset when other criteria were reset (ce196ac0)
- **user:** Make resource count dependent (30359347)
- **semester:** Reset the offset when other criteria were reset (c1e1362f)
- **semester:** Make resource count reactive (d2824f95)
- **tag:** Reset the offset when other criteria were reset (f99d7034)
- **tag:** Stop continuously loading (727bfcb9)
- **role:** Reset the offset when other criteria were reset (7dbdfb57)
- **department:** Reset the offset when other criteria were reset (326ade78)
- **department:** Make resource count reactive (93368c57)
- **user:** Correct the state to mutate (735ba128)

### 💅 Refactors
- **user:** Use the minimum password length (e02a182c)

### 📖 Documentation
- Correct the format (c8aa6d13)

### 🏡 Chore
- **user:** Remove the log (b615468c)

### 🎨 Styles
- **component:** Style when disabled (79c3b856)
- **component:** Give border (c52ec1df)
- **component:** Use border to make visible (a4a35eb6)
- **consultation:** Make reactive (ab012a89)
- **field:** Make the options align properly (30afa6a0)
- **field:** Correct the margins (22687895)
- **resource management:** Make resource options flexible (a9d31a14)
- **field:** Add little bit of margin before the selection (f8216152)
- Fix minor dropdown in dark mode (af989e21)
- **field:** Ensure radios are on the same line (b59b5b81)
- **component:** Make responsive (231b0711)

### 👓 Reformed Templates
- **tags:** Add missing impornt (1ce84261)
- **component:** Render variously by page length (97cde780)
- **component:** Render conditionally (9c2b4f12)

### 🔩 Internals
- **server:** Add length limit (beee5e41)
- **consultation:** Force cast argument (de89ee62)
- **consultation:** Push into list document (80fc61e0)

### 🦠 Unit Tests
- **page:** Ensure toggle dark mode works (74ad4851)

### 🕷 Integration Tests
- **user:** Use correct email to register student (10067250)

### ❤️  Contributors
- Angelo Magtoto
- Ardrin Gregorio
- Jarlem Red De Peralta
- Kenneth Trecy Tobias
