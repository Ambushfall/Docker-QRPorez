import { NextResponse } from "next/server"
import EventEmitter from "node:events"

export default class LPA {
  // NEVER store state in a getter
  // just get the state and set it, never store it
  // RangeError: Maximum call stack size exceeded
  private static urlUpita: string = 'https://lpa.gov.rs/upitstanja/upit'
  private static debug: boolean = true
  private _state: Array<any>
  private _response: any
  private _token: string
  private _response_url: Array<any>
  private _request_url: Array<any>
  private _emitter: EventEmitter
  private _event: string = 'responsechanged'
  private _handler: Function
  private _putanja: Array<any>
  public _responseBuilder: Array<any>
  public _umcn: string = ''
  private _newReqbody: BodyParametar = {
    pib: this._umcn,
    datumUplateDo: null,
    datumZaduzenjaDo: null,
    detail: null,
    racun: null
  }

  constructor (emitter: EventEmitter, event: string, handler: Function) {
    this._state = Array()
    this._response_url = Array()
    this._request_url = Array()
    this._token = ''
    this._response = NextResponse
    this._emitter = emitter
    this._event = event
    this._handler = handler
    this._putanja = Array()
    this._responseBuilder = Array()
  }
  sastaviTelo (): RequestInit {
    return {
      headers: {
        authorization: this._token,
        'content-type': 'application/json'
      },
      body: JSON.stringify(this._newReqbody),
      method: 'POST'
    }
  }
  vratiUrl () {
    return LPA.urlUpita
  }

  public set umcn (v: string) {
    this._umcn = v
    this._newReqbody.pib = v
  }

  public get umcn (): string {
    return this._umcn
  }

  public set responseBuilder (v: any) {
    this._responseBuilder.push(v)
  }

  public get responseBuilder (): Array<any> {
    return this._responseBuilder
  }

  public get handler (): Function {
    return this._handler
  }

  public set handler (v: Function) {
    this._putanja.push(v)
    this._handler = v
  }

  get emitter () {
    return this._emitter
  }

  set emitter (v: EventEmitter) {
    this._putanja.push(v)
    this._emitter = v
  }

  get event () {
    return this._event
  }

  set event (v: string) {
    this._putanja.push(v)
    this._event = v
  }

  get token () {
    return this._token
  }
  set token (v: string) {
    this._putanja.push(v)
    this._token = v
  }

  get state () {
    return this._state
  }
  set state (v: any) {
    this._putanja.push(v)
    this._state.push(v)
  }
  get response () {
    return this._response.json(
      LPA.debug
        ? this._responseBuilder
        : this._responseBuilder[this._responseBuilder.length - 1]
    )
  }
  set response (v: any) {
    this._putanja.push(v)
    this._emitter.emit('responsechanged')
    this._response = v
  }
  get response_url () {
    return this._response_url
  }
  set response_url (v: any) {
    this._putanja.push(v)
    this._response_url.push(v)
  }
  get request_url () {
    return this._request_url
  }
  set request_url (v: any) {
    this._putanja.push(v)
    this._request_url.push(v)
  }
}
