import { motion } from 'motion/react';
import { Users, Heart, Globe, Instagram, Youtube, Music2, TrendingUp, Target, Zap, CheckCircle2, MessageSquare, ArrowRight, BarChart3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    title: "인플루언서 마케팅",
    description: "유튜브, 인스타그램, 틱톡 등 각 플랫폼에 최적화된 인플루언서 매칭을 통해 브랜드 인지도를 폭발적으로 상승시킵니다.",
    icon: <Users className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1595039838779-f3780873afdd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    platforms: [
      { name: "YouTube", icon: <Youtube className="w-5 h-5" />, color: "text-red-600", bg: "bg-red-50" },
      { name: "Instagram", icon: <Instagram className="w-5 h-5" />, color: "text-pink-600", bg: "bg-pink-50" },
      { name: "TikTok", icon: <Music2 className="w-5 h-5" />, color: "text-white", bg: "bg-zinc-900" }
    ],
    details: ["제품 리뷰 및 언박싱", "브랜디드 콘텐츠 제작", "공동구매 진행", "숏폼 챌린지 기획"]
  },
  {
    title: "병원 마케팅",
    description: "환자들의 신뢰를 얻을 수 있는 전문적인 콘텐츠로 병원의 가치를 높입니다.",
    icon: <Heart className="w-8 h-8" />,
    image: "https://plus.unsplash.com/premium_photo-1681843129112-f7d11a2f17e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9zcGl0YWx8ZW58MHx8MHx8fDA%3D",
    details: ["전문의 인터뷰 영상", "치료 후기 콘텐츠", "병원 브랜드 블로그 관리", "지역 기반 타겟 광고"]
  },
  {
    title: "왕홍 마케팅",
    description: "중국 시장 진출의 핵심, 영향력 있는 왕홍(중국 인플루언서)을 통해 거대한 중국 시장을 공략합니다.",
    icon: <Globe className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1597552571860-136a103d5eb3?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: ["샤오홍슈/도우인 바이럴", "라이브 커머스 진행", "중국 현지 물류/결제 연동", "K-뷰티/패션 특화 마케팅"]
  }
];

const STATS = [
  { label: "누적 캠페인", value: "1,200+", icon: <BarChart3 className="w-6 h-6" /> },
  { label: "평균 도달률", value: "350%", icon: <TrendingUp className="w-6 h-6" /> },
  { label: "협업 인플루언서", value: "5,000+", icon: <Users className="w-6 h-6" /> },
  { label: "고객 만족도", value: "98%", icon: <Heart className="w-6 h-6" /> }
];

const PLATFORMS = [
  {
    name: "YouTube",
    strategy: "검색 최적화 및 롱테일 노출",
    desc: "정보성 콘텐츠와 브랜디드 영상을 통해 지속적인 유입과 신뢰도를 구축합니다.",
    color: "text-red-600",
    bg: "bg-red-50"
  },
  {
    name: "Instagram",
    strategy: "비주얼 스토리텔링 및 감성 마케팅",
    desc: "트렌디한 릴스와 고퀄리티 이미지를 통해 브랜드 이미지를 강화하고 팬덤을 형성합니다.",
    color: "text-pink-600",
    bg: "bg-pink-50"
  },
  {
    name: "TikTok",
    strategy: "폭발적인 바이럴 및 숏폼 챌린지",
    desc: "MZ세대를 겨냥한 쉽고 재미있는 챌린지를 통해 단기간에 압도적인 노출을 실현합니다.",
    color: "text-zinc-900",
    bg: "bg-zinc-100"
  }
];

