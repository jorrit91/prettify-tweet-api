import puppeteer from "puppeteer"

let client: puppeteer.Browser | null = null

export async function getPuppeteerInstance() {
  if (!client) {
    client = await puppeteer.launch({
      headless: true,
      args: ["--incognito", "--no-sandbox", "--single-process", "--no-zygote"],
    })
  }

  return client
}
