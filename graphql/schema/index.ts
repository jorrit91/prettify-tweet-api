import { asNexusMethod, enumType } from "nexus"
import { GraphQLDate, GraphQLDateTime } from "graphql-iso-date"

export * from "./tweets"

export const dateTimeScalar = asNexusMethod(GraphQLDateTime, "DateTime")
export const dateScalar = asNexusMethod(GraphQLDate, "Date")
export const DateTime = GraphQLDateTime
export const Date = GraphQLDate
