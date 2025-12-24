export default function TreatmentsLoading() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <div className="w-[240px] bg-white border-r border-gray-100" />
      <div className="flex-1 pl-64">
        <div className="h-16 border-b border-gray-100 bg-white" />
        <main className="p-6">
          <div className="animate-pulse">
            <div className="h-10 w-80 bg-gray-200 rounded mb-6" />
            <div className="h-[400px] bg-gray-100 rounded-2xl" />
          </div>
        </main>
      </div>
    </div>
  )
}
