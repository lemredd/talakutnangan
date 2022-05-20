# Talakutnangan
A capstone project aim to create a consultation chat platform for MCC.

## Installation

### Prerequisites
- [Node.js and NPM]. LTS version is recommended
- [Docker]

### General Development Instruction
1. Copy *.env.example* file as *.env*. Default are enough but you may customize the values according
   to your liking.
2. Run `docker-compose up -d --build`
   - It will run too long for the first build only. Subsequent builds will be fast. This will create
     the database server.
3. Run `npm install`
4. Run `npm run dev`
5. Visit http://localhost:16000

### Author
Coded by Kenneth Trecy Tobias.

[Node.js and NPM]: https://nodejs.org/en/
[Docker]: https://www.docker.com/get-started/
