import { Link, useLocation } from 'react-router-dom';
import { Home, User, BookOpen, Users, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: '灵境' },
    { path: '/social', icon: Users, label: '碰一碰' },
    { path: '/summon', icon: Sparkles, label: '召唤', isSpecial: true },
    { path: '/profile', icon: User, label: '我的' },
    { path: '/gallery', icon: BookOpen, label: '珍藏馆' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-3 bg-orange-50/95 backdrop-blur-lg rounded-t-[40px] shadow-[0_-10px_40px_rgba(66,40,32,0.08)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        if (item.isSpecial) {
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center rounded-full px-5 py-2 transition-all active:scale-90 duration-300",
                isActive 
                  ? "bg-gradient-to-br from-amber-600 to-amber-400 text-white shadow-lg shadow-amber-200/50" 
                  : "text-stone-500"
              )}
            >
              <item.icon size={24} fill={isActive ? "currentColor" : "none"} />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 duration-300",
              isActive ? "text-amber-600" : "text-stone-500 hover:text-amber-600"
            )}
          >
            <item.icon size={24} fill={isActive ? "currentColor" : "none"} />
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
