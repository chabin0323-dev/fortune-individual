export interface FortuneCategory {
  luck: number;
  text: string;
}

export interface WeeklyBiorhythmItem {
  date: string;
  day: string;
  luck: number;
  comment: string;
}

export interface Fortune {
  overall: FortuneCategory;
  money: FortuneCategory;
  health: FortuneCategory;
  love: FortuneCategory;
  work: FortuneCategory;
  advice: string;
  weeklyBiorhythm: WeeklyBiorhythmItem[];
  luckyItem: string;
  luckyColor: string;
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
