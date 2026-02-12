
import { YearlyFortuneContent } from './types';

export const BLOOD_TYPES: string[] = ['不明', 'A', 'B', 'O', 'AB'];

export const ZODIAC_SIGNS: string[] = [
  '不明', '牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', 
  '乙女座', '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'
];

export const ETO: string[] = [
  '不明', '子 (ね)', '丑 (うし)', '寅 (とら)', '卯 (う)', '辰 (たつ)', '巳 (み)',
  '午 (うま)', '未 (ひつじ)', '申 (さる)', '酉 (とり)', '戌 (いぬ)', '亥 (い)'
];

const CURRENT_YEAR = new Date().getFullYear();
export const YEARS: string[] = ['不明', ...Array.from({ length: 100 }, (_, i) => (CURRENT_YEAR - i).toString())];
export const MONTHS: string[] = ['不明', ...Array.from({ length: 12 }, (_, i) => (i + 1).toString())];
export const DAYS: string[] = ['不明', ...Array.from({ length: 31 }, (_, i) => (i + 1).toString())];

export const YEARLY_FORTUNE_DATA: { [key: string]: YearlyFortuneContent } = {
  overall: {
    title: '今年の総合運',
    text: '努力が実り新ステージへ。恐れず自己投資を。',
  },
  money: {
    title: '今年の金運',
    text: '財運安定。衝動買いを避け、計画的な貯蓄を。',
  },
  love: {
    title: '今年の恋愛運',
    text: '縁が深まる年。運命的な出会いに期待。誠実な対話を大切に。',
  },
  work: {
    title: '今年の仕事運',
    text: '才能が開花し昇進の好機。能力を信じ、周囲と協調して前進を。',
  },
  health: {
    title: '今年の健康運',
    text: '心身の調和が鍵。多忙でも自らを労わり、休息と発散を大切に。',
  },
};
