import { motion } from 'motion/react';
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Users, BarChart3, MessageSquare, ShieldCheck, MapPin, Zap, Info } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebase';

const CATEGORIES = [
  "전체", "기업", "분양/건설/인테리어", "제품", "공연/전시/행사", 
  "쇼핑", "패션/뷰티", "카페/레스토랑", "프랜차이즈", 
  "레저/스포츠/여행", "포트폴리오/스튜디오", "종합전시회", "학원(교육)/취미"
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

const STATS = [
  { label: "고객 만족도", value: "99%", icon: <Users className="w-5 h-5" /> },
  { label: "누적 상담건", value: "8,700만건", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "누적 고객수", value: "457,715건", icon: <MessageSquare className="w-5 h-5" /> }
];

const REASONS = [
  {
    id: "01",
    title: "배포 후기",
    desc: "작업한 대표 사진들을 전달함으로서 배포 과정을 투명하게 공개합니다.",
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
  { step: "05", title: "배포완료 현황보고", desc: "작업 완료 후 사진 및 결과보고로 마무리 합니다." },
  { step: "06", title: "광고주 확인 및 세금계산서 교부", desc: "최종 결과 확인 후 행정 처리를 마무리합니다." }
];

export default function Production() {
  const location = useLocation();
  const path = location.pathname;
  const isWebsite = path.includes('website');
  const [activeCategory, setActiveCategory] = useState("전체");
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isWebsite) {
      setLoading(false);
      return;
    }

    const fetchTemplates = async () => {
      try {
        const q = query(collection(db, 'website_templates'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedTemplates = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTemplates(fetchedTemplates);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'website_templates');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [isWebsite]);

  const filteredTemplates = activeCategory === "전체" 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      {isWebsite ? (
        <section className="relative pt-40 pb-32 overflow-hidden bg-zinc-950 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent" />
          </div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <span className="inline-block px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                Custom Website Production
              </span>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                당신의 비즈니스를 완성하는<br />
                <span className="text-blue-600 italic">단 하나의 웹사이트.</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 font-medium max-w-3xl mx-auto mb-12">
                기성복 같은 템플릿이 아닌, 당신의 비즈니스를 위한 맞춤 정장 같은 웹사이트를 제작합니다. 
                브랜딩부터 기능까지, 독보적인 가치를 담아냅니다.
              </p>
              <div className="flex flex-wrap justify-center gap-6 mb-16">
                {['독보적 브랜딩', '반응형 최적화', '고성능 아키텍처', 'SEO 마케팅'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 size={18} className="text-blue-600" />
                    <span className="font-bold">{item}</span>
                  </div>
                ))}
              </div>
              <Link 
                to="tel:01044292078"
                className="inline-flex items-center gap-3 bg-white text-zinc-950 px-10 py-5 rounded-full font-black text-lg hover:bg-blue-600 hover:text-white transition-all group"
              >
                무료 상담 신청하기
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      ) : (
        <section className="relative pt-40 pb-32 overflow-hidden bg-zinc-950 text-white">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2000&auto=format&fit=crop" 
              alt="Print Background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/80 to-zinc-950" />
          </div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                <ShieldCheck className="w-4 h-4" />
                Clean Distribution Service
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                불량 배포<br />
                <span className="text-blue-600 italic">이제 걱정하지마세요</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 font-medium max-w-3xl mx-auto mb-12">
                "10년 동안 함께한 믿음과 신뢰, 우리는 전단 배포의 '정직함'을 지켜왔습니다."<br />
                철저한 시스템 관리와 정직한 현장 운영으로 단 한 장의 전단지도 허투루 배포하지 않습니다.
              </p>
              <div className="flex flex-wrap justify-center gap-6 mb-16">
                {['전국 배포 가능', '작업후기 피드백 서비스', '맞춤형 디자인', '정직한 운영'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 size={18} className="text-blue-600" />
                    <span className="font-bold">{item}</span>
                  </div>
                ))}
              </div>
              <Link 
                to="tel:01044292078"
                className="inline-flex items-center gap-3 bg-white text-zinc-950 px-10 py-5 rounded-full font-black text-lg hover:bg-blue-600 hover:text-white transition-all group"
              >
                무료 상담 신청하기
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-6 py-24">
        {isWebsite && loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-zinc-400 animate-spin mb-4" />
            <p className="text-zinc-500 font-medium tracking-tight">최고의 작품을 불러오는 중입니다...</p>
          </div>
        ) : isWebsite ? (
          <>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black tracking-tight mb-4">고객 1:1 맞춤 홈페이지를 제작합니다!</h2>
              <p className="text-zinc-500 max-w-3xl mx-auto">
                고객 니즈를 파악후 최고의 홈페이지로 제작됩니다. 
                기존에 서비스중인 웹사이트를 참고해 주세요. 자신만의 개성 있는 사이트를 만들어보세요!
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-16">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group"
                >
                  <div className="relative aspect-[16/10] bg-zinc-100 rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                    {template.isNew && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-tighter transform -rotate-12 inline-block">
                          NEW
                        </span>
                      </div>
                    )}
                    <img 
                      src={template.image} 
                      alt={template.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/40 transition-all duration-500 flex items-center justify-center">
                      <button className="bg-white text-zinc-950 px-6 py-2.5 rounded-full font-bold text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                        미리보기
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors text-center">
                    {template.title}
                  </h3>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-32">
            {/* Stats Section */}
            <section className="py-12 bg-white rounded-[3rem] border border-zinc-100 shadow-sm">
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
            </section>

            {/* Pricing Table Section */}
            <section>
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black text-zinc-900 mb-6 tracking-tighter uppercase">Pricing Guide</h2>
                <p className="text-xl text-zinc-500 font-medium">합리적인 가격으로 최상의 홍보 효과를 약속합니다.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {PRICING.map((group, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -10 }}
                    className="bg-zinc-50 p-10 rounded-[40px] border border-zinc-100 flex flex-col hover:bg-white hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500"
                  >
                    <div className="mb-8 pb-6 border-b border-zinc-200">
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
                    <div className="mt-10 pt-8 border-t border-zinc-200">
                      <div className="flex items-start gap-3">
                        <Info size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                        <p className="text-[11px] text-zinc-400 font-bold leading-relaxed">
                          디자인 편집량에 따라 3~10만원 추가될 수 있습니다. 
                          배포 비용은 전국 가능하며 사전 협의가 필요합니다.
                        </p>
                      </div>
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
                <Link to="tel:01044292078" className="bg-white text-zinc-900 px-8 py-4 rounded-full font-black hover:bg-zinc-100 transition-all whitespace-nowrap">
                  배포 지역 문의하기
                </Link>
              </div>
            </section>

            {/* 3 Reasons Section */}
            <section>
              <div className="mb-20">
                <h2 className="text-4xl md:text-6xl font-black text-zinc-900 mb-6 tracking-tighter">Why Choose Us</h2>
                <p className="text-xl text-zinc-500 font-medium">클린배포를 선택해야 하는 3가지 이유</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {REASONS.map((reason, idx) => (
                  <div key={idx} className="group">
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-8">
                      <img src={reason.image} alt={reason.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-6 left-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-xl text-zinc-900 shadow-xl">
                        {reason.id}
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900 mb-4">{reason.title}</h3>
                    <p className="text-zinc-500 font-medium leading-relaxed">{reason.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Process Section */}
            <section className="py-24 bg-zinc-950 rounded-[3rem] text-white px-12">
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
            </section>
          </div>
        )}

        <div className="mt-32 text-center">
          <h2 className="text-3xl font-black mb-8">더 자세한 상담이 필요하신가요?</h2>
          <p className="text-zinc-500 mb-12">전문가와 함께 당신의 비즈니스에 최적화된 솔루션을 찾아보세요.</p>
          <Link 
            to="tel:01044292078"
            className="inline-block bg-[#0077D6] text-white px-12 py-5 rounded-full font-black text-lg hover:bg-[#0066B8] transition-all"
          >
            상담 신청하기
          </Link>
        </div>
      </div>
    </div>
  );
}
