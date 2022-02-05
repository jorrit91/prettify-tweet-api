import { getPuppeteerInstance } from "./get-puppeteer-instance"

type ScreenshotArgs = {
  tweetId: string
  color: string
  layout: string
}

export async function getScreenshot({
  tweetId,
  color,
  layout,
}: ScreenshotArgs): Promise<string | Buffer> {
  const browser = await getPuppeteerInstance()
  const page = await browser.newPage()
  await page.setViewport({
    width: 800,
    height: 800,
    deviceScaleFactor: 3,
  })

  await page.goto(
    `${process.env.CLIENT_URL}/screenshot/` +
      `?id=${tweetId}&color=${color}&layout=${layout}`
  )
  await page.evaluate(() => {
    // @ts-ignore
    document.body.style.transitionDuration = "0s"
    // @ts-ignore
    document.body.style.background = "transparent"
  })

  await page.waitForSelector("#preview-parent")
  const element = await page.$("#preview-parent")
  return await element.screenshot({
    type: "png",
    omitBackground: true,
  })
}
