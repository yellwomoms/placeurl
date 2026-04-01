export const REFERENCE_CATEGORIES = [
  '쇼핑·리뷰',
  '뷰티·패션',
  '푸드·맛집',
  '매장·홍보',
  '부업·경제',
  '헬스·운동',
  '게임·클립',
  '동물·힐링',
  '여행·브이로그'
] as const;

export type ReferenceCategory = typeof REFERENCE_CATEGORIES[number];
