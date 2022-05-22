import { use, serializeUser, deserializeUser } from "passport"
import { Strategy } from "passport-local"
import User from "!/models/user"

export default async function() {
	use(new Strategy(
		{
			usernameField: "email",
			passwordField: "password"
		},
		(username: string, password: string, done: Function) => {
			// TODO: Search the database
			done(null, false)
		}
	))

	serializeUser((user: User, done: Function) => {
		done(null, user.id)
	})

	deserializeUser((userID, done: Function) => {
		// TODO: Search the database
	})
}
