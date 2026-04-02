import { AlertTriangle, Music, Video, Type, ShieldCheck, ArrowRight, ExternalLink, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Shorts() {
  return (
    <div className="bg-white min-h-screen">
      {/* WARNING SECTION - Hero */}
      <section className="relative min-h-screen flex items-center pt-40 pb-32 overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 opacity-10">
          {/* Subtle background texture or abstract element could go here */}
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 px-5 py-2.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-10">
              <AlertTriangle size={14} />
              Warning: Must Read Before Starting
            </div>
            
            <h2 className="text-5xl md:text-8xl font-black tracking-tightest leading-[0.9] mb-16">
              채널을 날려먹기 전에,<br />
              <span className="text-red-500 underline decoration-red-500/30 underline-offset-[12px]">이 글부터 읽으세요.</span>
            </h2>

            <div className="space-y-10 text-xl md:text-2xl text-white/60 font-medium leading-relaxed max-w-2xl tracking-tight">
              <p>
                쇼츠 하나에 1~2만 원. 매일 업로드. 조회수도 나쁘지 않다.<br />
                그런데 어느 날 아침, 유튜브 스튜디오에 <span className="text-red-500 font-bold">빨간 경고창</span>이 뜹니다.
              </p>
              
              <div className="p-8 bg-red-500/5 border-l-4 border-red-500 rounded-r-[32px] italic text-red-500/90 font-bold shadow-2xl shadow-red-500/5">
                "저작권 위반 경고: 계정 수익 창출 정지"
              </div>

              <p>
                싸게 맡겼던 그 업체 때문에, 당신이 쌓아온 브랜드 채널이<br />
                <span className="text-white font-bold">하루아침에 사라집니다.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 1 - Problem Intro */}
      <section className="py-48 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-red-500 font-bold tracking-[0.2em] uppercase text-xs mb-8">The Risk</p>
              <h2 className="text-5xl md:text-6xl font-black tracking-tightest mb-10 leading-[1.0]">
                왜 싼 업체는 위험한가?<br />
                <span className="text-zinc-300">— 아무도 알려주지 않는 진실</span>
              </h2>
              <p className="text-xl text-zinc-500 font-medium leading-relaxed tracking-tight">
                저가 숏폼 제작 업체들이 비용을 맞추는 방법은 단 하나입니다.<br />
                <span className="text-brand-dark font-bold">제대로 된 소스를 쓰지 않는 것.</span><br />
                그 피해는 고스란히 채널 주인인 당신에게 돌아옵니다.
              </p>
            </motion.div>
            
            <div className="grid gap-8">
              {[
                { id: '01', title: '무료 음원의 함정', icon: <Music className="text-red-500" /> },
                { id: '02', title: '남의 영상 베끼기', icon: <Video className="text-red-500" /> },
                { id: '03', title: 'AI 양산형 쇼츠 폭탄', icon: <Type className="text-red-500" /> }
              ].map((item) => (
                <div key={item.id} className="flex items-center gap-8 p-10 bg-white rounded-[40px] border border-zinc-50 shadow-sm hover:shadow-xl transition-all duration-500 group">
                  <span className="text-5xl font-black text-zinc-100 group-hover:text-red-500/10 transition-colors">{item.id}</span>
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all duration-500">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-bold text-brand-dark tracking-tight">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2, 3, 4 - Detailed Problems */}
      <section className="py-48 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-48">
          
          {/* Problem 1 */}
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-24 items-center">
            <div className="space-y-8">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-8">
                <Music className="text-red-500" size={28} />
              </div>
              <h3 className="text-3xl md:text-5xl font-black tracking-tightest mb-6 leading-[1.1]">
                ① 무료 음원의 함정
              </h3>
              <p className="text-xl text-zinc-500 font-medium leading-relaxed tracking-tight">
                유튜브 라이브러리의 무료 음원? 안전해 보이죠. <br />
                하지만 <span className="text-brand-dark font-bold">저작권자가 정책을 바꾸는 순간</span>, 당신의 영상은 수익 창출이 정지되거나 삭제됩니다. 
              </p>
              <div className="flex items-start gap-4 p-8 bg-zinc-50 rounded-[32px] border border-zinc-100">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                  저가 업체들은 유료 라이선스 비용을 아끼기 위해 이런 위험한 소스를 사용합니다. 나중에 문제가 생겨도 그들은 책임지지 않습니다.
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-6 bg-red-500/5 rounded-[48px] -z-10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border border-zinc-50">
                <img 
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  title={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n유튜브영상제작\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                  alt={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n유튜브영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full w-fit mb-3">Legal Risk</div>
                  <div className="text-white font-black text-xl tracking-tight">Copyright Violation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Problem 2 */}
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-24 items-center">
            <div className="relative group lg:order-first order-last">
              <div className="absolute -inset-6 bg-red-500/5 rounded-[48px] -z-10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border border-zinc-50">
                <img 
                  src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"
                  title={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n유튜브영상제작\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                  alt={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n유튜브영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full w-fit mb-3">Detection</div>
                  <div className="text-white font-black text-xl tracking-tight">Content ID Match</div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-8">
                <Video className="text-red-500" size={28} />
              </div>
              <h3 className="text-3xl md:text-5xl font-black tracking-tightest mb-6 leading-[1.0]">
                ② 남의 영상 베끼기
              </h3>
              <p className="text-xl text-zinc-500 font-medium leading-relaxed tracking-tight">
                유튜브 알고리즘은 바보가 아닙니다. <br />
                타인의 영상을 재가공하거나 소스를 무단으로 가져다 쓰는 행위는 <span className="text-brand-dark font-bold">Content ID 시스템</span>에 즉각 적발됩니다.
              </p>
              <div className="flex items-start gap-4 p-8 bg-zinc-50 rounded-[32px] border border-zinc-100">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                  한 번 '재사용된 콘텐츠'로 찍히면 채널의 노출도가 급격히 떨어지며, 최악의 경우 채널 자체가 삭제될 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Problem 3 */}
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-24 items-center">
            <div className="space-y-8">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-8">
                <Type className="text-red-500" size={28} />
              </div>
              <h3 className="text-3xl md:text-5xl font-black tracking-tightest mb-6 leading-[1.0]">
                ③ AI 양산형 쇼츠 폭탄
              </h3>
              <p className="text-xl text-zinc-500 font-medium leading-relaxed tracking-tight">
                "너무 만들기 쉽네?" 하고 그냥 대량 양산했다가는 <br />
                어느날 <span className="text-brand-dark font-bold">채널 수익정지</span>를 받게 됩니다. 적절하게 AI를 사용중인지, 유익한 영상인지 확인하셨나요?
              </p>
              <div className="flex items-start gap-4 p-8 bg-zinc-50 rounded-[32px] border border-zinc-100">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                  저가 업체들은 폰트 라이선스를 일일이 관리하지 않습니다. 그들이 만든 영상의 법적 책임은 모두 '게시자'인 당신에게 있습니다.
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-6 bg-red-500/5 rounded-[48px] -z-10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border border-zinc-50">
                <img 
                  src="https://images.unsplash.com/photo-1642789673880-f25084b1c46d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  title={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n유튜브영상제작\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                  alt={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n유튜브영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full w-fit mb-3">Warning</div>
                  <div className="text-white font-black text-xl tracking-tight">License Settlement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - Solution */}
      <section className="py-48 bg-brand-dark text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <ShieldCheck size={800} className="translate-x-1/4 -translate-y-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-24 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-brand-cyan font-bold tracking-[0.2em] uppercase text-xs mb-8">The Solution</p>
              <h2 className="text-5xl md:text-7xl font-black tracking-tightest mb-12 leading-[1.0]">
                저작권은 창작자의 권리,<br />
                당신 비즈니스의 안전띠입니다.
              </h2>
              <div className="inline-flex items-center gap-4 px-8 py-4 bg-brand-cyan text-brand-dark rounded-2xl text-xl md:text-2xl font-black tracking-tight shadow-2xl mb-10">
                PlaceURL은 다릅니다.
              </div>
              <p className="text-xl text-white/60 font-medium leading-relaxed tracking-tight max-w-xl">
                우리는 단순히 영상을 만드는 것이 아니라, 당신의 자산을 보호합니다.<br />
                모든 소스는 저작권에서 자유로운 것들을 사용해야 합니다.
              </p>
            </motion.div>
            
            <div className="relative group">
              <div className="absolute -inset-10 bg-brand-cyan/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative aspect-square rounded-[48px] overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
                  title={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n유튜브영상제작\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                  alt={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n유튜브영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-dark/20 mix-blend-overlay"></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: '모든 BGM', desc: '정식 상업용 라이선스 플랫폼 사용', icon: <Music size={24} /> },
              { title: '모든 영상 소스', desc: '직접 제작 또는 AI활용 영상 적용', icon: <Video size={24} /> },
              { title: '모든 이미지 소스', desc: '상업적 이용 가능 이미지만 사용', icon: <Type size={24} /> }
            ].map((item, idx) => (
              <div key={idx} className="group p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[48px] flex flex-col items-center text-center hover:bg-white/10 transition-all duration-500">
                <div className="w-16 h-16 bg-brand-cyan rounded-2xl flex items-center justify-center mb-8 text-brand-dark group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-black mb-4 uppercase tracking-tight">{item.title}</h4>
                <p className="text-white/50 font-medium text-lg tracking-tight">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-32 text-center max-w-4xl mx-auto space-y-12">
            <p className="text-2xl md:text-3xl font-medium leading-relaxed text-white/60 tracking-tight">
              채널이 커질수록, 저작권 리스크는 더 커집니다.<br />
              처음부터 제대로 만들어야, 나중에 발목 잡히지 않습니다.
            </p>
            <p className="text-3xl md:text-5xl font-black tracking-tightest leading-[1.1]">
              불안한 가성비 대신,<br />
              안전하고 확실한 퀄리티를 선택하세요.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-48 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-16"
          >
            <h2 className="text-5xl md:text-8xl font-black tracking-tightest leading-[0.9]">
              당신의 채널을<br />
              <span className="text-brand-cyan">가장 현명하게</span> 지키는 법.
            </h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <Link 
                to="/consult"
                className="group relative inline-flex items-center gap-4 bg-brand-dark text-white px-12 py-6 rounded-full text-xl font-bold overflow-hidden transition-all duration-500 hover:pr-16"
              >
                <span className="relative z-10">제작 상담하기</span>
                <ArrowRight className="relative z-10 transition-transform duration-500 group-hover:translate-x-2" size={24} />
                <div className="absolute inset-0 bg-brand-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
              <Link 
                to="/reference"
                className="inline-flex items-center gap-4 text-brand-dark px-12 py-6 rounded-full text-xl font-bold border-2 border-brand-dark/10 hover:border-brand-dark transition-all duration-500"
              >
                레퍼런스 보기
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
