# PDF 與音訊資源網站

## 功能特色
- PDF 文件查看器（使用 PDF.js）
- YouTube 音訊播放器
- 響應式網頁設計
- 導航選單和上下頁功能
- 回饋表單
- 外部連結

## 安裝與部署

### 本地運行
1. 將所有文件複製到網站伺服器目錄
2. 在 `assets/pdfs/` 目錄中添加 PDF 文件
3. 更新 `data/pdfs.json` 和 `data/audios.json` 中的文件列表
4. 用瀏覽器打開 `index.html`

### 部署到 GitHub Pages
1. 創建新的 GitHub 倉庫
2. 將所有文件推送到倉庫
3. 在倉庫設置中啟用 GitHub Pages
4. 選擇 main 分支作為來源

## 檔案結構
- `index.html` - 主 HTML 文件
- `style.css` - 樣式表
- `script.js` - JavaScript 功能
- `data/` - JSON 資料文件
- `assets/` - 資源文件（PDF、圖片）
- `README.md` - 說明文件

## 自定義
- 修改 `data/pdfs.json` 來添加/修改 PDF 文件
- 修改 `data/audios.json` 來添加/修改音訊
- 更新 `index.html` 中的個人資訊
- 修改 `style.css` 來更改外觀

## 技術
- HTML5/CSS3/JavaScript
- PDF.js（Mozilla）
- YouTube IFrame API
- GitHub Pages（部署）