// p5.js 2.4.0 平面（2D）スケッチ ── インスタンスモード
// p5の関数・定数はすべて p. を付けて呼ぶ（例：p.circle(), p.mouseX）

function word(p, word, place) {
  // word = [R, W, G, B]みたいな感じ
  // place = [0, 200]
  const colors = {
    R: [255, 0, 0],
    B: [0, 0, 255],
    G: [0, 255, 0],
    W: [255, 255, 255],
  };
  p.push();
  for (let i = 3; i >= 0; i--) {
    p.strokeWeight(4);
    p.stroke(0);
    p.fill(colors[word[i]]);
    p.circle(place[0], place[1], i * 40 + 40);
  }
  p.pop();
}

export function sketch(p) {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.background(17);
    word(p, ["R", "G", "B", "W"], [200, 200]);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}
