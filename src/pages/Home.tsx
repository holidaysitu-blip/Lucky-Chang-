import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Users, Plus, Coins, ZapOff, Wand2 } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { INITIAL_USER, STYLE_LABELS } from '../constants';
import { ChangStyle, LuckyChang, User } from '../types';
import { generateLuckyChang } from '../services/gemini';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

import { useUser } from '../lib/UserContext';

export default function Home() {
  const navigate = useNavigate();
  const { user, addChang } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [basicPrompt, setBasicPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ChangStyle>('normal');
  const [diyPrompt, setDiyPrompt] = useState('');

  const handleGenerate = async (isDIY = false) => {
    const style = isDIY ? 'diy' : selectedStyle;
    const cost = isDIY ? 50 : (user.generationCount[style] >= 5 ? 20 : 0);
    
    if (user.balance < cost) {
      alert('余额不足！');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = isDIY ? diyPrompt : basicPrompt;
      const newChang = await generateLuckyChang(style, prompt || undefined);
      const changWithId: LuckyChang = {
        ...newChang as LuckyChang,
        id: `lc_${Date.now()}`,
        isDIY,
        ownerId: user.id,
        ownerName: user.name,
        style: style
      };

      addChang(changWithId, cost, style);

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f9a825', '#7f5200', '#ffc5a7']
      });

      setTimeout(() => {
        navigate('/gallery');
      }, 1500);

    } catch (error) {
      console.error(error);
      alert('召唤失败，请重试');
    } finally {
      setIsGenerating(false);
      setDiyPrompt('');
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <TopBar title="吉象灵境" />
      
      <main className="pt-24 px-6 space-y-8 max-w-2xl mx-auto">
        {/* User Status */}
        <section className="bg-surface-container-low rounded-2xl p-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-amber-50">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{user.name}</h2>
              <p className="text-xs text-on-surface-variant">拥有 {new Set(user.collection.map(c => c.style)).size} 个系列小吉象</p>
            </div>
          </div>
          <div className="bg-primary-container px-4 py-2 rounded-full flex items-center gap-2 shadow-inner">
            <Coins size={16} className="text-primary" />
            <span className="font-bold text-primary">{user.balance}</span>
          </div>
        </section>

        {/* Basic Series - Free Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="text-primary" size={24} />
            <h3 className="text-xl font-bold font-headline text-primary">免费召唤板块</h3>
          </div>
          
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xl border border-white/50 space-y-6">
            <div className="grid grid-cols-5 gap-2">
              {(['pixel', 'normal', 'movie', 'variant', 'artbox'] as ChangStyle[]).map(style => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-2xl transition-all",
                    selectedStyle === style ? "bg-primary text-white scale-105 shadow-lg" : "bg-surface-container-high text-on-surface-variant"
                  )}
                >
                  <span className="text-[10px] font-bold">{STYLE_LABELS[style]}</span>
                  <div className="text-[8px] opacity-70">
                    {user.generationCount[style] < 5 ? '免费' : '20 币'}
                  </div>
                </button>
              ))}
            </div>

            <div className="relative">
              <textarea
                value={basicPrompt}
                onChange={(e) => setBasicPrompt(e.target.value)}
                placeholder="输入灵感关键词，召唤你的小吉象..."
                className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/30 resize-none h-20"
              />
            </div>

            <button
              disabled={isGenerating}
              onClick={() => handleGenerate(false)}
              className={cn(
                "w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg",
                isGenerating 
                  ? "bg-surface-container-high text-outline cursor-not-allowed" 
                  : "bg-gradient-to-r from-amber-600 to-amber-400 text-white shadow-amber-200/50"
              )}
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles size={24} />
                </motion.div>
              ) : (
                <>
                  <Sparkles size={24} />
                  <span>
                    {user.generationCount[selectedStyle] < 5 ? '立即免费召唤' : `付费召唤 (20币)`}
                  </span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* DIY Series - Paid Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Wand2 className="text-amber-600" size={24} />
            <h3 className="text-xl font-bold font-headline text-amber-700">DIY 专属系列 (付费板块)</h3>
          </div>
          
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xl border border-white/50 space-y-4">
            <div className="relative">
              <textarea
                value={diyPrompt}
                onChange={(e) => setDiyPrompt(e.target.value)}
                placeholder="输入你的灵感咒语，召唤独一无二的小吉象..."
                className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-amber-500/30 resize-none h-24"
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-amber-600 font-bold">
                50 币/只
              </div>
            </div>

            <button
              disabled={isGenerating || diyPrompt.length === 0}
              onClick={() => handleGenerate(true)}
              className={cn(
                "w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg",
                isGenerating || diyPrompt.length === 0
                  ? "bg-surface-container-high text-outline cursor-not-allowed" 
                  : "bg-gradient-to-r from-amber-700 to-amber-500 text-white shadow-amber-200/50"
              )}
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles size={24} />
                </motion.div>
              ) : (
                <>
                  <Sparkles size={24} />
                  <span>付费 DIY 召唤 (50币)</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* My Collection */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-primary" size={24} />
              <h3 className="text-xl font-bold font-headline">我的契约小吉象</h3>
            </div>
            <Link to="/gallery" className="text-xs text-primary font-bold hover:underline">
              进入珍藏馆
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
            <AnimatePresence>
              {user.collection.map((chang, idx) => (
                <motion.div
                  key={chang.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="min-w-[280px] bg-white rounded-[2.5rem] p-4 shadow-xl border border-orange-100 relative group"
                >
                  <div className="aspect-square rounded-[2rem] overflow-hidden mb-4 relative">
                    <img src={chang.image} alt={chang.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold">
                      Lv.{chang.level}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-md text-primary px-3 py-1 rounded-full text-[10px] font-bold">
                      {STYLE_LABELS[chang.style]}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xl font-black text-on-background">{chang.name}</h4>
                      {chang.isDIY && <div className="bg-amber-100 text-amber-700 text-[8px] px-2 py-0.5 rounded-full font-bold">DIY</div>}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(chang.stats).map(([key, val]) => (
                        <div key={key} className="bg-surface-container-low rounded-xl p-2 text-center">
                          <div className="text-[8px] text-on-surface-variant uppercase">{key}</div>
                          <div className="text-xs font-bold text-primary">{val}%</div>
                        </div>
                      ))}
                    </div>

                    <Link 
                      to="/social"
                      className="w-full py-3 rounded-full bg-surface-container-high text-on-surface font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center"
                    >
                      互动交流
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Social Bump Zone */}
        <section className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <Users size={32} />
              <h3 className="text-2xl font-black font-headline">召唤师广场</h3>
            </div>
            <p className="text-indigo-100 text-sm leading-relaxed">
              实时连接其他召唤师！通过“碰一碰”认识新朋友，让你的 Lucky Chang 与他们的伙伴互动、交流、甚至开启一段奇妙的冒险。
            </p>
            <Link to="/social" className="bg-white text-indigo-600 px-8 py-3 rounded-full font-black text-lg shadow-xl hover:scale-105 transition-transform active:scale-95">
              进入广场
            </Link>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        </section>
      </main>
    </div>
  );
}
