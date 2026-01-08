// 全局變數
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;
let currentPdfIndex = -1;
let currentYouTubeIndex = -1;
let player = null;

// 資料儲存
let pdfData = [];
let youtubeData = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePDFViewer();
    initializeYouTubePlayer();
    setupEventListeners();
    
    // 載入所有資料
    loadAllData();
});

// 載入所有資料
async function loadAllData() {
    try {
        // 並行載入 PDF 和 YouTube 資料
        await Promise.all([
            loadPDFData(),
            loadYouTubeData()
        ]);
    } catch (error) {
        console.error('載入資料失敗:', error);
        // 如果載入失敗，使用預設資料
        generateDefaultData();
    }
}

// 載入 PDF 資料
async function loadPDFData() {
    try {
        const response = await fetch('data/pdfs.json');
        if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
                pdfData = data;
                console.log('從 pdfs.json 載入了', pdfData.length, '個 PDF 文件');
            } else {
                pdfData = await generatePDFList();
            }
        } else {
            pdfData = await generatePDFList();
        }
    } catch (error) {
        console.warn('pdfs.json 載入失敗，自動生成 PDF 列表:', error);
        pdfData = await generatePDFList();
    }
    
    populatePDFDropdown(pdfData);
}

// 自動生成 PDF 列表
async function generatePDFList() {
    const pdfList = [];
    const maxPDFs = 20; // 最多檢查 20 個 PDF
    
    for (let i = 1; i <= maxPDFs; i++) {
        const num = i.toString().padStart(2, '0');
        const filename = `pdf${num}.pdf`;
        const filepath = `assets/pdfs/${filename}`;
        
        // 檢查文件是否存在
        try {
            const response = await fetch(filepath, { method: 'HEAD' });
            if (response.ok) {
                pdfList.push({
                    id: i,
                    filename: filename,
                    title: `PDF 文件 ${num}`,
                    path: filepath
                });
            }
        } catch (error) {
            // 文件不存在，繼續檢查下一個
        }
    }
    
    // 如果沒有找到任何 PDF，使用預設列表
    if (pdfList.length === 0) {
        console.log('沒有找到 PDF 文件，使用預設列表');
        for (let i = 1; i <= 11; i++) {
            const num = i.toString().padStart(2, '0');
            pdfList.push({
                id: i,
                filename: `pdf${num}.pdf`,
                title: `PDF 文件 ${num}`,
                path: `assets/pdfs/pdf${num}.pdf`
            });
        }
    }
    
    console.log('自動生成了', pdfList.length, '個 PDF 項目');
    return pdfList;
}

// 載入 YouTube 資料
async function loadYouTubeData() {
    try {
        const response = await fetch('data/youtube.json');
        if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
                youtubeData = data;
                console.log('從 youtube.json 載入了', youtubeData.length, '個 YouTube 影片');
            } else {
                youtubeData = await generateYouTubeList();
            }
        } else {
            youtubeData = await generateYouTubeList();
        }
    } catch (error) {
        console.warn('youtube.json 載入失敗，自動生成 YouTube 列表:', error);
        youtubeData = await generateYouTubeList();
    }
    
    populateYouTubeDropdown(youtubeData);
}

// 自動生成 YouTube 列表
async function generateYouTubeList() {
    // 預設的 YouTube 影片 ID
    const defaultVideos = [
        { id: 'dQw4w9WgXcQ', title: 'YouTube 音樂 01' },
        { id: '9bZkp7q19f0', title: 'YouTube 音樂 02' },
        { id: 'kJQP7kiw5Fk', title: 'YouTube 音樂 03' },
        { id: 'JGwWNGJdvx8', title: 'YouTube 音樂 04' },
        { id: 'OPf0YbXqDm0', title: 'YouTube 音樂 05' }
    ];
    
    const youtubeList = defaultVideos.map((video, index) => {
        const num = (index + 1).toString().padStart(2, '0');
        return {
            id: video.id,
            title: video.title || `YouTube 音訊 ${num}`,
            description: `第 ${num} 個 YouTube 音訊`,
            type: 'youtube'
        };
    });
    
    console.log('自動生成了', youtubeList.length, '個 YouTube 項目');
    return youtubeList;
}

// 填充 PDF 下拉選單
function populatePDFDropdown(pdfs) {
    const select = document.getElementById('pdf-select');
    select.innerHTML = '<option value="">請選擇 PDF 文件</option>';
    
    pdfs.forEach((pdf, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = pdf.title;
        select.appendChild(option);
    });
}

// 填充 YouTube 下拉選單
function populateYouTubeDropdown(videos) {
    const select = document.getElementById('youtube-select');
    select.innerHTML = '<option value="">請選擇 YouTube 音訊</option>';
    
    videos.forEach((video, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = video.title;
        select.appendChild(option);
    });
}

// 初始化 PDF 查看器
function initializePDFViewer() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.min.js';
}

// YouTube API 準備好時
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '360',
        width: '640',
        playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0
        }
    });
}

