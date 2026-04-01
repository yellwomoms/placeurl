import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-4 mt-24">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-3 rounded-full bg-zinc-100 text-zinc-900 disabled:opacity-30 hover:bg-zinc-200 transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex items-center gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-12 h-12 rounded-full font-bold transition-all ${
              currentPage === page 
                ? 'bg-zinc-950 text-white' 
                : 'bg-white text-zinc-500 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-3 rounded-full bg-zinc-100 text-zinc-900 disabled:opacity-30 hover:bg-zinc-200 transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
