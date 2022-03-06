import fetch from "node-fetch"

type Props = {
  tweetId: string
  color: string
  layout: string
}

export async function getScreenshotImage({
  tweetId,
  color,
  layout,
}: Props): Promise<any> {
  const encodedUrl = encodeURIComponent(
    `${process.env.CLIENT_URL}/screenshot?id=${tweetId}&color=${color}&layout=${layout}`
  )
  const rasterwise: any = await fetch(
    `https://api.rasterwise.com/v1/get-screenshot?apikey=${process.env.GET_SCREENSHOT_KEY}&url=${encodedUrl}&element=%23preview-parent > div > div&devicefactor=3&forcetr=true`
  ).then((response) => response.json())
  const imageUrl = rasterwise.screenshotImage
  const image = await fetch(imageUrl).then((response) => response.buffer())

  return image
}
