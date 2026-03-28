import { Bell } from 'lucide-react';

export function TopBar({ title }: { title?: string }) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-orange-50/90 backdrop-blur-md shadow-[0_4px_30px_rgba(66,40,32,0.05)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border-2 border-white">
          <img 
            src="https://api.dicebear.com/7.x/notionists/svg?seed=LuckyElephant" 
            alt="Mascot" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="text-xl font-black text-amber-700 tracking-tight font-headline">
          {title || "Lucky Chang 召唤"}
        </h1>
      </div>
      <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-orange-100/50 transition-all active:scale-95 text-amber-800">
        <Bell size={20} />
      </button>
    </header>
  );
}
