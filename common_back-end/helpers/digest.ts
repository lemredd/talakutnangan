export default async function(source: Buffer): Promise<string> {
	const { createHash } = await import("node:crypto")

	const hash = createHash("sha256")

	hash.update(source)

	return hash.digest("hex")
}
