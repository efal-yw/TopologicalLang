// p5.js 2.4.0 スターター
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function word() {}

function draw() {
  background(17);
  noFill();
  stroke(255);
  strokeWeight(2);
  // 動作確認用：マウスに追従する円
  circle(mouseX, mouseY, 80);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
