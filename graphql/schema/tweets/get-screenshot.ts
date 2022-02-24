import { extendType, stringArg } from "nexus"
import { getScreenshotImage } from "../../../lib/get-screenshot-image"
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
          const date = new Date()

          const image = await getScreenshotImage({ tweetId, color, layout })
          const filename = `prettify-tweet-${tweetId}-${date.getTime()}.${imageType}`

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
