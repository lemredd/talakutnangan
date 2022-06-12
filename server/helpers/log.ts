import consola from "consola"

export default class Log {
	private static allowedAreas: string[]

	static intialize(isTest): void {
		const allowedAreas = isTest
			? process.env.LOGGING_ALLOWED_TEST_AREAS || ""
			: process.env.LOGGING_ALLOWED_DEV_AREAS || ""

		this.allowedAreas = allowedAreas.split(",")
	}

	/**
	 * Method to use to report about the errors in application.
	 * @param area Area where the message belongs
	 * @param message Message to output
	 */
	 static error(area, message) {
		if (this.allowedAreas.includes(area)) {
			consola.withTag(area).error(message)
		}
	}

	/**
	 * Method to use to warn the developer about something that may cause possible problems.
	 * @param area Area where the message belongs
	 * @param message Message to output
	 */
	 static warn(area, message) {
		if (this.allowedAreas.includes(area)) {
			consola.withTag(area).warn(message)
		}
	}

	/**
	 * Method to use to log some important detail.
	 * @param area Area where the message belongs
	 * @param message Message to output
	 */
	 static log(area, message) {
		if (this.allowedAreas.includes(area)) {
			consola.withTag(area).log(message)
		}
	}

	/**
	 * Method to use if there is a successful operation like connecting to e-mail server.
	 * @param area Area where the message belongs
	 * @param message Message to output
	 */
	static success(area, message) {
		if (this.allowedAreas.includes(area)) {
			consola.withTag(area).success(message)
		}
	}

	/**
	 * Method to use for bug-fixing.
	 * @param area Area where the message belongs
	 * @param message Message to output
	 */
	static debug(area, message) {
		if (this.allowedAreas.includes(area)) {
			consola.withTag(area).debug(message)
		}
	}

	/**
	 * Method to use for tracing some operation.
	 * @param area Area where the message belongs
	 * @param message Message to output
	 */
	static trace(area, message) {
		if (this.allowedAreas.includes(area)) {
			consola.withTag(area).trace(message)
		}
	}
}
