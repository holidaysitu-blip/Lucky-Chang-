import { Edit3, Info, Send, ShieldCheck, MapPin, Coins } from 'lucide-react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { useUser } from '../lib/UserContext';

export default function Profile() {
  const { user } = useUser();
  return (
    <div className="min-h-screen pb-32">
      <TopBar title="个人中心" />
      
      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8">
        {/* Profile Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-xl p-8 bg-surface-container-low"
        >
          <div className="flex items-center gap-6 relative z-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-surface-container-lowest overflow-hidden shadow-lg">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary p-1.5 rounded-full border-2 border-surface-container-low">
                <ShieldCheck size={12} className="text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-on-background font-headline">{user.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant text-sm flex items-center gap-1">
                  <MapPin size={14} />
                  吉象灵境
                </span>
              </div>
            </div>
          </div>
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        </motion.section>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-highest rounded-xl p-5 space-y-2">
            <span className="text-on-surface-variant text-sm font-medium flex items-center gap-1">
              <Coins size={14} /> 余额
            </span>
            <p className="text-4xl font-black text-primary font-headline">{user.balance}</p>
          </div>
          <div className="bg-surface-container rounded-xl p-5 space-y-2">
            <span className="text-on-surface-variant text-sm font-medium">收藏数量</span>
            <p className="text-4xl font-black text-secondary font-headline">
              {user.collection.length}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
