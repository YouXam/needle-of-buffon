let needles = [];
let needleLength = 50;
let lineSpacing = 100;
let totalNeedles = 0;
let intersectedNeedles = 0;
let isContinuous = false;
let lines = []
let min_line = 0
let max_line = 0
let speed = 1
let cur = 0
let max_length = 100000
let avgFrameRate = 0;
let frameCountAvg = 5;

function setup() {
  createCanvas(windowWidth - 10, windowHeight - 40);
  background(0);

  for (let y = lineSpacing * 2; y < height - lineSpacing * 2; y += lineSpacing) {
    line(0, y, width, y);
    lines.push(y);
  }
  min_line = lines.reduce((a, b) => a < b ? a : b);
  max_line = lines.reduce((a, b) => a > b ? a : b);

  let btn1 = createButton('投一根针');
  btn1.mousePressed(() => {
    addNeedle(true);
  });

  let btn2 = createButton('投10根针');
  btn2.mousePressed(() => {
    for (let i = 0; i < 10; i++) {
      addNeedle(false);
    }
  });

  let btn3 = createButton('持续/停止投针');
  btn3.mousePressed(() => {
    isContinuous = !isContinuous;
    speed = 1
  });

  let btn4 = createButton('速度*2');
  btn4.mousePressed(() => {
    speed*=2
  });
}

function draw() {
  background(0);
  stroke(255);
  for (let y of lines) {
    line(0, y, width, y);
  }
  for (let needle of needles) {
    if (!isContinuous) needle.update();
    needle.show();
  }
  fill(255);
  noStroke();
  textSize(16);
  text(`总数: ${totalNeedles}`, 10, 20);
  text(`相交: ${intersectedNeedles}`, 10, 40);
  text(`速度: ${speed}`, 10, 60);
  avgFrameRate = lerp(avgFrameRate, frameRate(), 1 / frameCountAvg);
  text(`帧率: ${avgFrameRate.toFixed(2)} fps`, 10, 80);
  if (speed > 30000) {
    fill(255, 0, 0)
    text(`已禁用画面更新，开启 WASM 优化`, 10, 100);
  }
  fill(255)
  textSize(30)
  text(`π: ${intersectedNeedles ? ((2 * needleLength * totalNeedles) / (intersectedNeedles * lineSpacing)).toFixed(10) : 'N/A'}`, 500, 60);
  textSize(10)
  // 右下角版权
  text('© 2023 @YouXam', width - 100, height - 10)

  if (isContinuous) {
    if (window.addNeedle2 === undefined || speed < 30000) {
      for (let i = 1; i <= speed; i++)
        addNeedle(false);
    } else {
      intersectedNeedles += window.addNeedle2(lines, width, speed)
      totalNeedles += speed
    }
  }
}

function addNeedle(showDetails) {
  const newNeedle = new Needle(random(width), random(min_line, max_line), random(TWO_PI), showDetails);
  if (!showDetails) newNeedle.animationProgress = 1, newNeedle.end = 1, newNeedle.isIntersected()
  if (speed <= 30000) {
    if (needles.length >= max_length) { 
      needles[cur++] = newNeedle;
      if (cur >= max_length) cur = 0
    } else needles.push(newNeedle);
  }
  totalNeedles++;
}

class Needle {
  constructor(x, y, angle, showDetails) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.showDetails = showDetails;
    this.animationProgress = 0.0;
    this.end = 0
  }

  update() {
    if (this.end) return
    this.animationProgress += 0.05;
    if (this.animationProgress > 1) {
      this.animationProgress = 1;
      this.end = 1
    }
  }

  isIntersected() {
    if (this.end && this.isIntersectedRes) return this.isIntersectedRes
    let distance = lines.map(x =>  Math.abs(this.y - x)).reduce((a, b) => a < b ? a : b);
    const res = distance <= (needleLength * this.animationProgress / 2) * Math.abs(Math.sin(this.angle));
    if (this.end) {
      this.isIntersectedRes = res
      if (res) intersectedNeedles++
    }
    return res
  }

  show() {
    stroke(this.isIntersected() ? color(255, 0, 0) : 255);
    if (!this.end) {
      this.x1 = this.x - (cos(this.angle) * needleLength) / 2 * this.animationProgress;
      this.y1 = this.y - (sin(this.angle) * needleLength) / 2 * this.animationProgress;
      this.x2 = this.x + (cos(this.angle) * needleLength) / 2 * this.animationProgress;
      this.y2 = this.y + (sin(this.angle) * needleLength) / 2 * this.animationProgress;
    } else {
      this.x1 = this.x - (cos(this.angle) * needleLength) / 2;
      this.y1 = this.y - (sin(this.angle) * needleLength) / 2;
      this.x2 = this.x + (cos(this.angle) * needleLength) / 2;
      this.y2 = this.y + (sin(this.angle) * needleLength) / 2;
    }
    line(this.x1, this.y1, this.x2, this.y2);
  }
}

