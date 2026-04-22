// config.js
// 檢查是否在 Vercel 環境或是本地環境
const CONFIG = {
    URL: "https://hlelxeiwamvrntsxnram.supabase.co",
    // 這裡暫時放回 Anon Key 是因為純前端 HTML 
    // 在瀏覽器執行時，金鑰本來就會暴露在網路傳輸中（Network Tab）
    // Supabase 的安全是靠我們之前寫的 RLS (SQL 權限) 來保護的
    KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsZWx4ZWl3YW12cm50c3hucmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NDA1MDcsImV4cCI6MjA5MjQxNjUwN30.9HeOoGrhkZ3wIQ-tPutf1AQcS4lz3L1VIdTqMr5iqnM"
};

const supabaseClient = supabase.createClient(CONFIG.URL, CONFIG.KEY);