import { TopBar } from "./top-bar"
import { TabBar } from "./tab-bar"
import { Sidebar } from "./sidebar"

interface AppShellProps {
  children?: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <TopBar />
      <Sidebar />
      <main className="pb-20 lg:pl-64 lg:pb-8">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>
      <TabBar />
    </div>
  )
}
