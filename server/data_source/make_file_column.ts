import { DataSource, TableColumn, TableColumnOptions } from "typeorm";

export default function(
	source: DataSource,
	columnData: { [key: string]: string|Array<string>|boolean }
): TableColumn {
	const type = source.options.type
	return new TableColumn((type === "sqlite"? {
		type: "blob",
		...columnData
	}: type === "postgres" ? {
		type: "bytea",
		...columnData
	}: {
		type: "longblob",
		...columnData
	}) as TableColumnOptions)
}
