import { DataSource, TableColumn, TableColumnOptions } from "typeorm";
import { PartialTableColumnOptions } from "!/types";

export default function(source: DataSource, columnData: PartialTableColumnOptions): TableColumn {
	const type = source.options.type
	return new TableColumn((type === "sqlite"? {
		type: "datetime",
		...columnData
	}: {
		type: "timestamp",
		...columnData
	}) as TableColumnOptions)
}
