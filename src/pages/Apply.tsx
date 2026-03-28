import { Edit3, Info, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';

export default function Apply() {
  return (
    <div className="min-h-screen pb-32">
      <TopBar title="召唤契约" />
      
      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* Hero Section - Clean version without people/flowers */}
        <div className="relative overflow-hidden rounded-3xl mb-10 h-48 sm:h-64 shadow-xl bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center border-4 border-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>
          <div className="relative z-10 text-center space-y-2">
            <div className="w-24 h-24 mx-auto rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/30">
              <img 
                src="https://api.dicebear.com/7.x/notionists/svg?seed=LuckyElephant" 
                alt="Mascot" 
                className="w-20 h-20 object-cover"
              />
            </div>
            <h2 className="text-amber-900 text-3xl font-black font-headline tracking-tight">召唤契约</h2>
            <p className="text-amber-800/70 text-sm font-bold">开启一段奇幻的新旅程</p>
          </div>
        </div>

        {/* Application Form Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_50px_rgba(66,40,32,0.04)] relative"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <Edit3 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-background font-headline">填写契约信息</h3>
              <p className="text-on-surface-variant text-sm">我们会尽快与您取得联系</p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant px-1">姓名</label>
              <input 
                type="text" 
                placeholder="请输入您的姓名" 
                className="w-full px-6 py-4 rounded-full bg-surface-container-high border-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline/60 text-on-background"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant px-1">联系电话</label>
                <input 
                  type="tel" 
                  placeholder="138-0000-0000" 
                  className="w-full px-6 py-4 rounded-full bg-surface-container-high border-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline/60 text-on-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant px-1">邮箱</label>
                <input 
                  type="email" 
                  placeholder="example@mail.com" 
                  className="w-full px-6 py-4 rounded-full bg-surface-container-high border-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline/60 text-on-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant px-1">你的召唤初衷是?</label>
              <textarea 
                placeholder="请简述您的召唤动机及契约承诺..." 
                rows={4}
                className="w-full px-6 py-4 rounded-3xl bg-surface-container-high border-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline/60 text-on-background resize-none"
              />
            </div>

            <div className="pt-4">
              <button className="w-full py-4 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold text-lg shadow-lg shadow-amber-200/50 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
                <span>提交契约</span>
                <Send size={20} />
              </button>
            </div>
          </form>
        </motion.section>

        {/* Information Notice */}
        <div className="mt-8 p-6 bg-surface-container-low rounded-xl flex gap-4 items-start">
          <Info size={20} className="text-primary-dim mt-1" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-on-background">温馨提示</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              提交契约后，我们将在 3 个工作日内对您的资料进行初步审核并与您沟通。召唤是一辈子的契约，感谢您的诚意与耐心。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
