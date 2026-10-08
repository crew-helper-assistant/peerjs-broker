# peerjs-broker

## 這是什麼

自架的 PeerJS 信令伺服器（broker），用來取代免費的 PeerJS 雲端服務，給 pixel-world 使用。它只負責讓兩個瀏覽器互相找到對方，實際資料仍是點對點傳送。

- `GET /healthz` 回傳 `ok`，用來檢查服務是否活著
- PeerJS 路徑：`/peerjs`
- 連接埠：讀取環境變數 `PORT`，預設 9000
- 已開啟 CORS

## 一、部署到 Render（免費）

1. 登入 https://render.com
2. 點 **New** > **Web Service**
3. 選 **Public Git repository**，貼上這個 repo 的網址，按 Continue
4. **Runtime** 選 **Node**（選 Docker 也可以，repo 內有 Dockerfile）
5. **Build Command** 填 `npm install`
6. **Start Command** 填 `npm start`
7. **Instance Type** 選 **Free**
8. 按 **Create Web Service**，等部署完成
9. 完成後會得到一個網址，例如 `https://xxx.onrender.com`，先記下來

注意：Render 免費方案閒置一段時間會休眠，休眠後第一次連線可能要等約 30 秒才會醒來。Render 支援 WebSocket，PeerJS 可以正常使用。

## 二、設定自己的網域（Cloudflare DNS + Render）

目標網址：`peer.hicrewapps.com`

### 1. 在 Render 加上自訂網域

1. 打開剛建立的 Web Service > **Settings** > **Custom Domains**
2. 按 **Add Custom Domain**，輸入 `peer.hicrewapps.com`
3. Render 會要求驗證，驗證方式就是下一步的 DNS 設定。設定好後回到這頁按 **Verify**

### 2. 在 Cloudflare 加 CNAME

1. 登入 Cloudflare，選擇 `hicrewapps.com` > **DNS** > **Records**
2. 按 **Add record**
3. Type：`CNAME`
4. Name：`peer`
5. Target：`xxx.onrender.com`（換成你自己的 Render 主機名稱，不要加 https://）
6. **Proxy status：關閉（灰色雲朵，DNS only）**
7. 儲存

回到 Render 按 Verify，通過後 Render 會自動發 HTTPS 憑證，通常幾分鐘內完成。

## 三、pixel-world 客戶端修改

把原本的 `new Peer()` 換成：

```js
new Peer({ host: 'peer.hicrewapps.com', port: 443, secure: true, path: '/peerjs' })
```

## 四、如何驗證

用瀏覽器打開：

https://peer.hicrewapps.com/healthz

看到 `ok` 就代表服務正常。若剛休眠，第一次可能要等約 30 秒。

## 本機執行

```bash
npm install
npm start
```
