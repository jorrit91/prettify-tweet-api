import { extendType, stringArg } from "nexus"
import puppeteer from "puppeteer"
import { getS3Client, uploadFileGetTemporaryUrl } from "../../../lib/s3"
import * as fs from "fs"
import { getScreenshot as getPuppeteerScreenshot } from "../../../lib/get-screenshot"

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
          const screenshot = await getPuppeteerScreenshot({
            tweetId,
            color,
            layout,
          })

          const date = new Date()
          const filename = `prettify-tweet-${tweetId}-${color}-${layout}-${date.getTime()}.${imageType}`
          const url = await uploadFileGetTemporaryUrl({
            stream: screenshot,
            mimetype: `image/${imageType}`,
            Key: `screenshots/${filename}`,
          })
          return { url, filename }
        } catch (err) {
          console.log(`❌ Error: ${err.message}`)
          return false
        }
      },
    })
  },
})
