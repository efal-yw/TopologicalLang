// p5.js 2.4.0 平面（2D）スケッチ ── インスタンスモード
// p5の関数・定数はすべて p. を付けて呼ぶ（例：p.circle(), p.mouseX）
//
// 文をグラフとして描く。
//   ・述語を中心に置き、述語とその修飾語を1つの円で囲む。述語は振動させる。
//   ・主格は左、対格は右。格は述語からの距離で表す（DISTANCE）。
//   ・使っていない格は空の項（白い丸1つ）。
//   ・述語以外の修飾語は、述語から遠い方向へ枝を伸ばしてつなぐ。

import { COLORS } from "./dictionary.js";

const STEP = 40; // 単語の円の間隔（いちばん外側の直径 = STEP * 4）
const RADIUS = STEP * 2; // 単語の外側の半径
export const DISTANCE = { subject: 400, object: 800 }; // 格 → 述語からの距離
const MODIFIER_GAP = 200; // 修飾語の枝の長さ
const ENCLOSURE_PADDING = 64; // 述語の囲みの余白（単語名が収まる大きさ）
const VIBRATION = { amplitude: 4, speed: 0.9 };

// 単語：入れ子になった4つの円。letters[0] がいちばん内側
export function word(p, letters, place, step = STEP) {
  p.push();
  p.strokeWeight(4);
  p.stroke(0);
  for (let i = letters.length - 1; i >= 0; i--) {
    p.fill(COLORS[letters[i]]);
    p.circle(place[0], place[1], i * step + step);
  }
  p.pop();
}

// 空の項：ただの白い丸1つ
function emptyTerm(p, place) {
  p.push();
  p.strokeWeight(4);
  p.stroke(0);
  p.fill(255);
  p.circle(place[0], place[1], RADIUS * 2);
  p.pop();
}

// 文 → 配置（座標は述語の中心が原点）
function layout(sentence) {
  const nodes = [];
  const edges = [];
  const add = (node) => nodes.push(node) - 1;

  // 述語とその修飾語（下方向に並べて、まとめて円で囲む）
  const pred = sentence.predicate;
  const predIndex = add({ entry: pred.head, x: 0, y: 0, vibrate: true });
  let prev = predIndex;
  pred.modifiers.forEach((m, k) => {
    const i = add({ entry: m, x: 0, y: (k + 1) * MODIFIER_GAP });
    edges.push([prev, i]);
    prev = i;
  });
  const half = (pred.modifiers.length * MODIFIER_GAP) / 2;
  const enclosure = { x: 0, y: half, r: half + RADIUS + ENCLOSURE_PADDING };

  // 項（主格は左、対格は右）
  for (const [role, dir] of [
    ["subject", -1],
    ["object", 1],
  ]) {
    const ph = sentence[role];
    const x0 = dir * DISTANCE[role];
    if (!ph) {
      edges.push([predIndex, add({ entry: null, x: x0, y: 0 })]);
      continue;
    }
    let prevArg = add({ entry: ph.head, x: x0, y: 0 });
    edges.push([predIndex, prevArg]);
    ph.modifiers.forEach((m, k) => {
      const i = add({ entry: m, x: x0 + dir * (k + 1) * MODIFIER_GAP, y: 0 });
      edges.push([prevArg, i]);
      prevArg = i;
    });
  }
  return { nodes, edges, enclosure };
}

function bounds({ nodes, enclosure }, labels) {
  const below = labels ? 50 : 0;
  let minX = enclosure.x - enclosure.r;
  let maxX = enclosure.x + enclosure.r;
  let minY = enclosure.y - enclosure.r;
  let maxY = enclosure.y + enclosure.r;
  for (const n of nodes) {
    minX = Math.min(minX, n.x - RADIUS);
    maxX = Math.max(maxX, n.x + RADIUS);
    minY = Math.min(minY, n.y - RADIUS);
    maxY = Math.max(maxY, n.y + RADIUS + below);
  }
  return { minX, maxX, minY, maxY };
}

// getState() は { sentence, showLabels } を返す関数（Reactから最新の状態を渡す）
export function makeSketch(getState) {
  return (p, container) => {
    p.setup = () => {
      p.createCanvas(container.clientWidth, container.clientHeight);
    };

    p.draw = () => {
      // 画面の大きさに合わせる
      if (
        p.width !== container.clientWidth ||
        p.height !== container.clientHeight
      ) {
        p.resizeCanvas(container.clientWidth, container.clientHeight);
      }
      p.background(17);

      const { sentence, showLabels } = getState();
      if (!sentence) {
        p.noStroke();
        p.fill(160);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
        p.text(
          "文を入力して「実行」を押してください",
          p.width / 2,
          p.height / 2,
        );
        return;
      }

      const g = layout(sentence);
      const b = bounds(g, showLabels);
      const margin = 40;
      const s = Math.min(
        (p.width - margin * 2) / (b.maxX - b.minX),
        (p.height - margin * 2) / (b.maxY - b.minY),
        1,
      );

      const jitter =
        Math.sin(p.frameCount * VIBRATION.speed) * VIBRATION.amplitude;
      const pos = (n) => [n.x + (n.vibrate ? jitter : 0), n.y];

      p.push();
      p.translate(p.width / 2, p.height / 2);
      p.scale(s);
      p.translate(-(b.minX + b.maxX) / 2, -(b.minY + b.maxY) / 2);

      // 枝
      p.stroke(150);
      p.strokeWeight(4);
      for (const [a, c] of g.edges) {
        const [x1, y1] = pos(g.nodes[a]);
        const [x2, y2] = pos(g.nodes[c]);
        p.line(x1, y1, x2, y2);
      }

      // 述語の囲み
      p.noFill();
      p.stroke(220);
      p.strokeWeight(3);
      p.circle(g.enclosure.x, g.enclosure.y, g.enclosure.r * 2);

      // 単語と空の項
      for (const n of g.nodes) {
        const place = pos(n);
        if (n.entry) word(p, n.entry.qualities, place);
        else emptyTerm(p, place);

        if (showLabels && n.entry) {
          // 枝と重なっても読めるように、背景を敷いてから書く
          const ty = place[1] + RADIUS + 10;
          p.textSize(28);
          const tw = p.textWidth(n.entry.word);
          p.noStroke();
          p.fill(17);
          p.rect(place[0] - tw / 2 - 6, ty - 2, tw + 12, 36, 4);
          p.fill(230);
          p.textAlign(p.CENTER, p.TOP);
          p.text(n.entry.word, place[0], ty);
        }
      }
      p.pop();
    };
  };
}
