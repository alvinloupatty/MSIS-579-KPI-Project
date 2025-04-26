export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      <span className="ml-3 text-lg text-gray-700">Loading KPI data...</span>
    </div>
  )
}
