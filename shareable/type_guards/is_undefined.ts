export default function(value: any): value is undefined {
	return typeof value === "undefined"
}
