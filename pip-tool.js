async function startPiP() {
    if (!('documentPictureInPicture' in window)) {
        alert("請使用最新版 Chrome 瀏覽器");
        return;
    }

    try {
        // 設定極窄尺寸 130px
        const pipWindow = await window.documentPictureInPicture.requestWindow({
            width: 130,
            height: 250,
        });

        const pipDoc = pipWindow.document;
        const tailwind = pipDoc.createElement('script');
        tailwind.src = 'https://cdn.tailwindcss.com';
        pipDoc.head.appendChild(tailwind);

        const container = pipDoc.createElement('div');
        container.className = "p-2 bg-white min-h-screen flex flex-col font-sans select-none";
        container.innerHTML = `
            <div class="flex justify-between items-center mb-1 px-0.5">
                <span class="font-black text-slate-800 text-[10px]">浩元通訊</span>
                <span id="p-status" class="text-[8px] font-bold text-emerald-500 italic">● LIVE</span>
            </div>
            <div id="time-box" class="bg-slate-50 p-2 rounded-xl border border-slate-100 mb-2 text-center cursor-pointer">
                <div id="p-time" class="text-3xl font-black text-slate-800 tracking-tighter leading-none">--:--</div>
                <div id="p-date" class="text-[9px] font-bold text-slate-400 mt-1">----/--/--</div>
            </div>
            <div class="space-y-1.5">
                <button id="btn-arrive" class="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all">到班通知</button>
                <button id="btn-leave" class="w-full border-2 border-slate-800 text-slate-800 py-4 rounded-xl font-bold text-xs active:scale-95 transition-all">離班通知</button>
            </div>
        `;
        pipDoc.body.appendChild(container);

        let isAuto = true;
        const pTime = container.querySelector('#p-time');
        const pDate = container.querySelector('#p-date');
        const pStatus = container.querySelector('#p-status');

        function updateTime() {
            if (!isAuto) return;
            const now = new Date();
            pTime.innerText = now.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' });
            pDate.innerText = now.toLocaleDateString('zh-TW');
        }
        const timer = setInterval(updateTime, 1000);
        updateTime();

        container.querySelector('#time-box').onclick = () => {
            isAuto = !isAuto;
            if (!isAuto) {
                const m = prompt("修正時間:", pTime.innerText);
                if (m) pTime.innerText = m;
                pStatus.innerText = "● FIXED";
                pStatus.className = "text-[8px] font-bold text-amber-500 italic";
            } else {
                pStatus.innerText = "● LIVE";
                pStatus.className = "text-[8px] font-bold text-emerald-500 italic";
                updateTime();
            }
        };

        const copy = async (type) => {
            const time = pTime.innerText;
            const text = type === 'arrive' ? 
                \`【到班通知】\\n家長您好，\\n同學已於\${time}到班！\\n如上課期間有任何問題或狀況，\\n我們都會即時反映給您\` :
                \`【離班通知】\\n家長您好，\\n同學已於\${time}離班！\\n如有任何問題或狀況，\\n再請家長留言給我們\`;
            try {
                await pipWindow.navigator.clipboard.writeText(text);
                const btn = container.querySelector(\`#btn-\${type}\`);
                const old = btn.innerText;
                btn.innerText = "✅ 成功";
                setTimeout(() => btn.innerText = old, 800);
            } catch (e) { alert("複製失敗，請確保視窗處於焦點狀態"); }
        };

        container.querySelector('#btn-arrive').onclick = () => copy('arrive');
        container.querySelector('#btn-leave').onclick = () => copy('leave');
        pipWindow.onunload = () => clearInterval(timer);

    } catch (e) {
        alert("開啟失敗！請檢查是否在 https 環境或 localhost 下執行。");
    }
}