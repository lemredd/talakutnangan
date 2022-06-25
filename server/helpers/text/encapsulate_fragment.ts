export default function(title: string, styles: string, fragment: string): string {
	return `
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>${title}</title>
			<style>
				${styles}
			</style>
		</head>
		<body>
			${fragment}
		</body>
	</html>
	`
}
