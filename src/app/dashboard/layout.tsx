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
      <div className="flex min-h-screen bg-[#F8F9FD] text-slate-900 font-sans overflow-x-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col lg:ml-64 min-w-0 w-full transition-all duration-300">
          <Header />
          <div className="p-4 lg:p-8 flex-1 w-full max-w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </LayoutProvider>
  )
}
