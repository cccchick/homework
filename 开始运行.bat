@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo 正在启动 低碳随手拍 服务...
echo 请稍候，启动后浏览器会自动打开...
echo.

start http://localhost:3000
npm start

pause
