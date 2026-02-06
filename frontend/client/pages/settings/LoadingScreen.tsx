import { Code } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
      <div className="w-[360px] rounded-3xl bg-white border border-gray-100 shadow-xl p-10 text-center">
        {/* Logo */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-skyblue to-navy flex items-center justify-center shadow-md mb-6">
          <Code className="w-7 h-7 text-white animate-pulse" />
        </div>

        {/* Skeleton Title */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3 animate-pulse" />
        <div className="h-3 bg-gray-100 rounded w-2/3 mx-auto mb-6 animate-pulse" />

        {/* Loading Dots */}
        <div className="flex justify-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-navy animate-bounce" />
          <span className="w-2 h-2 rounded-full bg-skyblue animate-bounce delay-150" />
          <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-300" />
        </div>

        <p className="text-sm text-gray-500">Loading your workspace…</p>
      </div>
    </div>
  );
}
