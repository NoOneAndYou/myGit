//继承   ==>   圣杯模式
// function inherit(Target, Origin) {
//     function F() {};
//     F.prototype = Origin.prototype;
//     Target.prototype = new F();
//     //找到原来的名称
//     Target.prototype.constructor = Target;
//     //添加一个属性 找到本身的原型
//     Target.prototype.uber = Origin.prototype;
// }
var inherit = function () {
    //使用闭包  实现属性私有化
    var F = function () { };
    return function (Target, Origin) {
        F.prototype = Origin.prototype;
        Target.prototype = new F();
        Target.prototype.consructor = Target;
        Target.prototype.uber = Origin.prototype;
    }
}

//深度克隆
function deepClone(origin, target) {
    var target = target || {},
        toStr = Object.prototype.toString,
        arrStr = "[object Array]";
    for (var prop in origin) {
        if (origin.hasOwnProperty(prop)) {
            if (typeof (origin[prop]) == "object") {
                if (origin[prop] !== "null" && toStr.call(origin[prop]) == arrStr) {
                    target[prop] = [];
                } else {
                    target[prop] = {};
                }
                deepClone(origin[prop], target[prop]);
            } else {
                target[prop] = origin[prop];
            }
        }
    }
    return target;
}

//myType方法 返回每一个数据的类型
function myType(target) {
    var typeStr = typeof (target),
        template = {
            "[object Array]": "array",
            "[object Object]": "object",
            "[object Number]": "number - object",
            "[object Boolean]": "boolean - object",
            "[object String]": "string - object",
        }
    if (target == null) {
        return 'null';
    }
    if (typeStr == "object") {
        var str = Object.prototype.toString.call(target);
        return template[str];
    } else {
        return typeStr;
    }
}

//数组去重
Array.prototype.unique = function () {
    var temp = {},
        arr = [],
        len = this.length;
    for (var i = 0; i < len; i++) {
        if (!temp[this[i]]) {
            temp[this[i]] = "abc";
            arr.push(this[i]);
        }
    }
    return arr;
}

//取出所有的子元素节点
// function retElementChild(node) {
//     var temp = {
//         length : 0,
//         push : Array.prototype.push,
//         splice : Array.prototype.splice
//     },
//     child = node.childNodes,
//     len = child.length;

//     for(var i = 0; i < len; i++) {
//         if(child[i].nodeType == 1) {
//             temp.push(child[i]);
//         }
//     }
//     return temp;
// }
Element.prototype.myChildren = function () {
    var arr = [],
        child = this.childNodes,
        len = child.length;
    for (var i = 0; i < len; i++) {
        if (child[i].nodeType == 1) {
            arr.push(child[i]);
        }
    }
    return arr;
}

//返回第n个兄弟元素节点
function retSibling(e, n) {
    while (e && n) {
        if (n > 0) {
            if (e && e.nextElementSibling) {
                e = e.nextElementSibling;
            } else {
                for (e = e.nextSibling; e && e.nodeType != 1; e = e.nextSibling) { };
            }
            n--;
        } else {
            if (e && e.previousElementSibling) {
                e = e.previousElementSibling;
            } else {
                for (e = e.previousSibling; e && e.nodeType != 1; e = e.previousSibling) { };
            }
            n++;
        }
    }
    return e;
}

//封装insertAfter方法 
Element.prototype.insertAfter = function (targetNode, afterNode) {
    function myNextSibling(elem) {
        if (elem.nextElementSibling) {
            elem = elem.nextElementSibling;
        } else {
            for (elem = elem.nextSibling; elem && elem.nodeType != 1 && elem.nodeType != 3; elem = elem.nextSibling) { };
        }
        return elem;
    }

    var beforeNode = myNextSibling(targetNode);

    if (beforeNode == null) {
        this.appendChild(targetNode);
    } else {
        this.insertBefore(beforeNode, afterNode);
    }
}

//兼容 滚动条的距离
function getScrollOffset() {
    if (window.pageXOffset) {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        }
    } else {
        return {
            x: document.body.scrollLeft + document.documentElement.scrollLeft,
            y: document.body.scrollTop + document.documentElement.scrollTop
        }
    }
}

//兼容 可视区窗口大小
function getViewportOffset() {
    if (window.innerWidth) {
        return {
            w: window.innerWidth,
            h: window.innerHeight
        }
    } else {
        if (document.compatMode === "BackCompat") {
            // 怪异模式 , 标准模式 "CSS1Compat"
            return {
                w: document.body.clientWidth,
                h: document.body.clientHeight
            }
        } else {
            return {
                w: document.documentElement.clientWidth,
                h: document.documentElement.clientHeight
            }
        }
    }
}

// 返回元素相对于文档的坐标
function getElementPosition(elem) {
    var parent = elem.offsetParent,
        elemLeft = elem.offsetLeft,
        elemTop = elem.offsetTop;
    while (parent != null) {
        elemLeft += parent.offsetLeft + (parent.offsetWidth - parent.clientWidth)/2;
        elemTop += parent.offsetTop  + (parent.offsetHeight - parent.clientHeight)/2;
        parent = parent.offsetParent; 
    }
    return {
        x : elemLeft,
        y : elemTop
    }
}

//兼容获取样式
function getStyle(elem, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(elem, false)[prop];
    } else {
        return elem.currentStyle[prop];
    }
}

//兼容 一个事件 绑定多个函数
function addEvent(elem, type, handle) {
    if (elem.addEventListener) {
        elem.addEventListener(type, handle, false);
    } else if (elem.attachEvent) {
        elem.attachEvent('on' + type, function () {
            handle.call(elem);
        })
    } else {
        elem['on' + type] = handle;
    }
}

// 兼容 解绑事件处理函数
function removeEvent(elem, type, handle) {
    if (elem.removeEventListener) {
        elem.removeEventListener(type, handle, false);
    }else if (elem.detachEvent) {
        elem.detachEvent('on' + type, function () {
            handle.call(elem);
        });
    }else{
        elem['on' + type] = null;
    }
}

//兼容取消事件冒泡
function stopBubble(event) {
    var event = event || window.event;
    if (event.stopBubble) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
}

//兼容 阻止默认事件
function cancleHandler(event) {
    var event = event || window.event;
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}

// 拖拽运动
// function drag(elem) {
//     var disX, disY;
//     addEvent(elem, 'mousedown', function (e) {
//         var event = event || window.event;

//         disX = e.pageX - parseInt(getStyle(elem, 'left'));
//         disY = e.pageY - parseInt(getStyle(elem, 'top'));
//         addEvent(document, 'mousemove', mouseMove);
//         addEvent(document, 'mouseup', mouseUp);
//         stopBubble(event);
//         cancleHandler(event);
//     })
//     function mouseMove(e) {
//         var event = event || window.event;
//         elem.style.left = e.pageX - disX + 'px';
//         elem.style.top = e.pageY - disY + 'px';
//     }
//     function mouseUp() {
//         removeEvent(document, 'mousemove', mouseMove);
//         removeEvent(document, 'mouseup', mouseUp);
//     }
// }

//js的异步加载
function loadScript(url, callBack) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    if (script.readyState) {
        script.onreadystatechange = function () {
            //状态码    IE
            if (script.readyState == "complete" || script.readyState == "loaded") {
                callBack();
            }
        }
    } else {
        script.onload = function () {
            callBack();
        }
    }
    script.src = url;
    document.head.appendChild(script);
}