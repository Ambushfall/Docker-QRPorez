import Image from 'next/image'
import { useFormStatus } from 'react-dom'

export default function QRCode ({ url }: { url: string }) {
  const { pending } = useFormStatus()
  return (
    <>
      {pending && (
        <Image
          alt='QR code'
          className='mx-auto'
          height='250'
          src='/placeholder.svg'
          style={{
            aspectRatio: '250/250',
            objectFit: 'cover'
          }}
          width='250'
        />
      )}
      {url && (
        <Image
          alt='QR code'
          className='mx-auto'
          height='250'
          src={url}
          style={{
            aspectRatio: '250/250',
            objectFit: 'cover'
          }}
          width='250'
        />
      )}
    </>
  )
}
