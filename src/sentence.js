// 入力欄の文字列 → 文の構造
//
// 各欄はスペース区切りで、最初の語が中心の単語、残りが修飾語（トキポナは修飾語が後ろにつく）。
//   sentence = { subject: Phrase | null, predicate: Phrase, object: Phrase | null }
//   Phrase   = { head: 辞書の項目, modifiers: 辞書の項目[] }
// null は空の項（使っていない格）。

import { lookup } from './dictionary.js';

function parsePhrase(text, unknown) {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return null;
  const entries = tokens.map((t) => {
    const e = lookup(t);
    if (!e) unknown.push(t);
    return e;
  });
  return { head: entries[0], modifiers: entries.slice(1) };
}

export function parseSentence({ subject, predicate, object }) {
  const errors = [];
  const unknown = [];
  const sentence = {
    subject: parsePhrase(subject, unknown),
    predicate: parsePhrase(predicate, unknown),
    object: parsePhrase(object, unknown),
  };
  if (!sentence.predicate) errors.push('述語を入力してください。');
  if (unknown.length > 0) {
    errors.push(`辞書にない単語があります：${[...new Set(unknown)].join(', ')}`);
  }
  return errors.length > 0 ? { sentence: null, errors } : { sentence, errors };
}

// 文に含まれる単語の番号（辞書の表で強調する用）
export function usedIndices(sentence) {
  const set = new Set();
  if (!sentence) return set;
  for (const ph of [sentence.subject, sentence.predicate, sentence.object]) {
    if (!ph) continue;
    [ph.head, ...ph.modifiers].forEach((e) => set.add(e.index));
  }
  return set;
}
