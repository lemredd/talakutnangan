import { DataSource, TableColumn, TableColumnOptions } from "typeorm";
import { PartialTableColumnOptions } from "!/types";

export default function(source: DataSource, columnData: PartialTableColumnOptions): TableColumn {
	return new TableColumn((source.options.type === "sqlite"? {
		type: "text",
		...columnData
	}: {
		type: "enum",
		...columnData
	}) as TableColumnOptions)
}
