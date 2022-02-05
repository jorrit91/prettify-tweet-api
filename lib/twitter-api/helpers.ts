import { TweetV2SingleResult } from "twitter-api-v2"
import { FAILED_TO_NORMALIZE } from "../errors"
import { Media, SingleTweetData } from "./types"

const userKeys = ["name", "username", "profile_image_url", "verified"]
const tweetKeys = ["source", "created_at", "text"]

export function normalizeTweetData(
  tweet: TweetV2SingleResult
): SingleTweetData {
  const valid = validateBasicFields(tweet)

  if (!valid) {
    throw new Error(FAILED_TO_NORMALIZE)
  }

  let media = getMediaItems(tweet)
  let text = getText(tweet)

  return {
    source: tweet.data.source,
    name: tweet.includes.users[0].name,
    username: tweet.includes.users[0].username,
    profileImageUrl: tweet.includes.users[0].profile_image_url.replace(
      "_normal",
      ""
    ),
    createdAt: tweet.data.created_at,
    text,
    verified: tweet.includes.users[0].verified,
    media,
  }
}

function getText(tweet: TweetV2SingleResult) {
  let text: string = tweet.data.text

  if (tweet.data.entities && tweet.data.entities.urls) {
    tweet.data.entities.urls.forEach((url) => {
      // Remove picture urls from body text
      if (url.display_url.includes("pic.twitter")) {
        text = text.replace(url.url, "")
        return
      }

      // Replace regular urls with human readable links
      text = text.replace(url.url, url.display_url)
    })
  }

  return text
}

function getMediaItems(tweet: TweetV2SingleResult): Media[] {
  let media: Media[] = []
  if (tweet.includes.media && tweet.includes.media[0]) {
    tweet.includes.media.forEach((item) => {
      if (item.url) {
        media.push(item as Media)
      }
    })
  }
  return media
}

function validateBasicFields(tweet: TweetV2SingleResult) {
  let valid = true
  const userKeys = ["name", "username", "profile_image_url", "verified"]
  const tweetKeys = ["source", "created_at", "text"]
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

  return valid
}
