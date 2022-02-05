import { extendType, stringArg } from "nexus"
import puppeteer from "puppeteer"
import { getS3Client, uploadFileGetTemporaryUrl } from "../../../lib/s3"
import * as fs from "fs"
import { getScreenshot as getPuppeteerScreenshot } from "../../../lib/get-screenshot"
import fetch from "node-fetch"

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
          const response = await fetch(
            // `https://api.rasterwise.com/v1/get-screenshot?apikey=${process.env.GET_SCREENSHOT_KEY}&url=https://2446-2a02-a44d-7142-1-f41f-15e0-f1a2-f3d2.ngrok.io/screenshot?id=1490055796704497665&color=dark&layout=auto&element=#preview-parent`
            `https://api.rasterwise.com/v1/get-screenshot?apikey=${process.env.GET_SCREENSHOT_KEY}&url=https://google.com`
          ).then((response) => response.json())
          const peter = response.screenshotImage
          const image = await fetch(peter).then((response) => response.buffer())
          console.log(image)
          // const screenshot = await getPuppeteerScreenshot({
          //   tweetId,
          //   color,
          //   layout,
          // })

          const date = new Date()
          const filename = `prettify-tweet-${tweetId}-${color}-${layout}-${date.getTime()}.${imageType}`
          const url = await uploadFileGetTemporaryUrl({
            stream: image,
            mimetype: `image/${imageType}`,
            Key: `screenshots/${filename}`,
          })
          console.log("peter")
          console.log({ url })
          return { url, filename }
        } catch (err) {
          throw new Error(`❌ Error: ${err.message}`)
        }
      },
    })
  },
})
