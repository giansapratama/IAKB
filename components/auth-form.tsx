'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

export default function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      console.error('[v0] Auth error:', error)
      setError(error.message ?? 'Something went wrong')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          {isSignUp ? 'Create an account' : 'Welcome back'}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          {isSignUp
            ? 'Sign up to get started'
            : 'Sign in to your account to continue'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isSignUp && (
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
              placeholder="John Doe"
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
            placeholder="you@example.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
          {loading
            ? 'Please wait...'
            : isSignUp
              ? 'Create account'
              : 'Sign in'}
        </Button>
      </form>

      <p className="text-sm text-slate-600 text-center mt-6">
        {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
        <Link
          href={isSignUp ? '/sign-in' : '/sign-up'}
          className="text-blue-600 font-medium hover:underline"
        >
          {isSignUp ? 'Sign in' : 'Sign up'}
        </Link>
      </p>
    </div>
  )
}
