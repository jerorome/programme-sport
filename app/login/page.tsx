// app/login/page.tsx
// Server component wrapper — prevents static prerendering
export const dynamic = 'force-dynamic'

import LoginForm from './login-form'

export default function LoginPage() {
  return <LoginForm />
}
