import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormStatus } from 'react-dom'

export default function Email () {
  const { pending } = useFormStatus()
  return (
    <>
      {/* <Label htmlFor='email'>Email</Label> */}
      <Input
        aria-disabled={pending}
        disabled={pending}
        id='email'
        placeholder='email'
        required
        name='email'
        type='email'
        autoComplete='email'
      />
    </>
  )
}
