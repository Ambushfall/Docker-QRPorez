'use client'
import { GrabFetchData } from '@/app/porez/action'
import { useFormState } from 'react-dom'
import { useEffect, useState } from 'react'
import QRCode from '@/components/component/QRCode'
import SubmitButton from '@/components/component/SubmitButton'
import Email from '@/components/component/Email'
import Password from '@/components/component/Password'
// export const dynamic = 'force-dynamic'

export default function Home (args: any) {
  const debug = true
  const [formState, action] = useFormState(GrabFetchData, {
    body: {
      body: JSON.stringify({}),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    },
    url: ''
  })
  const [error, setError] = useState('')
  const [objectUrl, setObjectUrl] = useState('')
  useEffect(() => {
    async function fetchData () {
      setError('');
      if (formState.body.body.length > 8) {
        const reqbody: BODYObject = JSON.parse(formState.body.body)
        const { I } = reqbody

        if (!I.includes('-')) {
          const res = await fetch(formState.url, formState.body)
          const data = await res.blob()
          setObjectUrl(URL.createObjectURL(data))
        } else {
          setError(`The amount owed is less than 0, ${I}`)
        }
      } else {
        if (formState.url.includes('error')) {
          setError(
            'An error might have occurred, check your credentials and try again'
          )
        }
      }
    }
    fetchData()
  }, [formState])

  return (
    <main className='flex items-center justify-center min-h-screen px-4'>
      <div className='grid gap-4 w-full max-w-sm'>
        <div className='text-center'>
          {error && <div>{error}</div>}
          {objectUrl && <div>Scan the QR code with your bank app</div>}
          <QRCode url={objectUrl} />
        </div>
        {!objectUrl && (
          <form className='space-y-4' action={action}>
            <Email />
            <Password />
            <SubmitButton />
          </form>
        )}
      </div>
    </main>
  )
}
