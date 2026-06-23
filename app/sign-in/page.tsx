import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import AuthForm from '@/components/auth-form'
import Link from 'next/link'

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Audit Knowledge Base
            </h1>
            <p className="text-slate-600">Internal Audit Management System</p>
          </div>
          <AuthForm mode="sign-in" />
          
          {/* Dev Login Button */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <Link
              href="/api/dev-login"
              className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition"
            >
              Quick Dev Login (Admin)
            </Link>
            <p className="text-xs text-slate-500 text-center mt-2">For development only</p>
          </div>
        </div>
      </div>
    </div>
  )
}
