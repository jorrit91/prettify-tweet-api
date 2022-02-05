import { MediaObjectV2 } from "twitter-api-v2"

export type Media = {
  height?: number
  width?: number
  url: string
}

export type SingleTweetData = {
  source: string
  name: string
  username: string
  profileImageUrl: string
  createdAt: string
  text: string
  verified: boolean
  media: Media[]
}
