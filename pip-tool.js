async function startPiP() {
    if ('documentPictureInPicture' in window) {
        // 設定更小的寬高：寬度 180, 高度 220 (比之前更窄更矮)
        const pipWindow = await window.documentPictureInPicture.requestWindow({
            width: 180,
            height: 220,
        });

        const tailwind = document.createElement('script');
        tailwind.src = 'https://cdn.tailwindcss.com';
        pipWindow.document.head.appendChild(tailwind);

        const container = pipWindow.document.createElement('div');
        // 使用 p-2 壓縮間距
        container.className = "p-2 bg-white min-h-screen flex flex-col font-sans";
        container.innerHTML = `
            <div class="flex justify-between items-center mb-1 px-1">
                <span class="font-black text-slate-800 text-[10px]">浩元通訊</span>
                <span id="p-status" class="text-[9px] font-bold text-blue-500">● 自動</span>
            </div>
            
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-100 mb-2 text-center">
                <div id="p-time" class="text-2xl font-black text-slate-800 tracking-tighter leading-none">--:--</div>
                <div id="p-date" class="text-[9px] font-bold text-slate-400 mt-1">----/--/--</div>
            </div>

            <div class="space-y-1.5">
                <button id="p-arrive" class="w-full bg-slate-800 text-white py-2 rounded-lg font-bold text-[10px] shadow-sm transition-all active:scale-95">到班通知</button>
                <button id="p-leave" class="w-full border border-slate-800 text-slate-800 py-2 rounded-lg font-bold text-[10px] transition-all active:scale-95">離班通知</button>
                <div class="pt-1">
                    <button id="p-copy" class="w-full bg-emerald-500 text-white py-2.5 rounded-lg font-black text-[10px] shadow-md transition-all active:scale-95">點擊複製訊息</button>
                </div>
            </div>
            <textarea id="temp-area" class="fixed -top-40 opacity-0"></textarea>
        `;
        pipWindow.document.body.appendChild(container);

        let isArrive = true;
        let isAuto = true;
        const pTime = container.querySelector('#p-time');
        const pDate = container.querySelector('#p-date');
        const pArrive = container.querySelector('#p-arrive');
        const pLeave = container.querySelector('#p-leave');
        const pCopy = container.querySelector('#p-copy');
        const pStatus = container.querySelector('#p-status');

        function updateTime() {
            if (!isAuto) return;
            const now = new Date();
            pTime.innerText = now.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' });
            pDate.innerText = now.toLocaleDateString('zh-TW');
        }
        setInterval(updateTime, 1000);
        updateTime();

        pArrive.onclick = () => {
            isArrive = true; isAuto = false;
            pStatus.innerText = "● 手動(到)";
            pArrive.className = "w-full bg-slate-800 text-white py-2 rounded-lg font-bold text-[10px] shadow-inner scale-95";
            pLeave.className = "w-full border border-slate-100 text-slate-300 py-2 rounded-lg font-bold text-[10px]";
        };

        pLeave.onclick = () => {
            isArrive = false; isAuto = false;
            pStatus.innerText = "● 手動(離)";
            pLeave.className = "w-full bg-slate-800 text-white py-2 rounded-lg font-bold text-[10px] shadow-inner scale-95";
            pArrive.className = "w-full border border-slate-100 text-slate-300 py-2 rounded-lg font-bold text-[10px]";
        };

        pCopy.onclick = async () => {
            const time = pTime.innerText;
            const text = isArrive ? 
                `【到班通知】☀️\n家長您好，\n同學已於🕐${time}安全抵達補習班！` :
                `【離班通知】🌙\n家長您好，\n同學已於🕐${time}離班！`;
            
            try {
                await pipWindow.navigator.clipboard.writeText(text);
                pCopy.innerText = "✅ 成功";
                pCopy.className = "w-full bg-emerald-600 text-white py-2.5 rounded-lg font-black text-[10px] scale-95";
                setTimeout(() => {
                    pCopy.innerText = "點擊複製訊息";
                    pCopy.className = "w-full bg-emerald-500 text-white py-2.5 rounded-lg font-black text-[10px] shadow-md";
                    isAuto = true;
                    pStatus.innerText = "● 自動";
                    updateTime();
                }, 800);
            } catch (err) { console.error(err); }
        };
    } else {
        alert("不支援置頂視窗功能");
    }
}