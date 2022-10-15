import { URL } from "url"
import type { Serializable } from "$/types/general"
import type { TemporaryURLInfo } from "$!/types/independent"

import decrypt from "$!/auth/decrypt"
import encrypt from "$!/auth/encrypt"
import DecryptionError from "$!/errors/decryption"
import specializePath from "$/helpers/specialize_path"

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
		document.links ||= {}
		document.links = {
			...document.links as object,
			"first": `${this.makeBaseModelPath(modelPath)}?page=1`,
			"last": `${this.makeBaseModelPath(modelPath)}?page=${lastPage}`,
			"next": currentPage === lastPage
				? null
				: `${this.makeBaseModelPath(modelPath)}?page=${currentPage + 1}`,
			"prev": currentPage === 1
				? null
				: `${this.makeBaseModelPath(modelPath)}?page=${currentPage - 1}`
		}

		return document
	}

	static makeBaseModelPath(modelPath: string): string {
		return `${this.basePath}/${modelPath}`
	}

	static getResolvedPort() {
		const HTTP_PORT = 80
		const HTTPS_PORT = 443
		return this.port === 0 || this.port === HTTP_PORT || this.port === HTTPS_PORT
			? ""
			: `:${this.port}`
	}

	static makeBaseURL(): string {
		const port = this.getResolvedPort()

		return `${this.protocol}://${this.hostname}${port}${this.basePath}`
	}

	static makeURLFromPath(templatePath: string, variables: object = {}): string {
		return this.removeRepeatingSlashes(`${this.makeBaseURL()}/${
			specializePath(templatePath, variables)
		}`)
	}

	static async makeEncryptedPath(path: string, data: string): Promise<string> {
		return this.removeRepeatingSlashes(`${path}/${await encrypt(data)}`)
	}

	static async makeEncryptedURL(path: string, data: string): Promise<string> {
		return this.removeRepeatingSlashes(
			`${this.makeBaseURL()}/${await this.makeEncryptedPath(path, data)}`
		)
	}

	static async makeTemporaryURL(
		path: string,
		data: Serializable,
		millisecondDuration: number,
		currentTime: number|undefined = new Date().getTime()
	) : Promise<string> {
		return this.removeRepeatingSlashes(
			await this.makeEncryptedURL(
				path,
				JSON.stringify([
					currentTime + millisecondDuration,
					data
				])
			)
		)
	}

	static async decryptURLData(encryptedURL: string): Promise<string> {
		const URLInfo = new URL(encryptedURL)
		const encryptedPath = URLInfo.pathname
		const encryptedData = encryptedPath.split("/").pop() || ""

		try {
			return await decrypt(encryptedData)
		} catch (error) {
			throw new DecryptionError("URL is invalid")
		}
	}

	static async checkTemporaryURL(
		encryptedURL: string,
		currentTime: number|undefined = new Date().getTime()
	): Promise<TemporaryURLInfo> {
		const decryptedData = await this.decryptURLData(encryptedURL)

		try {
			const parsedData = JSON.parse(decryptedData)

			if (
				parsedData instanceof Array
				&& parsedData.length === 2
				&& typeof parsedData[0] === "number"
			) {
				return {
					"data": parsedData[1],
					"hasExpired": parsedData[0] < currentTime
				}
			}
			throw new Error()
		} catch (error) {
			throw new DecryptionError("URL data is invalid")
		}
	}

	static removeRepeatingSlashes(URLPart: string): string {
		return URLPart.replace(/([^:/])\/\/+/gu, "$1/")
	}

	static destroy(): void {
		this.protocol = ""
		this.hostname = ""
		this.port = 0
		this.basePath = ""
		this.models = {}
	}
}
