import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Users, Zap, MessageCircle, Heart, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { socketService } from '../services/socket';
import { useUser } from '../lib/UserContext';
import { LuckyChang, Message } from '../types';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

export default function Social() {
  const navigate = useNavigate();
  const { user: currentUser } = useUser();
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [bumpingWith, setBumpingWith] = useState<any>(null);
  const [isBumping, setIsBumping] = useState(false);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = socketService.connect();
    socketRef.current = socket;

    socket.emit('join', {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.collection[0]?.image || currentUser.avatar,
      chang: currentUser.collection[0]
    });

    socket.on('presence_update', (users: any[]) => {
      setActiveUsers(users.filter(u => u.id !== socket.id));
    });

    socket.on('bump_received', (sender: any) => {
      setBumpingWith(sender);
    });

    socket.on('bump_confirmed', (acceptor: any) => {
      setIsBumping(true);
      setBumpingWith(acceptor);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    });

    socket.on('receive_message', (msg: any) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        senderId: msg.senderId,
        senderName: msg.senderName,
        text: msg.message,
        timestamp: Date.now()
      }]);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleBump = (targetId: string) => {
    socketRef.current.emit('bump_request', targetId);
  };

  const acceptBump = () => {
    socketRef.current.emit('bump_accept', bumpingWith.id);
    setIsBumping(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    socketRef.current.emit('send_message', {
      targetId: bumpingWith.id,
      message: inputText
    });
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      senderId: socketRef.current.id,
      senderName: currentUser.name,
      text: inputText,
      timestamp: Date.now()
    }]);
    setInputText('');
  };

  return (
    <div className="min-h-screen bg-indigo-900 text-white pb-32">
      {/* Header */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-indigo-800/80 backdrop-blur-md border-b border-indigo-700">
        <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-700 text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-black text-lg font-headline">碰一碰广场</h1>
        <div className="w-10" />
      </nav>

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8">
        {!isBumping ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <h2 className="text-xl font-bold">在线召唤师 ({activeUsers.length})</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {activeUsers.map(user => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-indigo-800/50 rounded-3xl p-4 flex items-center justify-between border border-indigo-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500">
                      <img src={user.chang.image} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{user.name} 的 {user.chang.name}</h3>
                      <p className="text-xs text-indigo-300">Lv.{user.chang.level} • {user.chang.traits[0]}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBump(user.id)}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-all"
                  >
                    碰一碰
                  </button>
                </motion.div>
              ))}
              {activeUsers.length === 0 && (
                <div className="text-center py-20 text-indigo-300">
                  <Users size={48} className="mx-auto mb-4 opacity-20" />
                  <p>广场上暂时只有你一个人...</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col h-[70vh] space-y-4"
          >
            {/* Interaction Header */}
            <div className="bg-indigo-800/80 rounded-3xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                  <img src={bumpingWith.chang.image} alt={bumpingWith.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold">{bumpingWith.name}</h3>
                  <p className="text-[10px] text-indigo-300">正在与你互动</p>
                </div>
              </div>
              <button onClick={() => setIsBumping(false)} className="text-xs text-indigo-300 underline">退出互动</button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-indigo-950/50 rounded-3xl p-4 overflow-y-auto space-y-4 no-scrollbar">
              {messages.map(msg => (
                <div key={msg.id} className={cn(
                  "flex flex-col max-w-[80%]",
                  msg.senderId === socketRef.current.id ? "ml-auto items-end" : "mr-auto items-start"
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                      <img 
                        src={msg.senderId === socketRef.current.id ? currentUser.collection[0].image : bumpingWith.chang.image} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[8px] text-indigo-400">{msg.senderName}</span>
                  </div>
                  <div className={cn(
                    "px-4 py-2 rounded-2xl text-sm",
                    msg.senderId === socketRef.current.id ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white text-indigo-900 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="让你的小吉象说点什么..."
                className="flex-1 bg-indigo-800 border-none rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-white/30"
              />
              <button
                onClick={sendMessage}
                className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-lg active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Bump Modal */}
      <AnimatePresence>
        {bumpingWith && !isBumping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-indigo-900 rounded-[3rem] p-8 w-full max-w-sm text-center space-y-6 border border-indigo-700 shadow-2xl"
            >
              <div className="relative mx-auto w-32 h-32">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img src={bumpingWith.chang.image} alt={bumpingWith.name} className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black">{bumpingWith.name} 想要碰一碰！</h3>
                <p className="text-indigo-300 text-sm">他的小吉象 {bumpingWith.chang.name} 正在向你打招呼</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setBumpingWith(null)}
                  className="flex-1 py-4 rounded-full bg-indigo-800 font-bold text-sm border border-indigo-700"
                >
                  拒绝
                </button>
                <button
                  onClick={acceptBump}
                  className="flex-1 py-4 rounded-full bg-white text-indigo-600 font-bold text-sm shadow-xl"
                >
                  接受
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
