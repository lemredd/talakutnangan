import { promisify } from "util"

export default async function(encryptedHex: string): Promise<string> {
	const {
		scrypt,
		createDecipheriv
	} = await import("crypto")

	const algorithm = process.env.SECURITY_ENCRYPTION_ALGORITHM || "aes-128-cbc"
	const salt = process.env.SECURITY_ENCRYPTION_SALT || "01234567890123456789012345678901"
	const password = process.env.SECURITY_ENCRYPTION_PASSWORD || "01234567890123456789012345678901"
	const generateKey = promisify(scrypt)
	const key = await generateKey(password, salt, 16)
	const cipher = createDecipheriv(algorithm, key as Buffer, Buffer.alloc(16, 0))

	return await new Promise<string>(resolve => {
		cipher.setEncoding("hex")

		let decryptedText = ""
		cipher.on("data", decryptedData => decryptedText += decryptedData);
		cipher.on("end", () => resolve(decryptedText));

		cipher.write(encryptedHex, "hex")
		cipher.end()
	})
}
