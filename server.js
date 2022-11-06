const process = require("process")
const childProcessor = require("child_process")

childProcessor.execSync("npm run build")
const childProcess = childProcessor.exec("npm run server:prod")
childProcess.stdout.pipe(process.stdout)
childProcess.stderr.pipe(process.stderr)
