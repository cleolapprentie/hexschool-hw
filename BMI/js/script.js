;(function(){
    var height
    var weight
    var bmi
    var date
    var bmiCalc = JSON.parse(localStorage.getItem('data')) || []

    getDate()   // 取得今日時間
    showResult()    // 執行結果

    function getDate(d) {
        var d = new Date()
        var month = ((d.getMonth()+1 < 10) ? '0' : '') + (d.getMonth()+1)
        var day = ((d.getDate() < 10) ? '0' : '') + (d.getDate())
        var year = d.getFullYear().toString()
        date = month + '-' + day + '-' + year.slice(2,4)
    }


    function showResult() {
        if (!bmiCalc.length) {
            document.querySelector('.reset').classList.add('hide')
            var a = document.querySelector('.content__result')
            a.innerHTML = '<p style="font-size: 3rem; color: #ccc; font-family: Montserrat">No record.'
            return
        } else {
            document.querySelector('.reset').classList.remove('hide')
        }
        createList()
    }

    function createList() {
        document.querySelector('.content__result').innerHTML = ''
        var arr = bmiCalc.map(function(item, index){
            var li = document.createElement('li')
            li.classList.add('sticker', 'result', item.stateClass)
            document.querySelector('.content__result').appendChild(li)
            var div = document.createElement('div')
            div.classList.add('row')
            li.appendChild(div)
            var spanState = document.createElement('span')
            var spanBmi = document.createElement('span')
            var spanWeight = document.createElement('span')
            var spanHeight = document.createElement('span')
            var spanDate = document.createElement('span')
            spanState.classList.add('col-2', 'result__state')
            spanBmi.classList.add('col-2', 'result__bmi')
            spanWeight.classList.add('col-2', 'result__weight')
            spanHeight.classList.add('col-2', 'result__height')
            spanDate.classList.add('col-1', 'result__date')
            spanState.textContent = item.state
            spanBmi.textContent = item.bmi
            spanWeight.textContent = item.weight + 'kg'
            spanHeight.textContent = item.height*100 + 'cm'
            spanDate.textContent = item.date
            div.appendChild(spanState)
            div.appendChild(spanBmi)
            div.appendChild(spanWeight)
            div.appendChild(spanHeight)
            div.appendChild(spanDate)
        })
    }
    // 檢查輸入是否正確
    function checkInput() {
        var el = document.querySelectorAll('.input')
        for(var i = 0; i < el.length; i++) {
            var a = el[i].value
            var b = a.trim()
            var check
            if(!b.length || isNaN(a)) {
                check = false
            } else {
                check = true
            }
        }
        return check
    }
    // 處理data
    function calculate(e){
        e.preventDefault()
        if(!checkInput()) { 
            alert('請輸入正確數值')
            return 
        }
        var resultBmi = document.querySelector('.showResult__bmi')
        var resultState = document.querySelector('.showResult__state')
        var target = document.querySelector('.showResult')
        height = document.querySelector('.js--height').value / 100
        weight = document.querySelector('.js--weight').value
        bmi = weight / (height * height)
        bmi = bmi.toFixed(2)
        var obj = {
            date: date,
            weight: weight,
            height: height,
            bmi: bmi
        }
        resultBmi.textContent = bmi
        document.querySelector('.js--submit').classList.add('hide')
        target.classList.remove('hide')
        var state = (bmi <= 18.5) ? 'under' : (bmi <= 25) ? 'normal' : (bmi <= 30) ? 'over' : (bmi <= 35) ? 'obese' : (bmi <= 40) ? 'obese' : 'obese-severely'
        target.classList.add(state)
        
        switch(state) {
            case 'under': 
                resultState.textContent = '過輕'
                break
            case 'normal':
                resultState.textContent = '理想'
                break
            case 'over':
                resultState.textContent = '過重'
                break
            case 'obese':
                if(bmi > 30 && bmi <= 35) {
                    resultState.textContent = '輕度肥胖'
                } else {
                    resultState.textContent = '中度肥胖'
                }
                break
            case 'obese-severely':
                resultState.textContent = '重度肥胖'
                break
        }
        
//        if (bmi <= 18.5) { //under
//            target.classList.add('under')
//            resultState.textContent = '過輕'
//        } else if (bmi <= 25 ) {
//            target.classList.add('normal')
//            resultState.textContent = '理想'
//        } else if (bmi <= 30 ) {
//            target.classList.add('over')
//            resultState.textContent = '過重'
//        } else if (bmi <= 35) {
//            target.classList.add('obese')
//            resultState.textContent = '輕度肥胖'
//        } else if (bmi <= 45) {
//            target.classList.add('obese')
//            resultState.textContent = '中度肥胖'
//        } else {
//            target.classList.add('obese-severely')
//            resultState.textContent = '重度肥胖'
//        }
        obj.state = resultState.textContent
        obj.stateClass = target.classList[1]
        bmiCalc.push(obj)
        localStorage.data = JSON.stringify(bmiCalc.reverse())
        showResult()
    }
    
    function resetHeader() {
        var target = document.querySelector('.showResult')
        document.querySelector('.js--submit').classList.remove('hide')
        target.classList.add('hide')
        var a = target.classList[1]
        if (a !== 'hide') { target.classList.remove(a) }
        document.querySelectorAll('.input').forEach(el => {
            if(el.value) {
                el.value = ''
            }
        })
    }

    // events
    document.querySelector('.js--submit').addEventListener('click', calculate, false)
    document.querySelector('.js--refresh').addEventListener('click', resetHeader, false)
    document.querySelector('.reset').addEventListener('click', function(){
        resetHeader()
        localStorage.removeItem('data')
        bmiCalc = []
        showResult()
    }, false)
})()