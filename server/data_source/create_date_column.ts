import { DataSource, TableColumn, TableColumnOptions } from "typeorm";

export default function(
	source: DataSource,
	columnData: { [key: string]: string|Array<string>|boolean }
): TableColumn {
	const type = source.options.type
	return new TableColumn((type === "sqlite"? {
		type: "datetime",
		...columnData
	}: {
		type: "timestamp",
		...columnData
	}) as TableColumnOptions)
}
