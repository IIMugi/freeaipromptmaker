export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-700 rounded-full" />
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-violet-500 rounded-full border-t-transparent animate-spin" />
        </div>
        
        {/* Text */}
        <p className="text-slate-400 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

