import { useMemo, useRef, useState } from 'react';
import P5Canvas from './P5Canvas.jsx';
import { makeSketch, DISTANCE } from './sketch.js';
import { COLORS, DICTIONARY } from './dictionary.js';
import { parseSentence, usedIndices } from './sentence.js';

// 辞書の表に出す、単語の小さな図（入れ子の円）
function WordIcon({ qualities }) {
  const rgb = (q) => `rgb(${COLORS[q].join(',')})`;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
      {[3, 2, 1, 0].map((i) => (
        <circle key={i} cx="18" cy="18" r={(i + 1) * 4} fill={rgb(qualities[i])} stroke="#000" strokeWidth="1" />
      ))}
    </svg>
  );
}

export default function App() {
  const [inputs, setInputs] = useState({ subject: '', predicate: '', object: '' });
  const [errors, setErrors] = useState([]);
  const [used, setUsed] = useState(new Set());
  const [showLabels, setShowLabels] = useState(true);
  const [filter, setFilter] = useState('');

  // スケッチは一度だけ作り、最新の状態は ref 経由で読ませる
  const stateRef = useRef({ sentence: null, showLabels: true });
  const sketch = useMemo(() => makeSketch(() => stateRef.current), []);

  const run = (e) => {
    e.preventDefault();
    const { sentence, errors } = parseSentence(inputs);
    setErrors(errors);
    if (sentence) {
      stateRef.current = { ...stateRef.current, sentence };
      setUsed(usedIndices(sentence));
    }
  };

  const toggleLabels = (e) => {
    setShowLabels(e.target.checked);
    stateRef.current = { ...stateRef.current, showLabels: e.target.checked };
  };

  const field = (key, placeholder) => (
    <input
      value={inputs[key]}
      placeholder={placeholder}
      onChange={(e) => setInputs({ ...inputs, [key]: e.target.value })}
      spellCheck={false}
    />
  );

  const rows = DICTIONARY.filter((e) => e.word.includes(filter.trim().toLowerCase()));

  return (
    <div className="app">
      <form className="input-bar" onSubmit={run}>
        {field('subject', '主格（空でも可）')}
        <span className="particle">li</span>
        {field('predicate', '述語')}
        <span className="particle">e</span>
        {field('object', '対格（空でも可）')}
        <button type="submit">実行</button>
        <label className="toggle">
          <input type="checkbox" checked={showLabels} onChange={toggleLabels} />
          単語名を表示
        </label>
      </form>
      {errors.length > 0 && (
        <div className="errors">
          {errors.map((m) => (
            <p key={m}>{m}</p>
          ))}
        </div>
      )}

      <main>
        <div className="stage">
          <P5Canvas sketch={sketch} className="canvas" />
          <div className="legend">
            主格＝距離 {DISTANCE.subject}（左）／ 対格＝距離 {DISTANCE.object}（右）／ 白い丸1つ＝空の項
          </div>
        </div>

        <aside className="dictionary">
          <h2>辞書（{DICTIONARY.length}語）</h2>
          <p className="note">
            番号を4桁の4進数にし、上の桁から内側の円の質にする（R=0, G=1, B=2, W=3）。
          </p>
          <input
            className="filter"
            value={filter}
            placeholder="単語で絞り込み"
            onChange={(e) => setFilter(e.target.value)}
            spellCheck={false}
          />
          <table>
            <thead>
              <tr>
                <th>番号</th>
                <th>4進数</th>
                <th>質</th>
                <th>図</th>
                <th>単語</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.index} className={used.has(e.index) ? 'used' : undefined}>
                  <td>{e.index}</td>
                  <td className="mono">{e.base4}</td>
                  <td className="mono">{e.qualities.join('')}</td>
                  <td>
                    <WordIcon qualities={e.qualities} />
                  </td>
                  <td>{e.word}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </main>
    </div>
  );
}
