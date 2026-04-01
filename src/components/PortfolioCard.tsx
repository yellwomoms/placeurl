import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReferenceCategory } from '../constants';

export interface ReferenceItem {
  id: string;
  title?: string;
  category: ReferenceCategory;
  thumbnail: string;
  thumbnails?: string[];
  linkUrl: string;
  createdAt: any;
  authorUid: string;
}

interface PortfolioCardProps {
  key?: string | number;
  item: ReferenceItem;
  index: number;
  lastItemRef?: any;
}

export default function PortfolioCard({ item, index, lastItemRef }: PortfolioCardProps) {
  const [currentThumbIdx, setCurrentThumbIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [currentImgUrl, setCurrentImgUrl] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const allThumbs = item.thumbnails && item.thumbnails.length > 0 ? item.thumbnails : [item.thumbnail];

  useEffect(() => {
    if (allThumbs[currentThumbIdx]) {
      setCurrentImgUrl(allThumbs[currentThumbIdx]);
      setImgError(false);
    }
  }, [currentThumbIdx, allThumbs]);

  const handleImageError = () => {
    if (currentImgUrl.includes('maxresdefault.jpg')) {
      // Try hqdefault as fallback if maxresdefault fails
      const fallback = currentImgUrl.replace('maxresdefault.jpg', 'hqdefault.jpg');
      setCurrentImgUrl(fallback);
      setImgError(false);
    } else if (currentImgUrl.includes('hqdefault.jpg')) {
      // Try mqdefault as second fallback
      const fallback = currentImgUrl.replace('hqdefault.jpg', 'mqdefault.jpg');
      setCurrentImgUrl(fallback);
      setImgError(false);
    } else {
      setImgError(true);
    }
  };

  useEffect(() => {
    if (isHovered && allThumbs.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentThumbIdx((prev) => (prev + 1) % allThumbs.length);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentThumbIdx(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, allThumbs.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: (index % 8) * 0.05 }}
      ref={lastItemRef}
      onClick={() => window.open(item.linkUrl, '_blank')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer relative bg-white rounded-[40px] overflow-hidden border border-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-500"
      style={{ width: '295px', height: '530px' }}
    >
      <div className="w-full h-full relative bg-zinc-50 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentImgUrl && !imgError ? (
            <motion.img 
              key={currentImgUrl}
              src={currentImgUrl} 
              alt="Reference Item" 
              loading="lazy"
              onError={handleImageError}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 text-zinc-400">
              <Play size={32} className="opacity-20 mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Preview</span>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center bg-brand-dark/20 backdrop-blur-[2px]">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 shadow-2xl">
          <Play className="fill-brand-dark ml-1 text-brand-dark" size={24} />
        </div>
      </div>

      <div className="absolute top-6 left-6 flex flex-col gap-3">
        <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-brand-cyan text-white w-fit shadow-lg shadow-cyan-500/20">
          {item.category}
        </span>
        {allThumbs.length > 1 && isHovered && (
          <div className="flex gap-1.5">
            {allThumbs.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-500 ${i === currentThumbIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
