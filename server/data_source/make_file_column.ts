import { DataSource, TableColumn, TableColumnOptions } from "typeorm";
import { PartialTableColumnOptions } from "!/types";

export default function(source: DataSource, columnData: PartialTableColumnOptions): TableColumn {
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
