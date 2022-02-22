export type Media = {
  height?: number
  width?: number
  url: string
  type: "video" | "photo" | "animated_gif"
}

export type UrlPreview = {
  title: string
  description: string
  url: string
  imageUrl: string
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
  urlPreview?: UrlPreview
}
