# BS4 Shopping Page 版型練習記錄

## [Demo](https://kayahino.github.io/hexschool-hw/BS4/shopping-page/shop.html)

1. 利用 JSON 來動態製作商品清單
2. FontAwesome 5 layer 用法
3. Bootstrap Carousel 應用
4. Checkbox and radio buttons 應用
5. 自訂下拉式選單配合表單驗證
6. `window.location` & `window.history.back()`

* [自我練習項目](#自我練習項目)
* [解決問題筆記](#解決問題筆記)

---

## 自我練習項目
### FontAwesome 5 layer 用法
![](https://i.imgur.com/pcARQLM.png)
一般像這種購物車 icon 通知圖示    
直覺都會用 `<div>` 加絕對定位來做出這樣的效果    
    
後來發現原來 FontAwesome 5 可以像圖層一樣疊加把 icon 拼起來    
除了 icon ，還可以針對文字和數字 counter 來疊加    
這次就是利用這個 counter 來做通知效果    
    
方法如下（節自FontAwesome官網）    
```javascript
<span class="fa-layers fa-fw" style="background:MistyRose">
  <i class="fas fa-envelope"></i>
  <span class="fa-layers-counter" style="background:Tomato">1,419</span>
</span>
```
1. `fa-layers` 創建該圖層
2. `fa-fw` 官方推薦加上這個 class 讓圖示排列地更整齊
3. `<i class="fas fa-envelope">` 當成底圖的 icon
4. `fa-layers-counter` 欲疊加的圖層：counter

是個很方便的功能～    
不過要注意的是這個方法只適用 JS + SVG 版的 FontAwesome    
> [Layering, Text, & Counters](https://fontawesome.com/how-to-use/on-the-web/styling/layering)

### Bootstrap Carousel 應用

* Jumbotron 搭配 Carousel 做成廣告 Banner

![](https://i.imgur.com/is81lXu.jpg)

* Carousel Indicators 當成 thumbnail 預覽

![](https://i.imgur.com/WIFDZtR.gif)

像原本的 indicator 一樣將三張圖片放進 `ul` 裡    
只不過不加 `carousel-indicators`，而是自己自訂樣式做成預覽圖    
再用 flex 做直式排版    
indicator 的核心就是 ` data-target` 和 `data-slide-to`    
設置好這兩個屬性 indicator 就有它基本的功能了    
        
只不過我又加了 focus 的效果    
讓使用者可以一眼看到現在圖片位置    

首先需要知道現在滑到的圖片是哪個
又是 `relatedTarget` 出場的時候了
```javascript
$('#myCarousel').on('slide.bs.carousel', function (e) {
  var target = $(e.relatedTarget).data('slide-target')
})
```
由於 `e.relatedTarget` 指向的會是主要滑動的大圖，    
為了方便 indicator 定位所以我在 `.carousel-item` 的元素加上了 `data-slide-target` 屬性，並設置相對應的 index    
這樣我就可以知道現在滑動的索引是哪個    
再利用屬性選擇器篩出具有該索引的預覽圖元素   
    
        
### Checkbox and radio buttons 應用
Bootstrap 的 radio 按鈕式設計之（改）    
想說 `<label>` 可以弄成 btn 樣式，那我也可以弄成自訂的樣式啊～    
於是就做出了這樣的顏色選擇按鈕XD    
![](https://i.imgur.com/RVN2NBa.gif)
        
        
### 利用 JSON 來動態製作商品清單
其實這原本是 JS 的最終作業要想的東西    
結果居然在這邊做出來了!!    

### 自訂下拉式選單配合表單驗證
![](https://i.imgur.com/gi9u2g5.gif)

沒有使用 plugin 做成動態的下拉式選單    
資料來自 [donma](https://github.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON?fbclid=IwAR0WL-DTcKTNDsW61f0Uh8FAqWukgrODxntCcXTfFSk-2yYXzSxvXaseV8s) 大大的台灣地址 JSON 資料    
    
下拉式選單是另外用 `<div>` 和 `<ul>` 來呈現的，再隱藏原本的 `<select>`    
透過自訂選單選取的時候也會一起改變原本 `<select>` 值    
方便之後驗證表單    

不過因為是自訂選單，表單驗證後不會套用原本的樣式
![](https://i.imgur.com/5ANgJfy.png)

稍微做了一點改裝    
先判斷 `<select>` 欄位為 `:valid` 還是 `:invalid`，再針對其改變樣式    
然後再加入 FontAwesome 的 icon 讓這個 `<div>` 看起來跟其他 `<input>` 欄位一樣    
![](https://i.imgur.com/MXWubxo.png)




## 解決問題筆記
### 1. dropdown menu 點擊關閉問題
> ![](https://i.imgur.com/jLTaMdc.gif)

如圖所示，當點擊到 dropdown menu 時，總會跟著關閉整個 menu    
實在是個不怎麼好的體驗    
        
原因在於 `<body>` 有個監聽會關閉這個 popup    
而點擊內容時會往上觸發到這個 body 事件    
為了不要讓冒泡的情形發生，需要加上 `e.stopPropagation()`    
讓我們可以自由地點擊 menu 內容

**解決方法**
```javascript
$('#cart-preview .dropdown-menu').on('click', function(e) {
  e.stopPropagation();
});
```

> ![](https://i.imgur.com/RlnjLiP.gif)

### 2. 只關閉 Modal 不關閉 Dropdown menu
![](https://i.imgur.com/DaN1T0Y.gif)
        
假設使用者要從購物車預覽刪除商品，但按了刪除之後視窗就會關掉    
若要刪除多筆還要一次一次打開來，真的不是很方便    

**解決方法**
```javascript
$('#myModal').on('click', function(e) {
    e.stopPropagation();
});
```
當我們在 Modal 開啟的狀態下點擊任何地方，事件會冒泡觸發到 `<body>` 的點擊事件而導致 Dropdown 關閉    
只要在該 Modal 的點擊事件加入 `e.stopPropagation()` 阻止它冒泡就可以了    
![](https://i.imgur.com/V7TeLz3.gif)

    
### 3. Modal 透過 js 觸發的 issue
#### - 加入屬性選項 - via JS
這次不知道為什麼我用 attribute 的方法一直無法開啟 modal    
開啟 devTool 會發現設定好的 attribute 根本沒顯示....    
無解QQQ    
所以就用了替代方案，利用 js 來開啟 Modal    

首先我是想到用 `.modal('show')` 來開啟，但是後來想要加入 `data-backdrop` 的效果，單純這樣用的方法行不通    
後來發現要利用 option 的方法：    
```javascript
$('#myModal').modal({
  backdrop: 'static',
  keyboard: false
});
```
所以要用 JS 觸發並加入屬性選項需要透過 object 來設定    
        
不過這時我又遇到另一個問題    
透過 JS 觸發的 Modal，無法正確回傳 `event.relatedTarget`    
總是顯示 `undefined` 以致無法正確抓到目標    
後來在 stackoverflow 看到有人說只要在後面加上點擊目標作為第二個參數就行了    
```javascript
$('#cart-preview .dropdown-menu').on('click', function(e) {
  e.stopPropagation();
  e.preventDefault();
  if ($(e.target).hasClass('delete-item')) {
    $('#deleteModal').modal({
      backdrop: 'static',
      keyboard: false
    }, e.target);
  }
});
```
我的情況的話，目標自然是 `e.target`    
只要加上這個參數，之後的事件就可以正確回傳 `e.relatedTarget` 了    

> maksbd19 : If you need to use event.relatedTarget in you dynamically opened modal then you can pass the target as a second argument in the modal function.
> [--- reference](https://stackoverflow.com/questions/26187370/bootstrap-modal-relatedtarget-is-undefined/43038439#43038439?newreg=d7e64022f19241778a630e9da2b1c1f7)

### 4. 同時驗證兩份表單並送出

除了訂購人資訊，我額外新增了一個收件人資訊的表單，分成兩個 `<form>`    
這時候問題來了，要怎麼一鍵送出兩份表單並驗證它們？    
如果是用 Bootstrap 提供的 API 會發現根本沒辦法送出    
因為我的 `<button>` 是寫在 `<form>` 外，而且也沒有指定 `form` 的屬性   
所以不會觸發送出表單的事件    
而觀察一下 Bootstrap 的 API 會發現它是監聽送出的事件再去驗證表單    
沒有觸發事件的話根本不會到驗證的步驟啊～～    

所以我稍微改寫了一下    
```javascript
$('button[type="submit"]').on('click', function(e) {
  e.preventDefault();
  $('.needs-validation').each(function() {
    $(this).addClass('was-validated');
  });
  if ($('#form1')[0].checkValidity() && $('#form2')[0].checkValidity()) {
    $('#form1').submit();
    $('#form2').submit();
  }
});
```
先監聽表單送出按鈕，在 `<form>` 加上 `.was-validated` 來給表單即時回饋    
而當每個表單的 `.checkValidity()` 為 `true` 的時候，就送出這兩份表單

![](https://i.imgur.com/aHPJ1EX.gif)
