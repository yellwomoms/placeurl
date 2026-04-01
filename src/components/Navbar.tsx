import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Play, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { id: 'shorts_main', label: '숏폼제작', path: '/shorts' },
  { 
    id: 'production', 
    label: '제작', 
    path: '#',
    subItems: [
      { label: '홈페이지제작', path: '/production/website' },
      { label: 'SNS홍보', path: '/sns' },
      { label: '인쇄물제작', path: '/production/print' },
    ]
  },
  { 
    id: 'reference', 
    label: 'Reference', 
    path: '/reference'
  },
  { id: 'price', label: 'Price', path: '/price' },
  { id: 'consult', label: '상담하기', path: '/consult', isButton: true }
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isWhitePage = location.pathname !== '/';
  const navClass = scrolled 
    ? "fixed top-0 left-0 right-0 z-[110] glass-nav py-3" 
    : `fixed top-0 left-0 right-0 z-[110] py-6 transition-all duration-500 ${isWhitePage ? 'bg-white/0 text-brand-dark' : 'bg-transparent text-white'}`;

  const logoColor = scrolled || isWhitePage ? "text-brand-dark" : "text-white";
  const linkColor = scrolled || isWhitePage ? "text-zinc-600 hover:text-brand-cyan" : "text-white/80 hover:text-white";

  return (
    <>
      <nav className={navClass}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 group cursor-pointer">
            <span className={`text-2xl font-black tracking-tightest transition-colors duration-300 ${logoColor}`}>
              Place<span className="text-brand-cyan">URL</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            {NAV_ITEMS.map(item => (
              <div key={item.id} className="relative group/item">
                {item.isButton ? (
                  <Link 
                    to={item.path}
                    className="px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 bg-brand-blue text-white hover:bg-brand-blue/90"
                  >
                    {item.label}
                  </Link>
                ) : item.subItems ? (
                  <div className="relative">
                    <button 
                      className={`text-sm font-semibold tracking-tight transition-colors flex items-center gap-1.5 ${linkColor}`}
                    >
                      {item.label}
                      <ChevronDown size={14} className="group-hover/item:rotate-180 transition-transform" />
                    </button>
                    
                    {/* Submenu */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300">
                      <div className="bg-white rounded-2xl shadow-2xl border border-zinc-100 py-3 min-w-[180px] overflow-hidden">
                        {item.subItems.map(sub => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className="block px-6 py-2.5 text-sm font-semibold text-zinc-600 hover:text-brand-cyan hover:bg-zinc-50 transition-all"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link 
                    to={item.path} 
                    className={`text-sm font-semibold tracking-tight transition-colors flex items-center gap-1.5 ${linkColor}`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button className={`lg:hidden p-2 ${logoColor}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-white pt-32 px-8 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map(item => (
                <div key={item.id} className="flex flex-col">
                  {item.isButton ? (
                    <Link 
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-[#0077D6] text-white w-full py-6 rounded-2xl text-xl font-bold mt-8 text-center shadow-lg shadow-blue-100 hover:bg-[#0066B8] transition-all"
                    >
                      {item.label}
                    </Link>
                  ) : item.subItems ? (
                    <div className="flex flex-col">
                      <button 
                        onClick={() => setActiveSubMenu(activeSubMenu === item.id ? null : item.id)}
                        className="text-4xl font-black tracking-tighter border-b border-zinc-100 py-4 flex items-center justify-between text-zinc-950"
                      >
                        {item.label}
                        <ChevronDown className={`transition-transform duration-300 ${activeSubMenu === item.id ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {activeSubMenu === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-zinc-50 rounded-2xl"
                          >
                            {item.subItems.map(sub => (
                              <Link
                                key={sub.path}
                                to={sub.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-8 py-4 text-xl font-bold text-zinc-600 border-b border-white last:border-0"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link 
                      to={item.path} 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-4xl font-black tracking-tighter border-b border-zinc-100 py-4 flex items-center justify-between text-zinc-950"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
