import { DataSource, TableColumn, TableColumnOptions } from "typeorm";

import { PartialTableColumnOptions } from "!/types";
import makeDateColumn from "!/data_source/make_date_column"

export default function(
	source: DataSource,
	columnData: PartialTableColumnOptions = {}
): TableColumn {
	return makeDateColumn(source, {
		name: "updatedAt",
		isNullable: false,
		default: "CURRENT_TIMESTAMP",
		...columnData
	})
}
