import compression from "compression"
import type { RequestHandler } from "express"

export default function(): RequestHandler {
	return compression()
}
