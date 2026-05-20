export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-700 to-blue-400 p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse rounded-2xl bg-white/10 p-6">
          <div className="h-8 w-64 bg-white/10 rounded mb-4" />
          <div className="h-4 w-full bg-white/10 rounded mb-2" />
          <div className="h-4 w-3/4 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}