import { TableColumnOptions, DataSource } from "typeorm"

export default function(source: DataSource): TableColumnOptions {
	return {
		name: "id",
		type: source.options.type === "sqlite" ? "integer" : "int",
		isPrimary: true,
		isGenerated: true,
		generationStrategy: "increment"
	}
}
