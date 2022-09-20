import { createTestAccount } from "nodemailer"

import Transport from "!/helpers/email/transport"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"

beforeAll(done => {
	createTestAccount((_error, account) => {
		const SMTP_PORT = 587

		Transport.initialize(
			"smtp.ethereal.email",
			SMTP_PORT,
			account.user,
			account.pass
		)
		done()
	})
}, convertTimeToMilliseconds("00:00:10"))
