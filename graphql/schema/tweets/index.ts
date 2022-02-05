import { objectType } from "nexus"

export * from "./get-tweet-data"
export * from "./get-screenshot"

export const Media = objectType({
  name: "Media",
  definition: (t) => {
    t.int("height")
    t.int("width")
    t.nonNull.string("url")
  },
})

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
    t.list.field("media", {
      type: Media,
    })
  },
})

export const GetScreenshot = objectType({
  name: "GetScreenshot",
  definition: (t) => {
    t.nonNull.string("url")
    t.nonNull.string("filename")
  },
})
