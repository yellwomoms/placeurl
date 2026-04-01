import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../firebase';
import PortfolioCard, { ReferenceItem } from '../../components/PortfolioCard';

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

export default function ShortsReference() {
  const [referenceItems, setReferenceItems] = useState<ReferenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const fetchCount = useRef(0);
  
  const ITEMS_PER_PAGE = window.innerWidth < 768 ? 12 : 16;

  const fetchItems = useCallback(async (isMore = false) => {
    const currentFetchId = ++fetchCount.current;

    if (isMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setReferenceItems([]);
      setLastVisible(null);
      setError(null);
    }

    try {
      let constraints: any[] = [orderBy('createdAt', 'desc'), limit(ITEMS_PER_PAGE)];
      
      if (isMore && lastVisible) {
        constraints.push(startAfter(lastVisible));
      }
      
      const q = query(collection(db, 'portfolio'), ...constraints);
      const querySnapshot = await getDocs(q);

      // If a newer fetch has started, ignore this one
      if (currentFetchId !== fetchCount.current) return;

      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ReferenceItem));

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      if (isMore) {
        setReferenceItems(prev => [...prev, ...items]);
      } else {
        let finalItems = items;
        if (finalItems.length === 0) {
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
      }

      setLastVisible(lastDoc);
      setHasMore(items.length === ITEMS_PER_PAGE);
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
  }, [ITEMS_PER_PAGE, lastVisible]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchItems(true);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, fetchItems]);

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <section className="bg-white min-h-screen">
      {/* --- Immersive Hero Section --- */}
      <div className="bg-[#050505] text-white pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden relative border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col items-center text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-8"
            >
              Shorts <span className="text-blue-600">Reference.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-400 font-medium max-w-2xl leading-relaxed"
            >
              우리는 단순한 영상을 만들지 않습니다. 브랜드의 철학을 담아 매출로 이어지는 <br className="hidden md:block" />
              <span className="text-white font-bold">강력한 비주얼 커뮤니케이션</span>을 설계합니다.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-12">

        {error ? (
          <div className="py-32 text-center">
            <p className="text-red-500 font-bold mb-4">{error}</p>
            <button 
              onClick={() => fetchItems()}
              className="px-6 py-2 bg-zinc-950 text-white rounded-full font-bold hover:bg-zinc-800 transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-[42px] justify-items-center relative">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-[42px] justify-items-center">
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

            {loadingMore && (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-zinc-300" size={32} />
              </div>
            )}

            {!hasMore && referenceItems.length > 0 && (
              <div className="py-20 text-center">
                <p className="text-zinc-400 font-medium text-sm">본 리스트는 자체 제작물 및 시장 트렌드 분석을 위해 큐레이션된 레퍼런스 사례를 포함하고 있습니다</p>
              </div>
            )}

            {!loading && referenceItems.length === 0 && (
              <div className="py-32 text-center">
                <p className="text-zinc-400 font-bold mb-4">레퍼런스가 없습니다.</p>
                <button 
                  onClick={() => fetchItems()}
                  className="text-sm text-blue-600 font-bold hover:underline"
                >
                  새로고침
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
