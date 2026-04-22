// 將變數宣告在全域，防止重新宣告錯誤
var pipWindow = null;
var pipTimer = null;

async function startPiP() {
    // 如果視窗已經存在且沒被關閉，就不重複開啟
    if (window.pipWindow && !window.pipWindow.closed) {
        window.pipWindow.focus();
        return;
    }

    if (!('documentPictureInPicture' in window)) {
        alert("瀏覽器不支援置頂視窗");
        return;
    }

    try {
        // 極窄化寬度 140px，減少螢幕佔用
        window.pipWindow = await window.documentPictureInPicture.requestWindow({
            width: 140,
            height: 260,
        });

        const pipDoc = window.pipWindow.document;

        // 注入 Tailwind
        const tailwind = pipDoc.createElement('script');
        tailwind.src = 'https://cdn.tailwindcss.com';
        pipDoc.head.appendChild(tailwind);

        const container = pipDoc.createElement('div');
        container.className = "p-2 bg-white min-h-screen flex flex-col font-sans select-none";
        container.innerHTML = `
            <div class="flex justify-between items-center mb-1 px-0.5">
                <span class="font-black text-slate-800 text-[10px]">浩元通訊</span>
                <span id="p-status" class="text-[8px] font-bold text-emerald-500">● ON</span>
            </div>
            
            <div id="time-box" class="bg-slate-50 p-2 rounded-xl border border-slate-100 mb-3 text-center cursor-pointer hover:bg-slate-200 transition-colors">
                <div id="p-time" class="text-3xl font-black text-slate-800 tracking-tighter leading-none">--:--</div>
                <div id="p-date" class="text-[9px] font-bold text-slate-400 mt-1">----/--/--</div>
                <div id="manual-hint" class="text-[8px] text-amber-600 font-bold mt-1 hidden">手動中-點此恢復</div>
            </div>

            <div class="space-y-2">
                <button id="btn-arrive" class="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all">到班通知</button>
                <button id="btn-leave" class="w-full border-2 border-slate-800 text-slate-800 py-4 rounded-xl font-bold text-xs active:scale-95 transition-all">離班通知</button>
            </div>
        `;
        pipDoc.body.appendChild(container);

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
        
        window.pipTimer = setInterval(updateTime, 1000);
        updateTime();

        // 點擊切換模式
        timeBox.onclick = () => {
            isAuto = !isAuto;
            if (!isAuto) {
                const m = prompt("修正時間:", pTime.innerText);
                if (m) pTime.innerText = m;
                pStatus.innerText = "● OFF";
                pStatus.className = "text-[8px] font-bold text-amber-500";
                manualHint.classList.remove('hidden');
            } else {
                pStatus.innerText = "● ON";
                pStatus.className = "text-[8px] font-bold text-emerald-500";
                manualHint.classList.add('hidden');
                updateTime();
            }
        };

        const copy = async (type) => {
            const time = pTime.innerText;
            const text = type === 'arrive' ? 
                \`【到班通知】\\n家長您好，\\n同學已於\${time}到班！\\n如上課期間有任何問題或狀況，\\n我們都會即時反映給您\` :
                \`【離班通知】\\n家長您好，\\n同學已於\${time}離班！\\n如有任何問題或狀況，\\n再請家長留言給我們\`;
            
            try {
                await window.pipWindow.navigator.clipboard.writeText(text);
                const btn = container.querySelector(\`#btn-\${type}\`);
                const old = btn.innerText;
                btn.innerText = "✅ 已複製";
                setTimeout(() => btn.innerText = old, 800);
            } catch (e) { console.error(e); }
        };

        container.querySelector('#btn-arrive').onclick = () => copy('arrive');
        container.querySelector('#btn-leave').onclick = () => copy('leave');

    } catch (e) { console.error(e); }
}