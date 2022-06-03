import template from "string-placeholder"

export default function(templateContent: string, variables: object): string {
	return template(templateContent, variables, {
		before: "{{ ",
		after: " }}"
	})
}
