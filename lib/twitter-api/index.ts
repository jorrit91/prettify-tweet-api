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
  getRandomTweetIds: (count: number) => Promise<string[]>
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
          expansions: ["author_id", "attachments.media_keys"],
          "user.fields": ["name", "username", "profile_image_url", "verified"],
          "tweet.fields": [
            "id",
            "created_at",
            "text",
            "source",
            "attachments",
            "entities",
          ],
          "media.fields": ["height", "width", "url", "preview_image_url"],
        })
        const normalized = normalizeTweetData(tweet)

        return normalized
      } catch (error) {
        throw new Error(error)
      }
    },
    async getRandomTweetIds(count: number) {
      try {
        const search = await client.v2.search("media", {
          "tweet.fields": ["id"],
        })
        const ids = search.tweets.slice(0, count).map((tweet) => tweet.id)

        return ids
      } catch (error) {
        throw new Error(error)
      }
    },
  }
}