// 初始化 YouTube 播放器
function initializeYouTubePlayer() {
    // YouTube IFrame API 會自動加載
}

// 設置事件監聽器
function setupEventListeners() {
    // PDF 選擇事件
    document.getElementById('pdf-select').addEventListener('change', function(e) {
        const index = parseInt(e.target.value);
        if (!isNaN(index)) {
            loadPDF(index);
        }
    });
    
    // YouTube 選擇事件
    document.getElementById('youtube-select').addEventListener('change', function(e) {
        const index = parseInt(e.target.value);
        if (!isNaN(index)) {
            loadYouTube(index);
        }
    });
    
    // PDF 導航按鈕
    document.getElementById('pdf-prev').addEventListener('click', function() {
        if (currentPdfIndex > 0) {
            const newIndex = currentPdfIndex - 1;
            document.getElementById('pdf-select').value = newIndex;
            loadPDF(newIndex);
        }
    });
    
    document.getElementById('pdf-next').addEventListener('click', function() {
        if (currentPdfIndex < pdfData.length - 1) {
            const newIndex = currentPdfIndex + 1;
            document.getElementById('pdf-select').value = newIndex;
            loadPDF(newIndex);
        }
    });
    
    // YouTube 導航按鈕
    document.getElementById('youtube-prev').addEventListener('click', function() {
        if (currentYouTubeIndex > 0) {
            const newIndex = currentYouTubeIndex - 1;
            document.getElementById('youtube-select').value = newIndex;
            loadYouTube(newIndex);
        }
    });
    
    document.getElementById('youtube-next').addEventListener('click', function() {
        if (currentYouTubeIndex < youtubeData.length - 1) {
            const newIndex = currentYouTubeIndex + 1;
            document.getElementById('youtube-select').value = newIndex;
            loadYouTube(newIndex);
        }
    });
    
    // 回饋表單提交
    document.getElementById('feedback-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };
        
        // 這裡可以發送到伺服器或存儲
        console.log('回饋表單資料:', formData);
        
        alert('感謝您的回饋！我們會儘快回覆。');
        document.getElementById('feedback-form').reset();
    });
}

// 載入 PDF
async function loadPDF(index) {
    try {
        currentPdfIndex = index;
        const pdf = pdfData[index];
        
        if (!pdf) {
            console.error('PDF 資料無效');
            return;
        }
        
        // 顯示載入中訊息
        document.getElementById('pdf-page-info').textContent = '載入中...';
        
        // 加載 PDF 文件
        const loadingTask = pdfjsLib.getDocument(pdf.path);
        pdfDoc = await loadingTask.promise;
        
        // 重置頁數
        pageNum = 1;
        renderPage(pageNum);
        
    } catch (error) {
        console.error('加載 PDF 失敗:', error);
        document.getElementById('pdf-page-info').textContent = '載入失敗';
        alert(`無法加載 PDF 文件: ${pdf.filename}`);
    }
}

// 渲染 PDF 頁面
function renderPage(num) {
    pageRendering = true;
    
    pdfDoc.getPage(num).then(function(page) {
        const canvas = document.getElementById('pdf-canvas');
        const ctx = canvas.getContext('2d');
        
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        const renderTask = page.render(renderContext);
        
        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
            
            // 更新頁面資訊
            document.getElementById('pdf-page-info').textContent = 
                `第 ${num} 頁 / 共 ${pdfDoc.numPages} 頁`;
        });
    });
}

// 載入 YouTube
function loadYouTube(index) {
    currentYouTubeIndex = index;
    const video = youtubeData[index];
    
    if (!video) {
        console.error('YouTube 資料無效');
        return;
    }
    
    if (player) {
        // 載入 YouTube 影片
        player.loadVideoById(video.id);
        
        // 顯示影片資訊
        const infoDiv = document.getElementById('youtube-info');
        infoDiv.innerHTML = `
            <h4>${video.title}</h4>
            <p>${video.description || ''}</p>
        `;
    } else {
        console.warn('YouTube 播放器尚未初始化');
    }
}

// 生成預設資料（備用）
function generateDefaultData() {
    console.log('使用預設資料');
    
    // 生成預設 PDF 列表
    for (let i = 1; i <= 11; i++) {
        const num = i.toString().padStart(2, '0');
        pdfData.push({
            id: i,
            filename: `pdf${num}.pdf`,
            title: `PDF 文件 ${num}`,
            path: `assets/pdfs/pdf${num}.pdf`
        });
    }
    
    // 生成預設 YouTube 列表
    youtubeData = [
        {
            id: 'dQw4w9WgXcQ',
            title: 'YouTube 音樂 01',
            description: '範例 YouTube 音訊',
            type: 'youtube'
        },
        {
            id: '9bZkp7q19f0',
            title: 'YouTube 音樂 02',
            description: '第二個 YouTube 音訊',
            type: 'youtube'
        }
    ];
    
    populatePDFDropdown(pdfData);
    populateYouTubeDropdown(youtubeData);
}