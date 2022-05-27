import { DataSource, TableColumn, TableColumnOptions } from "typeorm";

export default function(
	source: DataSource,
	columnData: { [key: string]: string|Array<string>|boolean }
): TableColumn {
	return new TableColumn((source.options.type === "sqlite"? {
		type: "text",
		...columnData
	}: {
		type: "enum",
		...columnData
	}) as TableColumnOptions)
}
