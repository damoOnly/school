var postfixList = ['163.com', 'gmail.com', '126.com', 'qq.com', '263.net'];
function loadd() {
    initEmail();
    var email = document.getElementById("email-input");
    email.oninput = textChange;
    email.onkeydown = textMousedown;
    email.focus();
}

window.onload = loadd;

function initEmail() {
    var ul = document.getElementById('email-sug-wrapper');
    for (var i = 0; i < postfixList.length; i++) {
        var li = document.createElement('li');
        li.innerHTML = postfixList[i];
        li.setAttribute("tv", "@" + postfixList[i]);
        li.onmousedown = liClick;
        ul.appendChild(li);
    }
}

function textMousedown(e) {
    if (e.keyCode !== 13 && e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 27) {
        return;
    }
    e.preventDefault();
    var ul = document.getElementById('email-sug-wrapper');
    var list = ul.getElementsByTagName('li');
    var selectIndex = -1;
    for (var i = 0; i < list.length; i++) {
        if (list[i].className.indexOf("select") > -1) {
            selectIndex = i;
            list[i].className = "";
            break;
        }
    }

    if (e.keyCode === 38) {
        if (selectIndex === 0) {
            selectIndex = list.length - 1;
        } else {
            selectIndex = selectIndex - 1;
        }

        if (selectIndex < 0) {
            selectIndex = 0;
        }
        list[selectIndex].className = "select";
    } else if (e.keyCode === 40) {
        if (selectIndex === list.length - 1) {
            selectIndex = 0;
        } else {
            selectIndex = selectIndex + 1;
        }
        if (selectIndex >= list.length) {
            selectIndex = list.length - 1;
        }
        list[selectIndex].className = "select";
    } else if (e.keyCode === 13) {
        document.getElementById("email-input").value = htmlDecode(list[selectIndex].innerHTML);
        var ul = document.getElementById('email-sug-wrapper');
        ul.setAttribute("class", "");
    } else if (e.keyCode === 27) {
        document.getElementById("email-input").select();
    }
}

function textChange() {
    var txt = getTxt();
    var ul = document.getElementById('email-sug-wrapper');
    if (txt.txt1 !== "") {
        updateLi(txt.txt1, txt.txt2);
        ul.setAttribute("class", "show");
    } else {
        ul.setAttribute("class", "");
    }

}

function updateLi(str1, str2) {
    var li = document.getElementsByTagName("li");
    var showLi = [];
    var f = 0;
    for (var i = 0; i < li.length; i++) {
        var substr = li[i].getAttribute("tv");
        var re = new RegExp("@" + str2);
        if (!re.test(substr)) {
            f++;
            li[i].setAttribute("class", "hidden");
            continue;
        }
        li[i].setAttribute("class", "");
        var html = str1 + substr;
        li[i].innerHTML = htmlEncode(html);
        showLi.push(li[i]);
    }
    if (f === li.length) {
        for (var j = 0; j < f; j++) {
            li[j].setAttribute("class", "");
            showLi.push(li[j]);
        }
    }
    showLi[0].className = "select";
}

function getTxt() {
    var txt = trim(document.getElementById('email-input').value);
    var txt1 = txt.replace(/@.*/, '');
    var mt = txt.match(/@(.+)/);
    var txt2 = '';
    if (mt !== null) {
        txt2 = mt[1];
    }
    return { txt1, txt2 };
}

function trim(str) {
    return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
}

function liClick(e) {
    var targ
    if (!e) var e = window.event
    if (e.target) targ = e.target
    else if (e.srcElement) targ = e.srcElement
    if (targ.nodeType == 3) // defeat Safari bug
        targ = targ.parentNode
    var ul = document.getElementById('email-sug-wrapper');
    ul.setAttribute("class", "");
    document.getElementById("email-input").value = htmlDecode(targ.innerHTML);    
    document.getElementById("email-input").focus();
    e.preventDefault();
}

function htmlEncode(html) {
    //1.首先动态创建一个容器标签元素，如DIV
    var temp = document.createElement("div");
    //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
    (temp.textContent != undefined) ? (temp.textContent = html) : (temp.innerText = html);
    //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
    var output = temp.innerHTML;
    temp = null;
    return output;
}

function htmlDecode(text) {
    //1.首先动态创建一个容器标签元素，如DIV
    var temp = document.createElement("div");
    //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
    temp.innerHTML = text;
    //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}