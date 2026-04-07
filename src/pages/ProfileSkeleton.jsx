export default function ProfileSkeleton() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#040404]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`animate-pulse rounded-none border border-white/10 bg-black/40 ${
                i === 1 ? "lg:col-span-2 h-64" : i === 4 ? "lg:col-span-4 h-48" : "h-48"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
