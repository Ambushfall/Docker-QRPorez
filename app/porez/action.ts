'use server'
import puppeteer, { HTTPResponse } from 'puppeteer'
import * as fs from 'fs'
import { EventEmitter } from 'events'
import LPA from '@/app/utils/LPA'
import BuildResponse from '@/app/utils/fetcher'
const debug = true
const qrCodeAPI = 'https://nbs.rs/QRcode/api/qr/v1/gen/500'

export async function GrabFetchData (previousState: any, formData: FormData) {
  const { pw, uid } = {
    uid: formData.get('email'),
    pw: formData.get('password')
  }
  console.log({
    previousState: previousState,
    formData: formData
  })

  const myEmitter = new EventEmitter()

  /**
   *
   * @param args
   * @deprecated
   */
  async function eventHandler (args: emmitedObj): Promise<void> {
    lpa.state = 'event uhvacen'
    lpa.state = args

    if (args.status && args.obj) {
      const res = await fetch(qrCodeAPI, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(args.obj)
      })
      lpa.state = res
      if (res.ok || res.status == 200) {
        const blob = await res.blob()

        const buffer = await blob.arrayBuffer()

        fs.writeFileSync('public/downloaded_image.jpg', Buffer.from(buffer))

        lpa.state = 'QR Code successfully generated'
      } else {
        lpa.state = 'QR Code generation failed'
      }
    } else {
      lpa.state = 'Your tax does not need to be paid for'
    }
  }
  const lpa = new LPA(myEmitter, 'responsechnaged', eventHandler)

  // lpa.emitter.on('response', eventHandler)
  lpa.emitter.on('responsechanged', () => console.log('Response Changed!'))

  const { launch } = puppeteer
  try {
    const browser = await launch({
      headless: true
    })
    lpa.state = 'browser launch'
    console.log('launch')

    let page = await browser.newPage()

    const testurl = 'http://www.lpa.gov.rs/'
    await page.goto(testurl)

    lpa.state = 'going to page'

    let login = await page.waitForSelector('div.sistem-login> a')
    login && (await login.click())
    lpa.state = 'login click'

    let usrname = await page.waitForSelector('#username1')
    usrname && (await usrname.click())
    lpa.state = 'username click'
    await page.keyboard.type(typeof uid === 'string' ? uid : '')

    let passwrd = await page.waitForSelector('#password1')
    passwrd && (await passwrd.click())
    await page.keyboard.type(typeof pw === 'string' ? pw : '')
    let submit = await page.waitForSelector('#aetButtonUP1')
    submit && (await submit.click())

    lpa.state = 'password and username field inputted'
    await page.waitForResponse(async (response: HTTPResponse) => {
      if (
        (response.request().url().includes('oauth2') ||
          response.url().includes('oauth2')) &&
        response.request().headers()['authorization']
      ) {
        if (response.request().headers()['authorization']) {
          const json: JSONResp = await response.json()
          lpa.token = response.request().headers()['authorization']
          lpa.umcn = json['http://schema.id.rs/claims/umcn']
          lpa.response_url = response.url()
          lpa.request_url = response.request().url()
          lpa.state = {
            requesturl: lpa.request_url,
            responseurl: lpa.response_url,
            requestHeaders: response.request().headers(),
            body: await response.json(),
            umcn: lpa.umcn,
            token: lpa.token
          }
        }

        return true
      } else return false
    })

    await browser.close()
  } catch (error) {
    lpa.state = error
  }

  let newurl = lpa.vratiUrl()
  let newbody = lpa.sastaviTelo()

  lpa.responseBuilder = newbody

  const res = await BuildResponse(newurl, newbody)

  const { url, body } = res

  return {
    body: body,
    url: url
  }
}
