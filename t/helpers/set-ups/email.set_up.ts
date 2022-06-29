import { createTestAccount } from "nodemailer"

import Transport from "!/helpers/email/transport"

beforeAll((done) => {
	createTestAccount((_error, account) => {
		Transport.initialize(
			"smtp.ethereal.email",
			587,
			account.user,
			account.pass
		)
		done()
	})
})
