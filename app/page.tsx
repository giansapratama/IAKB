import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Dashboard from '@/components/dashboard'
import AppSidebar from '@/components/app-sidebar'
import { db } from '@/lib/db'
import { userRoles, user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

export default async function Home() {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })
  
  // Check for dev login session
  let userId = session?.user?.id
  let userName = session?.user?.name
  let userEmail = session?.user?.email
  
  if (!userId) {
    // Check if there's a dev session cookie
    const cookieStore = await cookies()
    const devSessionId = cookieStore.get('auth_session')?.value
    
    if (devSessionId?.startsWith('dev-session-')) {
      // This is a dev login, use the test user
      userId = 'test-user-001'
      
      // Fetch user data from database
      const userData = await db.select().from(user).where(eq(user.id, userId))
      if (userData.length > 0) {
        userName = userData[0].name
        userEmail = userData[0].email
      }
    }
  }
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Check if user is admin
  const userRole = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.userId, userId))

  const isAdmin = userRole[0]?.role === 'admin'
  
  // Create user object for the sidebar
  const mockUser = {
    id: userId,
    name: userName || 'Audit Admin',
    email: userEmail || 'admin@audit.local',
  }

  return (
    <div className="flex h-screen bg-white">
      <AppSidebar user={mockUser} isAdmin={isAdmin} />
      <div className="flex-1 overflow-auto">
        <Dashboard />
      </div>
    </div>
  )
}
