import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

export default function SubmitButton () {
  const { pending } = useFormStatus()
  return (
    <Button
      className='w-full'
      disabled={pending}
      aria-disabled={pending}
      type='submit'
    >
      Submit
    </Button>
  )
}
