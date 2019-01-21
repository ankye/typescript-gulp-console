let { createCanvas } = require("canvas");
var fs = require("fs");
var path = require("path");

var DEBUG_TEXT_SHOW = true; //是否显示网格行列

var colorMap = [
  "rgba(255,255,255,0.4)",
  "rgba(134,166,1,0.4)",
  "rgba(144,114,98,0.4)",
  "rgba(47,59,75,0.4)",
  "rgba(27,158,255,0.4)"
];

function drawText(ctx: any, x: number, y: number, row: number, col: number) {
  ctx.save();

  var fontSize = 12;
  ctx.font = fontSize + "px Microsoft Yahei";
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(row + "," + col, x, y);

  ctx.restore();
}
function drawPath(
  ctx: any,
  x: number,
  y: number,
  width: number,
  height: number
) {
  var i, ang;

  ang = (Math.PI * 2) / 4; //旋转的角度
  ctx.save(); //保存状态
  ctx.fillStyle = colorMap[1]; //填充红色，半透明
  ctx.strokeStyle = "hsl(120,50%,50%)"; //填充绿色
  ctx.lineWidth = 1; //设置线宽
  ctx.translate(x, y); //原点移到x,y处，即要画的多边形中心
  ctx.moveTo(0, -height / 2.0); //据中心r距离处画点
  ctx.beginPath();
  for (i = 0; i < 4; i++) {
    ctx.rotate(ang); //旋转
    let r = -height / 2.0;
    if ((i + 1) % 2 == 1) {
      r = -width / 2.0;
    }
    ctx.lineTo(0, r); //据中心r距离处连线
  }

  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore(); //返回原始状态
}

function getStaggeredRowCol(x: number, y: number, tw: number, th: number): any {
  x = x;
  y = y;
  var halfw = tw / 2.0;
  var halfh = th / 2.0;
  let pX = x - halfw;
  let pY = y - halfh;

  let tx = Math.floor((pX + (pY - halfh) * 2) / tw);
  let ty = Math.floor((pY - (pX - halfw) * 0.5) / th);

  let row = ty + tx + 1;
  let col = Math.floor((tx - ty) / 2) + 1 - 1 * (row % 2);
  return [row, col];
}
function getStaggeredXY(row: number, col: number, tw: number, th: number): any {
  var halfw = tw / 2.0;
  var halfh = th / 2.0;
  let x = col * tw + halfw;
  if (row % 2 == 1) {
    x += halfw;
  }
  let y = row * halfh + halfh;
  return [x, y];
}

function drawRect(ctx: any, row: number, col: number, tw: number, th: number) {
  let point = getStaggeredXY(row, col, tw, th);
  ctx.lineWidth = 1;
  drawPath(ctx, point[0], point[1], tw, th);
  if (DEBUG_TEXT_SHOW) {
    drawText(ctx, point[0], point[1], row, col);
  }
  let p = getStaggeredRowCol(point[0], point[1] - th / 4.0, tw, th);
  if (p[0] != row && p[1] != col) {
    console.log("row and col", row, col, p);
  }
}

function getFilePath(filename: string): string {
  let outPath = path.join(__dirname, filename);
  return outPath;
}

function drawMap(
  name: string,
  width: number,
  height: number,
  rows: number,
  cols: number
) {
  let canvas = createCanvas(width, height);
  let ctx = canvas.getContext("2d");
  console.log("rows,cols", rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      drawRect(ctx, i, j, 10, 10);
    }
  }
  let outPath = getFilePath("../assets/" + name + ".png");
  console.log("==> output map png:%s", outPath);

  canvas.createPNGStream().pipe(fs.createWriteStream(outPath));
}

export default drawMap;
