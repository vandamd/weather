const { createCanvas, registerFont } = require("canvas");
const fs = require("fs");
const path = require("path");

const fontPath = path.join(__dirname, "../assets/fonts/PublicSans-Regular.ttf");
registerFont(fontPath, { family: "PublicSans" });

const appConfig = JSON.parse(fs.readFileSync("app.json", "utf8"));
const appName = appConfig.expo.name;
const firstLetter = appName.charAt(0).toUpperCase();

const size = 100;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "black";
ctx.fillRect(0, 0, size, size);

ctx.fillStyle = "white";
ctx.font = "85.4px PublicSans";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText(firstLetter, size / 2 - 1, size / 2 + 0.5);

const outputPath = path.join(__dirname, "../assets/images/icon.png");
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const buffer = canvas.toBuffer("image/png");
fs.writeFileSync(outputPath, buffer);

console.log(`Icon saved to ${outputPath}`);
