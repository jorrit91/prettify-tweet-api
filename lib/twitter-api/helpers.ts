import { TweetV2SingleResult } from "twitter-api-v2"
import { FAILED_TO_NORMALIZE } from "../errors"
import { SingleTweetData } from "./types"

const userKeys = ["name", "username", "profile_image_url", "verified"]
const tweetKeys = ["source", "created_at", "text"]

export function normalizeTweetData(
  tweet: TweetV2SingleResult
): SingleTweetData {
  let valid = true
  for (const key of tweetKeys) {
    if (typeof tweet.data[key] === "undefined") {
      valid = false
    }
  }
  for (const key of userKeys) {
    if (typeof tweet.includes.users[0][key] === "undefined") {
      valid = false
    }
  }

  if (!valid) {
    throw new Error(FAILED_TO_NORMALIZE)
  }

  return {
    source: tweet.data.source,
    name: tweet.includes.users[0].name,
    username: tweet.includes.users[0].username,
    profileImageUrl: tweet.includes.users[0].profile_image_url.replace(
      "_normal",
      ""
    ),
    createdAt: tweet.data.created_at,
    text: tweet.data.text,
    verified: tweet.includes.users[0].verified,
  }
}
