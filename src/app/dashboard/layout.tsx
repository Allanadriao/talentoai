import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LayoutProvider } from '@/components/layout/LayoutContext'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import LayoutModals from '@/components/layout/LayoutModals'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <LayoutProvider>
      <LayoutModals />
      <div className="flex min-h-screen bg-[#F8F9FD] text-slate-900 font-sans">
        <Sidebar />
        <main className="flex-grow lg:ml-64 w-full">
          <Header />
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </LayoutProvider>
  )
}
