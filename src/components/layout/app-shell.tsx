import { Outlet } from "react-router-dom"
import { TopBar } from "./top-bar"
import { TabBar } from "./tab-bar"
import { Sidebar } from "./sidebar"

export function AppShell() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <TopBar />
      <Sidebar />
      <main className="pt-16 pb-20 lg:pl-64 lg:pb-8">
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
      <TabBar />
    </div>
  )
}
