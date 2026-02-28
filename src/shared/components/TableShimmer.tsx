export function TableShimmer() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="w-56 h-10 bg-gray-200 rounded-xs animate-pulse" />
        <div className="w-28 h-10 bg-gray-200 rounded-xs animate-pulse" />
      </div>
      <div className="w-full border rounded-xs overflow-hidden">
        <div className="grid grid-cols-7 bg-zinc-50 border-b">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="p-3">
              <div className="w-full h-5 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, r) => (
          <div key={r} className="grid grid-cols-7 border-b">
            {Array.from({ length: 7 }).map((__, c) => (
              <div key={c} className="p-3">
                <div className="w-full h-5 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
