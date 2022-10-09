import { useRouter } from 'next/router'

import { useAuth } from '~/context'
import { ButtonWithArrow } from '~/ui'

export const AccountPassword = () => {
  const { logout } = useAuth()
  const router = useRouter()

  function handleForgetPassword() {
    logout()
    router.push(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/forgot-password`)
  }

  return (
    <section className="max-w-[440px]">
      <ButtonWithArrow buttonVariant="primary" onClick={handleForgetPassword}>
        Change Password
      </ButtonWithArrow>
    </section>
  )
}
