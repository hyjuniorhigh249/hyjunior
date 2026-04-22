/**
 * 浩元行政系統 - 側邊欄元件
 */
document.addEventListener('DOMContentLoaded', () => {
    const sidebarHTML = `
        <nav class="w-40 bg-white border-r border-slate-200 p-3 flex flex-col gap-1 shrink-0 h-screen sticky top-0">
            <div class="font-black text-lg mb-4 text-slate-800 border-b pb-2 text-center italic">浩元行政</div>
            <a href="index.html" class="px-3 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition text-sm">🏠 系統首頁</a>
            <a href="students.html" class="px-3 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition text-sm">👥 學生總檔</a>
            <a href="classes.html" class="px-3 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition text-sm">📚 班級管理</a>
            
            <div class="mt-4 pt-4 border-t border-slate-100">
                <p class="text-[10px] font-bold text-slate-400 uppercase mb-2 px-2">快捷工具</p>
                <button onclick="startPiP()" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-blue-600 hover:bg-blue-50 text-sm transition">
                    <span>📱</span> 迷你通訊窗
                </button>
            </div>

            <div class="mt-auto pt-4 border-t border-slate-100 px-2">
                <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">管理員</p>
                <p id="user-email-display" class="text-[10px] font-medium text-slate-500 truncate mb-2">---</p>
                <button onclick="logout()" class="w-full text-left text-[10px] font-bold text-red-400 hover:text-red-600 transition">登出系統</button>
            </div>
        </nav>
    `;
    
    // 找到頁面中的 sidebar-container 並注入
    const container = document.getElementById('sidebar-container');
    if (container) {
        container.innerHTML = sidebarHTML;
    }
});