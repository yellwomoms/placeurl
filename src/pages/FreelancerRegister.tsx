import React, { useState, useEffect } from 'react';
import { User, Building2, Send, CheckCircle2, Mail, Phone, Info, Loader2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getCountFromServer, query, where } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebase';
import { toast } from 'sonner';

export default function FreelancerRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'individual' as 'individual' | 'business',
    experienceIntro: '',
    portfolioLink: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [approvedCount, setApprovedCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  useEffect(() => {
    const checkApprovedCount = async () => {
      try {
        const q = query(collection(db, 'freelancers'), where('status', '==', 'approved'));
        const snapshot = await getCountFromServer(q);
        setApprovedCount(snapshot.data().count);
      } catch (error) {
        console.error('Error fetching approved count:', error);
      } finally {
        setIsLoadingCount(false);
      }
    };
    checkApprovedCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.experienceIntro) {
      toast.error('필수 정보를 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Save to Firestore
      await addDoc(collection(db, 'freelancers'), {
        ...formData,
        status: 'pending',
        consultationLogs: [],
        createdAt: serverTimestamp()
      });

      // 2. Send notification via n8n if configured
      try {
        const n8nWebhookUrl = (import.meta as any).env.VITE_N8N_WEBHOOK_URL;
        if (n8nWebhookUrl) {
          await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...formData,
              source: 'Freelancer Registration',
              timestamp: new Date().toISOString()
            })
          });
        }
      } catch (error) {
        console.error('Failed to send n8n notification:', error);
      }

      setIsSuccess(true);
      toast.success('프리랜서 등록 신청이 완료되었습니다. 심사 후 연락드리겠습니다!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'freelancers');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="py-24 bg-zinc-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Join Our <span className="text-zinc-300">Network.</span></h2>
          <p className="text-base text-zinc-500 font-medium max-w-xl mx-auto">
            PlaceURL과 함께 성장할 역량 있는 프리랜서 분들을 모집합니다. 
            전문성을 발휘하여 최고의 결과물을 함께 만들어가요.
          </p>
        </motion.div>

        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-zinc-200/50 relative overflow-hidden">
          {isLoadingCount ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="animate-spin text-zinc-200" size={48} />
              <p className="text-sm font-bold text-zinc-400 animate-pulse">모집 현황 확인 중...</p>
            </div>
          ) : approvedCount !== null && approvedCount >= 50 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 md:py-20"
            >
              <div className="w-20 h-20 bg-zinc-50 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-10">
                <Heart size={40} className="fill-zinc-100" />
              </div>
              
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-zinc-400 font-bold text-sm">지원해주셔서 감사합니다.</p>
                  <h3 className="text-2xl md:text-3xl font-black text-zinc-950 leading-tight">
                    영상제작 프리랜서 모집이<br />
                    내부 선정 기준에 따라 정원 마감되었습니다.
                  </h3>
                </div>

                <div className="h-px w-12 bg-zinc-100 mx-auto" />

                <p className="text-base text-zinc-500 font-medium leading-relaxed">
                  현재 접수된 지원서는<br />
                  하나씩 신중하게 검토 중이며,<br />
                  확인 완료 후 개별적으로 안내드릴 예정입니다.
                </p>

                <div className="space-y-1 pt-4">
                  <p className="text-zinc-950 font-bold">함께할 수 있는 분들과의 좋은 인연을 기대하겠습니다.</p>
                  <p className="text-zinc-400 font-bold text-sm">감사합니다.</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {!isSuccess ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-8"
              >
                {/* Registration Type */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Registration Type *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'individual' }))}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.type === 'individual' 
                        ? 'border-zinc-950 bg-zinc-950 text-white shadow-lg' 
                        : 'border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-200'
                      }`}
                    >
                      <User size={24} />
                      <span className="font-bold text-sm">개인</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'business' }))}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.type === 'business' 
                        ? 'border-zinc-950 bg-zinc-950 text-white shadow-lg' 
                        : 'border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-200'
                      }`}
                    >
                      <Building2 size={24} />
                      <span className="font-bold text-sm">개인사업자</span>
                    </button>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="성함" 
                      className="w-full border-b border-zinc-100 py-3 focus:border-zinc-950 outline-none transition-colors font-bold text-base" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com" 
                      className="w-full border-b border-zinc-100 py-3 focus:border-zinc-950 outline-none transition-colors font-bold text-base" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Contact *</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="010-0000-0000" 
                    className="w-full border-b border-zinc-100 py-3 focus:border-zinc-950 outline-none transition-colors font-bold text-base" 
                    required
                  />
                </div>

                {/* Experience & Intro */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Experience & Introduction *</label>
                  <textarea 
                    name="experienceIntro"
                    value={formData.experienceIntro}
                    onChange={handleChange}
                    rows={4} 
                    placeholder="주요 경력 사항과 자기소개를 자유롭게 작성해주세요." 
                    className="w-full border-b border-zinc-100 py-3 focus:border-zinc-950 outline-none transition-colors font-bold text-base resize-none" 
                    required
                  />
                </div>

                {/* Portfolio URL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Portfolio URL</label>
                  <input 
                    type="text" 
                    name="portfolioLink"
                    value={formData.portfolioLink}
                    onChange={handleChange}
                    placeholder="https://..." 
                    className="w-full border-b border-zinc-100 py-3 focus:border-zinc-950 outline-none transition-colors font-bold text-base" 
                  />
                  <p className="text-xs text-zinc-400 font-medium italic">
                    * 포트폴리오 URL이 없는 경우, 신청 완료 후 <span className="text-zinc-900 font-bold">placeurl.com@gmail.com</span>으로 별도 발송 부탁드립니다.
                  </p>
                </div>

                {/* Document Info Box */}
                <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 flex gap-4 items-start">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-zinc-950 shadow-sm shrink-0">
                    <Info size={20} />
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-sm text-zinc-950">심사 후 서류 제출 안내</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      심사 후 <span className="text-zinc-950 font-bold">"승인"</span>이 완료되면 아래 서류를 당사 이메일로 보내주셔야 합니다.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="p-3 bg-white rounded-xl border border-zinc-100">
                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">개인</p>
                        <p className="text-[11px] font-bold text-zinc-700">신분증 사본 + 계좌 정보</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-zinc-100">
                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">개인사업자</p>
                        <p className="text-[11px] font-bold text-zinc-700">사업자등록증 사본 + 계좌 정보</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-zinc-950 text-white py-6 rounded-2xl font-black text-lg hover:bg-zinc-800 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '신청 중...' : '프리랜서 등록 신청하기'} <Send size={20} />
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-black text-zinc-950 mb-3">신청이 완료되었습니다!</h3>
                <p className="text-base text-zinc-500 font-medium mb-8">
                  꼼꼼히 검토 후 <br />
                  빠른 시일 내에 연락드리겠습니다.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="px-8 py-3 bg-zinc-950 text-white rounded-full font-bold hover:bg-zinc-800 transition-all"
                >
                  돌아가기
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  </section>
);
}
