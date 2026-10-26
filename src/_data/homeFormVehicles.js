const fs = require("node:fs");
const path = require("node:path");
// 公開中の車種だけを選択肢に使用。その他は自由入力で受け付ける。
module.exports = () => fs.readdirSync(path.join(__dirname, "vehicles"))
  .filter(name => name.endsWith(".json"))
  .map(name => JSON.parse(fs.readFileSync(path.join(__dirname, "vehicles", name), "utf8")))
  .filter(v => !v.draft)
  .map(v => ({maker: v.maker, makerJa: v.makerJa, model: v.model, nameJa: v.nameJa}));
