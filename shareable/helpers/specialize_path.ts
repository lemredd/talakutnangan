import template from "string-placeholder"

export default function(pathTemplate: string, variables: object): string {
	return template(pathTemplate, variables, {
		"before": ":",
		"after": ""
	})
}
