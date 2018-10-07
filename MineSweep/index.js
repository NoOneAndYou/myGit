
var btn = document.getElementsByClassName('btn')[0];

var conBox = document.getElementsByClassName('conBox')[0];
var flagBox = document.getElementsByClassName('flagBox')[0];
var score = document.getElementsByClassName('score')[0];

var loser = document.getElementsByClassName('loser')[0];
var loserImg = document.getElementsByClassName('loserImg')[0];
var close = document.getElementsByClassName('close')[0];

var mineNum, mineOver;

var grid,
    mineMap = [];

bindEvent();
function bindEvent() {
    btn.onclick = function () {
        btn.style.display = 'none';
        conBox.style.display = 'block';
        flagBox.style.display = 'block';
        init();
    }
    conBox.oncontextmenu = function () {
        return false;
    }
    conBox.onmousedown = function (e) {
        var event = event || window.event;
        var target = event.target || event.srcElement;

        if (e.button == 0) {
            leftClick(target);
        } else if (e.button == 2) {
            rightClick(target);
        }
    }
    close.onclick = function () {
        loser.style.display = 'none';
        conBox.style.display = 'none';
        flagBox.style.display = 'none';
        btn.style.display = 'block';
        conBox.innerHTML = '';
    }
}

function init() {
    mineNum = 20;
    mineOver = 20;
    score.innerHTML = mineOver;

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var conGrid = document.createElement('div');
            conGrid.classList.add('grid');
            conGrid.setAttribute('id', i + '-' + j);
            conBox.appendChild(conGrid);
            mineMap.push({ mine: 0 });
        }
    }

    grid = document.getElementsByClassName('grid');
    while (mineNum) {
        var mineIndex = Math.floor(Math.random() * 100);
        if (mineMap[mineIndex].mine === 0) {
            mineMap[mineIndex].mine = 1;
            grid[mineIndex].classList.add('isMine');
            mineNum--;
        }
    }
}

function leftClick(dom) {

    var isMine = document.getElementsByClassName('isMine');
    var len = isMine.length;
    // dom.classList.contains('isMine') -- 是否包含这个类名 
    if (dom && dom.className == 'grid isMine') {
        for (var i = 0; i < len; i++) {
            isMine[i].classList.add('show');
        }
        setTimeout(function () {
            loser.style.display = 'block';
            loserImg.style.backgroundImage = "url('./img/over.jpg')";
        }, 800)
    } else {

        var n = 0;
        var posArr = dom && dom.getAttribute('id').split('-');
        var posX = posArr && +posArr[0];
        var posY = posArr && +posArr[1];
        dom && dom.classList.add('num');

        for (var i = posX - 1; i <= posX + 1; i++) {
            for (var j = posY - 1; j <= posY + 1; j++) {
                var aroundBox = document.getElementById(i + '-' + j);
                if (aroundBox && aroundBox.classList.contains('isMine')) {
                    n++;
                }
            }
        }
        dom && (dom.innerHTML = n);
        if (n == 0) {
            for (var i = posX - 1; i <= posX + 1; i++) {
                for (var j = posY - 1; j <= posY + 1; j++) {
                    var nearBox = document.getElementById(i + '-' + j);
                    if (nearBox && nearBox.length != 0) {
                        if (!nearBox.classList.contains('check')) {
                            nearBox.classList.add('check');
                            leftClick(nearBox);
                        }
                    }
                }
            }
        }
    }
    if (dom.classList.contains('num')) {
        dom.classList.add('data');
    }
    var data = document.getElementsByClassName('data');
    if (data.length == 80) {
        loser.style.display = 'block';
        loserImg.style.backgroundImage = "url('./img/success.png')";
    }
}

function rightClick(dom) {
    var isMine = document.getElementsByClassName('isMine');

    if (dom.classList.contains('num')) {
        return;
    }

    dom.classList.toggle('flag');
    if (dom.classList.contains('isMine') && dom.classList.contains('flag')) {
        mineOver --;
    }
    if (dom.classList.contains('isMine') && !dom.classList.contains('flag')) {
        mineOver ++;
    }
    score.innerHTML = mineOver;

    if (mineOver == 0) {
        loser.style.display = 'block';
        loserImg.style.backgroundImage = "url('./img/success.png')";
    }
}