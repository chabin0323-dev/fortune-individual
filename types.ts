
export interface FortuneCategory {
  luck: number; // 1-5 rating
  text: string;
}

export interface Fortune {
  overall: FortuneCategory;
  money: FortuneCategory;
  health: FortuneCategory;
  love: FortuneCategory;
  work: FortuneCategory;
  luckyItem: string;
  luckyNumber: string;
}

export interface UserInfo {
    name: string;
    year: string;
    month: string;
    day: string;
    bloodType: string;
    zodiacSign: string;
    eto: string;
}

export interface YearlyFortuneContent {
  title: string;
  text: string;
}
