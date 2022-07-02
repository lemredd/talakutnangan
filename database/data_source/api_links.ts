export default class {
	private static protocol: string
	private static hostname: string
	private static port: number
	private static basePath: string
	private static models: { [key: string]: string }

	static initialize(protocol: string, hostname: string, port: number, basePath: string) {
		this.protocol = protocol
		this.hostname = hostname
		this.port = port
		this.basePath = basePath
	}

	static addPaginationLinks(
		JSONAPI: { [key: string]: string|object },
		modelPath: string,
		currentPage: number,
		lastPage: number
	): object {
		const document = { ...JSONAPI }
		document.links = document.links || {}
		document.links = {
			...document.links as object,
			"first": this.makeBaseModelPath(modelPath) + `/list?page=1`,
			"last": this.makeBaseModelPath(modelPath) + `/list?page=${lastPage}`,
			"prev": currentPage === 1 ? null : (
				this.makeBaseModelPath(modelPath) + `/list?page=${currentPage - 1}`
			),
			"next": currentPage === lastPage ? null : (
				this.makeBaseModelPath(modelPath) + `/list?page=${currentPage + 1}`
			)
		}

		return document
	}

	static makeBaseModelPath(modelPath: string): string {
		return `${this.basePath}/${modelPath}`
	}

	static makeBaseURL(): string {
		const port = this.port === 0? "" :  `:${this.port}`

		return `${this.protocol}://${this.hostname}${port}${this.basePath}`
	}

	static destroy(): void {
		this.protocol = ""
		this.hostname = ""
		this.port = 0
		this.basePath = ""
		this.models = {}
	}
}
