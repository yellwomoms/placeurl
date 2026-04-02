import { motion } from 'motion/react';
import { CheckCircle2, Users, BarChart3, MessageSquare, ArrowRight, ShieldCheck, Zap, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATS = [
  { label: "고객 만족도", value: "99%", icon: <Users className="w-5 h-5" /> },
  { label: "누적 상담건", value: "8,700만", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "누적 고객수", value: "457,715건", icon: <MessageSquare className="w-5 h-5" /> }
];

const REASONS = [
  {
    id: "01",
    title: "대표 배포 사진 전달",
    desc: "전국 어디든지 대기업부터 소상공인 홍보를 위해 최선을 다합니다.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "02",
    title: "다양한 관리 시스템",
    desc: "배포 끝? 아니죠. 무료 맞춤 컨설팅부터 사업 성장 방향을 함께 고민해드립니다.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "전단배포/디자인 문의",
    desc: "지금 바로 문의하세요! 맞춤형 디자인 기획부터 홍보력을 높이는 배포 전략까지 무료로 지원합니다.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop"
  }
];

const PROCESS = [
  { step: "01", title: "작업 및 종류 문의", desc: "고객님의 니즈에 맞는 인쇄물 종류와 배포 지역을 상담합니다." },
  { step: "02", title: "계약 후 홍보물 인수 및 결제", desc: "디자인 확정 및 인쇄물 제작 후 결제를 진행합니다." },
  { step: "03", title: "전단지 인수 후 배포지역 분석", desc: "타겟 고객이 밀집된 최적의 배포 경로를 설계합니다." },
  { step: "04", title: "작업 진행", desc: "전문 배포팀이 현장에 투입되어 꼼꼼하게 배포를 시작합니다." },
  { step: "05", title: "배포완료 현황보고", desc: "작업 완료 후 대표사진들 전달해드립니다." },
  { step: "06", title: "광고주 확인 및 세금계산서 교부", desc: "최종 결과 확인 후 행정 처리를 마무리합니다." }
];

const PRICING = [
  {
    category: "일반 명함",
    unit: "500장 단위",
    items: [
      { label: "단면 인쇄", price: "40,000원" },
      { label: "양면 인쇄", price: "60,000원" }
    ]
  },
  {
    category: "전단 제작 (A4)",
    unit: "4,000장 기준",
    items: [
      { label: "단면 인쇄", price: "150,000원" },
      { label: "양면 인쇄", price: "230,000원" }
    ]
  },
  {
    category: "전단 제작 (16절/A5)",
    unit: "8,000장 기준",
    items: [
      { label: "단면 인쇄", price: "180,000원" },
      { label: "양면 인쇄", price: "270,000원" }
    ]
  }
];

export default function OutdoorAds() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Editorial Style */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-[#F5F5F0]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-full text-xs font-bold mb-8 tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4" />
              Clean Distribution Service
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-zinc-900 mb-8 tracking-tighter leading-[0.95]">
              불량 배포<br />
              <span className="text-zinc-400 italic">이제 걱정하지마세요</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-600 font-medium max-w-3xl mx-auto leading-relaxed">
              "십여년 동안 함께한 믿음과 신뢰, 우리는 전단 배포의 '정직함'을 지켜왔습니다."<br />
              철저한 시스템 관리와 정직한 현장 운영으로 단 한 장의 전단지도 허투루 배포하지 않습니다.
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="relative rounded-[2.5rem] overflow-hidden aspect-[21/9] shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2000&auto=format&fit=crop" 
              title={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n유튜브영상제작\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
              alt={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n유튜브영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row items-end justify-between gap-8">
              <div className="text-white">
                <p className="text-sm font-bold tracking-widest uppercase opacity-80 mb-2">Our Mission</p>
                <h2 className="text-3xl font-black">당신의 브랜드, 깨끗하게 전해드리겠습니다.</h2>
              </div>
              <Link to="/consult" className="bg-white text-zinc-900 px-8 py-4 rounded-full font-black flex items-center gap-2 hover:bg-zinc-100 transition-all">
                상담 신청하기 <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {STATS.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mb-4 text-zinc-900">
                  {stat.icon}
                </div>
                <div className="text-5xl font-black text-zinc-900 mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-zinc-900 mb-6 tracking-tighter uppercase">Pricing Guide</h2>
            <p className="text-xl text-zinc-500 font-medium">합리적인 가격으로 최상의 홍보 효과를 약속합니다.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {PRICING.map((group, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[40px] border border-zinc-100 flex flex-col hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500"
              >
                <div className="mb-8 pb-6 border-b border-zinc-100">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">{group.unit}</span>
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tight">{group.category}</h3>
                </div>
                <div className="space-y-6 flex-grow">
                  {group.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-zinc-500 font-bold text-sm">{item.label}</span>
                      <span className="text-xl font-black text-zinc-900 tracking-tighter">{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-10 pt-8 border-t border-zinc-100">
                  <p className="text-[11px] text-zinc-400 font-bold leading-relaxed">
                    * 디자인 편집량에 따라 3~10만원 추가될 수 있습니다.<br />
                    * 배포는 전국 가능하며, 지역별 사전 협의가 필요합니다.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-zinc-900 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold">전국 어디든 배포 가능합니다</h4>
                <p className="text-zinc-400">지역별 맞춤 전략으로 타겟 고객에게 직접 다가갑니다.</p>
              </div>
            </div>
            <Link to="/consult" className="bg-white text-zinc-900 px-8 py-4 rounded-full font-black hover:bg-zinc-100 transition-all whitespace-nowrap">
              배포 지역 문의하기
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Reasons Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-zinc-900 mb-6 tracking-tighter">Why Choose Us</h2>
            <p className="text-xl text-zinc-500 font-medium">찌라시를 선택해야 하는 3가지 이유</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {REASONS.map((reason, idx) => (
              <div key={idx} className="group">
                <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-8">
                  <img 
                    src={reason.image} 
                    title={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n유튜브영상제작\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                    alt={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n유튜브영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-6 left-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-xl text-zinc-900 shadow-xl">
                    {reason.id}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-4">{reason.title}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Distribution Process</h2>
            <p className="text-xl text-zinc-400 font-medium">체계적인 시스템으로 성공적인 홍보를 지원합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {PROCESS.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-xs font-black text-zinc-500 mb-4 tracking-widest uppercase">Step {item.step}</div>
                <h4 className="text-xl font-bold mb-4">{item.title}</h4>
                <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
                {idx < PROCESS.length - 1 && (
                  <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 text-zinc-800">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600 rounded-full blur-[100px]" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                지금 바로<br />
                <span className="text-zinc-500">홍보를 시작하세요</span>
              </h2>
              <p className="text-xl text-zinc-400 mb-12 font-medium">
                전문가의 컨설팅으로 귀사의 비즈니스 성장을 돕겠습니다.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/consult" className="w-full sm:w-auto bg-white text-zinc-900 px-10 py-5 rounded-full font-black text-lg hover:bg-zinc-100 transition-all">
                  무료 상담 신청
                </Link>
                <a href="tel:010-4429-2078" className="w-full sm:w-auto bg-white/10 text-white border border-white/20 px-10 py-5 rounded-full font-black text-lg hover:bg-white/20 transition-all">
                  전화 문의하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
