# 六角學院 BS4 Backend Page 版型練習記錄

## [Demo](https://kayahino.github.io/hexschool-hw/BS4/backend-page/backend_index.html)

首頁
![](https://i.imgur.com/ivBoqPx.png)

列表
![](https://i.imgur.com/9qCS7yB.png)




### 解決圖表在手機版瀏覽時圖像太小不易閱讀的問題
        
由於 Chart.js 有自帶 responsive 功能，會隨著內容寬度來自適應
在裝置寬度較小的手機版有可能因為過度縮小導致內容不易閱讀
![](https://i.imgur.com/8XJVzoM.png)

**解決方法**
在 `<canvas>` 外包一層 `<div>` 並將設定其最小寬度
再將更外層的 `<div>` 加入 `.table-responsive` 的 class 讓它在超出畫面時可以做出捲動

```htmlembedded
<div class="table-responsive">
  <div style="min-width: 480px">
    <canvas id="traffic-source"></canvas>
  </div>
</div>
```

在手機版下也能順暢的瀏覽了！
![](https://i.imgur.com/XyE5tnA.png)