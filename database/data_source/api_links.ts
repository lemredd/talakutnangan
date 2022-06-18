export default class {
	private static protocol: string
	private static hostname: string
	private static port: number
	private static basePath: string

	static initialize(protocol: string, hostname: string, port: number, basePath: string) {
		this.protocol = protocol
		this.hostname = hostname
		this.port = port
		this.basePath = basePath
	}

	static makeBaseURL(): string {
		const port = this.port === 0? "" :  `:${this.port}`

		return `${this.protocol}://${this.hostname}${port}/${this.basePath}`
	}
}
