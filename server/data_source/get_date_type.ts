import { DataSource } from "typeorm"

export default function(source: DataSource) {
	return source.options.type === "sqlite"? "datetime": "timestamp"
}
