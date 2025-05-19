import { Mic, Settings, Sparkles, History } from "lucide-react";
import clx from "clsx";

export default function AppNavbar() {
  return (
    <header className="w-full px-4 py-3 bg-gray-900 border-b border-gray-700 shadow-sm flex items-center justify-between">
      {/* Left: Logo / Title */}
      <div className="flex items-center gap-2 text-white text-lg font-bold tracking-tight">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute -inset-px rounded-full blur-md bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] opacity-70 group-hover:opacity-100 animate-spin-slow" />
          <Sparkles className="relative h-5 w-5 text-white" />
        </div>
        <span>Smart QA</span>
      </div>

      {/* Center: Optional Tabs */}
      <div className="hidden md:flex gap-4 text-sm text-gray-400">
        {["Questions", "History", "Settings"].map((item, idx) => (
          <button
            key={idx}
            className={clx(
              "transition-all px-2 py-1 rounded-md hover:text-white",
              item === "Questions" && "text-white border-b-2 border-blue-500"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Right: Icons */}
      <nav className="flex items-center gap-4">
        <NavIcon icon={Mic} glow />
        <NavIcon icon={History} />
        <NavIcon icon={Settings} />
      </nav>
    </header>
  );
}

function NavIcon({
  icon: Icon,
  glow = false,
}: {
  icon: React.ElementType;
  glow?: boolean;
}) {
  return (
    <button
      className={clx(
        "relative group p-2 rounded-full transition-all",
        "hover:text-blue-400 text-gray-400",
        glow && "hover:shadow-[0_0_8px_2px_rgba(59,130,246,0.5)]"
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
