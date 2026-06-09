import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// 👇 請把下面引號裡面的中文，換成你在 LINE 開發者後台拿到的長效型 Token (請保留前後的雙引號)
const LINE_CHANNEL_ACCESS_TOKEN = "By3qNQ0m+6SUaDwrTi3mPMbM+87NTy4ClTpD76fN9YoiZvVnLaieIGmOp6GuUM3ThNP/lZq7AmYj5q/saqrE//JhdhQyzfxkgKo5ylJfSkqoMG3RAqvu36C/s4uz+MA2EAA3tQrpI2uwVA7LONc+lAdB04t89/1O/w1cDnyilFU="

serve(async (req) => {
  // 解決 CORS 問題 (讓你的 HTML 可以順利呼叫這個函數)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
    // 接收來自 attendance.html 的資料
    const { studentName, time, action, parentLineId } = await req.json()

    if (!parentLineId) {
      return new Response(JSON.stringify({ error: "家長未綁定 LINE" }), { headers: { "Content-Type": "application/json" } })
    }

    // 組合要發送給家長的訊息文字
    const messageText = `家長您好，孩子 ${studentName} 已於 ${time} ${action}囉！`

    // 呼叫 LINE 的 API 發送訊息
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        to: parentLineId,
        messages: [
          {
            type: "text",
            text: messageText
          }
        ]
      })
    })

    const result = await response.json()
    return new Response(JSON.stringify({ success: true, result }), { headers: { "Content-Type": "application/json" } })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})