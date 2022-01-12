import { MercuriusOptions } from "mercurius"
import { options } from "./graphql"
import fastify from "fastify"
import mercurius from "mercurius"
import cors from "fastify-cors"
import * as dotenv from "dotenv"

dotenv.config()

const app = fastify()
app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
})
app.register(mercurius, options)
app.listen(4000)
