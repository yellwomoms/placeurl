import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebase';
import { ALL_CLIENTS } from '../constants/clients';
import PortfolioCard, { ReferenceItem } from '../components/PortfolioCard';

const CLIENT_LOGOS = ALL_CLIENTS;

function FeaturedPortfolio() {
  const [items, setItems] = useState<ReferenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from both collections
        const [portfolioSnap, referencesSnap] = await Promise.all([
          getDocs(query(collection(db, 'portfolio'), limit(40))),
          getDocs(query(collection(db, 'references'), limit(40)))
        ]);
        
        const portfolioItems = portfolioSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ReferenceItem[];
        const referencesItems = referencesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ReferenceItem[];

        // Combine and remove duplicates by ID
        const combinedMap = new Map<string, ReferenceItem>();
        [...portfolioItems, ...referencesItems].forEach(item => {
          if (item.id) combinedMap.set(item.id, item);
        });
        
        let allItems = Array.from(combinedMap.values());

        // Shuffle the items randomly
        for (let i = allItems.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
        }

        if (allItems.length > 0) {
          // Take top 40 items for the showcase
          setItems(allItems.slice(0, 40));
        } else {
          console.log("FeaturedPortfolio: No items found in either collection. Using fallbacks.");
          // Fallback to some sample items if DB is empty
          const defaultVideoId = '9No-FiE946s';
          const defaultThumb = `https://img.youtube.com/vi/${defaultVideoId}/hqdefault.jpg`;
          const fallbackItems = [
            {
              id: 'fallback-1',
              category: '쇼핑·리뷰',
              linkUrl: `https://www.youtube.com/shorts/${defaultVideoId}`,
              thumbnail: defaultThumb,
              thumbnails: [defaultThumb],
              title: '샘플 레퍼런스 01'
            },
            {
              id: 'fallback-2',
              category: '뷰티·패션',
              linkUrl: `https://www.youtube.com/shorts/${defaultVideoId}`,
              thumbnail: defaultThumb,
              thumbnails: [defaultThumb],
              title: '샘플 레퍼런스 02'
            },
            {
              id: 'fallback-3',
              category: '푸드·맛집',
              linkUrl: `https://www.youtube.com/shorts/${defaultVideoId}`,
              thumbnail: defaultThumb,
              thumbnails: [defaultThumb],
              title: '샘플 레퍼런스 03'
            },
            {
              id: 'fallback-4',
              category: '매장·홍보',
              linkUrl: `https://www.youtube.com/shorts/${defaultVideoId}`,
              thumbnail: defaultThumb,
              thumbnails: [defaultThumb],
              title: '샘플 레퍼런스 04'
            }
          ] as any[];
          setItems(fallbackItems);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'portfolio');
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Don't return null if loading, show a placeholder or just wait
  if (loading) return (
    <div className="py-32 flex justify-center">
      <div className="w-8 h-8 border-4 border-zinc-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <section className="py-32 bg-white border-t border-zinc-100 text-center">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-black text-zinc-950 mb-4">Reference Showcase</h2>
        <p className="text-red-500 mb-8">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-zinc-950 text-white rounded-full font-bold hover:bg-zinc-800 transition-all"
        >
          다시 시도
        </button>
      </div>
    </section>
  );
  
  // If items are empty, show a message or placeholder instead of null
  if (items.length === 0 && !loading) return (
    <section className="py-32 bg-white border-t border-zinc-100 text-center">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-black text-zinc-950 mb-4">Reference Showcase</h2>
        <p className="text-zinc-500">등록된 레퍼런스가 없습니다.</p>
      </div>
    </section>
  );

  return (
    <section className="py-48 bg-zinc-50/50 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
          <div className="max-w-2xl">
            <p className="text-brand-cyan font-bold tracking-[0.2em] uppercase text-xs mb-8">Reference Showcase</p>
            <h2 className="text-5xl md:text-7xl font-black text-brand-dark tracking-tightest mb-10 leading-[1.0]">
              스크롤을 멈추게 하는 <br />
              <span className="text-zinc-300">감각적인 숏폼.</span>
            </h2>
            <p className="text-xl text-zinc-500 font-medium leading-relaxed tracking-tight">
              수많은 브랜드가 선택한 검증된 결과물을 확인해보세요. <br className="hidden sm:block" />
              당신의 브랜드도 주인공이 될 수 있습니다.
            </p>
          </div>
          <Link 
            to="/reference" 
            className="group flex items-center gap-6 text-brand-dark font-black text-lg hover:text-brand-cyan transition-all"
          >
            전체 보기
            <div className="w-16 h-16 rounded-full border border-zinc-200 flex items-center justify-center group-hover:border-brand-cyan group-hover:bg-brand-cyan group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-cyan-500/20">
              <ArrowRight className="w-8 h-8" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16 justify-items-center relative">
          {items.map((item, idx) => (
            <PortfolioCard key={item.id} item={item} index={idx} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-zinc-400 text-sm font-medium">
            본 리스트는 자체 제작물 및 시장 트렌드 분석을 위해 큐레이션된 레퍼런스 사례를 포함하고 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  return (
    <>
      {/* --- Hero Section --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-dark">
        <motion.div style={{ scale }} className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2670&auto=format&fit=crop"
            title={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n유튜브영상제작\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
            alt={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n유튜브영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div className="absolute inset-0 bg-brand-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-dark/20 to-brand-dark" />
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <p className="text-brand-cyan font-bold tracking-[0.3em] uppercase text-sm mb-8">Premium Video Production</p>
            <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.9] tracking-tightest mb-12">
              성장을 만드는<br />
              <span className="text-brand-cyan">숏폼의 기준.</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/70 font-medium mb-16 max-w-3xl mx-auto leading-relaxed tracking-tight">
              시간 낭비는 끝내고 성장에만 집중하세요. <br className="hidden md:block" />
              1,000만 뷰 데이터 기반의 기획과 촬영, 편집 전문가 그룹이 함께합니다.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/reference"
                className="w-full sm:w-auto bg-white text-brand-dark px-12 py-5 rounded-full font-black text-lg hover:bg-zinc-100 transition-all flex items-center justify-center gap-3 group shadow-2xl"
              >
                레퍼런스 보기 <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                to="/consult"
                className="w-full sm:w-auto bg-brand-cyan text-white px-12 py-5 rounded-full font-black text-lg hover:bg-brand-cyan/90 hover:scale-105 transition-all flex items-center justify-center shadow-2xl shadow-cyan-500/20"
              >
                상담하기
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-zinc-400 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-black tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-zinc-400 to-transparent" />
        </motion.div>
      </section>

      {/* --- Why Shorts Appeal Section --- */}
      <section className="pt-48 pb-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-[60%] relative"
            >
              <div className="absolute -inset-10 bg-brand-cyan/10 rounded-[60px] -z-10 blur-3xl opacity-30" />
              <img 
                src="https://images.unsplash.com/photo-1724754608903-79368ccef14a?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                title={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n유튜브영상제작\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                alt={`쇼츠제작\n릴스제작\n유튜브숏폼대행\nAI영상제작\n유튜브영상제작\n홍보영상편집\n홈페이지제작\n상세페이지제작\n전단지배포\n명함디자인\nSNS광고대행\n온라인마케팅\n옥외광고\n브랜드홍보\n틱톡영상\n숏폼마케팅\n\nPlaceURL(http://www.placeURL.com)\nTEL: 010-4429-2078`}
                className="w-full rounded-[48px] shadow-2xl shadow-brand-cyan/10 object-cover aspect-video"
                referrerPolicy="no-referrer"
              />
              <p className="mt-6 text-zinc-400 text-xs font-medium text-center lg:text-left">
                본 리스트는 자체 제작물 및 시장 트렌드 분석을 위해 큐레이션된 레퍼런스 사례를 포함하고 있습니다.
              </p>
              <div className="absolute -bottom-12 -right-12 bg-white p-10 rounded-[40px] shadow-2xl border border-zinc-50 hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-3 h-3 rounded-full bg-brand-cyan animate-pulse" />
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Live Performance</span>
                </div>
                <div className="text-5xl font-black text-brand-dark tracking-tightest">+450%</div>
                <div className="text-sm font-bold text-zinc-500 mt-2">Engagement Growth</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-[40%]"
            >
              <p className="text-brand-cyan font-bold tracking-[0.2em] uppercase text-xs mb-8">The Power of Shorts</p>
              <h2 className="text-5xl md:text-6xl font-black text-brand-dark tracking-tightest mb-12 leading-[1.0]">
                지금 당신의 브랜드가 <br />
                <span className="text-zinc-300">숏츠를 해야만 하는 이유</span>
              </h2>
              <div className="space-y-8">
                {[
                  {
                    title: "압도적인 시청 시간",
                    desc: "평균 시청 시간 60분 이상, 숏폼은 이제 가장 강력한 미디어 플랫폼입니다."
                  },
                  {
                    title: "폭발적인 알고리즘 노출",
                    desc: "구독자 수와 상관없이 콘텐츠의 힘만으로 수백만 명에게 도달할 수 있습니다."
                  },
                  {
                    title: "높은 구매 전환율",
                    desc: "짧고 강렬한 메시지는 시청자의 즉각적인 행동과 구매를 유도합니다."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0077D6] font-black">
                      0{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-zinc-950 mb-2">{item.title}</h4>
                      <p className="text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Featured Portfolio Section --- */}
      <FeaturedPortfolio />

      {/* --- Why Shorts Section --- */}
      <section className="py-32 bg-zinc-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#0077D6] font-black tracking-widest uppercase text-sm mb-6"
            >
              Why Shorts?
            </motion.h3>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tighter mb-8"
            >
              왜 숏츠를 <span className="text-zinc-500">만들어야 할까?</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-zinc-400 max-w-2xl mx-auto font-medium"
            >
              숏폼은 이제 선택이 아닌 필수입니다. <br />
              압도적인 도달률과 빠른 성장의 기회를 놓치지 마세요.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "압도적인 도달률",
                desc: "60초 이내의 짧고 강렬한 영상으로 시청자의 시선을 즉각적으로 사로잡습니다.",
                icon: "🚀"
              },
              {
                title: "빠른 성장 기회",
                desc: "유튜브 알고리즘이 신규 브랜드에게도 공평하고 강력한 노출 기회를 제공합니다.",
                icon: "📈"
              },
              {
                title: "높은 전환율",
                desc: "핵심만 담은 메시지로 브랜드 인지도를 높이고 실제 구매와 행동을 유도합니다.",
                icon: "🎯"
              },
              {
                title: "스마트폰으로 충분",
                desc: "거창한 장비 없이도 아이디어와 기획력만 있다면 고품질 콘텐츠 제작이 가능합니다.",
                icon: "📱"
              },
              {
                title: "바이럴 최적화",
                desc: "공유하기 쉬운 포맷으로 유튜브, 틱톡, 인스타그램 어디서든 빠르게 확산됩니다.",
                icon: "🔥"
              },
              {
                title: "친근한 소통",
                desc: "정형화된 광고보다 더 가깝고 진정성 있는 방식으로 고객과 연결됩니다.",
                icon: "🤝"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800 hover:border-[#0077D6] transition-all group"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-black mb-4">{feature.title}</h4>
                <p className="text-zinc-400 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 p-12 bg-[#0077D6] rounded-[40px] flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h3 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                지금 바로 숏폼 마케팅을 <br /> 시작해야 하는 이유
              </h3>
              <p className="text-blue-100 text-lg font-medium leading-relaxed">
                유튜브 쇼츠는 매일 500억 회 이상의 조회수를 기록하고 있습니다. 
                이 거대한 트래픽의 주인공이 되어보세요. PlaceURL이 함께합니다.
              </p>
            </div>
            <Link 
              to="/consult"
              className="bg-white text-[#0077D6] px-12 py-6 rounded-full font-black text-xl hover:bg-zinc-100 transition-all shadow-2xl whitespace-nowrap"
            >
              무료 상담 신청하기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
