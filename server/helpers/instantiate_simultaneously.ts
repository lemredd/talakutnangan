export default async function<T>(classes: (new() => T)[])
: Promise<(T)[]> {
	const instances: Promise<(T)>[] = classes.map(
		ClassName => new Promise<T>(resolve => {
			resolve(new ClassName())
		})
	)

	return await Promise.all(instances)
}
