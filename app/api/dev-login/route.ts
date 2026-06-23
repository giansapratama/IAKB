import { db } from '@/lib/db'
import { session } from '@/lib/db/schema'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const userId = 'test-user-001'
    
    // Create a session directly
    const sessionId = 'dev-session-' + Date.now()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    
    // Insert session into database
    await db.insert(session).values({
      id: sessionId,
      userId: userId,
      token: sessionId,
      expiresAt: expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).catch(() => {
      // Session might already exist, ignore
    })
    
    // Set session cookie with proper flags
    const cookieStore = await cookies()
    cookieStore.set('auth_session', sessionId, {
      httpOnly: true,
      secure: false, // Set to false for localhost
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })
    
    // Return redirect response
    const redirectUrl = new URL('/', 'http://localhost:3000')
    return Response.redirect(redirectUrl, 302)
  } catch (error) {
    console.error('[v0] Dev login error:', error)
    return new Response('Dev login failed: ' + (error instanceof Error ? error.message : 'Unknown error'), { status: 500 })
  }
}
