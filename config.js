// config.js - 從環境變數讀取連線設定
// 在 Vercel 部署時，會自動替換為你在後台設定的值
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 確保變數存在才初始化，避免報錯
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Supabase 設定遺失，請檢查 Vercel 環境變數設定。");
}

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);