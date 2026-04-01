import { Check, ArrowRight, Clock, Video, Edit3, Layers, Zap, Calendar, Star, Info, Plus, Minus, ExternalLink, HelpCircle, Sparkles, Target, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const EDIT_ONLY = [
  { name: '기본형', length: '0~15초', features: ['자막·음악·컬러', '기본 컷 편집', '2회 수정'], price: '80,000' },
  { name: '표준형', length: '15~30초', features: ['자막·음악·컬러', '모션 그래픽', '2회 수정'], price: '150,000' },
  { name: '고급형', length: '30~60초', features: ['자막·음악·컬러·효과', '모션 그래픽', '고급 사운드 적용', '3회 수정'], price: '250,000' },
  { name: '프리미엄', length: '60초+', features: ['협의 후 결정', '전담 PD 배정', '3회 수정'], price: '협의' },
];

const FILMING_EDITING = [
  { name: '쇼핑 숏츠', features: ['촬영·편집·자막·음악', '기본 컷 편집', '1~3시간 촬영'], time: '1~3시간', price: '650,000' },
  { name: '브랜드 영상', features: ['촬영·편집·자막·음악', '컬러그레이딩·모션', '2~4시간 촬영'], time: '2~4시간', price: '1,050,000' },
  { name: '제품 언박싱', features: ['촬영·편집·특수효과', '모션그래픽', '2~3시간 촬영'], time: '2~3시간', price: '550,000' },
];

const SUBSCRIPTION = [
  { 
    name: '라이트', 
    count: '월 2개', 
    length: '0~15초',
    features: ['편집 전용', '기본 컷 편집 적용', '24시간 내 피드백'], 
    monthly: '200,000', 
    highlight: false 
  },
  { 
    name: '비즈니스', 
    count: '월 5개', 
    length: '15~60초',
    features: ['편집 전용', '고급 컷 편집 적용', '우선순위 제작', '전략 컨설팅 포함'], 
    monthly: '800,000', 
    highlight: true 
  },
  { 
    name: '프로', 
    count: '월 10개', 
    length: '60초+',
    features: ['편집 + 촬영(옵션)', '작업자 배정', '3회 수정', '전략 컨설팅 포함'], 
    monthly: '1,700,000', 
    highlight: false 
  },
];

export default function Price() {
  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION - Bold Editorial */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/30 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.95] uppercase mb-8">
              Simple<br />
              <span className="text-zinc-600">Shorts. Reels.</span><br />
              <span className="text-blue-600 underline decoration-blue-600/30 underline-offset-[12px]">제작 가격표</span>
            </h1>

            <div className="grid lg:grid-cols-2 gap-12 items-end">
              <p className="text-lg md:text-xl text-zinc-400 font-medium leading-tight max-w-xl">
                우리는 복잡한 견적 과정을 생략합니다. <br />
                가장 합리적이고 투명한 가격으로 <br />
                <span className="text-white">당신의 비즈니스에 속도를 더하세요.</span>
              </p>
              
              <div className="flex flex-wrap gap-8 border-l border-zinc-800 pl-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Currency</span>
                  <span className="text-xl font-black tracking-tighter">KRW (₩)</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Tax Policy</span>
                  <span className="text-xl font-black tracking-tighter">VAT INCL.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRICING CONTENT */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          
          {/* 01. Editing Only */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-zinc-100 pb-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-blue-600">01</span>
                <div>
                  <h2 className="text-3xl font-black tracking-tight uppercase">Editing Only</h2>
                  <p className="text-zinc-400 font-bold text-sm">편집 전용 서비스</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {EDIT_ONLY.map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -8 }}
                  className="p-8 bg-zinc-50 rounded-[32px] border border-zinc-100 flex flex-col h-full group hover:bg-white hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500"
                >
                  <div className="mb-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">
                      <Clock size={12} /> {item.length}
                    </span>
                    <h3 className="text-2xl font-black text-zinc-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    {item.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
                        <Check size={14} className="text-blue-600" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6 border-t border-zinc-100 flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-1">
                      {item.price !== '협의' && <span className="text-sm font-black text-zinc-400">₩</span>}
                      <span className="text-3xl font-black tracking-tighter text-zinc-900">{item.price}</span>
                    </div>
                    <Link 
                      to="/consult" 
                      state={{ 
                        plan: `Editing Only - ${item.name}`,
                        initialPrice: item.price === '협의' ? 0 : Number(item.price.replace(/,/g, ''))
                      }}
                      className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all"
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 02. Filming & Production */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-zinc-100 pb-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-blue-600">02</span>
                <div>
                  <h2 className="text-3xl font-black tracking-tight uppercase">Filming</h2>
                  <p className="text-zinc-400 font-bold text-sm">촬영 + 편집 패키지</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {FILMING_EDITING.map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -8 }}
                  className="p-10 bg-zinc-950 text-white rounded-[40px] flex flex-col h-full relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="mb-8">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                      <Video size={20} />
                    </div>
                    <h3 className="text-3xl font-black tracking-tight mb-2">{item.name}</h3>
                    <p className="text-zinc-500 text-sm font-bold">{item.time} 촬영 세션</p>
                  </div>

                  <ul className="space-y-4 mb-12 flex-grow">
                    {item.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-400 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-8 border-t border-white/10 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Starting at</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-black text-blue-500">₩</span>
                        <span className="text-4xl font-black tracking-tighter">{item.price}</span>
                      </div>
                    </div>
                    <Link 
                      to="/consult" 
                      state={{ 
                        plan: `Filming - ${item.name}`,
                        initialPrice: Number(item.price.replace(/,/g, ''))
                      }}
                      className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all"
                    >
                      <ArrowRight size={24} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 03. Membership */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-zinc-100 pb-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-blue-600">03</span>
                <div>
                  <h2 className="text-3xl font-black tracking-tight uppercase">Membership</h2>
                  <p className="text-zinc-400 font-bold text-sm">구독형 멤버십 서비스</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {SUBSCRIPTION.map((plan, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -8 }}
                  className={`p-10 rounded-[40px] flex flex-col h-full relative border-2 transition-all duration-500 ${
                    plan.highlight 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-200' 
                    : 'bg-white text-zinc-950 border-zinc-100 hover:border-blue-600 shadow-sm'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute top-8 right-8 bg-white text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-3xl font-black tracking-tight mb-2">{plan.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      <div className={`inline-block px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${
                        plan.highlight ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {plan.count} 제작
                      </div>
                      <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${
                        plan.highlight ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        <Clock size={12} /> {plan.length}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-12 flex-grow">
                    {plan.features.map((f, i) => (
                      <li key={i} className={`flex items-start gap-3 font-medium ${
                        plan.highlight ? 'text-blue-50' : 'text-zinc-600'
                      }`}>
                        <Check size={18} className={plan.highlight ? 'text-white' : 'text-blue-600'} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`pt-8 border-t ${plan.highlight ? 'border-white/20' : 'border-zinc-100'} flex items-center justify-between gap-4`}>
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                        plan.highlight ? 'text-blue-200' : 'text-zinc-400'
                      }`}>Monthly Subscription</span>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-sm font-black ${plan.highlight ? 'text-white' : 'text-blue-600'}`}>₩</span>
                        <span className="text-5xl font-black tracking-tighter">{plan.monthly}</span>
                        <span className={`text-sm font-bold ml-1 ${plan.highlight ? 'text-blue-200' : 'text-zinc-400'}`}>/ mo</span>
                      </div>
                    </div>
                    <Link 
                      to="/consult" 
                      state={{ 
                        plan: `Membership - ${plan.name}`,
                        initialPrice: Number(plan.monthly.replace(/,/g, ''))
                      }}
                      className={`p-4 rounded-2xl transition-all ${
                        plan.highlight ? 'bg-white text-blue-600 hover:bg-zinc-100' : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <ArrowRight size={24} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Strategy Consulting Highlight */}
            <div className="mt-12 p-12 bg-zinc-50 rounded-[48px] border border-zinc-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="relative grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                      <Sparkles size={24} />
                    </div>
                    <h3 className="text-3xl font-black tracking-tight">전략 컨설팅 서비스</h3>
                  </div>
                  <p className="text-lg text-zinc-600 font-medium leading-relaxed mb-8">
                    단순한 영상 제작을 넘어, 브랜드의 성장을 위한 <span className="text-blue-600 font-bold">콘텐츠 전략</span>을 함께 고민합니다. 
                    트렌드 분석부터 채널 운영 방향성까지, 전문가의 인사이트를 제공합니다.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { icon: <Target size={18} />, label: '타겟 분석' },
                      { icon: <BarChart size={18} />, label: '트렌드 리포트' },
                      { icon: <Layers size={18} />, label: '채널 믹스' },
                      { icon: <Zap size={18} />, label: '전환 최적화' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-zinc-900 font-bold">
                        <div className="text-blue-600">{item.icon}</div>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100">
                  <h4 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-6">Consulting Value</h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-zinc-500 font-medium">월간 트렌드 분석</span>
                      <span className="text-zinc-900 font-black">상담가능</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-zinc-500 font-medium">콘텐츠 기획 회의</span>
                      <span className="text-zinc-900 font-black">상담가능</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-zinc-500 font-medium">성과 데이터 리뷰</span>
                      <span className="text-zinc-900 font-black">상담가능</span>
                    </div>
                    <div className="pt-6 border-t border-zinc-100 flex justify-between items-center">
                      <span className="text-blue-600 font-black">비즈니스/프로 전용</span>
                      <Sparkles className="text-blue-600" size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CTA - High Impact */}
      <section className="py-24 bg-zinc-950 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-12 uppercase">
              Let's Make <br />
              <span className="text-blue-600 italic">Impact.</span>
            </h2>
            <Link 
              to="/consult" 
              className="group inline-flex items-center gap-4 text-2xl md:text-4xl font-black border-b-4 border-white pb-2 hover:text-blue-600 hover:border-blue-600 transition-all"
            >
              START YOUR PROJECT <ArrowRight className="group-hover:translate-x-4 transition-transform" size={40} />
            </Link>
            <p className="mt-12 text-zinc-500 font-bold text-sm uppercase tracking-widest">
              PlaceURL • Professional Short-form Production
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
