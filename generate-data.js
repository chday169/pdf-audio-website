const fs = require('fs');
const path = require('path');

async function checkFileExists(filepath) {
    try {
        await fs.promises.access(filepath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

async function generatePDFsJSON() {
    const pdfsDir = path.join(__dirname, 'assets', 'pdfs');
    const pdfs = [];
    
    try {
        // 讀取 PDF 資料夾中的所有檔案
        const files = await fs.promises.readdir(pdfsDir);
        
        // 過濾出 PDF 檔案並按數字排序
        const pdfFiles = files
            .filter(file => file.toLowerCase().endsWith('.pdf'))
            .filter(file => /pdf\d+\.pdf$/i.test(file))  // 只匹配 pdf01.pdf 格式
            .sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)?.[0] || 0);
                const numB = parseInt(b.match(/\d+/)?.[0] || 0);
                return numA - numB;
            });
        
        // 生成 JSON 數據
        pdfFiles.forEach((filename, index) => {
            const num = (index + 1).toString().padStart(2, '0');
            const match = filename.match(/pdf(\d+)\.pdf$/i);
            const fileNum = match ? match[1] : num;
            
            pdfs.push({
                id: index + 1,
                filename: filename,
                title: `PDF 文件 ${fileNum}`,
                path: `assets/pdfs/${filename}`
            });
        });
        
        console.log(`找到 ${pdfFiles.length} 個 PDF 文件:`, pdfFiles);
        
    } catch (error) {
        console.log('PDF 目錄不存在或讀取失敗，使用預設列表');
        
        // 生成預設的 pdf01.pdf 到 pdf11.pdf
        for (let i = 1; i <= 11; i++) {
            const num = i.toString().padStart(2, '0');
            pdfs.push({
                id: i,
                filename: `pdf${num}.pdf`,
                title: `PDF 文件 ${num}`,
                path: `assets/pdfs/pdf${num}.pdf`
            });
        }
    }
    
    // 寫入 JSON 文件
    const outputPath = path.join(__dirname, 'data', 'pdfs.json');
    await fs.promises.writeFile(
        outputPath,
        JSON.stringify(pdfs, null, 2),
        'utf8'
    );
    
    console.log(`已生成 pdfs.json，共 ${pdfs.length} 個 PDF 文件`);
    return pdfs;
}

async function generateYouTubeJSON() {
    const youtubeData = [];
    
    // 預設的 YouTube 影片 ID（可修改）
    const defaultVideos = [
        { id: 'dQw4w9WgXcQ', title: 'YouTube 音樂 01', description: '第一個 YouTube 音訊' },
        { id: '9bZkp7q19f0', title: 'YouTube 音樂 02', description: '第二個 YouTube 音訊' },
        { id: 'kJQP7kiw5Fk', title: 'YouTube 音樂 03', description: '第三個 YouTube 音訊' },
        { id: 'JGwWNGJdvx8', title: 'YouTube 音樂 04', description: '第四個 YouTube 音訊' },
        { id: 'OPf0YbXqDm0', title: 'YouTube 音樂 05', description: '第五個 YouTube 音訊' }
    ];
    
    // 如果有設定檔，可以從設定檔讀取
    try {
        const configPath = path.join(__dirname, 'config', 'youtube-videos.txt');
        const configContent = await fs.promises.readFile(configPath, 'utf8');
        
        // 每行格式: 影片ID,標題,描述
        const lines = configContent.split('\n').filter(line => line.trim());
        
        lines.forEach((line, index) => {
            const [id, title, description] = line.split(',').map(s => s.trim());
            if (id) {
                youtubeData.push({
                    id: id,
                    title: title || `YouTube 音訊 ${(index + 1).toString().padStart(2, '0')}`,
                    description: description || `第 ${(index + 1).toString().padStart(2, '0')} 個 YouTube 音訊`,
                    type: 'youtube'
                });
            }
        });
        
        console.log(`從設定檔讀取 ${youtubeData.length} 個 YouTube 影片`);
        
    } catch (error) {
        console.log('沒有設定檔，使用預設 YouTube 影片列表');
        
        // 使用預設列表
        defaultVideos.forEach((video, index) => {
            const num = (index + 1).toString().padStart(2, '0');
            youtubeData.push({
                id: video.id,
                title: video.title || `YouTube 音訊 ${num}`,
                description: video.description || `第 ${num} 個 YouTube 音訊`,
                type: 'youtube'
            });
        });
    }
    
    // 寫入 JSON 文件
    const outputPath = path.join(__dirname, 'data', 'youtube.json');
    await fs.promises.writeFile(
        outputPath,
        JSON.stringify(youtubeData, null, 2),
        'utf8'
    );
    
    console.log(`已生成 youtube.json，共 ${youtubeData.length} 個 YouTube 影片`);
    return youtubeData;
}

// 執行生成
async function main() {
    console.log('開始生成資料文件...');
    console.log('=====================');
    
    await generatePDFsJSON();
    console.log('---------------------');
    await generateYouTubeJSON();
    console.log('=====================');
    console.log('資料生成完成！');
}

// 執行主函數
main().catch(console.error);