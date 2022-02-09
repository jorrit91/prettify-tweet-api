import { extendType, stringArg } from "nexus"
import fetch from "node-fetch"
import { uploadFileGetTemporaryUrl } from "../../../lib/s3"

export const getScreenshot = extendType({
  type: "Mutation",
  definition: (t) => {
    t.field("getScreenshot", {
      type: "GetScreenshot",
      args: {
        tweetId: stringArg(),
        color: stringArg(),
        layout: stringArg(),
      },
      resolve: async (_, { tweetId, color, layout }) => {
        const imageType = "png"

        try {
          const encodedUrl = encodeURIComponent(
            "https://prettify-tweet-git-configurator-jorrit1.vercel.app/screenshot?id=1490055796704497665&color=dark&layout=auto"
          )
          console.log({ encodedUrl })
          const response: any = await fetch(
            `https://api.rasterwise.com/v1/get-screenshot?apikey=${process.env.GET_SCREENSHOT_KEY}&url=${encodedUrl}`
          ).then((response) => response.json())
          const peter = response.screenshotImage
          const image = await fetch(peter).then((response) => response.buffer())

          const date = new Date()
          const filename = `prettify-tweet-${tweetId}-${color}-${layout}-${date.getTime()}.${imageType}`
          const url = await uploadFileGetTemporaryUrl({
            stream: image,
            mimetype: `image/${imageType}`,
            Key: `screenshots/${filename}`,
          })

          return { url, filename }
        } catch (err) {
          throw new Error(`❌ Error: ${err.message}`)
        }
      },
    })
  },
})
