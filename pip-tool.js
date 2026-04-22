/**
 * 浩元行政系統 - 迷你通訊元件 v1.0
 * 獨立維護此檔案即可更新全站的通訊窗內容
 */

async function startPiP() {
    if (!('documentPictureInPicture' in window)) {
        alert("您的瀏覽器暫不支援置頂視窗，請更新至最新版 Chrome！");
        return;
    }

    // 1. 開啟迷你視窗
    const pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 250,
        height: 280,
    });

    // 2. 注入外部樣式 (Tailwind)
    const tailwind = document.createElement('script');
    tailwind.src = 'https://cdn.tailwindcss.com';
    pipWindow.document.head.appendChild(tailwind);

    // 3. 定義工具內容 (未來維護只需改這裡)
    const container = pipWindow.document.createElement('div');
    container.className = "p-2 bg-slate-50 min-h-screen font-sans";
    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-3 space-y-3">
            <div class="flex justify-between items-center px-1">
                <span class="text-[10px] font-bold text-blue-500" id="pStatus">● 自動</span>
                <input type="time" id="pTime" class="bg-transparent font-mono font-bold text-sm text-slate-700 outline-none">
            </div>
            <div class="grid grid-cols-2 gap-2">
                <button id="pIn" class="py-2 rounded-lg font-bold text-xs border transition-all">到班</button>
                <button id="pOut" class="py-2 rounded-lg font-bold text-xs border transition-all">離班</button>
            </div>
            <button id="pCopy" class="w-full bg-slate-800 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95">
                複製訊息
            </button>
        </div>
    `;
    pipWindow.document.body.appendChild(container);

    // 4. 視窗內部邏輯處理
    let mode = '到班';
    let isAuto = true;
    const pIn = pipWindow.document.getElementById('pIn');
    const pOut = pipWindow.document.getElementById('pOut');
    const pTime = pipWindow.document.getElementById('pTime');
    const pCopy = pipWindow.document.getElementById('pCopy');
    const pStatus = pipWindow.document.getElementById('pStatus');

    // 自動更新時間邏輯
    const updateTime = () => {
        if (!isAuto) return;
        const now = new Date();
        pTime.value = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    };

    const setUI = (type) => {
        mode = type;
        pIn.className = type === '到班' ? "py-2 rounded-lg font-bold text-xs border-cyan-500 bg-cyan-50 text-cyan-700 shadow-sm" : "py-2 rounded-lg font-bold text-xs border-slate-100 bg-white text-slate-400";
        pOut.className = type === '離班' ? "py-2 rounded-lg font-bold text-xs border-orange-500 bg-orange-50 text-orange-700 shadow-sm" : "py-2 rounded-lg font-bold text-xs border-slate-100 bg-white text-slate-400";
    };

    setUI('到班');
    updateTime();
    setInterval(updateTime, 20000);

    pIn.onclick = () => setUI('到班');
    pOut.onclick = () => setUI('離班');
    pTime.oninput = () => { 
        isAuto = false; 
        pStatus.innerText = "○ 手動"; 
        pStatus.className = "text-[10px] font-bold text-slate-400"; 
    };

    pCopy.onclick = async () => {
        const time = pTime.value;
        // 在這裡修改通知範本內容
        const text = mode === '到班' ? 
            \`【到班通知】💫\\n家長您好，\\n同學已於🕐\${time}到班！\\n如上課期間有任何問題或狀況，\\n我們都會即時反映給您\` :
            \`【離班通知】🌙\\n家長您好，\\n同學已於🕐\${time}離班！\\n如有任何問題或狀況，\\n再請家長留言給我們\`;
        
        try {
            await pipWindow.navigator.clipboard.writeText(text);
            const originalBtnText = pCopy.innerText;
            pCopy.innerText = "✅ 已複製";
            pCopy.className = "w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs shadow-inner";
            setTimeout(() => { 
                pCopy.innerText = originalBtnText;
                pCopy.className = "w-full bg-slate-800 text-white py-3 rounded-xl font-bold text-xs shadow-md";
            }, 800);
        } catch (err) {
            console.error("複製失敗", err);
        }
    };
}