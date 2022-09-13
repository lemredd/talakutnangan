import consola from "consola"
import RequestEnvironment from "$/singletons/request_environment"

export default class Log {
	private static maxStringLength: number
	private static allowedAreas: Map<string, string>

	static initialize(): void {
		const rawAllowedAreas = RequestEnvironment.isOnTest
			? process.env.LOGGING_ALLOWED_TEST_AREAS || ""
			: process.env.LOGGING_ALLOWED_DEV_AREAS || ""

		const splittedAreas = rawAllowedAreas.split(",")
		const bracketedAreas = splittedAreas.map(area => `[${area}]`)
		const longestArea = Math.max(...bracketedAreas.map(area => area.length))

		const allowance = 0
		this.maxStringLength = longestArea + allowance
		this.allowedAreas = new Map(
			splittedAreas.map((area, index) => [ area, bracketedAreas[index] ])
		)
	}

	/**
	 * Method to use to report about the errors in application.
	 * @param area Area where the message belongs
	 * @param message Message to output
	 */
	static errorMessage(area: string, message: string): void {
		if (this.allowedAreas.has(area)) {
			consola.error(this.formatMessage(area, message))
		}
	}

	/**
	 * Method to use to report the original error.
	 * @param area Area where the message belongs
	 * @param error Original error to show
	 */
	static error(area: string, error: Error): void {
		if (this.allowedAreas.has(area)) {
			consola.error(error)
		}
	}

	/**
	 * Method to use to warn the developer about something that may cause possible problems.
	 * @param area Area where the message belongs
	 * @param message Message to output
	 */
	static warn(area: string, message: string): void {
		if (this.allowedAreas.has(area)) {
			consola.warn(this.formatMessage(area, message))
		}
	}

	/**
	 * Method to use to log some important detail.
	 * @param area Area where the message belongs
	 * @param message Message to output
	 */
	static log(area: string, message: string): void {
		if (this.allowedAreas.has(area)) {
			consola.log(this.formatMessage(area, message))
		}
	}

	/**
	 * Method to use if there is a successful operation like connecting to e-mail server.
	 * @param area Area where the message belongs
	 * @param message Message to output
	 */
	static success(area: string, message: string): void {
		if (this.allowedAreas.has(area)) {
			consola.success(this.formatMessage(area, message))
		}
	}

	/**
	 * Method to use for bug-fixing.
	 * @param area Area where the message belongs
	 * @param message Message to output
	 */
	static debug(area: string, message: string): void {
		if (this.allowedAreas.has(area)) {
			consola.debug(this.formatMessage(area, message))
		}
	}

	/**
	 * Method to use for tracing some operation.
	 * @param area Area where the message belongs
	 * @param message Message to output
	 */
	static trace(area: string, message: string): void {
		if (this.allowedAreas.has(area)) {
			consola.trace(this.formatMessage(area, message))
		}
	}

	private static formatMessage(area: string, message: string): string {
		const preformattedAreaName = this.allowedAreas.get(area)
		const paddedArea = preformattedAreaName.padStart(this.maxStringLength, " ")
		return `${paddedArea}: ${message}`
	}
}
