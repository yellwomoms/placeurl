import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebase';
import { toast } from 'sonner';

export default function Consult() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    industry: '',
    productionPurpose: '매출 증대',
    videoType: '',
    message: '',
    referenceLink: '',
    plan: '',
    initialPrice: 0,
    quantity: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (location.state?.plan) {
      setFormData(prev => ({ 
        ...prev, 
        plan: location.state.plan,
        initialPrice: location.state.initialPrice || 0
      }));
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.message || !formData.industry) {
      toast.error('필수 정보를 모두 입력해주세요.');
      return;
    }

    // Phone validation (Korean format)
    const phoneRegex = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('올바른 연락처 형식을 입력해주세요. (예: 010-1234-5678)');
      return;
    }

    try {
      setIsSubmitting(true);
      const table = 'consultations';
      
      await addDoc(collection(db, table), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Send notification via Telegram (Directly as requested)
      try {
        const botToken = (import.meta as any).env.VITE_TELEGRAM_BOT_TOKEN || "8562623357:AAEhnm4zTu_7WBTQKeutPFWs3d4rrHpfU2k";
        const chatId = (import.meta as any).env.VITE_TELEGRAM_CHAT_ID || "5333544557";
        
        const message = `
🚀 <b>[PlaceURL 신규 상담 신청]</b>
────────────────
👤 <b>성함/업체명:</b> ${formData.name}
📞 <b>연락처:</b> ${formData.phone}
🏢 <b>업종:</b> ${formData.industry}
🎯 <b>제작 목적:</b> ${formData.productionPurpose}
🔗 <b>레퍼런스:</b> ${formData.referenceLink || '없음'}
📦 <b>선택 플랜:</b> ${formData.plan || '없음'}
🔢 <b>제작 수량:</b> ${formData.quantity || '없음'}
💰 <b>예산 구간:</b> ${formData.budget || '없음'}
📝 <b>요청사항:</b>
${formData.message}
────────────────
        `.trim();

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "HTML"
          })
        });
      } catch (error) {
        console.error('Failed to send Telegram notification:', error);
      }

      // Send notification via n8n if configured
      try {
        const n8nWebhookUrl = (import.meta as any).env.VITE_N8N_WEBHOOK_URL;
        if (n8nWebhookUrl) {
          await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...formData,
              source: 'Consultation Request',
              submittedAt: new Date().toISOString(),
              userAgent: navigator.userAgent,
              pageUrl: window.location.href
            })
          });
        }
      } catch (error) {
        console.error('Failed to send n8n notification:', error);
      }

      setIsSuccess(true);
      toast.success('상담 신청이 완료되었습니다. 곧 연락드리겠습니다!');
      setFormData({
        name: '',
        phone: '',
        industry: '',
        productionPurpose: '매출 증대',
        videoType: '',
        message: '',
        referenceLink: '',
        plan: '',
        initialPrice: 0,
        quantity: '',
        budget: ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'consultations');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const industries = ['커머스/쇼핑몰', 'F&B/식당', '뷰티/패션', 'IT/테크', '교육/강의', '제조/수출', '기타'];
  const purposes = ['매출 증대', '브랜드 인지도', '팔로워 확보', '제품 홍보', '이벤트 행사', '기타'];
  const videoTypes = ['편집 전용 (Editing Only)', '촬영 + 편집 (Filming)', '정기 구독 (Membership)'];
  const quantities = ['1개', '5개', '10개', '30개 이상'];
  const budgets = ['30만원 이하', '30~100만원', '100~300만원', '300만원 이상'];

  return (
    <section id="consult" className="py-48 bg-zinc-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-32"
        >
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 leading-none">Let's <br /><span className="text-zinc-300">Connect.</span></h2>
            <p className="text-lg text-zinc-500 font-medium mb-12 max-w-md leading-relaxed">
              당신의 비즈니스를 한 단계 더 성장시킬 준비가 되셨나요? 
              지금 바로 전문가와 상담을 시작하세요.
            </p>
            
            <div className="space-y-10">
              {[
                { icon: <Mail />, label: 'Email', value: 'placeurl.com@gmail.com' },
                { icon: <Phone />, label: 'Phone', value: '010-4429-2078' },
                { icon: <MapPin />, label: 'Office', value: '인천광역시 연수구 하모니로 188번길 17' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-zinc-950 group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-lg font-bold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-12 md:p-20 rounded-[60px] shadow-2xl shadow-zinc-200/50 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-10"
                >
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Name *</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="성함 또는 업체명" 
                        className="w-full border-b-2 border-zinc-100 py-4 focus:border-zinc-950 outline-none transition-colors font-bold text-lg" 
                        required
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Contact *</label>
                      <input 
                        type="text" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="연락처" 
                        className="w-full border-b-2 border-zinc-100 py-4 focus:border-zinc-950 outline-none transition-colors font-bold text-lg" 
                        required
                      />
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400">업종 *</label>
                    <div className="flex flex-wrap gap-3">
                      {industries.map(industry => (
                        <button
                          key={industry}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, industry }))}
                          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                            formData.industry === industry 
                            ? 'bg-brand-blue text-white shadow-lg' 
                            : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                          }`}
                        >
                          {industry}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Production Purpose */}
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400">제작 목적 *</label>
                    <div className="flex flex-wrap gap-3">
                      {purposes.map(purpose => (
                        <button
                          key={purpose}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, productionPurpose: purpose }))}
                          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                            formData.productionPurpose === purpose 
                            ? 'bg-brand-blue text-white shadow-lg' 
                            : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                          }`}
                        >
                          {purpose}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reference Link */}
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400">레퍼런스 (원하는 스타일 영상 링크 1개)</label>
                    <input 
                      type="text" 
                      name="referenceLink"
                      value={formData.referenceLink}
                      onChange={handleChange}
                      placeholder="https://youtube.com/..." 
                      className="w-full border-b-2 border-zinc-100 py-4 focus:border-zinc-950 outline-none transition-colors font-bold text-lg" 
                    />
                  </div>

                  {/* Conditional Section: Plan vs Simplified Options */}
                  <div className="pt-6 border-t border-zinc-100">
                    {formData.plan ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black uppercase tracking-widest text-zinc-400">선택한 플랜</label>
                          <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, plan: '' }))}
                            className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline"
                          >
                            <X size={14} /> 선택 취소
                          </button>
                        </div>
                        <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-between">
                          <span className="text-xl font-black text-blue-600">{formData.plan}</span>
                          <CheckCircle2 className="text-blue-600" />
                        </div>
                        <p className="text-sm text-zinc-400 font-medium italic">
                          * 선택하신 플랜에 맞춰 상세 상담을 진행해 드립니다.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-10">
                        <div className="space-y-4">
                          <label className="text-xs font-black uppercase tracking-widest text-zinc-400">제작 수량</label>
                          <div className="flex flex-wrap gap-3">
                            {quantities.map(q => (
                              <button
                                key={q}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, quantity: q }))}
                                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                                  formData.quantity === q 
                                  ? 'bg-brand-blue text-white shadow-lg' 
                                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-xs font-black uppercase tracking-widest text-zinc-400">예산 구간</label>
                          <div className="flex flex-wrap gap-3">
                            {budgets.map(b => (
                              <button
                                key={b}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, budget: b }))}
                                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                                  formData.budget === b 
                                  ? 'bg-brand-blue text-white shadow-lg' 
                                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                                }`}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400">요청사항 *</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4} 
                      placeholder="제작하고자 하는 영상의 종류나 요구사항을 자유롭게 적어주세요." 
                      className="w-full border-b-2 border-zinc-100 py-4 focus:border-zinc-950 outline-none transition-colors font-bold text-lg resize-none" 
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0077D6] text-white py-8 rounded-3xl font-black text-xl hover:bg-[#0066B8] hover:scale-[1.02] transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '신청 중...' : '상담 신청하기'} <Send size={24} />
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20"
                >
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-zinc-950 mb-4">신청이 완료되었습니다!</h3>
                  <p className="text-lg text-zinc-500 font-medium mb-12">
                    담당자가 확인 후 <br />
                    빠른 시일 내에 연락드리겠습니다.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="px-10 py-4 bg-zinc-950 text-white rounded-full font-bold hover:bg-zinc-800 transition-all"
                  >
                    새로운 문의하기
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
