async function startPiP() {
    if ('documentPictureInPicture' in window) {
        // 要求開啟 PiP 視窗
        const pipWindow = await window.documentPictureInPicture.requestWindow({
            width: 240,
            height: 280,
        });

        // 複製主視窗的樣式 (Tailwind) 到 PiP 視窗
        const tailwind = document.createElement('script');
        tailwind.src = 'https://cdn.tailwindcss.com';
        pipWindow.document.head.appendChild(tailwind);

        // 建立通訊工具介面
        const container = pipWindow.document.createElement('div');
        container.className = "p-4 bg-white min-h-screen flex flex-col font-sans";
        container.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <span class="font-black text-slate-800 text-sm">浩元通訊</span>
                <span id="p-status" class="text-[10px] font-bold text-blue-500">● 自動</span>
            </div>
            
            <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-3 text-center">
                <div id="p-time" class="text-3xl font-black text-slate-800 tracking-tighter">--:--</div>
                <div id="p-date" class="text-[10px] font-bold text-slate-400">----/--/--</div>
            </div>

            <div class="space-y-2">
                <button id="p-arrive" class="w-full bg-slate-800 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95">預備：到班通知</button>
                <button id="p-leave" class="w-full border-2 border-slate-800 text-slate-800 py-3 rounded-xl font-bold text-xs transition-all active:scale-95">預備：離班通知</button>
                <div class="pt-1">
                    <button id="p-copy" class="w-full bg-emerald-500 text-white py-3 rounded-xl font-black text-xs shadow-lg transition-all active:scale-95">複製訊息內容</button>
                </div>
            </div>
            <textarea id="temp-area" class="fixed -top-40 opacity-0"></textarea>
        `;
        pipWindow.document.body.appendChild(container);

        // 初始化 PiP 視窗內的變數與邏輯
        let isArrive = true;
        let isAuto = true;
        const pTime = container.querySelector('#p-time');
        const pDate = container.querySelector('#p-date');
        const pArrive = container.querySelector('#p-arrive');
        const pLeave = container.querySelector('#p-leave');
        const pCopy = container.querySelector('#p-copy');
        const pStatus = container.querySelector('#p-status');
        const tempArea = container.querySelector('#temp-area');

        function updateTime() {
            if (!isAuto) return;
            const now = new Date();
            pTime.innerText = now.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' });
            pDate.innerText = now.toLocaleDateString('zh-TW');
        }
        setInterval(updateTime, 1000);
        updateTime();

        pArrive.onclick = () => {
            isArrive = true;
            isAuto = false;
            pStatus.innerText = "● 手動(到班)";
            pArrive.className = "w-full bg-slate-800 text-white py-3 rounded-xl font-bold text-xs shadow-inner scale-95";
            pLeave.className = "w-full border-2 border-slate-100 text-slate-300 py-3 rounded-xl font-bold text-xs";
        };

        pLeave.onclick = () => {
            isArrive = false;
            isAuto = false;
            pStatus.innerText = "● 手動(離班)";
            pLeave.className = "w-full bg-slate-800 text-white py-3 rounded-xl font-bold text-xs shadow-inner scale-95";
            pArrive.className = "w-full border-2 border-slate-100 text-slate-300 py-3 rounded-xl font-bold text-xs";
        };

        pCopy.onclick = async () => {
            const time = pTime.innerText;
            const text = isArrive ? 
                `【到班通知】☀️\\n家長您好，\\n同學已於🕐${time}安全抵達補習班！` :
                `【離班通知】🌙\\n家長您好，\\n同學已於🕐${time}離班！`;
            
            try {
                await pipWindow.navigator.clipboard.writeText(text);
                pCopy.innerText = "✅ 已複製";
                setTimeout(() => {
                    pCopy.innerText = "複製訊息內容";
                    isAuto = true;
                    pStatus.innerText = "● 自動";
                    updateTime();
                }, 1000);
            } catch (err) {
                console.error("無法複製", err);
            }
        };
    } else {
        alert("您的瀏覽器不支援置頂視窗功能，請確保使用最新版 Chrome。");
    }
}