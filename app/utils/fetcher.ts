const debug = false

async function FetchPOSTJSON (url: string, body: RequestInit) {
  const res = await fetch(url, body)

  return await res.json()
}

async function FetchPOSTBODY (url: string, body: RequestInit) {
  const res = await fetch(url, body)

  return await res.blob()
}

async function FetchGETJSON (url: string) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  //   const json = await res.json();
  return await res.json()
}

async function Fetcher (url: string, body: RequestInit) {
  return await FetchPOSTJSON(url, body)
}

export function buildBody (body: any) {
  return {
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body),
    method: 'POST'
  }
}

export default async function BuildResponse (url: string, body: RequestInit) {
  const json: OdgovorGlavnogUpita = await Fetcher(url, body)
  // const json: OdgovorGlavnogUpita = await res.json()
  const { pib, upitStanjaSaldoOpstList } = json
  if (typeof upitStanjaSaldoOpstList !== 'undefined') {
    const [opstaLista] = upitStanjaSaldoOpstList
    const {
      datumUpita,
      nazivOpstine,
      obveznikIdent,
      pozivNaBroj,
      sifraOpstine,
      upitStanjaSaldoList,
      vremeObrade
    } = opstaLista

    const [saldoLista] = upitStanjaSaldoList
    const {
      kamataNaplacena,
      kamataObracunata,
      kamataZaduzenje,
      racun,
      racunCeo,
      racunOpis,
      saldoDuguje,
      saldoGlavnica,
      saldoKamata,
      saldoPotrazuje,
      saldoUkupan
    } = saldoLista

    const [num1, num2, num3] = racunCeo.split('-')
    const pravilanRacun = `${num1}${num2.padStart(13, '0')}${num3}`

    const reqObj: BODYObject = {
      K: 'PR',
      V: '01',
      C: '1',
      R: pravilanRacun,
      N: `LPA ${nazivOpstine}`,
      I: debug ? 'RSD253,00' : `RSD${String(saldoUkupan).split('.').join(',')}`,
      // I: 'RSD253,00',
      SF: '253',
      S: 'Porez na Imovinu od Fizickih Lica',
      RO: pozivNaBroj.replace(' ', '')
    }

    return {
      url: 'https://nbs.rs/QRcode/api/qr/v1/gen/500',
      body: buildBody(reqObj)
    }
  } else {
    return {
      body: {
        body: '',
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST'
      },
      url: 'error'
    }
  }
}
