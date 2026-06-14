# 低碳随手拍

课堂展示项目：通过拍照识别校园内的低碳/浪费行为，并生成积分与数据图表。

## 已配置 AI

本项目已接入 **Moonshot (Kimi)** 视觉模型：

```env
AI_BASE_URL=https://api.moonshot.cn/v1
AI_MODEL=moonshot-v1-8k-vision-preview
```

如需更换模型，可改为：

- `moonshot-v1-32k-vision-preview`
- `moonshot-v1-128k-vision-preview`
- `kimi-latest`

## 小组展示：让观众体验的最简单方法

### 推荐方案：同一 WiFi / 电脑开热点（无需部署，2 分钟搞定）

**前提**：观众手机和你电脑在同一局域网。

#### 步骤 1：启动服务

方式 A：双击 `开始运行.bat`

方式 B：命令行启动

```bash
cd C:\Users\chick\低碳随手拍
npm start
```

看到 `服务已启动：http://localhost:3000` 即成功。

#### 步骤 2：查看本机 IP

在命令行输入：

```bash
ipconfig
```

找到 `IPv4 地址`，例如 `192.168.1.105`。

#### 步骤 3：观众访问

让观众手机浏览器打开：

```text
http://192.168.1.105:3000
```

把 `192.168.1.105` 换成你实际的 IP 即可。

#### 如果教室 WiFi 不让设备互访

用电脑开热点：

1. Windows 设置 → 移动热点 → 开启
2. 让观众手机连你的热点
3. 观众访问 `http://[电脑IP]:3000`

---

### 备选方案 A：内网穿透（适合教室 WiFi 隔离）

用免费工具把本地服务暴露到公网：

```bash
npx localtunnel --port 3000
# 或
npx ngrok http 3000
```

生成类似 `https://xxxx.loca.lt` 的链接，观众扫码或输入即可访问。

> 注意：免费隧道有时不稳定，建议提前测试。

### 备选方案 B：部署到 Glitch（免费，提前准备好）

1. 注册 [glitch.com](https://glitch.com)
2. 新建一个 Node.js 项目
3. 上传 `server.js`、`package.json`、`index.html`
4. 在 Glitch 环境变量里设置 `AI_API_KEY`、`AI_BASE_URL`、`AI_MODEL`
5. 把 Glitch 生成的网址发给观众

这样不用你电脑一直开着，最省心。

---

## 本地运行步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

`.env` 已配置好 Moonshot 密钥，无需修改。如果需要改模型：

```env
AI_API_KEY=sk-8LXW6Lo9BEJ3z0OVyYZcDxrGrOV46HD5IlXEvSwShkDQwbk1
AI_BASE_URL=https://api.moonshot.cn/v1
AI_MODEL=moonshot-v1-8k-vision-preview
PORT=3000
```

> ⚠️ **重要**：不要把 API 密钥写进前端代码或提交到 Git！

### 3. 启动服务

```bash
npm start
```

打开浏览器访问：http://localhost:3000

## 项目文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 前端页面（纯 HTML/CSS/JS） |
| `server.js` | Node.js 后端代理，隐藏 API 密钥并调用 Kimi |
| `package.json` | 项目依赖 |
| `.env` | 环境变量（已填好，不提交） |
| `.env.example` | 环境变量示例 |
| `.gitignore` | 防止密钥误提交 |
| `开始运行.bat` | Windows 双击启动脚本 |
| `README.md` | 本说明 |

## 演示流程建议

1. 你用手机或电脑拍一张照片上传，展示 AI 分析动画
2. 展示结果页（节能/浪费/中性）
3. 选择地点，进入数据页看积分和图表
4. 邀请观众拿出手机访问同一链接，现场拍照体验
5. 数据页会实时累积每个人的提交（仅当前设备/浏览器）

## 常见问题

### Q: 为什么要把 API 密钥放在后端？

如果把密钥直接写进 `index.html`，任何打开网页的人都能在源码里看到并盗用你的密钥，导致额度被刷光。后端代理可以把密钥藏在服务器里，前端只调用你自己的接口。

### Q: 观众手机访问不了？

- 检查电脑防火墙是否放行 3000 端口
- 检查手机和电脑是否同一网络
- 尝试用电脑开热点

### Q: Kimi 调用失败？

- 检查 `.env` 里的 `AI_API_KEY` 是否正确
- 检查 Moonshot 账户是否有余额
- 检查模型名是否支持视觉（必须带 vision）

## 课堂展示快捷链接

- 本地地址：http://localhost:3000
- 快速展示节能结果：http://localhost:3000?result=energy-saving
- 快速展示浪费结果：http://localhost:3000?result=wasteful
- 快速展示中性结果：http://localhost:3000?result=neutral
