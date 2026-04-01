import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Loader2, Video, ArrowRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy, limit, startAfter, where, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../firebase';
import { REFERENCE_CATEGORIES, ReferenceCategory } from '../constants';
import PortfolioCard, { ReferenceItem } from '../components/PortfolioCard';
import { toast } from 'sonner';

function SkeletonCard() {
  return (
    <div className="w-[295px] h-[530px] bg-zinc-50 rounded-2xl border border-zinc-100 animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <div className="w-20 h-6 bg-zinc-200 rounded-full" />
      </div>
    </div>
  );
}

export default function Reference() {
  const [referenceItems, setReferenceItems] = useState<ReferenceItem[]>([]);
  const [filter, setFilter] = useState<ReferenceCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const fetchCount = useRef(0);
  
  const ITEMS_PER_PAGE = window.innerWidth < 768 ? 12 : 16;

  const ADMIN_EMAIL = "sojil.com@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.email === ADMIN_EMAIL);
    });
    return () => unsubscribe();
  }, []);

  const seedSampleData = async () => {
    setIsSeeding(true);
    try {
      const user = auth.currentUser;
      const samples = [
        {
          category: '쇼핑·리뷰',
          linkUrl: 'https://www.youtube.com/shorts/9No-FiE946s',
          thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
          thumbnails: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'
          ],
          createdAt: serverTimestamp(),
          authorUid: user?.uid
        },
        {
          category: '뷰티·패션',
          linkUrl: 'https://www.youtube.com/shorts/9No-FiE946s',
          thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
          thumbnails: [
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop'
          ],
          createdAt: serverTimestamp(),
          authorUid: user?.uid
        },
        {
          category: '푸드·맛집',
          linkUrl: 'https://www.youtube.com/shorts/9No-FiE946s',
          thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
          thumbnails: [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1476224488681-aba35537002a?q=80&w=1000&auto=format&fit=crop'
          ],
          createdAt: serverTimestamp(),
          authorUid: user?.uid
        },
        {
          category: '매장·홍보',
          linkUrl: 'https://www.youtube.com/shorts/9No-FiE946s',
          thumbnail: 'https://images.unsplash.com/photo-1556740734-7f95894513c1?q=80&w=1000&auto=format&fit=crop',
          thumbnails: [
            'https://images.unsplash.com/photo-1556740734-7f95894513c1?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop'
          ],
          createdAt: serverTimestamp(),
          authorUid: user?.uid
        }
      ];

      const batch = writeBatch(db);
      samples.forEach(sample => {
        const newDocRef = doc(collection(db, 'portfolio'));
        batch.set(newDocRef, sample);
      });
      await batch.commit();
      
      toast.success('샘플 데이터가 추가되었습니다.');
      fetchItems(true, filter);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'portfolio');
    } finally {
      setIsSeeding(false);
    }
  };

  const fetchItems = useCallback(async (isFirstLoad = true, currentFilter: ReferenceCategory | 'all' = filter) => {
    const currentFetchId = ++fetchCount.current;
    
    if (isFirstLoad) {
      setLoading(true);
      setError(null);
      setLastVisible(null);
    } else {
      setLoadingMore(true);
    }

    try {
      let constraints: any[] = [orderBy('createdAt', 'desc'), limit(ITEMS_PER_PAGE)];
      
      if (currentFilter !== 'all') {
        constraints.unshift(where('category', '==', currentFilter));
      }
      
      if (!isFirstLoad && lastVisible) {
        constraints.push(startAfter(lastVisible));
      }
      
      const q = query(collection(db, 'portfolio'), ...constraints);
      const querySnapshot = await getDocs(q);

      if (currentFetchId !== fetchCount.current) return;

      const fetchedItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ReferenceItem));

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      if (isFirstLoad) {
        let finalItems = fetchedItems;
        
        // If no items found, add some default placeholders to avoid "empty" look
        if (finalItems.length === 0 && currentFilter === 'all') {
          finalItems = [
            {
              id: 'default-1',
              category: '쇼핑·리뷰',
              linkUrl: 'https://www.youtube.com/shorts/9No-FiE946s',
              thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
              thumbnails: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'],
              title: '쇼핑·리뷰 레퍼런스'
            },
            {
              id: 'default-2',
              category: '뷰티·패션',
              linkUrl: 'https://www.youtube.com/shorts/9No-FiE946s',
              thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
              thumbnails: ['https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop'],
              title: '뷰티·패션 레퍼런스'
            },
            {
              id: 'default-3',
              category: '푸드·맛집',
              linkUrl: 'https://www.youtube.com/shorts/9No-FiE946s',
              thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
              thumbnails: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop'],
              title: '푸드·맛집 레퍼런스'
            },
            {
              id: 'default-4',
              category: '매장·홍보',
              linkUrl: 'https://www.youtube.com/shorts/9No-FiE946s',
              thumbnail: 'https://images.unsplash.com/photo-1556740734-7f95894513c1?q=80&w=1000&auto=format&fit=crop',
              thumbnails: ['https://images.unsplash.com/photo-1556740734-7f95894513c1?q=80&w=1000&auto=format&fit=crop'],
              title: '매장·홍보 레퍼런스'
            }
          ] as any[];
        }

        setReferenceItems(finalItems);
        setLastVisible(lastDoc);
        setHasMore(fetchedItems.length === ITEMS_PER_PAGE);
      } else {
        setReferenceItems(prev => {
          const newItems = [...prev];
          fetchedItems.forEach(item => {
            if (!newItems.find(i => i.id === item.id)) {
              newItems.push(item);
            }
          });
          return newItems;
        });
        setLastVisible(lastDoc);
        setHasMore(fetchedItems.length === ITEMS_PER_PAGE);
      }

      setError(null);
    } catch (err: any) {
      if (currentFetchId === fetchCount.current) {
        handleFirestoreError(err, OperationType.LIST, 'portfolio');
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      }
    } finally {
      if (currentFetchId === fetchCount.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [filter, ITEMS_PER_PAGE, lastVisible]);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchItems(false, filter);
    }
  }, [loading, loadingMore, hasMore, fetchItems, filter]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, loadMore]);

  useEffect(() => {
    fetchItems(true, filter);
  }, [filter]);

  return (
    <section id="reference" className="bg-white min-h-screen">
      {/* --- Immersive Hero Section --- */}
      <div className="bg-[#050505] text-white pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden relative border-b border-white/5">
        {/* Atmospheric Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col items-center text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-8"
            >
              우리는 단순 <span className="text-zinc-600">제작팀이</span> <br className="md:hidden" />
              <span className="text-indigo-500 italic">아닙니다.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-lg md:text-2xl text-zinc-400 font-medium max-w-3xl leading-relaxed"
            >
              <span className="text-white font-bold">조회수·체류시간·전환</span>까지 설계하는 <br className="hidden md:block" />
              숏츠 전문 파트너, <span className="text-indigo-400">PlaceURL</span>입니다.
            </motion.p>
          </div>

          {/* Success Formula Grid - Redesigned for more impact */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Play, 
                  label: "첫 3초 후킹", 
                  desc: "이탈을 막는 강력한 오프닝",
                  color: "from-blue-600 to-indigo-600"
                },
                { 
                  icon: Video, 
                  label: "몰입 유지", 
                  desc: "체류시간을 극대화하는 편집",
                  color: "from-indigo-600 to-purple-600"
                },
                { 
                  icon: ArrowRight, 
                  label: "행동 유도", 
                  desc: "구매와 전환으로 이어지는 설계",
                  color: "from-purple-600 to-pink-600"
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1), duration: 0.6 }}
                  className="group relative"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-[32px] blur opacity-10 group-hover:opacity-40 transition duration-500`} />
                  <div className="relative bg-zinc-950/50 border border-white/5 backdrop-blur-xl p-10 rounded-[32px] h-full flex flex-col items-center text-center group-hover:border-white/20 transition-colors duration-500">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <item.icon size={28} className="text-white" fill={i === 0 ? "currentColor" : "none"} />
                    </div>
                    <h3 className="text-2xl font-black mb-3 tracking-tight">{item.label}</h3>
                    <p className="text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Results Section - Redesigned for more impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 flex flex-col items-center"
          >
            <div className="relative">
              <div className="absolute -inset-8 bg-indigo-600/20 blur-[60px] rounded-full animate-pulse" />
              <h2 className="relative text-3xl md:text-5xl font-black italic tracking-tighter text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-300 to-white">
                  결과로 증명합니다.
                </span>
              </h2>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-indigo-500/50" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-indigo-500/50" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-12">

        {/* Categories Filter */}
        <div className="mb-12 sticky top-24 z-[105] bg-white py-4 -mx-6 px-6 border-y border-zinc-100 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                filter === 'all' ? 'bg-[#0077D6] text-white shadow-lg shadow-blue-100' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
              }`}
            >
              전체
            </button>
            {REFERENCE_CATEGORIES.map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  filter === cat ? 'bg-[#0077D6] text-white shadow-lg shadow-blue-100' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="py-32 text-center">
            <p className="text-red-500 font-bold mb-4">{error}</p>
            <button 
              onClick={() => fetchItems(true, filter)}
              className="px-6 py-2 bg-zinc-950 text-white rounded-full font-bold hover:bg-zinc-800 transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : (loading && referenceItems.length === 0) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-[42px] justify-items-center relative">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-[42px] justify-items-center relative transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              <AnimatePresence>
                {referenceItems.map((item, index) => (
                  <PortfolioCard 
                    key={item.id}
                    item={item}
                    index={index}
                    lastItemRef={index === referenceItems.length - 1 ? lastItemRef : null}
                  />
                ))}
              </AnimatePresence>
            </div>

            {(loadingMore || (loading && referenceItems.length > 0)) && (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-zinc-300" size={32} />
              </div>
            )}

            {referenceItems.length > 0 && (
              <div className="py-20 text-center">
                <p className="text-zinc-400 font-medium text-sm">본 리스트는 자체 제작물 및 시장 트렌드 분석을 위해 큐레이션된 레퍼런스 사례를 포함하고 있습니다</p>
              </div>
            )}

            {!loading && referenceItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                  <Play className="text-zinc-300" size={24} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">등록된 레퍼런스가 없습니다</h3>
                <p className="text-zinc-500 max-w-xs mx-auto mb-8">
                  {filter === 'all' 
                    ? '아직 등록된 포트폴리오가 없습니다. 관리자 페이지에서 새로운 레퍼런스를 추가해주세요.' 
                    : `${filter} 카테고리에 등록된 레퍼런스가 없습니다.`}
                </p>
                {filter !== 'all' ? (
                  <button 
                    onClick={() => setFilter('all')}
                    className="text-sm font-bold text-zinc-900 underline underline-offset-4 hover:text-red-600 transition-colors"
                  >
                    전체 보기로 돌아가기
                  </button>
                ) : (
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => fetchItems(true, filter)}
                      className="text-sm font-bold text-zinc-900 underline underline-offset-4 hover:text-red-600 transition-colors"
                    >
                      새로고침
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={seedSampleData}
                        disabled={isSeeding}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                      >
                        {isSeeding ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                        샘플 데이터로 채우기
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