const SPECIALIZED_SOLUTIONS = [
  {
    title: "병원 마케팅 특화 솔루션",
    desc: "고객 신뢰도 확보를 최우선으로 합니다.",
    features: [
      "고객 맞춤서비스 지향",
      "전문의 퍼스널 브랜딩",
      "실제 환자 기반 리얼 스토리텔링",
      "지역 타겟팅 정밀 광고 집행"
    ],
    image: "https://plus.unsplash.com/premium_photo-1681843129112-f7d11a2f17e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9zcGl0YWx8ZW58MHx8MHx8fDA%3D"
  },
  {
    title: "왕홍 마케팅 특화 솔루션",
    desc: "중국 시장 진출의 가장 빠르고 확실한 길을 제시합니다.",
    features: [
      "급별 왕홍(Top/Mid/Micro) 매칭",
      "샤오홍슈/도우인 계정 운영 대행",
      "라이브 커머스 실시간 송출",
      "중국 현지 트렌드 분석 리포트"
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop"
  }
];

const WHY_CHOOSE_US = [
  {
    title: "데이터 기반 전략",
    desc: "단순한 감이 아닌, 철저한 시장 분석과 데이터 통계를 바탕으로 성과를 예측하고 실행합니다.",
    icon: <BarChart3 className="w-10 h-10" />
  },
  {
    title: "고퀄리티 콘텐츠",
    desc: "브랜드의 가치를 높이는 감각적인 영상과 디자인으로 소비자의 시선을 단번에 사로잡습니다.",
    icon: <Sparkles className="w-10 h-10" />
  },
  {
    title: "플랫폼 최적화",
    desc: "유튜브, 인스타그램, 틱톡 등 각 플랫폼의 알고리즘을 완벽히 이해하고 최적의 노출을 실현합니다.",
    icon: <Zap className="w-10 h-10" />
  },
  {
    title: "투명한 리포팅",
    desc: "캠페인 진행 과정을 실시간으로 공유하고, 종료 후 상세한 성과 분석 보고서를 제공합니다.",
    icon: <CheckCircle2 className="w-10 h-10" />
  }
];

const FAQS = [
  {
    q: "마케팅 성과는 어떻게 측정하나요?",
    a: "도달률, 참여도(좋아요, 댓글, 공유), 클릭률(CTR), 그리고 최종 전환율까지 상세한 데이터를 분석하여 주간/월간 리포트로 제공해 드립니다."
  },
  {
    q: "인플루언서 섭외 기준은 무엇인가요?",
    a: "단순히 팔로워 수가 많은 인플루언서가 아닌, 브랜드 타겟과 일치하는 오디언스를 보유하고 있으며 실제 소통 지수가 높은 인플루언서를 엄선합니다."
  },
  {
    q: "콘텐츠 제작 기간은 얼마나 걸리나요?",
    a: "캠페인 규모에 따라 다르지만, 보통 기획부터 최종 발행까지 1~2주 정도 소요됩니다. 긴급한 이슈의 경우 숏폼 콘텐츠는 3일 내 제작도 가능합니다."
  },
  {
    q: "병원 SNS마케팅은 왜 중요한가요?",
    a: "병원의 신뢰도를 높이고 환자와의 소통을 강화하며, 신규 환자 유입과 재방문을 유도하는 핵심 마케팅 전략입니다"
  }
];

const CASE_STUDIES = [
  {
    title: "뷰티 브랜드 인플루언서 캠페인",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    result: "도달수 120만 돌파"
  },
  {
    title: "강남 유명 성형외과 브랜딩",
    category: "Medical",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1000&auto=format&fit=crop",
    result: "신규 예약 45% 증가"
  },
  {
    title: "F&B 프랜차이즈 숏폼 챌린지",
    category: "Food",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
    result: "영상 조회수 300만회"
  },
  {
    title: "IT 스타트업 서비스 런칭",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop",
    result: "앱 다운로드 5만건"
  }
];

export default function SNSPromotion() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 opacity-50">
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
            title={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n유튜브영상제작\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
            alt={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n유튜브영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/80 to-zinc-950" />
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold mb-8 shadow-lg shadow-blue-900/20">
                <Sparkles className="w-4 h-4" />
                SNS & Viral Marketing Expert
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white mb-10 leading-[1.05]">
                당신의 브랜드가<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-[length:200%_auto] animate-gradient">
                  세상의 중심이 되는 순간
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 mb-12 font-medium leading-relaxed max-w-3xl mx-auto">
                단순한 노출을 넘어 진정한 팬덤을 만듭니다. <br className="hidden md:block" />
                최신 트렌드와 정밀한 데이터 분석을 결합한 최적의 솔루션을 제안합니다.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/consult" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-full font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 group">
                  무료 상담 신청하기 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#services" className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-full font-black text-lg hover:bg-white/20 transition-all flex items-center justify-center">
                  서비스 둘러보기
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-zinc-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {STATS.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 text-blue-400 mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">{stat.value}</div>
                <div className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Gallery Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-zinc-950 mb-6 tracking-tighter">Success Stories</h2>
              <p className="text-xl text-zinc-500 font-medium max-w-2xl">
                수많은 브랜드들이 이미 성과를 경험하고 있습니다. <br />
                우리의 결과물이 곧 실력입니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CASE_STUDIES.map((study, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-[2rem] bg-zinc-100 aspect-[3/4]"
              >
                <img 
                  src={study.image} 
                  title={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n유튜브영상제작\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                  alt={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n유튜브영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest mb-3">
                    {study.category}
                  </span>
                  <h4 className="text-xl font-black text-white mb-2 leading-tight">{study.title}</h4>
                  <p className="text-blue-400 font-bold text-sm">{study.result}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SNS Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-6xl font-black text-zinc-950 mb-8 tracking-tighter leading-tight">
                  왜 <span className="text-blue-600">SNS 마케팅</span>인가?
                </h2>
                <p className="text-xl text-zinc-500 font-medium mb-12 leading-relaxed">
                  소비자의 80%는 구매 전 SNS를 통해 정보를 확인합니다. <br />
                  강력한 SNS 존재감은 이제 선택이 아닌 필수입니다.
                </p>
                <div className="space-y-6">
                  {[
                    { title: "압도적인 도달률", desc: "알고리즘을 통한 기하급수적인 노출 확산" },
                    { title: "정밀한 타겟팅", desc: "브랜드에 최적화된 잠재 고객층 집중 공략" },
                    { title: "실시간 소통", desc: "고객과의 직접적인 소통을 통한 브랜드 신뢰도 향상" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-zinc-950 mb-1">{item.title}</h4>
                        <p className="text-zinc-500 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            <div className="lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <div className="absolute -inset-4 bg-blue-600/10 rounded-[3rem] blur-2xl" />
                <img 
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2548&auto=format&fit=crop" 
                  title={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n유튜브영상제작\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                  alt={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n유튜브영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                  className="relative rounded-[2.5rem] shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                {/* Floating elements */}
                <div className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-xl border border-zinc-100 hidden md:block animate-bounce-slow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                      <Instagram className="w-6 h-6" />
                    </div>
                    <span className="font-black text-zinc-950">Engagement</span>
                  </div>
                  <div className="text-2xl font-black text-blue-600">+240%</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-zinc-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black text-zinc-950 mb-6 tracking-tighter">Core Services</h2>
              <p className="text-xl text-zinc-500 font-medium max-w-2xl mx-auto">
                각 분야별 전문가들이 브랜드에 최적화된 <br className="hidden md:block" />
                마케팅 솔루션을 제공합니다.
              </p>
            </motion.div>
          </div>

          <div className="space-y-32">
            {SERVICES.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col lg:flex-row items-center gap-16 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="lg:w-1/2">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-blue-600/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl">
                      <img 
                        src={service.image} 
                        title={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n유튜브영상제작\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                        alt={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n유튜브영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
                      <div className="absolute bottom-8 left-8">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-4">
                          {service.icon}
                        </div>
                        <h3 className="text-3xl font-black text-white">{service.title}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6">
                    Service {idx + 1}
                  </div>
                  <h3 className="text-4xl font-black mb-6 tracking-tight text-zinc-950">{service.title}</h3>
                  <p className="text-xl text-zinc-500 leading-relaxed mb-10 font-medium">
                    {service.description}
                  </p>

                  {service.platforms && (
                    <div className="flex flex-wrap gap-3 mb-10">
                      {service.platforms.map((p, i) => (
                        <div key={i} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold ${p.color} ${p.bg} border border-current/10`}>
                          {p.icon}
                          {p.name}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-3 p-5 bg-white rounded-2xl text-zinc-900 font-bold text-sm border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Solutions Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-950 mb-6 tracking-tighter">Specialized Solutions</h2>
            <p className="text-xl text-zinc-500 font-medium">특정 산업군에 최적화된 고도화된 마케팅 전략</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {SPECIALIZED_SOLUTIONS.map((solution, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-[3rem] bg-zinc-900 aspect-[16/10] lg:aspect-auto"
              >
                <img 
                  src={solution.image} 
                  title={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n유튜브영상제작\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                  alt={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n유튜브영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <div className="relative h-full p-10 flex flex-col justify-end">
                  <h3 className="text-3xl font-black text-white mb-4">{solution.title}</h3>
                  <p className="text-zinc-300 font-medium mb-8 max-w-md">{solution.desc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {solution.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/90 text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-950 mb-6 tracking-tighter">Why Choose Us</h2>
            <p className="text-xl text-zinc-500 font-medium text-center">우리가 특별한 이유, 성과로 증명합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_CHOOSE_US.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="text-blue-600 mb-6">{item.icon}</div>
                <h4 className="text-xl font-black text-zinc-950 mb-4">{item.title}</h4>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Strategy Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-950 mb-6 tracking-tighter">Platform Strategy</h2>
            <p className="text-xl text-zinc-500 font-medium">플랫폼별 특성을 고려한 정밀한 마케팅 전략</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {PLATFORMS.map((platform, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-10 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 group ${platform.bg}`}
              >
                <h4 className={`text-2xl font-black mb-4 ${platform.color}`}>{platform.name}</h4>
                <div className="text-lg font-black text-zinc-950 mb-4 leading-tight">{platform.strategy}</div>
                <p className="text-zinc-500 font-medium leading-relaxed">{platform.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-zinc-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">Marketing Process</h2>
            <p className="text-xl text-zinc-500 font-medium">체계적인 단계를 통해 확실한 성과를 보장합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-zinc-200 -translate-y-1/2 z-0" />
            
            {[
              { step: "01", title: "상담 및 분석", desc: "브랜드 아이덴티티와 타겟 고객을 분석합니다.", icon: <MessageSquare className="w-6 h-6" /> },
              { step: "02", title: "전략 수립", desc: "플랫폼별 최적화된 마케팅 믹스를 제안합니다.", icon: <Target className="w-6 h-6" /> },
              { step: "03", title: "콘텐츠 제작", desc: "고퀄리티 영상 및 이미지 콘텐츠를 제작합니다.", icon: <Zap className="w-6 h-6" /> },
              { step: "04", title: "실행 및 보고", desc: "마케팅 실행 후 성과 데이터를 분석하여 보고합니다.", icon: <BarChart3 className="w-6 h-6" /> }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-sm z-10 hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                  {item.icon}
                </div>
                <div className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Step {item.step}</div>
                <h4 className="text-2xl font-black mb-4 text-zinc-950">{item.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-950 mb-6 tracking-tighter">Frequently Asked Questions</h2>
            <p className="text-xl text-zinc-500 font-medium">자주 묻는 질문들을 확인해보세요.</p>
          </div>

          <div className="space-y-6">
            {FAQS.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100"
              >
                <h4 className="text-lg font-black text-zinc-950 mb-4 flex items-center gap-3">
                  <span className="text-blue-600">Q.</span> {faq.q}
                </h4>
                <p className="text-zinc-500 font-medium leading-relaxed pl-8 border-l-2 border-blue-100">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
            title="쇼츠제작&#13릴스제작&#13유튜브숏폼대행&#13AI영상제작&#13홍보영상편집&#13홈페이지제작&#13상세페이지제작&#13전단지배포&#13명함디자인&#13SNS광고대행&#13온라인마케팅&#13옥외광고&#13유튜브영상제작&#13브랜드홍보&#13틱톡영상&#13숏폼마케팅&#13&#13PlaceURL(http://www.placeURL.com)&#13TEL: 010-4429-2078"
            alt="쇼츠제작&#13릴스제작&#13유튜브숏폼대행&#13AI영상제작&#13유튜브영상제작&#13홍보영상편집&#13홈페이지제작&#13상세페이지제작&#13전단지배포&#13명함디자인&#13SNS광고대행&#13온라인마케팅&#13옥외광고&#13브랜드홍보&#13틱톡영상&#13숏폼마케팅&#13&#13PlaceURL(http://www.placeURL.com)&#13TEL: 010-4429-2078"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
              지금 바로 당신의 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">브랜드 가치</span>를 높여보세요
            </h2>
            <p className="text-xl md:text-2xl text-zinc-400 mb-12 font-medium leading-relaxed">
              전문가와의 상담을 통해 귀사에 최적화된 <br className="hidden md:block" />
              마케팅 전략을 무료로 제안받으세요.
            </p>
            <Link to="/consult" className="inline-flex items-center gap-3 bg-blue-600 text-white px-12 py-6 rounded-full font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/20 group">
              무료 상담 신청하기 <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

