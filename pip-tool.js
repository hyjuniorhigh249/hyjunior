async function startPiP() {
    // 檢查瀏覽器支援
    if (!('documentPictureInPicture' in window)) {
        alert("瀏覽器不支援置頂視窗，請使用 Chrome 並確保在 HTTPS 環境下執行。");
        return;
    }

    try {
        // 1. 請求開啟視窗：寬度縮減至 130 (極窄)，高度 280
        const pipWindow = await window.documentPictureInPicture.requestWindow({
            width: 130,
            height: 280,
        });

        // 2. 注入 Tailwind 樣式
        const tailwind = document.createElement('script');
        tailwind.src = 'https://cdn.tailwindcss.com';
        pipWindow.document.head.appendChild(tailwind);

        // 3. 建立內容容器
        const container = pipWindow.document.createElement('div');
        container.className = "p-2 bg-white min-h-screen flex flex-col font-sans select-none";
        container.innerHTML = `
            <div class="flex justify-between items-center mb-1 px-0.5">
                <span class="font-black text-slate-800 text-[10px]">浩元通訊</span>
                <span id="p-status" class="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">● Auto</span>
            </div>
            
            <div id="time-box" class="bg-slate-50 p-2 rounded-xl border border-slate-100 mb-3 text-center cursor-pointer hover:bg-slate-200 transition-colors">
                <div id="p-time" class="text-3xl font-black text-slate-800 tracking-tighter leading-none">--:--</div>
                <div id="p-date" class="text-[10px] font-bold text-slate-400 mt-1">----/--/--</div>
                <div id="manual-hint" class="text-[8px] text-amber-600 font-bold mt-1 hidden">手動中-點此恢復</div>
            </div>

            <div class="space-y-2">
                <button id="btn-arrive" class="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all">到班通知</button>
                <button id="btn-leave" class="w-full border-2 border-slate-800 text-slate-800 py-4 rounded-xl font-bold text-xs active:scale-95 transition-all">離班通知</button>
            </div>
        `;
        pipWindow.document.body.appendChild(container);

        // 4. 定義邏輯
        let isAuto = true;
        const pTime = container.querySelector('#p-time');
        const pDate = container.querySelector('#p-date');
        const pStatus = container.querySelector('#p-status');
        const timeBox = container.querySelector('#time-box');
        const manualHint = container.querySelector('#manual-hint');

        function updateTime() {
            if (!isAuto) return;
            const now = new Date();
            pTime.innerText = now.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' });
            pDate.innerText = now.toLocaleDateString('zh-TW');
        }
        
        const timer = setInterval(updateTime, 1000);
        updateTime();

        // 點擊時間區塊進入手動調整
        timeBox.onclick = () => {
            isAuto = !isAuto;
            if (!isAuto) {
                const manualTime = prompt("修正時間 (例如 18:30):", pTime.innerText);
                if (manualTime) pTime.innerText = manualTime;
                pStatus.innerText = "● Manual";
                pStatus.className = "text-[8px] font-bold text-amber-500 uppercase tracking-tighter";
                manualHint.classList.remove('hidden');
            } else {
                pStatus.innerText = "● Auto";
                pStatus.className = "text-[8px] font-bold text-emerald-500 uppercase tracking-tighter";
                manualHint.classList.add('hidden');
                updateTime();
            }
        };

        // 複製訊息功能
        const copyMessage = async (type) => {
            const time = pTime.innerText;
            const text = type === 'arrive' ? 
                \`【到班通知】\\n家長您好，\\n同學已於\${time}到班！\\n如上課期間有任何問題或狀況，\\n我們都會即時反映給您\` :
                \`【離班通知】\\n家長您好，\\n同學已於\${time}離班！\\n如有任何問題或狀況，\\n再請家長留言給我們\`;
            
            try {
                await pipWindow.navigator.clipboard.writeText(text);
                const btn = container.querySelector(\`#btn-\${type}\`);
                const oldText = btn.innerText;
                btn.innerText = "✅ 已複製";
                setTimeout(() => btn.innerText = oldText, 800);
            } catch (err) { console.error("複製失敗", err); }
        };

        container.querySelector('#btn-arrive').onclick = () => copyMessage('arrive');
        container.querySelector('#btn-leave').onclick = () => copyMessage('leave');

        // 視窗關閉時清除計時器
        pipWindow.addEventListener("pagehide", () => clearInterval(timer));

    } catch (error) {
        console.error("PiP 啟動失敗:", error);
    }
}