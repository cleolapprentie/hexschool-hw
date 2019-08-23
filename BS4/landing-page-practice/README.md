# BS4 Landing Page 版型練習記錄

## [Demo](https://kayahino.github.io/hexschool-hw/BS4/landing-page-practice/landing.html)

## 解決 modal (多次) 開啓時的bug

### 1. 點擊 `dismiss` 和 `toggle` 同時存在的按鈕 BUG

當 `data-toggle` 和 `data-dismiss` 同時存在時，Modal 雖然會正常顯示    
和其他不同的是，`body` 卻不會自動加上 `.modal-open` 的 class
        
**解決方法**
當該按鈕被點擊，Modal 完全顯現之後在 `body` 加上 `.modal-open`
```javascript
// 選擇同時擁有 data-dismiss 及 data-toggle 的按鈕事件
$('a[data-dismiss="modal"][data-toggle="modal"]').on('click', function() {
  $('body').on('shown.bs.modal', function() {
    $(this).addClass('modal-open');
  });
});
```
    
### 2. 當 Modal 開啓時，桌面版會出現 `padding-right: 17px` 的問題

![](https://i.imgur.com/pL6tvuJ.png)

如圖， `body` 在桌面版會自動跑出 `padding-right: 17px` 的樣式  
査了一下這似乎是 Bootstrap 為了讓 modal 置中所加入的   
幸運的話可能什麼問題都不會發生   
不過有時候會造成網頁稍微偏移的困擾   
所以就靠自己新增樣式來解決吧    
    
      
---
    
        
首先 `padding-right: 17px` 和 scrollbar 非常有關係    
因為 17px 正好等於 `scrollbar` 的寬度    
不知道是不是只有 windows 會這樣    
看老師的影片沒有這個 `padding-right` 的問題!?    
但可以確定的是這個 `padding-right` 的確是為了 scrollbar 而存在的    
Bootstrap 文件上也說了，這個 Modal 的運作方式是從 `<body>` 中刪除滾動，以便動態視窗的內容滾動。   
所以 `padding-right: 17px` 正好是補了被刪除的 scrollbar 空間   
    
    
    
> [!WARNING]
> 以下只適用在確定 Modal 高度不會大於 viewport 而造成捲動的情況下    
> 不然會有兩條 scrollbar HEN 監介

    
依照我的觀察，當 `data-dismiss` 和 `data-toggle` 同時被觸發，第二個 Modal 開啓時，    
原先有 scrollbar 的頁面不知道為什麼 scrollbar 不見了   
沒有 scrollbar 的話 `body` 就不會加入 `padding-right`    
應該是這樣的判斷機制    
不過因為失去了 scrollbar 會導致畫面整個往右偏    
所以首要就是把 scrollbar 給加回來，   
    
    
**解決方法**
        
```css
body {
  /* 覆蓋過 padding-right: 17px */
  padding-right: 0!important;
  /* 避免出現橫向捲軸 */
  overflow-x: hidden;
}

body.modal-open {
  overflow-y: scroll;
}
```
在 `body` 加入 `padding-right: 0!important`    
並讓 scrollbar 保持顯示的狀態    
這樣就會應該就可以讓頁面變得更加協調....    
    
    
但這時候又發現了另一個問題   
而且這個問題又更複雜。   
Bootstrap 的 Modal 這種類似的機制好像也包括了 class 名稱含有 `fixed`、`sticky` 的這些元素   
只要是使用 BS 這類 helper 就會中獎   
    
我在 navbar 加入 `sticky-top`、在 footer 加入`fixed-bottom`   
都被自動加了 `padding-right` 的樣式，甚至在 navbar 還多了 `margin-right` 呢    
    
試試跟剛才一樣手寫樣式覆蓋上去   
```css
.modal-open .sticky-top, .modal-open .fixed-bottom {
  margin-right: 0!important;
  padding-right: 0!important;
}
```
當 `.modal-open` 時，`.sticky-top` 和 `fixed-bottom` 的 `padding-right`、`margin-right` 皆為 `0`
    
但問題並沒有完全解決。   
![](https://i.imgur.com/XoGNEny.gif)

`footer` 看起來是解決了但是 `navbar` 還是會往右偏移（崩潰    
這似乎跟為什麼只有 `.sticky-top` 會同時動用到 `padding` 和 `margin` 有關係，    
但具體是為什麼我也不知道QQ    

來觀察一下   
![](https://i.imgur.com/Ob23u0G.png)
直覺告訴我只要把 `padding-right: 0` 改成`16px` 就OK了！（喂    

**解決方法**
```css
.modal-open .sticky-top {
  margin-right: 0!important;
  padding-right: 16px!important;
}
.modal-open .fixed-bottom {
  margin-right: 0!important;
  padding-right: 0!important;
}
```
        
    
然而此時！   
燈楞！又遇上了野生的偏移BUG！（是有完沒完!?    

![](https://i.imgur.com/9bcijhj.gif)

雖然正常開啓 Modal 看起來沒有什麼問題，   
但一旦按下那可怕的 `dismiss` 和 `toggle` 同時觸發的按鈕時，問題又來了。    

`footer` 會稍稍左偏，而 `navbar` 則是往右偏，甚至每當關閉 Modal 的時候 `navbar` 會不斷的往右邊偏移...    
到底是什麼妖術喇吼！！   

還記得當初覆蓋 `padding-right` 和 `margin-right` 樣式是在 `body` 有 `.modal-open` 的情況下   
當 Modal 被關閉時，`.modal-open` 就會消失   
然而同時觸發 `dismiss` 和 `toggle` 的話，有一瞬間 `body` 是沒有 `.modal-open`的   
這代表那一瞬間那個覆蓋的樣式是失效的。   
並且不知道為什麼 Modal 在關閉的時候還是會給 `.sticky-top` 那邊新增負的 `margin`   

問題就出在那多出來的 `style` 啊!!!   
所以必須加入把這邊的 `style` 給清除的 code    

**解決方法**
```javascript
$('body').on('shown.bs.modal', function() {
　$(this).removeAttr('style');　// 刪除 body style
　$('.sticky-top').removeAttr('style');
　$('.fixed-bottom').removeAttr('style');
});
```
    
    

終於看起來像是解決了（拭淚   
或許會覺得為什麼不要一開始就把這些清除 `style` 的寫上去就好    
那是因為這段只會在 Modal 完全顯現之後才會觸發    
但 Modal `show` 和 `shown` 這期間還是會加到這段樣式   
所以設定 `.modal-open` 那段覆蓋樣式是必須的！    

    
        

> [!IMPORTANT]
> 更新如下
    
結果我後來發現我其中一個 Modal 內容會超過 viewport 的高度   
造成兩條捲軸的尷尬問題   
因為 BS 讓 `body` 的捲軸消失，我又強制讓捲軸在 `.modal-open` 的情況下出來    
若 Modal 內容高過瀏覽器視窗產生捲軸時，就會有兩條捲軸同時存在的情況   
所以我捨棄了這些方法了！！（mader我想超久...    
    
一切回到 Bootstrap 所預設的那樣   
事實證明 Bootstrap 會這麼設定是有他的考量在的    
現在的問題就是在於   
連續執行關閉及開啓 Modal 的時候   
`body` 不會正確出現 `.modal-open` 的 class   
我後來發現似乎是 timing 的問題   
所以我就把 Modal 視窗顯示的 timing 稍微往後挪了之後   
`.modal-open` 果真乖乖出現了！    

**解決方法**

```javascript
$('.switch').on('click', function(e) {
  var target = e.target.getAttribute('id');
  setTimeout(function() {
    if (target === 'switch-signup') {
      $('#signUpModal').modal('show');
    } else {
      $('#loginModal').modal('show');
    }
  }, 320);
});
```
這次開啓 Modal 不再用 `data-toggle` 來觸發，而換成 js 來手動觸發   
首先在切換 Modal 的連結我添加了一個 class `.switch`   
然後用它來綁監聽，取得點擊對象的 id 去判斷開啓對應的 Modal    
然後把時間延遲 320 毫秒，Done！    