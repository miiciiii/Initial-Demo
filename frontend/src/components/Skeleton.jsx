// Base shimmer block
export function Sk({ className = '' }) {
  return (
    <div className={`bg-slate-200 rounded-lg animate-pulse ${className}`} />
  )
}

// Protocol list — 6 card skeletons matching ProtocolCard layout
export function ProtocolListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white/70 border border-gray-200/50 rounded-2xl p-6 space-y-3">
          {/* Tags */}
          <div className="flex gap-2">
            <Sk className="h-5 w-14 rounded-full" />
            <Sk className="h-5 w-16 rounded-full" />
          </div>
          {/* Title */}
          <Sk className="h-6 w-3/4" />
          {/* Content preview */}
          <div className="space-y-2">
            <Sk className="h-4 w-full" />
            <Sk className="h-4 w-5/6" />
          </div>
          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <Sk className="h-8 w-8 rounded-full" />
              <Sk className="h-4 w-24" />
              <Sk className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-3">
              <Sk className="h-4 w-20" />
              <Sk className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Protocol detail page skeleton
export function ProtocolDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white/70 border border-gray-200/50 rounded-2xl p-6 space-y-4">
        <div className="flex gap-2">
          <Sk className="h-5 w-14 rounded-full" />
          <Sk className="h-5 w-16 rounded-full" />
        </div>
        <Sk className="h-8 w-2/3" />
        <div className="flex items-center gap-3">
          <Sk className="h-9 w-9 rounded-full" />
          <Sk className="h-4 w-28" />
          <Sk className="h-4 w-20 ml-auto" />
        </div>
        <div className="space-y-2 pt-2">
          <Sk className="h-4 w-full" />
          <Sk className="h-4 w-full" />
          <Sk className="h-4 w-4/5" />
          <Sk className="h-4 w-full" />
          <Sk className="h-4 w-3/4" />
        </div>
      </div>
      {/* Reviews section */}
      <div className="space-y-3">
        <Sk className="h-6 w-32" />
        {[1, 2].map(i => (
          <div key={i} className="bg-white/70 border border-gray-200/50 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-3">
              <Sk className="h-8 w-8 rounded-full" />
              <Sk className="h-4 w-28" />
              <Sk className="h-4 w-20" />
            </div>
            <Sk className="h-4 w-full" />
            <Sk className="h-4 w-3/4" />
          </div>
        ))}
      </div>
      {/* Threads section */}
      <div className="space-y-3">
        <Sk className="h-6 w-28" />
        {[1, 2].map(i => (
          <div key={i} className="bg-white/70 border border-gray-200/50 rounded-2xl p-5 space-y-2">
            <Sk className="h-5 w-2/3" />
            <Sk className="h-4 w-full" />
            <Sk className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Thread page skeleton
export function ThreadPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Thread header */}
      <div className="bg-white/70 border border-gray-200/50 rounded-2xl p-6 space-y-4">
        <Sk className="h-7 w-3/4" />
        <div className="space-y-2">
          <Sk className="h-4 w-full" />
          <Sk className="h-4 w-full" />
          <Sk className="h-4 w-2/3" />
        </div>
        <div className="flex items-center gap-3 pt-1">
          <Sk className="h-8 w-8 rounded-full" />
          <Sk className="h-4 w-28" />
          <Sk className="h-8 w-20 ml-auto rounded-xl" />
        </div>
      </div>
      {/* Comments */}
      <div className="space-y-3">
        <Sk className="h-6 w-32" />
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white/70 border border-gray-200/50 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-3">
              <Sk className="h-8 w-8 rounded-full" />
              <Sk className="h-4 w-24" />
            </div>
            <Sk className="h-4 w-full" />
            <Sk className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Search page skeleton
export function SearchSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white/70 border border-gray-200/50 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Sk className="h-5 w-16 rounded-full" />
            <Sk className="h-5 w-12 rounded-full ml-auto" />
          </div>
          <Sk className="h-5 w-2/3" />
          <Sk className="h-4 w-full" />
          <Sk className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  )
}
