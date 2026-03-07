
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// セキュリティ・プライバシー設定：サーバー側でのデータ収集・解析を防止
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// キャッシュ制御
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// 静的ファイルの配信（入力データの保存機能は一切持ちません）
app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Privacy-focused server running on port ${port}`);
});
