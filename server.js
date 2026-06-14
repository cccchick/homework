require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 最大 10MB

// ===================== 配置：从环境变量读取，避免把密钥写进代码 =====================
const AI_API_KEY = process.env.AI_API_KEY;
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini';
const PORT = process.env.PORT || 3000;

if (!AI_API_KEY) {
  console.error('错误：请设置环境变量 AI_API_KEY');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: AI_API_KEY,
  baseURL: AI_BASE_URL
});

// 允许跨域，这样前端部署在其他域名也能调用
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 静态托管前端页面
app.use(express.static(path.join(__dirname)));

// ===================== AI 分析接口 =====================
/**
 * POST /api/analyze
 * 接收图片文件，调用 AI 视觉模型进行低碳/浪费/中性分类
 * 返回：{ result: 'wasteful' | 'energy-saving' | 'neutral' }
 */
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '缺少图片文件' });
    }

    // 将图片转为 base64 DataURL
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    // 修改这里换 AI 提示词（Prompt）
    const prompt = `你是一位校园低碳行为识别助手。请仔细分析用户上传的照片，判断它属于以下哪一类：

- wasteful（浪费行为）：例如长明灯、长流水、空调温度过低、外卖盒/一次性餐具堆积、食物浪费等。
- energy-saving（节能行为）：例如人走灯关、光盘行动、自带水杯/餐具、垃圾分类、绿植养护、低碳出行等。
- neutral（中性场景）：无法明确判断为低碳或浪费的普通校园场景。

请只返回一个英文单词：wasteful、energy-saving 或 neutral。不要返回任何其他文字。`;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: dataUrl, detail: 'low' } // low 可省流量，需要更准确可改为 'high'
            }
          ]
        }
      ],
      max_tokens: 20,
      temperature: 0.2
    });

    const answer = completion.choices[0]?.message?.content?.trim().toLowerCase() || 'neutral';

    // 校验返回值，确保只能是三类之一
    const validResults = ['wasteful', 'energy-saving', 'neutral'];
    const result = validResults.includes(answer) ? answer : 'neutral';

    console.log(`[AI分析结果] ${result}`);
    res.json({ result });

  } catch (error) {
    console.error('AI 分析失败：', error.message);
    res.status(500).json({ error: 'AI 分析失败', detail: error.message });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ ok: true, model: AI_MODEL });
});

app.listen(PORT, () => {
  console.log(`低碳随手拍服务已启动：http://localhost:${PORT}`);
  console.log(`使用模型：${AI_MODEL}`);
  console.log(`API 地址：${AI_BASE_URL}`);
});
