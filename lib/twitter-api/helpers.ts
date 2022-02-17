import { TweetV2SingleResult } from "twitter-api-v2"
import { FAILED_TO_NORMALIZE } from "../errors"
import { Media, SingleTweetData, UrlPreview } from "./types"

export function normalizeTweetData(
  tweet: TweetV2SingleResult
): SingleTweetData {
  const valid = validateBasicFields(tweet)

  if (!valid) {
    throw new Error(FAILED_TO_NORMALIZE)
  }

  let media = getMediaItems(tweet)
  let text = getText(tweet)
  let urlPreview = getUrlPreview(tweet)

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
    urlPreview,
    verified: tweet.includes.users[0].verified,
    media,
  }
}

function getUrlPreview(tweet: TweetV2SingleResult) {
  if (tweet.data.entities && tweet.data.entities.urls) {
    let preview: null | UrlPreview = null
    tweet.data.entities.urls.forEach((item) => {
      if (item.images && item.images.length > 0) {
        preview = {
          title: item.title,
          url: item.url,
          imageUrl: item.images[0].url,
          description: item.description,
        }
      }
    })
    return preview
  }
  return null
}

function getText(tweet: TweetV2SingleResult) {
  let text: string = tweet.data.text

  if (tweet.data.entities) {
    if (tweet.data.entities.urls) {
      tweet.data.entities.urls.forEach((url) => {
        // Remove picture urls from body text
        if (url.display_url.includes("pic.twitter")) {
          text = text.replace(url.url, "")
          return
        }

        // Replace regular urls with human readable links
        text = text.replace(url.url, `<span>${url.display_url}</span>`)
      })
    }

    if (tweet.data.entities.mentions) {
      tweet.data.entities.mentions.forEach((mention) => {
        // Wrap mentions in a span
        text = text.replace(
          `@${mention.username}`,
          `<span>@${mention.username}</span>`
        )
      })
    }
  }
  return text
}

function getMediaItems(tweet: TweetV2SingleResult): Media[] {
  let media: Media[] = []

  if (tweet.includes.media && tweet.includes.media[0]) {
    tweet.includes.media.forEach((item) => {
      if (item.type === "photo") {
        media.push(item as Media)
      }
      if (item.type === "video") {
        media.push({ ...(item as Media), url: item.preview_image_url })
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
