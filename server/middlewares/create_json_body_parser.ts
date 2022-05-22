import bodyParser from "body-parser"
import type { RequestHandler } from "express"

export default function(): RequestHandler {
	return bodyParser.json({ strict: true })
}
