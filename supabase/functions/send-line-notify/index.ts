import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// 👇 您的 LINE 長效型 Token
const LINE_CHANNEL_ACCESS_TOKEN = "By3qNQ0m+6SUaDwrTi3mPMbM+87NTy4ClTpD76fN9YoiZvVnLaieIGmOp6GuUM3ThNP/lZq7AmYj5q/saqrE//JhdhQyzfxkgKo5ylJfSkqoMG3RAqvu36C/s4uz+MA2EAA3tQrpI2uwVA7LONc+lAdB04t89/1O/w1cDnyilFU="

serve(async (req) => {
  // 解決 CORS 問題
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' 
      } 
    })
  }

  try {
    const { studentName, time, action, parentLineId } = await req.json()

    if (!parentLineId) {
      return new Response(JSON.stringify({ error: "家長未綁定 LINE" }), { 
        status: 400,
        headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } 
      })
    }

    // 🔥 強效防呆：自動清除可能因為手動複製貼上夾帶的隱形空格、換行符號
    const cleanLineId = String(parentLineId).trim()

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
        to: cleanLineId,
        messages: [
          {
            type: "text",
            text: messageText
          }
        ]
      })
    })

    const result = await response.json()

    // 🔥 核心修正：如果 LINE 官方返回錯誤（如 ID 格式不對、被家長封鎖），必須回傳錯誤狀態碼，不能假裝成功
    if (!response.ok) {
      return new Response(JSON.stringify({ 
        error: result.message || "LINE 官方拒絕發送訊息", 
        details: result 
      }), { 
        status: response.status, 
        headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } 
      })
    }

    return new Response(JSON.stringify({ success: true, result }), { 
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } 
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400,
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } 
    })
  }
})
