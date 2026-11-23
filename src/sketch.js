// p5.js 2.4.0 立体（WEBGL）スケッチ ── インスタンスモード
// p5の関数・定数はすべて p. を付けて呼ぶ（例：p.box(), p.WEBGL）
// ドラッグで回転、ホイールでズーム、右ドラッグで平行移動
export function sketch(p) {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
  };

  p.draw = () => {
    p.background(17);
    p.orbitControl();
    p.normalMaterial();

    const t = p.frameCount * 0.01;

    // 中央：トーラス
    p.push();
    p.rotateX(t);
    p.rotateY(t * 0.7);
    p.torus(120, 40, 48, 24);
    p.pop();

    // 左：立方体
    p.push();
    p.translate(-300, 0, 0);
    p.rotateY(t);
    p.box(100);
    p.pop();

    // 右：球
    p.push();
    p.translate(300, 0, 0);
    p.sphere(60);
    p.pop();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}
