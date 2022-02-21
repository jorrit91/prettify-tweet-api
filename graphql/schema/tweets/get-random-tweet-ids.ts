import { extendType, intArg } from "nexus"

export const getRandomTweetIds = extendType({
  type: "Query",

  definition: (t) => {
    t.field("getRandomTweetIds", {
      type: "GetRandomTweetIds",
      args: {
        count: intArg(),
      },
      resolve: async (_, { count }, { twitterAPI }) => {
        try {
          const tweetData = await twitterAPI.getRandomTweetIds(count)
          return {
            ids: tweetData,
          }
        } catch (err) {
          throw new Error(`❌ Error: ${err.message}`)
        }
      },
    })
  },
})
