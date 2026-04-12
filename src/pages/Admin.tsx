import { useState, FormEvent, useEffect, useRef, ChangeEvent, useMemo } from 'react';
import { Plus, Youtube, Lock, Unlock, LogOut, Loader2, Trash2, Edit2, X, Link as LinkIcon, Image as ImageIcon, Upload, Sparkles, Users, ClipboardList, Calendar, DollarSign, MessageSquare, CheckCircle2, Clock, Mail, Phone, Search, ChevronLeft, ChevronRight, User, Download, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { toast } from 'sonner';

import * as XLSX from 'xlsx';
import { REFERENCE_CATEGORIES, ReferenceCategory } from '../constants';

interface ReferenceItem {
  id: string;
  title?: string;
  category: ReferenceCategory;
  thumbnail: string;
  thumbnails?: string[];
  linkUrl: string;
  createdAt: string;
  authorUid: string;
  collection?: string;
}

const ADMIN_EMAIL = 'sojil.com@gmail.com';

export default function Admin() {
  const [portfolioItems, setPortfolioItems] = useState<(ReferenceItem & { collection: string })[]>([]);
  const [referencesItems, setReferencesItems] = useState<(ReferenceItem & { collection: string })[]>([]);
  const [websiteItems, setWebsiteItems] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [activeTab, setActiveTab] = useState<'references' | 'website' | 'consultations' | 'freelancers' | 'orders'>('references');
  
  // Form State
  const [category, setCategory] = useState<ReferenceCategory>(REFERENCE_CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Thumbnail Generation State
  const [isAutoThumb, setIsAutoThumb] = useState(false);
  const [ytThumbnails, setYtThumbnails] = useState<string[]>([]);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  
  // Freelancer Form
  const [fName, setFName] = useState('');
  const [fEmail, setFEmail] = useState('');
  const [fPhone, setFPhone] = useState('');
  const [fType, setFType] = useState<'individual' | 'business'>('individual');
  const [fExperience, setFExperience] = useState('');
  const [fPortfolio, setFPortfolio] = useState('');
  const [fStatus, setFStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [fIdCardUrl, setFIdCardUrl] = useState('');
  const [fBusinessRegUrl, setFBusinessRegUrl] = useState('');
  const [fBankAccount, setFBankAccount] = useState('');
  const [selectedFreelancer, setSelectedFreelancer] = useState<any | null>(null);
  const [fLogContent, setFLogContent] = useState('');

  // Order Form
  const [selectedConsultationId, setSelectedConsultationId] = useState('');
  const [selectedFreelancerId, setSelectedFreelancerId] = useState('');
  const [fPrice, setFPrice] = useState<number>(0);
  const [cPrice, setCPrice] = useState<number>(0);
  const [deadline, setDeadline] = useState('');
  const [consultationNotes, setConsultationNotes] = useState('');
  const [orderStatus, setOrderStatus] = useState<string>('pending_approval');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full');
  const [depositAmount, setDepositAmount] = useState<number>(0);

  // Order Date Filtering
  const [orderDateRange, setOrderDateRange] = useState<'all' | 'monthly' | 'quarterly' | 'half' | 'yearly'>('all');
  const [orderYear, setOrderYear] = useState(new Date().getFullYear());
  const [orderMonth, setOrderMonth] = useState(new Date().getMonth() + 1);
  const [orderQuarter, setOrderQuarter] = useState(Math.floor(new Date().getMonth() / 3) + 1);
  const [orderHalf, setOrderHalf] = useState(new Date().getMonth() < 6 ? 1 : 2);

  // Sorting
  const [orderSortBy, setOrderSortBy] = useState<'createdAt' | 'deadline'>('createdAt');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('total');
  const [showAwaitingBalanceOnly, setShowAwaitingBalanceOnly] = useState(false);
  const [consultationFilterStatus, setConsultationFilterStatus] = useState<string>('all');
  const [selectedConsultation, setSelectedConsultation] = useState<any | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [logContent, setLogContent] = useState('');

  const formatDate = (date: any) => {
    if (!date) return '-';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      if (isNaN(d.getTime())) return '-';
      return d.toLocaleDateString();
    } catch (e) {
      return '-';
    }
  };

  const formatDateTime = (date: any) => {
    if (!date) return '-';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      if (isNaN(d.getTime())) return '-';
      return d.toLocaleString();
    } catch (e) {
      return '-';
    }
  };

  const getTime = (date: any) => {
    if (!date) return 0;
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return isNaN(d.getTime()) ? 0 : d.getTime();
    } catch (e) {
      return 0;
    }
  };

  const downloadOrdersExcel = () => {
    const data = filteredOrders.map(o => {
      const freelancer = freelancers.find(f => f.id === o.freelancerId);
      const clientPriceNet = o.clientPrice / 1.1;
      const cardFee = o.clientPrice * 0.035;
      const freelancerCost = o.freelancerPrice;
      const profit = clientPriceNet - freelancerCost - cardFee;
      const profitMargin = clientPriceNet > 0 ? (profit / clientPriceNet) * 100 : 0;
      const expectedPayment = freelancer?.type === 'business' 
        ? o.freelancerPrice * 1.1 
        : o.freelancerPrice * 0.967;
      
      return {
        '상태': getOrderStatusLabel(o.status),
        '등록일': o.createdAt ? new Date(o.createdAt).toLocaleString() : '',
        '마감일': o.deadline ? new Date(o.deadline).toLocaleDateString() : '',
        '고객명': o.clientName,
        '프리랜서': freelancer?.name || 'Unknown',
        '프리랜서 유형': freelancer?.type === 'business' ? '사업자' : '개인',
        '결제방식': o.paymentMethod === 'cash' ? '현금' : '카드',
        '결제구분': o.paymentType === 'deposit' ? '계약금' : '완불',
        '계약금': o.depositAmount || 0,
        '잔금': o.balanceAmount || 0,
        '고객 결제금액': o.clientPrice,
        '프리랜서 오더금액': o.freelancerPrice,
        '입금예정금액': Math.round(expectedPayment),
        '예상 수익': Math.round(profit),
        '이익률': profitMargin.toFixed(1) + '%'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, `orders_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Mock Email Service
  const sendEmailToFreelancer = async (orderData: any, freelancer: any) => {
    console.log('--- MOCK EMAIL SENT ---');
    console.log(`To: ${freelancer.email} (${freelancer.name})`);
    console.log('Subject: [PlaceURL] 새로운 작업 의뢰가 도착했습니다.');
    console.log('Body:');
    console.log(`안녕하세요 ${freelancer.name}님, 새로운 작업 의뢰가 배정되었습니다.`);
    console.log(`고객명: ${orderData.clientName}`);
    console.log(`마감일: ${orderData.deadline ? new Date(orderData.deadline).toLocaleDateString() : '-'}`);
    console.log(`의뢰 금액: ₩${orderData.freelancerPrice.toLocaleString()}`);
    console.log('\n[작업 내용]');
    console.log(orderData.workContent);
    console.log('-----------------------');
    
    // In a real app, you would use a service like SendGrid, Resend, or a backend API
    toast.info(`${freelancer.name}님께 작업 의뢰 메일이 발송되었습니다. (시뮬레이션)`);
  };

  const freelancerOrderCount = useMemo(() => {
    const counts: { [id: string]: number } = {};
    orders.forEach(o => {
      if (o.status === 'in_progress' || o.status === 'pending_approval') {
        counts[o.freelancerId] = (counts[o.freelancerId] || 0) + 1;
      }
    });
    return counts;
  }, [orders]);

  const handleAddLog = async (e: any, consultationId: string) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    
    if (!logContent.trim()) return;

    try {
      const consultation = consultations.find(c => c.id === consultationId);
      const currentLogs = consultation?.consultationLogs || [];
      
      const newLogEntry = {
        date: new Date().toISOString(),
        content: logContent.trim()
      };
      
      const updatedLogs = [...currentLogs, newLogEntry];

      const consultationRef = doc(db, 'consultations', consultationId);
      await updateDoc(consultationRef, { consultationLogs: updatedLogs });

      // Update local state for immediate feedback
      if (selectedConsultation?.id === consultationId) {
        setSelectedConsultation(prev => prev ? { ...prev, consultationLogs: updatedLogs } : null);
      }

      setLogContent('');
      toast.success('상담 기록이 추가되었습니다.');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `consultations/${consultationId}`);
    }
  };

  // Pagination State
  const [consultationPage, setConsultationPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [freelancerPage, setFreelancerPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const [searchConsultation, setSearchConsultation] = useState('');
  const [searchFreelancer, setSearchFreelancer] = useState('');
  const [freelancerFilterStatus, setFreelancerFilterStatus] = useState('all');
  const [searchOrder, setSearchOrder] = useState('');

  // Reset pages when filters change
  useEffect(() => { setConsultationPage(1); }, [searchConsultation, consultationFilterStatus]);
  useEffect(() => { setOrderPage(1); }, [searchOrder, orderFilterStatus, orderSortBy, showAwaitingBalanceOnly]);
  useEffect(() => { setFreelancerPage(1); }, [searchFreelancer]);
  useEffect(() => { setSelectedIds([]); }, [activeTab]);

  const filteredConsultations = useMemo(() => {
    let filtered = consultations;

    if (consultationFilterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === consultationFilterStatus);
    }

    if (searchConsultation) {
      const term = searchConsultation.toLowerCase();
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(term) ||
        c.phone?.includes(term)
      );
    }

    return filtered;
  }, [consultations, searchConsultation, consultationFilterStatus]);

  const handleAddFreelancerLog = async (e: any, freelancerId: string) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    
    if (!fLogContent.trim()) return;

    try {
      const freelancer = freelancers.find(f => f.id === freelancerId);
      const currentLogs = freelancer?.consultationLogs || [];
      
      const newLogEntry = {
        date: new Date().toISOString(),
        content: fLogContent.trim()
      };
      
      const updatedLogs = [...currentLogs, newLogEntry];

      const freelancerRef = doc(db, 'freelancers', freelancerId);
      await updateDoc(freelancerRef, { consultationLogs: updatedLogs });

      if (selectedFreelancer?.id === freelancerId) {
        setSelectedFreelancer(prev => prev ? { ...prev, consultationLogs: updatedLogs } : null);
      }

      setFLogContent('');
      toast.success('상담 내역이 추가되었습니다.');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `freelancers/${freelancerId}`);
    }
  };

  const handleUploadFreelancerDoc = async (freelancerId: string, type: 'id_card' | 'business_reg' | 'bank_account', file: File) => {
    toast.info('파일 업로드 기능은 Firebase Storage 설정이 필요합니다.');
    // In a real app with Firebase Storage:
    // const storageRef = ref(storage, `admin_uploads/${freelancerId}_${type}_${Date.now()}`);
    // await uploadBytes(storageRef, file);
    // const publicUrl = await getDownloadURL(storageRef);
    // ... update Firestore
  };

  const filteredFreelancers = useMemo(() => {
    let filtered = freelancers;
    
    if (freelancerFilterStatus !== 'all') {
      filtered = filtered.filter(f => f.status === freelancerFilterStatus);
    }

    if (searchFreelancer) {
      const term = searchFreelancer.toLowerCase();
      filtered = filtered.filter(f => 
        f.name?.toLowerCase().includes(term) ||
        f.phone?.includes(term) ||
        f.email?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [freelancers, searchFreelancer, freelancerFilterStatus]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    
    if (showAwaitingBalanceOnly) {
      filtered = filtered.filter(o => (o.status === 'in_progress' || o.status === 'confirming') && o.paymentType === 'deposit');
    } else {
      if (orderFilterStatus !== 'total') {
        // Specific status filter
        filtered = filtered.filter(o => o.status === orderFilterStatus);
      }
    }

    if (searchOrder) {
      const term = searchOrder.toLowerCase();
      filtered = filtered.filter(o => {
        const freelancer = freelancers.find(f => f.id === o.freelancerId);
        return o.clientName?.toLowerCase().includes(term) ||
               freelancer?.name?.toLowerCase().includes(term);
      });
    }

    // Date Filtering
    if (orderDateRange !== 'all') {
      filtered = filtered.filter(o => {
        const date = o.createdAt ? new Date(o.createdAt) : new Date(0);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        
        if (year !== orderYear) return false;

        if (orderDateRange === 'monthly') {
          return month === orderMonth;
        }
        if (orderDateRange === 'quarterly') {
          const q = Math.floor((month - 1) / 3) + 1;
          return q === orderQuarter;
        }
        if (orderDateRange === 'half') {
          const h = month <= 6 ? 1 : 2;
          return h === orderHalf;
        }
        if (orderDateRange === 'yearly') {
          return true; // Already checked year
        }
        return true;
      });
    }

    return [...filtered].sort((a, b) => {
      if (orderSortBy === 'deadline') {
        const dateA = a.deadline ? new Date(a.deadline) : new Date(0);
        const dateB = b.deadline ? new Date(b.deadline) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      }
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [orders, orderFilterStatus, orderSortBy, searchOrder, freelancers, orderDateRange, orderYear, orderMonth, orderQuarter, orderHalf, showAwaitingBalanceOnly]);

  const paginatedConsultations = useMemo(() => {
    const start = (consultationPage - 1) * ITEMS_PER_PAGE;
    return filteredConsultations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredConsultations, consultationPage]);

  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, orderPage]);

  const paginatedFreelancers = useMemo(() => {
    const start = (freelancerPage - 1) * ITEMS_PER_PAGE;
    return filteredFreelancers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFreelancers, freelancerPage]);

  const Pagination = ({ currentPage, totalItems, onPageChange }: { currentPage: number, totalItems: number, onPageChange: (page: number) => void }) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-8 pb-8">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-zinc-200 disabled:opacity-30 hover:bg-zinc-50 transition-all"
        >
          <ChevronLeft size={18} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
              currentPage === page 
                ? 'bg-zinc-950 text-white shadow-lg' 
                : 'bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-950 hover:text-zinc-950'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-zinc-200 disabled:opacity-30 hover:bg-zinc-50 transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    );
  };

  const downloadConsultationAsText = (c: any) => {
    const order = orders.find(o => o.consultationId === c.id);
    const logs = c.consultationLogs?.map((log: any) => 
      `[${log.date ? new Date(log.date).toLocaleString() : 'No Date'}] ${log.content}`
    ).join('\n') || '기록 없음';

    let orderInfo = '';
    if (order) {
      orderInfo = `
[결제 및 오더 정보]
-----------------------------------------
결제 방식: ${order.paymentMethod === 'cash' ? '현금 결제' : '카드 결제'}
결제 구분: ${order.paymentType === 'deposit' ? '계약금' : '완불'}
최종 고객 결제금액: ₩${order.clientPrice?.toLocaleString()}
${order.paymentType === 'deposit' ? `계약금 (입금액): ₩${order.depositAmount?.toLocaleString()}\n미수금 (잔금): ₩${order.balanceAmount?.toLocaleString()}` : ''}
오더 상태: ${getOrderStatusLabel(order.status)}
-----------------------------------------
`;
    }

    const content = `
[상담 의뢰 상세 내역]
-----------------------------------------
신청일: ${c.createdAt ? new Date(c.createdAt).toLocaleString() : 'No Date'}
상태: ${getOrderStatusLabel(c.status)}

[고객 정보]
성함: ${c.name}
연락처: ${c.phone}
산업군: ${c.industry || '-'}

[의뢰 내용]
제작 목적: ${c.productionPurpose || '-'}
영상 유형/플랜: ${c.plan || c.videoType || '-'}
수량: ${c.quantity || '-'}
예산: ${c.budget || '-'}
참고 링크: ${c.referenceLink || '-'}

[고객 메시지]
${c.message}

${orderInfo}

[추가 상담 기록]
-----------------------------------------
${logs}
-----------------------------------------
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `상담의뢰_${c.name}_${c.id.slice(-4)}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_approval': return '승인대기';
      case 'in_progress': return '진행중';
      case 'confirming': return '컨펌중';
      case 'awaiting_balance': return '잔금대기중';
      case 'completed': return '작업완료';
      case 'paid': return '지불완료';
      case 'cancelled': return '취소됨';
      default: return status;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'bg-amber-100 text-amber-600';
      case 'in_progress': return 'bg-blue-100 text-blue-600';
      case 'confirming': return 'bg-indigo-100 text-indigo-600';
      case 'awaiting_balance': return 'bg-orange-100 text-orange-600';
      case 'completed': return 'bg-green-100 text-green-600';
      case 'paid': return 'bg-purple-100 text-purple-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-zinc-100 text-zinc-600';
    }
  };
  const isAdmin = user?.email === ADMIN_EMAIL;

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('로그인 중 오류가 발생했습니다.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success('로그아웃되었습니다.');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !isAdmin) return;

    // Realtime subscriptions for all collections
    const unsubscribes = [
      onSnapshot(query(collection(db, 'portfolio'), orderBy('createdAt', 'desc')), (snapshot) => {
        setPortfolioItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), collection: 'portfolio' } as any)));
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'portfolio')),
      
      onSnapshot(query(collection(db, 'references'), orderBy('createdAt', 'desc')), (snapshot) => {
        setReferencesItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), collection: 'references' } as any)));
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'references')),
      
      onSnapshot(query(collection(db, 'website_templates'), orderBy('createdAt', 'desc')), (snapshot) => {
        setWebsiteItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'website_templates')),
      
      onSnapshot(query(collection(db, 'consultations'), orderBy('createdAt', 'desc')), (snapshot) => {
        setConsultations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'consultations')),
      
      onSnapshot(query(collection(db, 'freelancers'), orderBy('createdAt', 'desc')), (snapshot) => {
        setFreelancers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'freelancers')),
      
      onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders')),
    ];

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [isAuthReady, isAdmin]);

  const referenceItems = useMemo(() => {
    const combined = [...portfolioItems, ...referencesItems];
    // Remove duplicates by ID
    const uniqueMap = new Map();
    combined.forEach(item => uniqueMap.set(item.id, item));
    const unique = Array.from(uniqueMap.values());
    
    // Sort by createdAt desc
    return unique.sort((a, b) => {
      const timeA = getTime(a.createdAt);
      const timeB = getTime(b.createdAt);
      return timeB - timeA;
    });
  }, [portfolioItems, referencesItems]);

  const sortedWebsiteItems = useMemo(() => {
    return [...websiteItems].sort((a, b) => {
      const timeA = getTime(a.createdAt);
      const timeB = getTime(b.createdAt);
      return timeB - timeA;
    });
  }, [websiteItems]);

  const currentItems = useMemo(() => {
    switch (activeTab) {
      case 'references': return referenceItems;
      case 'website': return sortedWebsiteItems;
      case 'consultations': return filteredConsultations;
      case 'freelancers': return filteredFreelancers;
      case 'orders': return filteredOrders;
      default: return [];
    }
  }, [activeTab, referenceItems, sortedWebsiteItems, filteredConsultations, filteredFreelancers, filteredOrders]);

  const getYoutubeThumbnail = (url: string) => {
    const videoId = getYoutubeVideoId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
  };

  const getYoutubeVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) return match[2];
    
    // Fallback for different formats
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'youtu.be') return urlObj.pathname.slice(1);
      if (urlObj.pathname.includes('/shorts/')) return urlObj.pathname.split('/shorts/')[1].split(/[?#]/)[0];
      return urlObj.searchParams.get('v');
    } catch (e) {
      return null;
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      setYtThumbnails([]);
      toast.info('Video loaded. Scrub to capture frames!');
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result && !thumbnails.includes(result)) {
          setThumbnails(prev => [...prev, result].slice(0, 4));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas to HD resolution (1280x720 or similar aspect)
    const scale = 1280 / video.videoWidth;
    canvas.width = 1280;
    canvas.height = video.videoHeight * scale;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      if (!thumbnails.includes(dataUrl)) {
        setThumbnails(prev => [...prev, dataUrl].slice(0, 4));
        toast.success('Frame captured in HD!');
      }
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentItems.map(i => i.id));
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    try {
      const item = currentItems.find(i => i.id === id);
      let tableName = item?.collection;
      
      if (!tableName) {
        switch (activeTab) {
          case 'references': tableName = 'portfolio'; break;
          case 'website': tableName = 'website_templates'; break;
          case 'consultations': tableName = 'consultations'; break;
          case 'freelancers': tableName = 'freelancers'; break;
          case 'orders': tableName = 'orders'; break;
          default: tableName = 'portfolio';
        }
      }
      
      await deleteDoc(doc(db, tableName, id));

      toast.success('삭제되었습니다.');
      setConfirmDeleteId(null);
      setSelectedIds(prev => prev.filter(i => i !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `unknown/${id}`);
    }
  };

  const handleBulkDelete = async () => {
    if (!isAdmin || selectedIds.length === 0) return;
    setIsBulkDeleting(true);
    try {
      const batch = writeBatch(db);
      selectedIds.forEach((id) => {
        const item = currentItems.find(i => i.id === id);
        let tableName = item?.collection;
        
        if (!tableName) {
          switch (activeTab) {
            case 'references': tableName = 'portfolio'; break;
            case 'website': tableName = 'website_templates'; break;
            case 'consultations': tableName = 'consultations'; break;
            case 'freelancers': tableName = 'freelancers'; break;
            case 'orders': tableName = 'orders'; break;
            default: tableName = 'portfolio';
          }
        }
        batch.delete(doc(db, tableName, id));
      });
      await batch.commit();
      toast.success(`${selectedIds.length}개의 항목이 삭제되었습니다.`);
      setSelectedIds([]);
      setConfirmBulkDelete(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'bulk');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const resetForm = () => {
    setCategory(REFERENCE_CATEGORIES[0]);
    setThumbnails([]);
    setLinkUrl('');
    setTitle('');
    setIsAutoThumb(false);
    setYtThumbnails([]);
    setVideoPreviewUrl(null);
    setEditingItem(null);
    
    // Reset Freelancer Form
    setFName('');
    setFEmail('');
    setFPhone('');
    setFType('individual');
    setFExperience('');
    setFPortfolio('');
    setFStatus('pending');
    setFIdCardUrl('');
    setFBusinessRegUrl('');
    setFBankAccount('');
    setSelectedFreelancer(null);

    // Reset Order Form
    setSelectedConsultationId('');
    setSelectedFreelancerId('');
    setFPrice(0);
    setCPrice(0);
    setDeadline('');
    setConsultationNotes('');
    setOrderStatus('pending_approval');
    setPaymentMethod('card');
    setPaymentType('full');
    setDepositAmount(0);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error('관리자 권한이 필요합니다.');
      return;
    }

    if (activeTab === 'references' && !linkUrl) {
      toast.error('링크 URL을 입력해주세요.');
      return;
    }

    if (activeTab === 'website' && !title) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    if (activeTab === 'freelancers') {
      if (!fName || !fEmail) {
        toast.error('이름과 이메일은 필수입니다.');
        return;
      }
    }

    if (activeTab === 'orders') {
      if (!selectedConsultationId || !selectedFreelancerId || !deadline) {
        toast.error('상담건, 프리랜서, 납기일은 필수입니다.');
        return;
      }
    }

    setIsAdding(true);
    try {
      if (activeTab === 'freelancers') {
        const freelancerData = {
          name: fName,
          email: fEmail,
          phone: fPhone,
          type: fType,
          experienceIntro: fExperience,
          portfolioLink: fPortfolio,
          status: fStatus,
          idCardUrl: fIdCardUrl,
          businessRegUrl: fBusinessRegUrl,
          bankAccountInfo: fBankAccount,
          createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
          consultationLogs: editingItem ? (editingItem.consultationLogs || []) : []
        };

        if (editingItem) {
          const freelancerRef = doc(db, 'freelancers', editingItem.id);
          await updateDoc(freelancerRef, freelancerData);
          toast.success('프리랜서 정보가 수정되었습니다.');
        } else {
          await addDoc(collection(db, 'freelancers'), {
            ...freelancerData,
            createdAt: serverTimestamp()
          });
          toast.success('프리랜서가 등록되었습니다.');
        }
        resetForm();
        return;
      }

      if (activeTab === 'orders') {
        const consultation = consultations.find(c => c.id === selectedConsultationId);
        const freelancer = freelancers.find(f => f.id === selectedFreelancerId);

        if (!consultation || !freelancer) {
          toast.error('상담 내역과 프리랜서를 선택해주세요.');
          return;
        }

        const orderData = {
          consultationId: selectedConsultationId,
          freelancerId: selectedFreelancerId,
          freelancerEmail: freelancer.email,
          clientName: consultation.name,
          freelancerPrice: Number(fPrice),
          clientPrice: Number(cPrice),
          deadline: new Date(deadline).toISOString(),
          status: editingItem ? orderStatus : 'pending_approval',
          workContent: consultationNotes,
          modificationRequests: editingItem ? editingItem.modificationRequests : '',
          paymentMethod,
          paymentType,
          depositAmount: paymentType === 'deposit' ? Number(depositAmount) : 0,
          balanceAmount: paymentType === 'deposit' ? Number(cPrice) - Number(depositAmount) : 0,
          updatedAt: serverTimestamp()
        };

        // Update consultation with notes and final price
        const consultationRef = doc(db, 'consultations', selectedConsultationId);
        await updateDoc(consultationRef, {
          consultationNotes: consultationNotes,
          finalClientPrice: Number(cPrice),
          status: 'in_production'
        });
        
        if (editingItem) {
          const orderRef = doc(db, 'orders', editingItem.id);
          await updateDoc(orderRef, orderData);
          toast.success('오더가 수정되었습니다.');
        } else {
          await addDoc(collection(db, 'orders'), {
            ...orderData,
            createdAt: serverTimestamp()
          });
          // Send email to freelancer upon matching
          await sendEmailToFreelancer(orderData, freelancer);
          toast.success('오더가 생성되었습니다. 프리랜서에게 안내 메일이 발송되었습니다.');
        }
        resetForm();
        return;
      }

      // Original logic for references and website templates
      let finalThumbnails = [...thumbnails];
      if (finalThumbnails.length === 0) {
        const autoThumb = getYoutubeThumbnail(linkUrl);
        if (autoThumb) {
          finalThumbnails = [autoThumb];
        } else {
          toast.error('썸네일 이미지를 업로드하거나 유튜브 링크를 입력해주세요.');
          return;
        }
      }

      const data: any = {
        category,
        thumbnail: finalThumbnails[0],
        thumbnails: finalThumbnails,
        authorUid: user?.uid
      };

      if (activeTab === 'references') {
        data.linkUrl = linkUrl;
      } else {
        data.title = title;
        data.image = finalThumbnails[0];
      }

      const targetTable = activeTab === 'references' ? 'portfolio' : 'website_templates';

      if (editingItem) {
        const tableName = editingItem.collection || targetTable;
        const itemRef = doc(db, tableName, editingItem.id);
        await updateDoc(itemRef, data);
        toast.success('수정되었습니다.');
      } else {
        await addDoc(collection(db, targetTable), {
          ...data,
          createdAt: serverTimestamp()
        });
        toast.success('추가되었습니다.');
      }
      resetForm();
    } catch (error: any) {
      handleFirestoreError(error, OperationType.WRITE, activeTab);
    } finally {
      setIsAdding(false);
    }
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'references' || activeTab === 'website') {
      setCategory(item.category);
      setThumbnails(item.thumbnails || [item.thumbnail || item.image]);
      setLinkUrl(item.linkUrl || '');
      setTitle(item.title || '');
    } else if (activeTab === 'freelancers') {
      setFName(item.name);
      setFEmail(item.email);
      setFPhone(item.phone || '');
      setFType(item.type || 'individual');
      setFExperience(item.experienceIntro || '');
      setFPortfolio(item.portfolioLink || '');
      setFStatus(item.status || 'pending');
      setFIdCardUrl(item.idCardUrl || '');
      setFBusinessRegUrl(item.businessRegUrl || '');
      setFBankAccount(item.bankAccountInfo || '');
    } else if (activeTab === 'orders') {
      setSelectedConsultationId(item.consultationId);
      setSelectedFreelancerId(item.freelancerId);
      setFPrice(item.freelancerPrice);
      setDeadline(item.deadline ? new Date(item.deadline).toISOString().split('T')[0] : '');
      setConsultationNotes(item.workContent || '');
      setCPrice(item.clientPrice || 0);
      setOrderStatus(item.status);
      setPaymentMethod(item.paymentMethod || 'card');
      setPaymentType(item.paymentType || 'full');
      setDepositAmount(item.depositAmount || 0);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const seedSampleData = async () => {
    if (!isAdmin) return;
    setIsSeeding(true);
    try {
      const samples = [
        {
          category: '쇼핑·리뷰',
          linkUrl: 'https://www.youtube.com/shorts/9No-FiE946s',
          thumbnail: 'https://img.youtube.com/vi/9No-FiE946s/maxresdefault.jpg',
          thumbnails: [
            'https://img.youtube.com/vi/9No-FiE946s/maxresdefault.jpg',
            'https://img.youtube.com/vi/9No-FiE946s/hq1.jpg',
            'https://img.youtube.com/vi/9No-FiE946s/hq2.jpg',
            'https://img.youtube.com/vi/9No-FiE946s/hq3.jpg'
          ],
          createdAt: serverTimestamp(),
          authorUid: user?.uid
        },
        {
          category: '뷰티·패션',
          linkUrl: 'https://www.youtube.com/shorts/9No-FiE946s',
          thumbnail: 'https://img.youtube.com/vi/9No-FiE946s/maxresdefault.jpg',
          thumbnails: [
            'https://img.youtube.com/vi/9No-FiE946s/maxresdefault.jpg',
            'https://img.youtube.com/vi/9No-FiE946s/hq1.jpg',
            'https://img.youtube.com/vi/9No-FiE946s/hq2.jpg',
            'https://img.youtube.com/vi/9No-FiE946s/hq3.jpg'
          ],
          createdAt: serverTimestamp(),
          authorUid: user?.uid
        },
        {
          category: '푸드·맛집',
          linkUrl: 'https://www.youtube.com/shorts/9No-FiE946s',
          thumbnail: 'https://img.youtube.com/vi/9No-FiE946s/maxresdefault.jpg',
          thumbnails: [
            'https://img.youtube.com/vi/9No-FiE946s/maxresdefault.jpg',
            'https://img.youtube.com/vi/9No-FiE946s/hq1.jpg',
            'https://img.youtube.com/vi/9No-FiE946s/hq2.jpg',
            'https://img.youtube.com/vi/9No-FiE946s/hq3.jpg'
          ],
          createdAt: serverTimestamp(),
          authorUid: user?.uid
        },
        {
          category: '매장·홍보',
          linkUrl: 'https://www.youtube.com/shorts/9No-FiE946s',
          thumbnail: 'https://img.youtube.com/vi/9No-FiE946s/maxresdefault.jpg',
          thumbnails: [
            'https://img.youtube.com/vi/9No-FiE946s/maxresdefault.jpg',
            'https://img.youtube.com/vi/9No-FiE946s/hq1.jpg',
            'https://img.youtube.com/vi/9No-FiE946s/hq2.jpg',
            'https://img.youtube.com/vi/9No-FiE946s/hq3.jpg'
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
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'portfolio');
    } finally {
      setIsSeeding(false);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-zinc-400" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-xl text-center border border-zinc-100">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock className="text-zinc-400" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-4">Admin Access</h1>
          <p className="text-zinc-500 mb-12 font-medium">관리자 계정으로 로그인하여 레퍼런스를 관리하세요.</p>
          <button 
            onClick={loginWithGoogle}
            className="w-full py-4 bg-zinc-950 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
          >
            <Lock size={20} /> Google Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-xl text-center border border-zinc-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock className="text-red-500" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-4 text-red-600">Access Denied</h1>
          <p className="text-zinc-500 mb-12 font-medium">관리자 권한이 없습니다. ({user.email})</p>
          <button 
            onClick={logout}
            className="w-full py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-3"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-widest">Admin Panel</span>
              <span className="text-zinc-400 font-mono text-sm">{user.email}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Management.</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-white p-1 rounded-2xl border border-zinc-200">
              <button 
                onClick={() => { setActiveTab('references'); resetForm(); }}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'references' ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-950'}`}
              >
                References ({referenceItems.length})
              </button>
              <button 
                onClick={() => { setActiveTab('website'); resetForm(); }}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'website' ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-950'}`}
              >
                Website Production ({sortedWebsiteItems.length})
              </button>
              <button 
                onClick={() => { setActiveTab('consultations'); resetForm(); }}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'consultations' ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-950'}`}
              >
                Consultations ({consultations.length})
              </button>
              <button 
                onClick={() => { setActiveTab('freelancers'); resetForm(); }}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'freelancers' ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-950'}`}
              >
                Freelancers ({freelancers.length})
              </button>
              <button 
                onClick={() => { setActiveTab('orders'); resetForm(); }}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-950'}`}
              >
                Orders ({orders.length})
                {orders.filter(o => (o.status === 'in_progress' || o.status === 'confirming') && o.paymentType === 'deposit').length > 0 && (
                  <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] rounded-full">
                    {orders.filter(o => (o.status === 'in_progress' || o.status === 'confirming') && o.paymentType === 'deposit').length}
                  </span>
                )}
              </button>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-white text-zinc-500 hover:bg-zinc-100 border border-zinc-200 transition-all"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Form Section */}
        {activeTab !== 'consultations' && (
          <motion.div 
            layout
            className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-zinc-100 mb-24"
          >
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black tracking-tighter">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              {editingItem && (
                <button onClick={resetForm} className="p-2 hover:bg-zinc-100 rounded-full transition-all">
                  <X size={24} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeTab === 'freelancers' ? (
                <>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Name</label>
                        <input 
                          type="text" 
                          value={fName}
                          onChange={(e) => setFName(e.target.value)}
                          className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                          placeholder="Freelancer Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Type</label>
                        <select 
                          value={fType}
                          onChange={(e) => setFType(e.target.value as any)}
                          className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                        >
                          <option value="individual">개인</option>
                          <option value="business">개인사업자</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Email</label>
                      <input 
                        type="email" 
                        value={fEmail}
                        onChange={(e) => setFEmail(e.target.value)}
                        className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Phone</label>
                      <input 
                        type="text" 
                        value={fPhone}
                        onChange={(e) => setFPhone(e.target.value)}
                        className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                        placeholder="010-0000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Experience & Intro</label>
                      <textarea 
                        value={fExperience}
                        onChange={(e) => setFExperience(e.target.value)}
                        className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all h-32"
                        placeholder="경력 및 자기소개..."
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Portfolio Link</label>
                      <input 
                        type="text" 
                        value={fPortfolio}
                        onChange={(e) => setFPortfolio(e.target.value)}
                        className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Bank Account Info</label>
                      <input 
                        type="text" 
                        value={fBankAccount}
                        onChange={(e) => setFBankAccount(e.target.value)}
                        className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                        placeholder="은행명 계좌번호 예금주"
                      />
                    </div>
                    {editingItem && (
                      <div>
                        <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Approval Status</label>
                        <select 
                          value={fStatus}
                          onChange={(e) => setFStatus(e.target.value as any)}
                          className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                        >
                          <option value="pending">심사중</option>
                          <option value="approved">승인</option>
                          <option value="rejected">비승인</option>
                        </select>
                      </div>
                    )}
                    {!fIdCardUrl && !fBusinessRegUrl && (
                      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Document Status</p>
                        <p className="text-[11px] text-zinc-500 italic">승인 후 이메일로 서류 제출 예정</p>
                      </div>
                    )}
                    {(fIdCardUrl || fBusinessRegUrl) && (
                      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Submitted Documents</p>
                        <div className="flex gap-2">
                          {fIdCardUrl && (
                            <a href={fIdCardUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[10px] font-bold hover:bg-zinc-100 transition-all">
                              View ID Card
                            </a>
                          )}
                          {fBusinessRegUrl && (
                            <a href={fBusinessRegUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[10px] font-bold hover:bg-zinc-100 transition-all">
                              View Business Reg
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    <button 
                      type="submit"
                      disabled={isAdding}
                      className="w-full py-6 bg-zinc-950 text-white rounded-[24px] font-black text-lg hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-zinc-200"
                    >
                      {isAdding ? <Loader2 className="animate-spin" /> : <Plus />}
                      {editingItem ? 'Update Freelancer' : 'Register Freelancer'}
                    </button>
                  </div>
                </>
              ) : activeTab === 'orders' ? (
                <>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Select Consultation</label>
                      <select 
                        value={selectedConsultationId}
                        onChange={(e) => setSelectedConsultationId(e.target.value)}
                        className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                      >
                        <option value="">Select a request...</option>
                        {consultations.filter(c => ['contacted', 'consultation_completed', 'in_production'].includes(c.status) || selectedConsultationId === c.id).map(c => (
                          <option key={c.id} value={c.id}>{c.name} - {c.industry}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Select Freelancer</label>
                      <select 
                        value={selectedFreelancerId}
                        onChange={(e) => setSelectedFreelancerId(e.target.value)}
                        className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                      >
                        <option value="">Select a freelancer...</option>
                        {freelancers.filter(f => f.status === 'approved' || selectedFreelancerId === f.id).map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Deadline (납기일)</label>
                      <input 
                        type="date" 
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Client Price (Total)</label>
                        <input 
                          type="number" 
                          value={cPrice}
                          onChange={(e) => setCPrice(Number(e.target.value))}
                          className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Freelancer Price</label>
                        <input 
                          type="number" 
                          value={fPrice}
                          onChange={(e) => setFPrice(Number(e.target.value))}
                          className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Payment Method (결제 방식)</label>
                        <select 
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                        >
                          <option value="card">카드 결제</option>
                          <option value="cash">현금 결제</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Payment Type (결제 구분)</label>
                        <select 
                          value={paymentType}
                          onChange={(e) => setPaymentType(e.target.value as any)}
                          className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                        >
                          <option value="full">완불</option>
                          <option value="deposit">계약금</option>
                        </select>
                      </div>
                    </div>
                    {paymentType === 'deposit' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Deposit Amount (계약금)</label>
                          <input 
                            type="number" 
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(Number(e.target.value))}
                            className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Balance Amount (잔금)</label>
                          <div className="w-full px-6 py-4 bg-zinc-100 border-none rounded-2xl font-bold text-zinc-500">
                            ₩{(cPrice - depositAmount).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Consultation Notes (상담 기록 / 작업내용)</label>
                      <textarea 
                        value={consultationNotes}
                        onChange={(e) => setConsultationNotes(e.target.value)}
                        className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all h-32"
                        placeholder="전화/문서 상담 내용 및 프리랜서에게 전달할 작업 내용 기록..."
                      />
                    </div>
                    {editingItem && (
                      <div>
                        <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Order Status (진행 상황)</label>
                        <select 
                          value={orderStatus}
                          onChange={(e) => setOrderStatus(e.target.value)}
                          className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                        >
                          <option value="pending_approval">승인대기</option>
                          <option value="in_progress">진행중</option>
                          <option value="confirming">컨펌중</option>
                          <option value="awaiting_balance">잔금대기중</option>
                          <option value="completed">작업완료</option>
                          <option value="paid">지불완료</option>
                          <option value="cancelled">취소됨</option>
                        </select>
                      </div>
                    )}
                    <button 
                      type="submit"
                      disabled={isAdding}
                      className="w-full py-6 bg-zinc-950 text-white rounded-[24px] font-black text-lg hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-zinc-200"
                    >
                      {isAdding ? <Loader2 className="animate-spin" /> : <ClipboardList />}
                      {editingItem ? 'Update Order' : 'Create Order & Match'}
                    </button>
                  </div>
                </>
              ) : (
                <>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(activeTab === 'references' ? REFERENCE_CATEGORIES : [
                      "기업", "분양/건설/인테리어", "제품", "공연/전시/행사", 
                      "쇼핑", "패션/뷰티", "카페/레스토랑", "프랜차이즈", 
                      "레저/스포츠/여행", "포트폴리오/스튜디오", "종합전시회", "학원(교육)/취미"
                    ]).map((cat) => (
                      <button 
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat as any)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
                          category === cat ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                {activeTab === 'website' && (
                  <div>
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3">Title</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="템플릿 제목을 입력하세요"
                      className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-all font-medium"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3">Thumbnails (Up to 4, 295x530)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {thumbnails.map((thumb, idx) => (
                      <div key={idx} className="relative aspect-[295/530] rounded-2xl overflow-hidden border border-zinc-200 group">
                        <img 
                          src={thumb} 
                          alt={`Preview ${idx}`} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-zinc-950/60 text-white text-[8px] font-black rounded-full uppercase tracking-widest backdrop-blur-sm">
                          {idx === 0 ? 'Main' : `P${idx}`}
                        </div>
                        <button 
                          type="button"
                          onClick={() => setThumbnails(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 p-1.5 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {thumbnails.length < 4 && (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative cursor-pointer group overflow-hidden border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl transition-all flex flex-col items-center justify-center bg-zinc-50 aspect-[295/530]"
                      >
                        <Upload size={20} className="text-zinc-400 mb-2" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Add Image</span>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Manual URL Input as fallback */}
                  <div className="mt-4 relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Or enter image URL manually and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = e.currentTarget.value;
                          if (val && !thumbnails.includes(val)) {
                            setThumbnails(prev => [...prev, val]);
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                      className="w-full pl-12 pr-6 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-all text-sm font-medium"
                    />
                  </div>
                  {/* Video Scrubbing / Thumbnail Selection Area */}
                  {(videoPreviewUrl || ytThumbnails.length > 0) && (
                    <div className="mt-8 p-6 bg-zinc-100 rounded-[32px] border border-zinc-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                          {videoPreviewUrl ? <ImageIcon size={16} /> : <Youtube size={16} className="text-red-600" />}
                          {videoPreviewUrl ? 'Scrub to Capture Frame' : 'Select YouTube Frame'}
                        </h4>
                        {!videoPreviewUrl && ytThumbnails.length > 0 && (
                          <button 
                            type="button"
                            onClick={() => {
                              setThumbnails(ytThumbnails.slice(0, 4));
                              setIsAutoThumb(true);
                              toast.success('All YouTube thumbnails selected!');
                            }}
                            className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
                          >
                            Select All
                          </button>
                        )}
                      </div>
                      
                      {videoPreviewUrl ? (
                        <div className="space-y-4">
                          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-200">
                            <video 
                              ref={videoRef}
                              src={videoPreviewUrl}
                              controls
                              crossOrigin="anonymous"
                              className="w-full h-full"
                            />
                          </div>
                          <canvas ref={canvasRef} className="hidden" />
                          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4">
                            <p className="text-xs text-blue-600 font-medium leading-relaxed">
                              💡 <b>고화질(Max Res) 팁:</b> 직접 업로드한 영상은 아래 버튼으로 <b>HD(1280px)</b>로 선명하게 캡처할 수 있습니다. 
                              유튜브 자동 프레임보다 훨씬 선명합니다!
                            </p>
                          </div>
                          <button 
                            type="button"
                            onClick={captureFrame}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                          >
                            <ImageIcon size={20} /> 현재 장면을 HD(1280px)로 캡처하기
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 mb-4">
                            <p className="text-xs text-amber-700 font-medium leading-relaxed">
                              ⚠️ <b>안내:</b> 유튜브 자동 프레임(FRAME 1~3)은 시스템상 <b>저화질(480x360)</b>로만 제공됩니다. 
                              <b>4개 모두 초고화질(Max Res)</b>을 원하시면 위 '직접 캡처' 기능을 사용하거나 별도로 이미지를 업로드해주세요.
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {ytThumbnails.map((thumb, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setThumbnails(prev => 
                                    prev.includes(thumb) ? prev.filter(t => t !== thumb) : [...prev, thumb].slice(0, 4)
                                  );
                                  setIsAutoThumb(true);
                                }}
                                className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                                  thumbnails.includes(thumb) ? 'border-blue-600 scale-[1.02]' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                              >
                                <img src={thumb} alt={`Option ${idx}`} className="w-full aspect-video object-cover" referrerPolicy="no-referrer" />
                                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                                  {idx === 0 ? 'DEFAULT' : `FRAME ${idx}`}
                                </div>
                                {thumbnails.includes(thumb) && (
                                  <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                    <div className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg">
                                      <Plus size={16} className="rotate-45" />
                                    </div>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {activeTab === 'references' && (
                  <div>
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3">Link URL</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                        <input 
                          type="text" 
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          placeholder="클릭 시 이동할 링크 주소를 입력하세요"
                          className="w-full pl-12 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-all font-medium"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          const videoId = getYoutubeVideoId(linkUrl);
                          if (videoId) {
                            const thumbs = [
                              `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                              `https://img.youtube.com/vi/${videoId}/hq1.jpg`,
                              `https://img.youtube.com/vi/${videoId}/hq2.jpg`,
                              `https://img.youtube.com/vi/${videoId}/hq3.jpg`
                            ];
                            setYtThumbnails(thumbs);
                            setThumbnails([thumbs[0]]);
                            setIsAutoThumb(true);
                            toast.success('YouTube thumbnails detected!');
                          } else if (linkUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || linkUrl.includes('images.unsplash.com')) {
                            setThumbnails(prev => prev.includes(linkUrl) ? prev : [...prev, linkUrl].slice(0, 4));
                            setYtThumbnails([]);
                            setIsAutoThumb(true);
                            toast.success('Image URL detected!');
                          } else {
                            setYtThumbnails([]);
                            toast.error('Could not auto-detect thumbnail for this URL.');
                          }
                        }}
                        className="px-6 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-200 transition-all whitespace-nowrap"
                      >
                        Auto-detect
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 pt-4">
                <button 
                  type="submit" 
                  disabled={isAdding}
                  className="w-full py-5 bg-zinc-950 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAdding ? <Loader2 className="animate-spin" size={24} /> : (editingItem ? <Edit2 size={24} /> : <Plus size={24} />)}
                  {isAdding ? 'Processing...' : (editingItem ? `Update ${activeTab === 'references' ? 'Reference' : 'Template'}` : `Add to ${activeTab === 'references' ? 'Reference' : 'Website'}`)}
                </button>
              </div>
                </>
              )}
            </form>
          </motion.div>
        )}

        {/* List Section */}
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-black tracking-tighter">
                {activeTab === 'references' ? 'Current References' : 
                 activeTab === 'website' ? 'Current Website Templates' : 
                 activeTab === 'consultations' ? 'Consultation Requests' :
                 activeTab === 'freelancers' ? 'Registered Freelancers' : 'Project Orders'}
              </h2>
              <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">
                {activeTab === 'consultations' ? `${filteredConsultations.length} Requests Found` :
                 activeTab === 'freelancers' ? `${filteredFreelancers.length} Freelancers Found` :
                 activeTab === 'orders' ? (
                   showAwaitingBalanceOnly 
                     ? `${filteredOrders.length} 잔금대기중 주문` 
                     : orderFilterStatus === 'total' 
                       ? `${filteredOrders.length} 전체 주문`
                       : `${filteredOrders.length} 주문`
                 ) : ''}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Search Bars */}
              {activeTab === 'consultations' && (
                <div className="flex gap-2">
                  <div className="relative min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      type="text"
                      placeholder="이름 또는 휴대폰번호 검색..."
                      value={searchConsultation}
                      onChange={(e) => setSearchConsultation(e.target.value)}
                      className="w-full pl-12 pr-6 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                    />
                  </div>
                  <select 
                    value={consultationFilterStatus}
                    onChange={(e) => setConsultationFilterStatus(e.target.value)}
                    className="px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-950 outline-none"
                  >
                    <option value="all">모든 상태</option>
                    <option value="pending">대기중</option>
                    <option value="contacted">상담진행중</option>
                    <option value="consultation_completed">상담완료</option>
                    <option value="in_production">제작중</option>
                    <option value="completed">완료됨</option>
                  </select>
                </div>
              )}

              {activeTab === 'freelancers' && (
                <div className="flex gap-2">
                  <div className="relative min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      type="text"
                      placeholder="이름, 휴대폰, 이메일 검색..."
                      value={searchFreelancer}
                      onChange={(e) => setSearchFreelancer(e.target.value)}
                      className="w-full pl-12 pr-6 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                    />
                  </div>
                  <select 
                    value={freelancerFilterStatus}
                    onChange={(e) => setFreelancerFilterStatus(e.target.value)}
                    className="px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-950 outline-none"
                  >
                    <option value="all">모든 상태</option>
                    <option value="pending">심사중</option>
                    <option value="approved">승인</option>
                    <option value="rejected">비승인</option>
                  </select>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="flex flex-wrap items-center gap-4 w-full">
                  <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      type="text"
                      placeholder="고객명 또는 프리랜서 이름..."
                      value={searchOrder}
                      onChange={(e) => setSearchOrder(e.target.value)}
                      className="w-full pl-12 pr-6 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-950 transition-all"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select 
                      value={orderDateRange}
                      onChange={(e) => setOrderDateRange(e.target.value as any)}
                      className="px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-950 outline-none"
                    >
                      <option value="all">전체 기간</option>
                      <option value="monthly">월별</option>
                      <option value="quarterly">분기별</option>
                      <option value="half">반기별</option>
                      <option value="yearly">연도별</option>
                    </select>

                    {orderDateRange !== 'all' && (
                      <select 
                        value={orderYear}
                        onChange={(e) => setOrderYear(Number(e.target.value))}
                        className="px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-950 outline-none"
                      >
                        {Array.from({ length: 2040 - 2026 + 1 }, (_, i) => 2040 - i).map((y) => (
                          <option key={y} value={y}>{y}년</option>
                        ))}
                      </select>
                    )}

                    {orderDateRange === 'monthly' && (
                      <select 
                        value={orderMonth}
                        onChange={(e) => setOrderMonth(Number(e.target.value))}
                        className="px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-950 outline-none"
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}월</option>
                        ))}
                      </select>
                    )}

                    {orderDateRange === 'quarterly' && (
                      <select 
                        value={orderQuarter}
                        onChange={(e) => setOrderQuarter(Number(e.target.value))}
                        className="px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-950 outline-none"
                      >
                        <option value={1}>1분기</option>
                        <option value={2}>2분기</option>
                        <option value={3}>3분기</option>
                        <option value={4}>4분기</option>
                      </select>
                    )}

                    {orderDateRange === 'half' && (
                      <select 
                        value={orderHalf}
                        onChange={(e) => setOrderHalf(Number(e.target.value))}
                        className="px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-950 outline-none"
                      >
                        <option value={1}>상반기</option>
                        <option value={2}>하반기</option>
                      </select>
                    )}

                    <select 
                      value={orderSortBy}
                      onChange={(e) => setOrderSortBy(e.target.value as any)}
                      className="px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-950 outline-none"
                    >
                      <option value="createdAt">최신순</option>
                      <option value="deadline">마감일순</option>
                    </select>
                    <select 
                      value={orderFilterStatus}
                      onChange={(e) => setOrderFilterStatus(e.target.value)}
                      disabled={showAwaitingBalanceOnly}
                      className={`px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-950 outline-none transition-opacity ${showAwaitingBalanceOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="total">전체 상태</option>
                      <option value="pending_approval">승인대기</option>
                      <option value="in_progress">진행중</option>
                      <option value="confirming">컨펌중</option>
                      <option value="completed">작업완료</option>
                      <option value="paid">지불완료</option>
                      <option value="cancelled">취소됨</option>
                    </select>
                    <button
                      onClick={() => setShowAwaitingBalanceOnly(!showAwaitingBalanceOnly)}
                      className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
                        showAwaitingBalanceOnly 
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' 
                          : 'bg-white border border-zinc-200 text-zinc-600 hover:border-orange-500 hover:text-orange-500'
                      }`}
                    >
                      <Clock size={16} />
                      잔금대기중 ({orders.filter(o => (o.status === 'in_progress' || o.status === 'confirming') && o.paymentType === 'deposit').length})
                    </button>
                    <button 
                      onClick={downloadOrdersExcel}
                      className="px-6 py-3 bg-green-600 text-white rounded-2xl text-sm font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-100"
                    >
                      <Download size={16} /> Excel 다운로드
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                {activeTab === 'references' && referenceItems.length === 0 && (
                  <button 
                    onClick={seedSampleData}
                    disabled={isSeeding}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2"
                  >
                    {isSeeding ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                    샘플 데이터 추가하기
                  </button>
                )}
                {currentItems.length > 0 && (
                  <button 
                    onClick={toggleSelectAll}
                    className="text-sm font-bold text-zinc-500 hover:text-zinc-950 transition-colors"
                  >
                    {selectedIds.length === currentItems.length ? '전체 해제' : '전체 선택'}
                  </button>
                )}
                {selectedIds.length > 0 && (
                  <button 
                    onClick={() => setConfirmBulkDelete(true)}
                    className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-100"
                  >
                    <Trash2 size={16} />
                    선택 삭제 ({selectedIds.length})
                  </button>
                )}
              </div>
            </div>
          </div>

          {activeTab === 'consultations' ? (
            <>
              <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/50 border-b border-zinc-100">
                        <th className="px-6 py-5 w-12">
                          <input 
                            type="checkbox"
                            checked={selectedIds.length === paginatedConsultations.length && paginatedConsultations.length > 0}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                          />
                        </th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">상태</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">신청일</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">고객명</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">연락처</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">산업군</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">제작목적</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedConsultations.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-20 text-center text-zinc-400 font-bold">
                            검색 결과가 없거나 상담 신청 내역이 없습니다.
                          </td>
                        </tr>
                      ) : (
                        paginatedConsultations.map((c) => (
                          <tr 
                            key={c.id} 
                            onClick={() => setSelectedConsultation(c)}
                            className={`hover:bg-zinc-50 transition-colors cursor-pointer group border-b border-zinc-100 last:border-0 ${selectedIds.includes(c.id) ? 'bg-zinc-50' : ''}`}
                          >
                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox"
                                checked={selectedIds.includes(c.id)}
                                onChange={() => toggleSelect(c.id)}
                                className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                c.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                                c.status === 'contacted' ? 'bg-blue-100 text-blue-600' : 
                                c.status === 'consultation_completed' ? 'bg-purple-100 text-purple-600' :
                                c.status === 'in_production' ? 'bg-indigo-100 text-indigo-600' :
                                'bg-green-100 text-green-600'
                              }`}>
                                {c.status === 'pending' ? '대기중' : 
                                 c.status === 'contacted' ? '상담진행중' : 
                                 c.status === 'consultation_completed' ? '상담완료' :
                                 c.status === 'in_production' ? '제작중' :
                                 c.status === 'completed' ? '완료됨' : c.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-zinc-500">
                              {formatDate(c.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-sm font-black text-zinc-900">{c.name}</td>
                            <td className="px-6 py-4 text-sm font-bold text-zinc-500">{c.phone}</td>
                            <td className="px-6 py-4 text-sm font-bold text-zinc-500">{c.industry || '-'}</td>
                            <td className="px-6 py-4 text-sm font-bold text-zinc-500 truncate max-w-[200px]">
                              {c.productionPurpose || '-'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadConsultationAsText(c);
                                  }}
                                  className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                                  title="Download Text"
                                >
                                  <Upload size={16} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('정말 삭제하시겠습니까?')) {
                                      handleDelete(c.id);
                                    }
                                  }}
                                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <Pagination 
                currentPage={consultationPage} 
                totalItems={filteredConsultations.length} 
                onPageChange={setConsultationPage} 
              />
            </>
          ) : activeTab === 'freelancers' ? (
            <>
              <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/50 border-b border-zinc-100">
                        <th className="px-6 py-5 w-12">
                          <input 
                            type="checkbox"
                            checked={selectedIds.length === paginatedFreelancers.length && paginatedFreelancers.length > 0}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                          />
                        </th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">상태</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">이름</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">경력/소개</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">활성 오더</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedFreelancers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-20 text-center text-zinc-400 font-bold">
                            등록된 프리랜서가 없습니다.
                          </td>
                        </tr>
                      ) : (
                        paginatedFreelancers.map((f) => (
                          <tr 
                            key={f.id} 
                            onClick={() => setSelectedFreelancer(f)}
                            className={`hover:bg-zinc-50 transition-colors cursor-pointer group border-b border-zinc-100 last:border-0 ${selectedIds.includes(f.id) ? 'bg-zinc-50' : ''}`}
                          >
                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox"
                                checked={selectedIds.includes(f.id)}
                                onChange={() => toggleSelect(f.id)}
                                className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                f.status === 'approved' ? 'bg-green-100 text-green-600' : 
                                f.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                              }`}>
                                {f.status === 'approved' ? '승인' : f.status === 'rejected' ? '비승인' : '심사중'}
                              </span>
                              <p className="text-[8px] text-zinc-400 mt-1">{f.type === 'business' ? '개인사업자' : '개인'}</p>
                            </td>
                            <td className="px-6 py-4 text-sm font-black text-zinc-900">{f.name}</td>
                            <td className="px-6 py-4 text-sm font-bold text-zinc-500">{f.experienceIntro}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                                {freelancerOrderCount[f.id] || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {f.portfolioLink && (
                                <a 
                                  href={f.portfolioLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-2 text-zinc-400 hover:text-blue-600 transition-colors"
                                  title="Portfolio"
                                >
                                  <LinkIcon size={16} />
                                </a>
                              )}
                                <button 
                                  onClick={() => startEdit(f)}
                                  className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => {
                                    if (window.confirm('정말 삭제하시겠습니까?')) {
                                      handleDelete(f.id);
                                    }
                                  }}
                                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <Pagination 
                currentPage={freelancerPage} 
                totalItems={filteredFreelancers.length} 
                onPageChange={setFreelancerPage} 
              />
            </>
          ) : activeTab === 'orders' ? (
            <>
              <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/50 border-b border-zinc-100">
                        <th className="px-6 py-5 w-12">
                          <input 
                            type="checkbox"
                            checked={selectedIds.length === paginatedOrders.length && paginatedOrders.length > 0}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                          />
                        </th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">상태</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">마감일</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">고객명</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">프리랜서</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">금액 (고객/프리)</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">결제 정보</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">이익률</th>
                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedOrders.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-6 py-20 text-center text-zinc-400 font-bold">
                            검색 결과가 없거나 진행 중인 오더가 없습니다.
                          </td>
                        </tr>
                      ) : (
                        paginatedOrders.map((o) => {
                          const freelancer = freelancers.find(f => f.id === o.freelancerId);
                          
                          // Profit Calculation Logic
                          // Client Price includes VAT (10%)
                          const clientPriceNet = o.clientPrice / 1.1;
                          const cardFee = o.clientPrice * 0.035;
                          
                          // Freelancer Cost for Profit Calculation
                          // User says: "프리랜서 지출예정금액은 vat별도금액이야!" (Business)
                          // User says: "프리랜서 지출예정금액은 3.3% 공제전 금액이야!" (Individual)
                          // In both cases, the base cost for the company is o.freelancerPrice.
                          const freelancerCost = o.freelancerPrice;

                          const profit = clientPriceNet - freelancerCost - cardFee;
                          const profitMargin = clientPriceNet > 0 ? (profit / clientPriceNet) * 100 : 0;

                          // Expected Payment Amount (입금예정금액)
                          const expectedPayment = freelancer?.type === 'business' 
                            ? o.freelancerPrice * 1.1 
                            : o.freelancerPrice * 0.967;
                          
                          return (
                            <tr 
                              key={o.id} 
                              onClick={() => setSelectedOrder(o)}
                              className={`hover:bg-zinc-50 transition-colors cursor-pointer border-b border-zinc-100 last:border-0 group ${selectedIds.includes(o.id) ? 'bg-zinc-50' : ''}`}
                            >
                              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="checkbox"
                                  checked={selectedIds.includes(o.id)}
                                  onChange={() => toggleSelect(o.id)}
                                  className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getOrderStatusColor(o.status)}`}>
                                  {getOrderStatusLabel(o.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-red-500">
                                {formatDate(o.deadline)}
                              </td>
                              <td className="px-6 py-4 text-sm font-black text-zinc-900">{o.clientName}</td>
                              <td className="px-6 py-4 text-sm font-bold text-zinc-500">
                                {freelancer?.name || 'Unknown'} {freelancer?.type === 'business' ? '(사업자)' : '(개인)'}
                                <p className="text-[10px] text-zinc-400">{o.freelancerEmail}</p>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-zinc-900">
                                ₩{o.clientPrice?.toLocaleString()}
                                <p className="text-[10px] text-blue-600">₩{o.freelancerPrice?.toLocaleString()}</p>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-zinc-500">
                                <div className="flex flex-col">
                                  <span className="text-zinc-900">
                                    {o.paymentMethod === 'cash' ? '현금' : '카드'}
                                    <span className="ml-1 text-[10px] text-blue-600">
                                      ({o.paymentType === 'deposit' ? '계약금' : '완불'})
                                    </span>
                                  </span>
                                  {o.paymentType === 'deposit' && (
                                    <span className="text-[10px] text-red-500">
                                      잔금: ₩{(o.balanceAmount || 0).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-zinc-500">
                                <div className="flex flex-col">
                                  <span className={profitMargin > 0 ? 'text-green-600' : 'text-zinc-400'}>
                                    {profitMargin.toFixed(1)}%
                                  </span>
                                  <span className="text-[10px] text-red-500 font-black">
                                    입금: ₩{Math.round(expectedPayment).toLocaleString()}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startEdit(o);
                                    }}
                                    className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (window.confirm('정말 삭제하시겠습니까?')) {
                                        handleDelete(o.id);
                                      }
                                    }}
                                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <Pagination 
                currentPage={orderPage} 
                totalItems={filteredOrders.length} 
                onPageChange={setOrderPage} 
              />
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-24">
              <AnimatePresence mode="popLayout">
                {currentItems.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item.id}
                    className="group relative bg-white rounded-[32px] overflow-hidden border border-zinc-100 shadow-sm"
                    style={{ width: '295px', height: '530px' }}
                  >
                    <img 
                      src={item.thumbnail || item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-zinc-950 text-white w-fit">
                        {item.category}
                      </span>
                      {item.title && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white text-zinc-950 w-fit shadow-sm">
                          {item.title}
                        </span>
                      )}
                    </div>

                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(item.id);
                      }}
                      className={`absolute top-4 right-4 w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all z-10 ${
                        selectedIds.includes(item.id) 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                          : 'bg-white/20 backdrop-blur-md border-white/40 text-transparent hover:border-white'
                      }`}
                    >
                      <Plus size={20} className={selectedIds.includes(item.id) ? 'rotate-45' : ''} />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        {confirmDeleteId === item.id ? (
                          <div className="flex-1 flex gap-2">
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all"
                            >
                              Confirm Delete
                            </button>
                            <button 
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-4 py-3 bg-white text-zinc-950 rounded-xl font-bold text-sm hover:bg-zinc-100 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => startEdit(item)}
                              className="flex-1 py-3 bg-white text-zinc-950 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all"
                            >
                              <Edit2 size={16} /> Edit
                            </button>
                            <button 
                              onClick={() => setConfirmDeleteId(item.id)}
                              className="p-3 bg-red-600/20 backdrop-blur-md text-red-500 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Delete Confirmation Modal */}
      <AnimatePresence>
        {selectedFreelancer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedFreelancer(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter">프리랜서 상세 정보</h3>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Freelancer Details</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFreelancer(null)}
                  className="p-3 hover:bg-zinc-100 rounded-2xl transition-all text-zinc-400 hover:text-zinc-950"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* Status & Basic Info */}
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <select 
                      value={selectedFreelancer.status}
                      onChange={async (e) => {
                        try {
                          try {
                            await updateDoc(doc(db, 'freelancers', selectedFreelancer.id), { status: e.target.value });
                            setSelectedFreelancer({ ...selectedFreelancer, status: e.target.value });
                            toast.success('상태가 변경되었습니다.');
                          } catch (error) {
                            handleFirestoreError(error, OperationType.UPDATE, 'freelancers');
                          }
                        } catch (error) {
                          toast.error('상태 변경 실패');
                        }
                      }}
                      className="px-6 py-3 bg-zinc-100 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-zinc-950 outline-none"
                    >
                      <option value="pending">심사중</option>
                      <option value="approved">승인</option>
                      <option value="rejected">비승인</option>
                    </select>
                    <span className="text-zinc-400 text-sm font-bold flex items-center gap-2">
                      <Clock size={16} /> {formatDateTime(selectedFreelancer.createdAt)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => startEdit(selectedFreelancer)}
                      className="px-6 py-3 bg-zinc-100 text-zinc-900 rounded-2xl font-bold text-sm hover:bg-zinc-200 transition-all flex items-center gap-2"
                    >
                      <Edit2 size={16} /> Edit Info
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSelectedFreelancer(null)}
                      className="p-3 hover:bg-zinc-100 rounded-2xl transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Name</p>
                    <p className="text-xl font-black">{selectedFreelancer.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Type</p>
                    <p className="text-xl font-black">{selectedFreelancer.type === 'business' ? '개인사업자' : '개인'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      selectedFreelancer.status === 'approved' ? 'bg-green-100 text-green-600' :
                      selectedFreelancer.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {selectedFreelancer.status}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Email</p>
                    <a href={`mailto:${selectedFreelancer.email}`} className="text-lg font-bold text-zinc-700 hover:text-blue-600 underline">{selectedFreelancer.email}</a>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Phone</p>
                    <p className="text-lg font-bold text-zinc-700">{selectedFreelancer.phone}</p>
                  </div>
                </div>

                {/* Bank Info */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Bank Account Info</p>
                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 font-bold text-zinc-700">
                    {selectedFreelancer.bankAccountInfo || '등록된 계좌 정보가 없습니다.'}
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Experience & Intro</p>
                  <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 text-zinc-700 font-medium leading-relaxed whitespace-pre-wrap">
                    {selectedFreelancer.experienceIntro || 'No intro provided.'}
                  </div>
                </div>

                {/* Portfolio Link */}
                {selectedFreelancer.portfolioLink && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Portfolio Link</p>
                    <a 
                      href={selectedFreelancer.portfolioLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-100 transition-all"
                    >
                      <LinkIcon size={16} /> View Portfolio
                    </a>
                  </div>
                )}

                {/* Documents Management */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Document Management</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* ID Card */}
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-3">
                      <p className="text-[10px] font-black text-zinc-400 uppercase">ID Card (신분증)</p>
                      {selectedFreelancer.idCardUrl ? (
                        <div className="flex flex-col gap-2">
                          <a href={selectedFreelancer.idCardUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-blue-600 hover:underline truncate">
                            View Current File
                          </a>
                          <label className="cursor-pointer text-[10px] font-black text-zinc-400 hover:text-zinc-950 transition-all">
                            Replace File
                            <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUploadFreelancerDoc(selectedFreelancer.id, 'id_card', e.target.files[0])} />
                          </label>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-zinc-200 rounded-xl hover:bg-white hover:border-zinc-400 transition-all">
                          <Upload size={16} className="text-zinc-400 mb-1" />
                          <span className="text-[10px] font-bold text-zinc-400">Upload ID Card</span>
                          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUploadFreelancerDoc(selectedFreelancer.id, 'id_card', e.target.files[0])} />
                        </label>
                      )}
                    </div>

                    {/* Business Reg */}
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-3">
                      <p className="text-[10px] font-black text-zinc-400 uppercase">Business Reg (사업자등록증)</p>
                      {selectedFreelancer.businessRegUrl ? (
                        <div className="flex flex-col gap-2">
                          <a href={selectedFreelancer.businessRegUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-blue-600 hover:underline truncate">
                            View Current File
                          </a>
                          <label className="cursor-pointer text-[10px] font-black text-zinc-400 hover:text-zinc-950 transition-all">
                            Replace File
                            <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUploadFreelancerDoc(selectedFreelancer.id, 'business_reg', e.target.files[0])} />
                          </label>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-zinc-200 rounded-xl hover:bg-white hover:border-zinc-400 transition-all">
                          <Upload size={16} className="text-zinc-400 mb-1" />
                          <span className="text-[10px] font-bold text-zinc-400">Upload Business Reg</span>
                          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUploadFreelancerDoc(selectedFreelancer.id, 'business_reg', e.target.files[0])} />
                        </label>
                      )}
                    </div>

                    {/* Bank Account */}
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-3">
                      <p className="text-[10px] font-black text-zinc-400 uppercase">Bank Account (통장사본)</p>
                      {selectedFreelancer.bankAccountUrl ? (
                        <div className="flex flex-col gap-2">
                          <a href={selectedFreelancer.bankAccountUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-blue-600 hover:underline truncate">
                            View Current File
                          </a>
                          <label className="cursor-pointer text-[10px] font-black text-zinc-400 hover:text-zinc-950 transition-all">
                            Replace File
                            <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUploadFreelancerDoc(selectedFreelancer.id, 'bank_account', e.target.files[0])} />
                          </label>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-zinc-200 rounded-xl hover:bg-white hover:border-zinc-400 transition-all">
                          <Upload size={16} className="text-zinc-400 mb-1" />
                          <span className="text-[10px] font-bold text-zinc-400">Upload Bank Copy</span>
                          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUploadFreelancerDoc(selectedFreelancer.id, 'bank_account', e.target.files[0])} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Logs Section */}
                <div className="space-y-6 pt-6 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black flex items-center gap-2">
                      <MessageSquare size={20} /> 상담 및 관리 기록
                    </h4>
                    <span className="text-xs font-bold text-zinc-400">{selectedFreelancer.consultationLogs?.length || 0} entries</span>
                  </div>

                  <div className="space-y-4">
                    {selectedFreelancer.consultationLogs?.map((log: any, idx: number) => (
                      <div key={idx} className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                        <p className="text-[10px] font-bold text-zinc-400 mb-2">{log.date ? new Date(log.date).toLocaleString() : ''}</p>
                        <p className="text-zinc-700 font-medium whitespace-pre-wrap">{log.content}</p>
                      </div>
                    ))}
                    {(!selectedFreelancer.consultationLogs || selectedFreelancer.consultationLogs.length === 0) && (
                      <p className="text-center py-10 text-zinc-400 font-bold italic">기록된 상담 내용이 없습니다.</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <textarea 
                      value={fLogContent}
                      onChange={(e) => setFLogContent(e.target.value)}
                      placeholder="상담 내용을 입력하세요..."
                      className="flex-1 px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950/10 transition-all resize-none h-24"
                    />
                    <button 
                      type="button"
                      onClick={(e) => handleAddFreelancerLog(e, selectedFreelancer.id)}
                      disabled={!fLogContent.trim()}
                      className="px-8 bg-zinc-950 text-white rounded-3xl font-bold text-sm hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      기록 추가
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedConsultation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedConsultation(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter">상담 상세 정보</h3>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Consultation Details</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedConsultation(null)}
                  className="p-3 hover:bg-zinc-100 rounded-2xl transition-all text-zinc-400 hover:text-zinc-950"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* Status & Basic Info */}
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <select 
                      value={selectedConsultation.status}
                      onChange={async (e) => {
                        try {
                          try {
                            await updateDoc(doc(db, 'consultations', selectedConsultation.id), { status: e.target.value });
                            setSelectedConsultation({ ...selectedConsultation, status: e.target.value });
                            toast.success('상태가 변경되었습니다.');
                          } catch (error) {
                            handleFirestoreError(error, OperationType.UPDATE, 'consultations');
                          }
                        } catch (error) {
                          toast.error('상태 변경 실패');
                        }
                      }}
                      className="px-6 py-3 bg-zinc-100 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-zinc-950 outline-none"
                    >
                      <option value="pending">대기중</option>
                      <option value="contacted">상담진행중</option>
                      <option value="consultation_completed">상담완료</option>
                      <option value="in_production">제작중</option>
                      <option value="completed">완료됨</option>
                    </select>
                    <span className="text-zinc-400 text-sm font-bold flex items-center gap-2">
                      <Clock size={16} /> {formatDateTime(selectedConsultation.createdAt)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {(['contacted', 'consultation_completed', 'in_production'].includes(selectedConsultation.status)) && (
                      <button 
                        type="button"
                        onClick={() => {
                          setSelectedConsultationId(selectedConsultation.id);
                          setFName('');
                          setFEmail('');
                          setFPhone('');
                          setFPortfolio('');
                          setFPrice(0);
                          setCPrice(selectedConsultation.finalClientPrice || 0);
                          setDeadline('');
                          // Pre-fill consultation details into notes for the order
                          const logs = selectedConsultation.consultationLogs?.map((log: any) => 
                            `[${formatDateTime(log.date)}] ${log.content}`
                          ).join('\n') || '';
                          
                          const details = `
[고객 정보]
성함: ${selectedConsultation.name}
연락처: ${selectedConsultation.phone}
산업군: ${selectedConsultation.industry || '-'}

[의뢰 내용]
제작 목적: ${selectedConsultation.productionPurpose || '-'}
영상 유형/플랜: ${selectedConsultation.plan || selectedConsultation.videoType || '-'}
수량: ${selectedConsultation.quantity || '-'}
예산: ${selectedConsultation.budget || '-'}
참고 링크: ${selectedConsultation.referenceLink || '-'}

[고객 메시지]
${selectedConsultation.message}

[상담 기록]
${logs}
                          `.trim();
                          
                          setConsultationNotes(details);
                          setCPrice(selectedConsultation.initialPrice || 0);
                          setActiveTab('orders');
                          setSelectedConsultation(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3 bg-zinc-950 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all flex items-center gap-2"
                      >
                        <Plus size={16} /> Create Order
                      </button>
                    )}
                    <button 
                      type="button"
                      onClick={() => downloadConsultationAsText(selectedConsultation)}
                      className="px-6 py-3 bg-white border border-zinc-200 text-zinc-950 rounded-2xl font-bold text-sm hover:bg-zinc-50 transition-all flex items-center gap-2"
                    >
                      <Upload size={16} /> Download Text
                    </button>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Customer Name</p>
                    <p className="text-xl font-black">{selectedConsultation.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Phone Number</p>
                    <p className="text-xl font-black">{selectedConsultation.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Industry</p>
                    <p className="text-xl font-black">{selectedConsultation.industry || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Production Purpose</p>
                    <p className="text-lg font-bold text-zinc-700">{selectedConsultation.productionPurpose || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Video Type / Plan</p>
                    <p className="text-lg font-bold text-zinc-700">{selectedConsultation.plan || selectedConsultation.videoType || '-'}</p>
                  </div>
                  {selectedConsultation.initialPrice > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Initial Plan Price (VAT Incl.)</p>
                      <p className="text-xl font-black text-blue-600">₩{selectedConsultation.initialPrice.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Customer Message</p>
                  <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 text-zinc-700 font-medium leading-relaxed whitespace-pre-wrap">
                    {selectedConsultation.message}
                  </div>
                </div>

                {/* Reference Link */}
                {selectedConsultation.referenceLink && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Reference Link</p>
                    <a 
                      href={selectedConsultation.referenceLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-100 transition-all"
                    >
                      <LinkIcon size={16} /> View Reference
                    </a>
                  </div>
                )}

                {/* Consultation Notes (Final) */}
                {selectedConsultation.consultationNotes && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">최종 상담 메모 / 작업 내용</p>
                    <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 text-zinc-700 font-medium leading-relaxed whitespace-pre-wrap">
                      {selectedConsultation.consultationNotes}
                    </div>
                  </div>
                )}

                {/* Order & Payment I                    <span className="text-xs font-bold text-zinc-400">{selectedConsultation.consultationLogs?.length || 0} entries</span>
                  </div>
 
                  <div className="space-y-4">
                    {selectedConsultation.consultationLogs?.map((log: any, idx: number) => (
                      <div key={idx} className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                        <p className="text-[10px] font-bold text-zinc-400 mb-2">{log.date ? new Date(log.date).toLocaleString() : ''}</p>
                        <p className="text-zinc-700 font-medium whitespace-pre-wrap">{log.content}</p>
                      </div>
                    ))}
                    {(!selectedConsultation.consultationLogs || selectedConsultation.consultationLogs.length === 0) && (
                      <p className="text-center py-10 text-zinc-400 font-bold italic">기록된 상담 내용이 없습니다.</p>
                    )}
                  </div>
div className="space-y-1">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">결제 구분</p>
                          <p className="text-xl font-black">
                            {order.paymentMethod === 'cash' ? (order.paymentType === 'deposit' ? '계약금' : '완불') : '일시불'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">최종 고객 결제금액</p>
                          <p className="text-xl font-black text-blue-600">₩{order.clientPrice?.toLocaleString()}</p>
                        </div>
                        {order.paymentMethod === 'cash' && order.paymentType === 'deposit' && (
                          <>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">계약금 (입금액)</p>
                              <p className="text-xl font-black text-green-600">₩{order.depositAmount?.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">미수금 (잔금)</p>
                              <p className="text-xl font-black text-red-600">₩{order.balanceAmount?.toLocaleString()}</p>
                            </div>
                          </>
                        )}
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">오더 상태</p>
                          <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getOrderStatusColor(order.status)}`}>
                            {getOrderStatusLabel(order.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Logs Section */}
                <div className="space-y-6 pt-6 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black flex items-center gap-2">
                      <MessageSquare size={20} /> 상담 기록
                    </h4>
                    <span className="text-xs font-bold text-zinc-400">{selectedConsultation.consultationLogs?.length || 0} entries</span>
                  </div>

                  <div className="space-y-4">
                    {selectedConsultation.consultationLogs?.map((log: any, idx: number) => (
                      <div key={idx} className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                        <p className="text-[10px] font-bold text-zinc-400 mb-2">{log.date ? new Date(log.date).toLocaleString() : ''}</p>
                        <p className="text-zinc-700 font-medium whitespace-pre-wrap">{log.content}</p>
                      </div>
                    ))}
                    {(!selectedConsultation.consultationLogs || selectedConsultation.consultationLogs.length === 0) && (
                      <p className="text-center py-10 text-zinc-400 font-bold italic">기록된 상담 내용이 없습니다.</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <textarea 
                      value={logContent}
                      onChange={(e) => setLogContent(e.target.value)}
                      placeholder="상담 내용을 입력하세요..."
                      className="flex-1 px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950/10 transition-all resize-none h-24"
                    />
                    <button 
                      type="button"
                      onClick={(e) => handleAddLog(e, selectedConsultation.id)}
                      disabled={!logContent.trim()}
                      className="px-8 bg-zinc-950 text-white rounded-3xl font-bold text-sm hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      기록 추가
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-zinc-950/60 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[48px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-10 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getOrderStatusColor(selectedOrder.status)}`}>
                      {getOrderStatusLabel(selectedOrder.status)}
                    </span>
                    <span className="text-zinc-400 text-sm font-bold flex items-center gap-2">
                      <Clock size={16} /> {formatDateTime(selectedOrder.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black tracking-tight">오더 상세 내역</h3>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-4 bg-white text-zinc-400 hover:text-zinc-900 rounded-2xl shadow-sm transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12">
                {/* Price & Profit Section */}
                {(() => {
                  const freelancer = freelancers.find(f => f.id === selectedOrder.freelancerId);
                  const clientPriceNet = selectedOrder.clientPrice / 1.1;
                  const cardFee = selectedOrder.clientPrice * 0.035;
                  const freelancerCost = selectedOrder.freelancerPrice;
                  const profit = clientPriceNet - freelancerCost - cardFee;
                  const profitMargin = clientPriceNet > 0 ? (profit / clientPriceNet) * 100 : 0;
                  const expectedPayment = freelancer?.type === 'business' 
                    ? selectedOrder.freelancerPrice * 1.1 
                    : selectedOrder.freelancerPrice * 0.967;

                  return (
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">전체 수주 금액 (고객)</p>
                        <p className="text-2xl font-black text-zinc-900">₩{selectedOrder.clientPrice?.toLocaleString()}</p>
                        <p className="text-[10px] text-zinc-400 mt-1">VAT 제외: ₩{Math.round(clientPriceNet).toLocaleString()}</p>
                      </div>
                      <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">프리랜서 오더 금액</p>
                        <p className="text-2xl font-black text-blue-600">₩{selectedOrder.freelancerPrice?.toLocaleString()}</p>
                        <p className="text-[10px] text-red-500 font-bold mt-1">입금예정: ₩{Math.round(expectedPayment).toLocaleString()}</p>
                      </div>
                      <div className="p-6 bg-green-50 rounded-3xl border border-green-100">
                        <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-2">예상 수익 (이익률)</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-black text-green-600">₩{Math.round(profit).toLocaleString()}</p>
                          <p className="text-sm font-bold text-green-500">({profitMargin.toFixed(1)}%)</p>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">카드수수료(3.5%) 제외</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Payment Information Section */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">결제 방식</p>
                    <p className="text-xl font-black text-zinc-900">{selectedOrder.paymentMethod === 'cash' ? '현금 결제' : '카드 결제'}</p>
                  </div>
                  <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">결제 구분</p>
                    <p className="text-xl font-black text-zinc-900">
                      {selectedOrder.paymentMethod === 'cash' ? (selectedOrder.paymentType === 'deposit' ? '계약금' : '완불') : '일시불'}
                    </p>
                  </div>
                  {selectedOrder.paymentMethod === 'cash' && selectedOrder.paymentType === 'deposit' && (
                    <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">미수금 (잔금)</p>
                      <p className="text-xl font-black text-red-600">₩{(selectedOrder.balanceAmount || 0).toLocaleString()}</p>
                      <p className="text-[10px] text-green-600 font-bold mt-1">계약금: ₩{(selectedOrder.depositAmount || 0).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">고객 정보</h4>
                      <div className="space-y-2">
                        <p className="text-lg font-bold text-zinc-900">{selectedOrder.clientName}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">프리랜서 정보</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold text-zinc-900">
                            {(() => {
                              const f = freelancers.find(f => f.id === selectedOrder.freelancerId);
                              return (
                                <>
                                  {f?.name || 'Unknown'}
                                  <span className="text-xs font-medium text-zinc-400 ml-1">
                                    {f?.type === 'business' ? '(사업자)' : '(개인)'}
                                  </span>
                                </>
                              );
                            })()}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-zinc-500">{selectedOrder.freelancerEmail}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">마감 기한</h4>
                      <p className="text-lg font-bold text-red-500 flex items-center gap-2">
                        <Calendar size={18} /> {formatDate(selectedOrder.deadline)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">작업 내용 (Work Content)</h4>
                    <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 min-h-[200px]">
                      <p className="text-zinc-700 font-medium whitespace-pre-wrap leading-relaxed">
                        {selectedOrder.workContent || '작업 내용이 없습니다.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-10 border-t border-zinc-100 flex gap-4">
                  <button 
                    onClick={() => {
                      const freelancer = freelancers.find(f => f.id === selectedOrder.freelancerId);
                      const content = `
[오더 상세 내역]
-----------------------------------------
고객명: ${selectedOrder.clientName}
마감일: ${formatDate(selectedOrder.deadline)}
오더 금액: ₩${selectedOrder.freelancerPrice?.toLocaleString()}

[작업 내용]
-----------------------------------------
${selectedOrder.workContent}
                      `.trim();
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `오더전달_${selectedOrder.clientName}_${freelancer?.name || '프리랜서'}.txt`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      toast.success('프리랜서 전달용 텍스트가 다운로드되었습니다.');
                    }}
                    className="flex-1 py-5 bg-blue-600 text-white rounded-3xl font-black text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                  >
                    <Upload size={20} /> 프리랜서에게 자료 전달 (Text)
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedOrder(null);
                      startEdit(selectedOrder);
                    }}
                    className="px-10 py-5 bg-zinc-950 text-white rounded-3xl font-black text-lg hover:bg-zinc-800 transition-all"
                  >
                    수정하기
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {confirmBulkDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-12 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <Trash2 size={40} />
              </div>
              <h3 className="text-3xl font-black tracking-tighter mb-4">Bulk Delete</h3>
              <p className="text-zinc-500 font-medium mb-10 leading-relaxed">
                선택한 {selectedIds.length}개의 항목을 정말 삭제하시겠습니까?<br />
                이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmBulkDelete(false)}
                  className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBulkDelete}
                  disabled={isBulkDeleting}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-red-100"
                >
                  {isBulkDeleting ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                  Delete All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
