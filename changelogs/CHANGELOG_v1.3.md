# Changelog

## v1.3.0

### 🚀 Enhancements
- **consultation:** Open form in new tab (87e35d60)
- **post:** Make route to update attached tags (87428b40)
- **chat:** Scroll automatically (0942d4a4)
- **tag:** Generalize the title for tag management (449a88b8)
- **resource management:** Hide selection if existence is unmodifiable (5cacdd75)
- **role:** Generalize the title for management (96e251c0)
- **role:** Generalize the title for management (d5cadb89)
- **semester:** Generalize the title for management (7e045850)
- **audit trail:** Generalize the title for management (c052469b)
- **user:** Generalize the title for management (e8a641c5)
- **resource management:** Hide batch buttons if none are selected (20a9e89e)

### 🩹 Fixes
- **post:** Include tags properly (045f715b)
- **post:** Pass the required ID (81be8734)
- **chat:** Use matching data profile picture (dc8704f8)
- **page:** Rename page props properly (490c1ac0)
- **resource management:** Correct the resource tab infos (5134c9bd)
- **user:** Show other tabs for dean (5b06d606)
- **user:** Use the full name department (4ec85835)

### 💅 Refactors
- **user:** Redetermine the title of the resource page (5cf708b1)
- **user:** Specialize the determination of title of user management (2bed244b)

### 🏡 Chore
- **fix:** Fix merge conflicts (ff768394)

### 🎨 Styles
- **component:** Break words (ac138e18)
- **post:** Add margin and style button (7939aa64)
- **component:** Adjust background color (0cd1bf7d)
- **field:** Make the selectable shown as row in desktop (61a60ab7)

### 🤖 CI
- Split the unit tests for back-end tests (e1dfd93f)
- Increase the timeout for unit route tests (243b46d7)

### 🗒️ Configurations
- Remove unnecessary configuration (4fc0c190)

### 👓 Reformed Templates
- **consultation:** View new details conditionally (dc537b74)
- **consultation:** Show controls conditionally (2c6e5e07)
- **consultation:** Pass message activities (f7e3c94b)

### 🔩 Internals
- **manager:** Add method to reattach the tags (9564c489)
- **server:** Include the enhancers for the pages to guard them (82f89087)
- **server:** Default to maintenance mode (ca6c68fa)
- **route:** Add transaction in chat message archive (be946b30)
- **route:** Add transaction in chat message activity archive (ada16268)
- **route:** Add transaction in comment archive (47edb0fd)
- **route:** Add transaction in comment vote archive (8707b49a)
- **route:** Add transaction in consultation archive (6afc93d1)
- **route:** Add transaction in department archive (216de591)
- **route:** Add transaction in employee schedule archive (14337482)
- **route:** Add transaction in post archive (e111bafa)
- **route:** Add transaction in post attachment archive (ab24b32c)
- **route:** Add transaction in profanity filter archive (27b725b7)
- **route:** Add transaction in role archive (d42c7453)
- **route:** Add transaction in semester archive (9735f084)
- **route:** Add transaction in tag archive (3a0a78a7)
- **route:** Add transaction in user archive (bd2a389f)
- **route:** Add transaction in chat message restore (2fe4e841)
- **route:** Add transaction in chat message activity restore (c94e6f73)
- **route:** Add transaction in comment restore (284430ea)
- **route:** Add transaction in comment vote restore (36dbad16)
- **route:** Add transaction in consultation restore (9fb81593)
- **route:** Add transaction in department restore (73acf09d)
- **route:** Add transaction in post restore (46cbd3e1)
- **route:** Add transaction in profanity filter restore (89b30cde)
- **route:** Add transaction in role restore (29c7421a)
- **route:** Add transaction in semester restore (e58a086f)
- **route:** Add transaction in tag restore (fdeff57b)
- **route:** Add transaction in user restore (59c7b236)
- **post:** Include the department of owner (0b03269d)
- **post:** Add the tag controllers (91976ece)
- **component:** Make prop optional (52c6963d)
- **consultation:** Pass current activities (c7ed82a6)
- **listener:** Filter matching user data (05d2e6ce)
- **page:** Correct the conditions to show maintenance message (dae6632a)
- **resource management:** Make function to determine the title (9968b52a)

### 🌐 Shareables
- **permission:** Make combination for tag (6b013b5e)
- **constant:** Make the link to update the tag of post (f8b76bbd)

### 🔦 Developer Experience
- **command:** Remove deprecated command name (4d6b80b8)

### 🦠 Unit Tests
- **post:** Allow any type of post resource (019ef627)
- **manager:** Ensure reattachment of tags works as expected (201c8489)
- **post:** Prepare test to update tags of a post (a7849ff0)
- **post:** Ensure to set the appropriate flags (a17b9d9d)
- **consultation:** Ensure scrolling to latest chat (e98cb773)
- **component:** Remove debuggeres (d1067b3b)
- **component:** Mock some passed data (a9a79c5d)

### 🕷 Integration Tests
- **consultation:** Stub element method (e324f43c)

### ❤️  Contributors
- Angelo Magtoto
- Ardrin Gregorio
- Jarlem Red De Peralta
- Kenneth Trecy Tobias
