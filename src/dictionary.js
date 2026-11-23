// 辞書：トキポナの単語 ⇔ 番号 ⇔ 4つの質
//
// 単語の一覧は ku（Toki Pona Dictionary）の基本語 137語（nimi ku suli）。
// 120語（nimi pu）＋ ku で追加された17語を、アルファベット順に並べている。
// 単語を追加するときは、既存の色がずれないように配列の末尾に足すこと。

// 質の色
export const COLORS = {
  R: [255, 0, 0],
  G: [0, 255, 0],
  B: [0, 0, 255],
  W: [255, 255, 255],
};

// 4進数の各桁 → 質（R=0, G=1, B=2, W=3）
export const DIGITS = ['R', 'G', 'B', 'W'];

export const WORDS = [
  'a', 'akesi', 'ala', 'alasa', 'ale', 'anpa', 'ante', 'anu', 'awen', 'e',
  'en', 'epiku', 'esun', 'ijo', 'ike', 'ilo', 'insa', 'jaki', 'jan', 'jasima',
  'jelo', 'jo', 'kala', 'kalama', 'kama', 'kasi', 'ken', 'kepeken', 'kijetesantakalu', 'kili',
  'kin', 'kipisi', 'kiwen', 'ko', 'kokosila', 'kon', 'ku', 'kule', 'kulupu', 'kute',
  'la', 'lanpan', 'lape', 'laso', 'lawa', 'leko', 'len', 'lete', 'li', 'lili',
  'linja', 'lipu', 'loje', 'lon', 'luka', 'lukin', 'lupa', 'ma', 'mama', 'mani',
  'meli', 'meso', 'mi', 'mije', 'misikeke', 'moku', 'moli', 'monsi', 'monsuta', 'mu',
  'mun', 'musi', 'mute', 'n', 'namako', 'nanpa', 'nasa', 'nasin', 'nena', 'ni',
  'nimi', 'noka', 'o', 'oko', 'olin', 'ona', 'open', 'pakala', 'pali', 'palisa',
  'pan', 'pana', 'pi', 'pilin', 'pimeja', 'pini', 'pipi', 'poka', 'poki', 'pona',
  'pu', 'sama', 'seli', 'selo', 'seme', 'sewi', 'sijelo', 'sike', 'sin', 'sina',
  'sinpin', 'sitelen', 'soko', 'sona', 'soweli', 'suli', 'suno', 'supa', 'suwi', 'tan',
  'taso', 'tawa', 'telo', 'tenpo', 'toki', 'tomo', 'tonsi', 'tu', 'unpa', 'uta',
  'utala', 'walo', 'wan', 'waso', 'wawa', 'weka', 'wile',
];

// 同じ単語の別表記
const ALIASES = { ali: 'ale' };

// 番号 → 4桁の4進数（例：27 → "0123"）
export function toBase4(n) {
  return n.toString(4).padStart(4, '0');
}

// 番号 → 質の並び。上の桁が内側の円（[0] がいちばん内側）
export function toQualities(n) {
  return [...toBase4(n)].map((d) => DIGITS[Number(d)]);
}

export const DICTIONARY = WORDS.map((word, index) => ({
  word,
  index,
  base4: toBase4(index),
  qualities: toQualities(index),
}));

const BY_WORD = new Map(DICTIONARY.map((e) => [e.word, e]));

// 単語 → 辞書の項目（見つからなければ null）
export function lookup(word) {
  const w = word.toLowerCase();
  return BY_WORD.get(ALIASES[w] ?? w) ?? null;
}
