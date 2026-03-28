import React from 'react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { useUser } from '../lib/UserContext';
import { STYLE_LABELS } from '../constants';
import { Link } from 'react-router-dom';

import { LuckyChang } from '../types';

export default function Gallery() {
  const { user } = useUser();
  const collection = user.collection;
  
  // Group by style
  const groupedCollection = collection.reduce((acc, chang) => {
    if (!acc[chang.style]) {
      acc[chang.style] = [];
    }
    acc[chang.style].push(chang);
    return acc;
  }, {} as Record<string, LuckyChang[]>);

  return (
    <div className="min-h-screen pb-32">
      <TopBar title="珍藏馆" />
      
      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-10">
        {(Object.entries(groupedCollection) as [string, LuckyChang[]][]).map(([style, items]) => (
          <section key={style} className="space-y-4">
            <div className="flex items-center justify-between border-b border-orange-100 pb-2">
              <h3 className="text-lg font-black text-amber-800">{STYLE_LABELS[style]} 系列</h3>
              <span className="text-xs text-on-surface-variant font-medium">共 {items.length} 只小吉象</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {items.map((chang, idx) => (
                <motion.div
                  key={chang.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative"
                >
                  <Link to={`/detail/${chang.id}`}>
                    <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg relative">
                      <img 
                        src={chang.image} 
                        alt={chang.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="font-bold text-lg">{chang.name}</p>
                        <p className="text-[10px] opacity-80">{chang.isDIY ? 'DIY 专属' : '系列衍生品'}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
        
        {collection.length === 0 && (
          <div className="py-20 text-center text-on-surface-variant">
            <p>你的珍藏馆还是空的哦</p>
            <Link to="/" className="text-primary font-bold mt-2 inline-block">去召唤一只吧</Link>
          </div>
        )}
      </main>
    </div>
  );
}
