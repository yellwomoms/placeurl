import { useState } from 'react';
import { Play, Instagram, Youtube, Facebook, X, Mail, Video, Zap, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ALL_CLIENTS } from '../constants/clients';

export default function Footer() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <footer className="bg-zinc-950 text-white overflow-hidden relative">
      {/* Fixed Client List Section */}
      <div className="bg-zinc-900/30 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h3 className="text-xs font-black text-zinc-500 tracking-[0.3em] uppercase mb-4">Trusted by 500+ Partners</h3>
            <div className="w-12 h-px bg-zinc-800 mx-auto" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-x-4 gap-y-6">
            {ALL_CLIENTS.map((client, idx) => (
              <div 
                key={idx} 
                className="text-[10px] sm:text-xs font-bold text-zinc-600 hover:text-zinc-400 transition-colors cursor-default text-center truncate px-1"
                title={client}
              >
                {client}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-20 mb-24">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Play className="text-zinc-950 fill-current w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">PlaceURL</span>
            </div>
            <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-md mb-12">
              PlaceURL은 라이브 커머스와 숏폼 콘텐츠의 새로운 기준을 제시합니다. 
              당신의 브랜드가 더 넓은 세상과 연결될 수 있도록 최선을 다하겠습니다.
            </p>
            <div className="flex gap-6">
              {[Instagram, Youtube, Facebook].map((Icon, idx) => (
                <a key={idx} href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-black text-sm tracking-widest uppercase mb-10 text-zinc-500">Company</h5>
            <ul className="space-y-6 text-zinc-400 font-bold">
              <li>상호명: 센트럴라인</li>
              <li>대표자: 김종상</li>
              <li>사업자번호: 806-22-00695</li>
              <li>주소: 인천광역시 연수구 하모니모 188번길 17 sk뷰센트럴 102동 3303호</li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-sm tracking-widest uppercase mb-10 text-zinc-500">Contact</h5>
            <ul className="space-y-6 text-zinc-400 font-bold">
              <li>T. 010-4429-2078</li>
              <li>E. placeurl.com@gmail.com</li>
              <li>Kakao. @ggty</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-600 text-xs font-bold uppercase tracking-widest">
          <p>© 2026 PlaceURL. All rights reserved.</p>
          <div className="flex gap-10">
            <button 
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              회사소개
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* About Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutOpen(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white text-zinc-950 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-8 right-8 p-2 hover:bg-zinc-100 rounded-full transition-all z-10"
              >
                <X size={24} />
              </button>

              <div className="p-10 md:p-16">
                <div className="mb-12">
                  <span className="px-4 py-1.5 bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 inline-block">Company Introduction</span>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight mb-6">
                    "짧지만 강렬하게, <br />
                    당신의 이야기를 세상에 전합니다."
                  </h2>
                  <p className="text-lg text-zinc-500 font-medium leading-relaxed">
                    저희는 <span className="text-zinc-950 font-bold">숏폼·릴스 전문 영상 제작 회사</span>입니다.
                  </p>
                </div>

                <div className="space-y-8 mb-12">
                  <p className="text-zinc-600 leading-relaxed font-medium">
                    빠르게 변화하는 디지털 환경 속에서, 단 몇 초의 영상이 브랜드의 운명을 바꾸는 시대가 왔습니다. 우리는 그 짧은 순간 안에 <span className="text-zinc-950 font-bold">브랜드의 철학, 감성, 그리고 메시지</span>를 온전히 담아냅니다.
                  </p>
                  <p className="text-zinc-600 leading-relaxed font-medium">
                    Instagram Reels, TikTok, YouTube Shorts 등 모든 숏폼 플랫폼에 최적화된 콘텐츠로, 더 많은 사람들이 <span className="text-blue-600 font-bold">당신의 브랜드에 멈추고, 공감하고, 공유</span>하게 만듭니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {[
                    { icon: Video, label: "기획부터 편집까지", desc: "아이디어 발굴에서 최종 납품까지 원스톱으로 진행합니다." },
                    { icon: Play, label: "플랫폼 맞춤 최적화", desc: "TikTok, Reels, Shorts 각 플랫폼의 알고리즘과 트렌드를 분석해 제작합니다." },
                    { icon: Zap, label: "빠른 제작 & 유연한 소통", desc: "신속한 피드백과 빠른 납기로 클라이언트의 시간을 존중합니다." },
                    { icon: Lightbulb, label: "트렌드를 읽는 크리에이티브", desc: "끊임없이 변화하는 숏폼 트렌드를 앞서 반영합니다." }
                  ].map((item, idx) => (
                    <div key={idx} className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 group hover:border-zinc-300 transition-all">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <item.icon size={20} className="text-zinc-950" />
                      </div>
                      <h4 className="font-bold text-sm mb-2">{item.label}</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-8 border-t border-zinc-100">
                  <p className="text-lg font-bold mb-8 tracking-tight">
                    스크롤을 멈추는 순간, 비즈니스가 시작됩니다. <br />
                    <span className="text-blue-600">지금 바로 우리와 함께 그 순간을 만들어보세요.</span>
                  </p>
                  <Link 
                    to="/consult"
                    onClick={() => setIsAboutOpen(false)}
                    className="inline-flex items-center gap-3 bg-zinc-950 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
                  >
                    <Mail size={20} /> 문의하기
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
