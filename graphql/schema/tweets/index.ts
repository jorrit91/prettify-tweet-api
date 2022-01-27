import { objectType } from "nexus"

export * from "./get-tweet-data"

export const Tweet = objectType({
  name: "Tweet",
  definition: (t) => {
    t.nonNull.string("name")
    t.nonNull.string("username")
    t.nonNull.string("profileImageUrl")
    t.nonNull.string("createdAt")
    t.nonNull.string("text")
    t.nonNull.boolean("verified")
    t.nonNull.string("source", {
      resolve: () => "Prettify Tweet",
    })
  },
})
