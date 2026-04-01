import { motion } from 'motion/react';
import { Globe, Search, BarChart3, Target, MousePointer2, Share2 } from 'lucide-react';

const SERVICES = [
  {
    icon: <Search size={32} />,
    title: '검색 광고 (SA)',
    description: '네이버, 구글 검색 결과 상단 노출로 잠재 고객의 직접적인 유입을 유도합니다.',
    features: ['키워드 분석', '입찰가 최적화', '성과 분석 리포트']
  },
  {
    icon: <Globe size={32} />,
    title: '디스플레이 광고 (DA)',
    description: '타겟 고객이 주로 이용하는 매체에 배너를 노출하여 브랜드 인지도를 높입니다.',
    features: ['정밀 타겟팅', '리마케팅 전략', '비주얼 소재 제작']
  },
  {
    icon: <Share2 size={32} />,
    title: 'SNS 마케팅',
    description: '인스타그램, 페이스북 채널 운영 및 광고 집행으로 고객과의 소통을 강화합니다.',
    features: ['콘텐츠 기획', '인플루언서 협업', '커뮤니티 관리']
  }
];

export default function OnlineAds() {
  return (
    <div className="bg-white min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
              Digital Marketing
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">
            Online <span className="text-blue-600 italic">Advertising.</span>
          </h1>
          <p className="text-xl text-zinc-500 font-medium max-w-2xl">
            디지털 환경에서 브랜드의 가치를 극대화하고 실질적인 성과를 만들어내는 온라인 광고 전략을 제안합니다.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 bg-zinc-50 rounded-[40px] hover:bg-white hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                {service.icon}
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-4">{service.title}</h3>
              <p className="text-zinc-500 font-medium leading-relaxed mb-8">
                {service.description}
              </p>
              <ul className="space-y-3">
                {service.features.map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-sm font-black text-zinc-400 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
