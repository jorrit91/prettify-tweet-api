import { MercuriusOptions } from "mercurius"
import { options } from "./graphql"
import fastify from "fastify"
import mercurius from "mercurius"
import * as dotenv from "dotenv"

dotenv.config()

const app = fastify()
app.register(mercurius, options)

app.get("/", async function (req, reply) {
  const query = "{ add(x: 2, y: 2) }"
  return reply.graphql(query)
})

app.listen(4000)
