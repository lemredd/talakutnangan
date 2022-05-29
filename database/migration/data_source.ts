import "reflect-metadata"
import "dotenv/config"

import type { SourceType } from "!/types"
import createDataSource from "%/data_source/create_source"

export const AppDataSource = createDataSource(process.env.DATABASE_TYPE as SourceType, false)
