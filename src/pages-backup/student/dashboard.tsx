import dynamic from "next/dynamic"

const StudentDashboardClient = dynamic(() => import("../../components/student-dashboard-client"), {
  ssr: false,
})

export default function Page() {
  return (
    <div className="px-4 py-6">
      <StudentDashboardClient />
    </div>
  )
}
 
