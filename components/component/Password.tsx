import { Input } from '@/components/ui/input'
import { useFormStatus } from 'react-dom'

export default function Password () {
  const { pending } = useFormStatus()
  return (
    <>
      {/* <Label htmlFor='password'>Password</Label> */}
      <Input aria-disabled={pending} disabled={pending} id='password' name='password' required type='password' placeholder='password' autoComplete='password'/>
    </>
  )
}
