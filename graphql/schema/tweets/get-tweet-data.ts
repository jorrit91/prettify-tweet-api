import { extendType, stringArg } from "nexus"

export const getTweetData = extendType({
  type: "Query",
  definition: (t) => {
    t.field("getTweetData", {
      type: "Tweet",
      args: {
        tweetId: stringArg(),
      },
      resolve: async (_, { tweetId }, { twitterAPI }) => {
        try {
          const tweetData = await twitterAPI.getTweetById(tweetId)

          return tweetData
        } catch (error) {
          throw new Error(error)
        }
      },
    })
  },
})
