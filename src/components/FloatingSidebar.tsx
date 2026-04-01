import { motion } from 'motion/react';
import { MessageCircle, Phone, Mail } from 'lucide-react';

export default function FloatingSidebar() {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[120] flex flex-col gap-4">
      <motion.a 
        whileHover={{ x: -5, scale: 1.05 }}
        href="https://open.kakao.com/o/sCZ3OUfi" 
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-14 h-14 bg-[#FEE500] text-[#3C1E1E] rounded-2xl flex items-center justify-center shadow-xl hover:shadow-yellow-200/50 transition-all"
      >
        <MessageCircle size={24} fill="currentColor" />
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          카카오톡 문의
        </span>
      </motion.a>
      
      <motion.a 
        whileHover={{ x: -5, scale: 1.05 }}
        href="tel:010-4429-2078" 
        className="group relative w-14 h-14 bg-[#22C55E] text-white rounded-2xl flex items-center justify-center shadow-xl hover:shadow-green-200/50 transition-all"
      >
        <Phone size={24} fill="white" />
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          010-4429-2078
        </span>
      </motion.a>
      
      <motion.a 
        whileHover={{ x: -5, scale: 1.05 }}
        href="mailto:placeurl.com@gmail.com" 
        className="group relative w-14 h-14 bg-zinc-950 text-white rounded-2xl flex items-center justify-center shadow-xl hover:shadow-blue-500/20 transition-all"
      >
        <Mail size={24} />
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          이메일 문의
        </span>
      </motion.a>
      
      <div className="w-1 h-12 bg-zinc-100 rounded-full mx-auto mt-2 overflow-hidden relative">
        <motion.div 
          className="absolute top-0 left-0 right-0 bg-blue-600 rounded-full"
          style={{ height: '40%' }}
          animate={{ y: [0, 60, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
