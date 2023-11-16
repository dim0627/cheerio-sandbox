import * as cheerio from "cheerio";
import * as fs from "node:fs/promises";

// ファイルを非同期で読み込む
const files = ["./success.html", "./failed.html"];
files.forEach((fileName) => {
  fs.readFile(fileName, { encoding: "utf8" })
    .then((file) => {
      console.log("fileName", fileName);
      const $ = cheerio.load(file);
      const item = $(".s-result-item.s-asin:not(.AdHolder)").first();
      const itemText = $(item).text().trim();

      console.log("itemText", itemText);
      const [pointAmount, pointRate] = ((): [string | null, string | null] => {
        const re = new RegExp(
          String.raw`(${/[\d,]*/.source})ポイント\((\d*)%\)`
        );
        const [, amount, rate] = re.exec(
          // 変更前（バグるコード）
          itemText
          // 変更後（正常に動くコード）
          // item.find(".a-color-secondary").text().trim()
        ) || [null, null, null];
        return [amount, rate];
      })();
      console.log("[pointAmount, pointRate]", [pointAmount, pointRate]);
    })
    .catch((err) => {
      console.error(err.message);
      // 終了ステータス 1（一般的なエラー）としてプロセスを終了する
      process.exit(1);
    });
});
