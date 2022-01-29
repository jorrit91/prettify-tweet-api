import puppeteer from "puppeteer"

type ScreenshotArgs = {
  tweetId: string
  color: string
  layout: string
}

export async function getPuppeteerScreenshot({
  tweetId,
  color,
  layout,
}: ScreenshotArgs): Promise<string | Buffer> {
  const browser = await puppeteer.launch({ headless: true })

  const page = await browser.newPage()
  await page.setViewport({
    width: 800,
    height: 800,
    deviceScaleFactor: 2,
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
