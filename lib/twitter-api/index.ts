import TwitterApi from "twitter-api-v2"
import { normalizeTweetData } from "./helpers"
import { SingleTweetData } from "./types"

function getTwitterClient() {
  return new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_KEY_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  }).readOnly
}

export type TwitterAPI = {
  getTweetById: (id: string) => Promise<SingleTweetData>
}
export const getTwitterAPI = (): TwitterAPI => {
  const client = getTwitterClient()
  if (!process.env.TWITTER_ACCESS_TOKEN) {
    throw new Error("Cannot find process.env.TWITTER_ACCESS_TOKEN")
  }

  return {
    async getTweetById(id: string) {
      try {
        const tweet = await client.v2.singleTweet(id, {
          expansions: ["author_id"],
          "user.fields": ["name", "username", "profile_image_url", "verified"],
          "tweet.fields": ["id", "created_at", "text", "source", "attachments"],
        })
        const normalized = normalizeTweetData(tweet)

        return normalized
      } catch (error) {
        throw new Error(error)
      }
    },
  }
}
