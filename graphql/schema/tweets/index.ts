import { objectType } from "nexus"

export * from "./get-tweet-data"
export * from "./get-screenshot"
export * from "./get-random-tweet-ids"

export const Media = objectType({
  name: "Media",
  definition: (t) => {
    t.int("height")
    t.int("width")
    t.nonNull.string("type")
    t.nonNull.string("url")
  },
})

export const UrlPreview = objectType({
  name: "UrlPreview",
  definition: (t) => {
    t.nonNull.string("imageUrl")
    t.nonNull.string("url")
    t.nonNull.string("title")
    t.nonNull.string("description")
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
    t.field("urlPreview", {
      type: UrlPreview,
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

export const GetRandomTweetIds = objectType({
  name: "GetRandomTweetIds",
  definition: (t) => {
    t.list.string("ids")
  },
})
