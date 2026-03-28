import { ArrowLeft, Heart, MapPin, MessageCircle, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { INITIAL_USER } from '../constants';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const elephant = INITIAL_USER.collection.find(e => e.id === id) || INITIAL_USER.collection[0];

  return (
    <div className="min-h-screen pb-32">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-orange-50/90 backdrop-blur-md shadow-[0_4px_30px_rgba(66,40,32,0.05)]">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 text-amber-900 hover:bg-orange-100/50 active:scale-95 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold tracking-tight text-amber-900 text-lg font-headline">吉象详情</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 text-amber-900 hover:bg-orange-100/50 active:scale-95 transition-all">
          <Heart size={20} />
        </button>
      </nav>

      <main className="pt-20 px-4 max-w-2xl mx-auto">
        {/* Profile Hero Section */}
        <section className="relative mb-8 mt-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative"
          >
            <img 
              src={elephant.image} 
              alt={elephant.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </motion.div>
          
          {/* Floating Name Tag */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] glass-panel rounded-full py-4 px-8 shadow-xl border border-white/30 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-amber-900 tracking-tight font-headline">{elephant.name}</h2>
              <p className="text-amber-700/80 text-sm font-medium flex items-center gap-1">
                <MapPin size={16} />
                {elephant.location}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold text-primary">{elephant.age}</span>
              <span className="text-xs text-on-surface-variant font-medium">{elephant.type}</span>
            </div>
          </div>
        </section>

        {/* Attributes Grid */}
        <section className="mt-12 grid grid-cols-3 gap-3">
          {elephant.traits.map((tag, i) => (
            <div key={tag} className="bg-surface-container-low p-4 rounded-full flex flex-col items-center justify-center text-center">
              <div className="text-primary-dim mb-1">
                {i === 0 ? <Heart size={20} fill="currentColor" /> : i === 1 ? <Heart size={20} /> : <Heart size={20} />}
              </div>
              <span className="text-amber-900 font-bold text-sm">{tag}</span>
            </div>
          ))}
        </section>

        {/* Description Section */}
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h3 className="text-xl font-bold text-on-background font-headline">关于{elephant.name}</h3>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
            <p className="text-on-surface leading-relaxed text-lg">
              {elephant.description}
            </p>
          </div>
        </section>

        {/* Gallery Snippet */}
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h3 className="text-xl font-bold text-on-background font-headline">生活瞬间</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 h-64">
            <div className="rounded-3xl overflow-hidden shadow-md">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuir-ZyKrbwBub-FOQGy_JcPwt1yEbL9odvbWjWYhNRyHFkTUf2RlwCMXFhsyVy2JNVEfIFZZG8CphpXVXN45Ltaljd2RCKSAZcirOtwdJ4FhEoVroOZzYuMxVlYKscvbW_7tFJIiPhQzTACRYX1NROiXv_-1u2ZGbru8SqW4VOqGqU8W-fdewnl9eFud9FI0ZMdz4_7DgZ5V8lOklQdhwkDyz25MwU9FmEA77swik4jJrccVB9vaGtS-blBgmmhlXCD8AOKbtqQo" 
                alt="Moment 1" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="rounded-3xl overflow-hidden shadow-md">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuir-ZyKrbwBub-FOQGy_JcPwt1yEbL9odvbWjWYhNRyHFkTUf2RlwCMXFhsyVy2JNVEfIFZZG8CphpXVXN45Ltaljd2RCKSAZcirOtwdJ4FhEoVroOZzYuMxVlYKscvbW_7tFJIiPhQzTACRYX1NROiXv_-1u2ZGbru8SqW4VOqGqU8W-fdewnl9eFud9FI0ZMdz4_7DgZ5V8lOklQdhwkDyz25MwU9FmEA77swik4jJrccVB9vaGtS-blBgmmhlXCD8AOKbtqQo" 
                  alt="Moment 2" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="rounded-3xl overflow-hidden bg-primary-container/20 flex items-center justify-center text-primary font-bold">
                +12 更多
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 w-full p-6 z-50">
        <div className="max-w-2xl mx-auto glass-panel rounded-full p-3 shadow-[0_-10px_40px_rgba(66,40,32,0.1)] flex items-center gap-4 border border-white/50">
          <button className="w-14 h-14 rounded-full flex items-center justify-center bg-surface-container-high text-amber-900 active:scale-95 transition-all">
            <Share2 size={24} />
          </button>
          <button 
            onClick={() => navigate('/summon')}
            className="flex-1 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-400 text-white font-bold text-lg shadow-lg shadow-amber-200/50 active:scale-95 transition-all"
          >
            立即召唤
          </button>
        </div>
      </div>
    </div>
  );
}
