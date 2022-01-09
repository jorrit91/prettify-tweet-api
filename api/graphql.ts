import { MercuriusOptions } from "mercurius"
import { makeSchema } from "nexus"
import * as path from "path"
import * as types from "../graphql/schema"
import { validatePlugin } from "nexus-validate"
import { getTwitterAPI } from "../lib/twitter-api"
import { Context } from "../graphql/context"

const schema = makeSchema({
  types,
  plugins: [validatePlugin()],
  outputs: {
    schema: path.join(__dirname, "/../.generated/schema.gen.graphql"),
    typegen: path.join(
      __dirname,
      "/../node_modules/@types/nexus-typegen/index.d.ts"
    ),
  },
  contextType: {
    module: path.join(__dirname, "../graphql/context.ts"),
    export: "Context",
    alias: "ctx",
  },
  shouldGenerateArtifacts:
    process.env.NODE_ENV === "development" ||
    process.argv.includes("--nexus-generate"),
  shouldExitAfterGenerateArtifacts: process.argv.includes("--nexus-generate"),
})

export const options: MercuriusOptions = {
  schema: schema,
  graphiql: process.env.ENV === "production" ? false : "graphiql",
  context: async (): Promise<Context> => {
    return {
      twitterAPI: getTwitterAPI(),
    }
  },
}
