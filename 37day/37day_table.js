
var hoverCallBack = null;
var originData = [];

var changeData = [];

function getChangeData() {
    return changeData;
}

function groupBy(array, f) {
    const groups = {};
    array.forEach(function (o) {
        const group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
        return groups[group];
    });
}

function renderTable(data, orders, callBack) {
    hoverCallBack = callBack;
    originData = data;
    changeData = data;
    var table = document.createElement('table');
    table.onmouseout = tableOnMouseOut;
    addHeader(table, orders, columHeader);
    addContentByGroup(table, orders, data);
    var wrapper = document.getElementById("table-wrapper");
    wrapper.innerHTML = "";
    wrapper.appendChild(table);
    tableOnMouseOut();
    document.onclick = documentOnClick;
}

function addHeader(table, orders, headers) {
    var header = document.createElement('tr');
    headers.shift();
    headers.shift();
    for (var i = orders.length - 1; i >= 0; i--) {
        if (orders[i] === "region") {
            headers.unshift("地区");
        } else {
            headers.unshift("商品");
        }
    }

    headers.forEach(function (c) {
        var th = document.createElement('th');
        th.innerHTML = c;
        header.appendChild(th);
    });
    table.appendChild(header);
}

function addContent(table, orders, data) {
    data.forEach(function (s) {
        var tr = document.createElement("tr");
        orders.forEach(function (item) {
            var td = document.createElement("td");
            td.innerHTML = s[item];
            tr.appendChild(td);
        });

        s.sale.forEach(function (sa) {
            var td = document.createElement("td");
            td.innerHTML = sa;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}

function addContentByGroup(table, orders, data) {
    var groupData = groupBy(data, function (item) {
        return item[orders[0]];
    });
    var groupValue = orders.shift();
    groupData.forEach(function (g) {
        for (var i = 0; i < g.length; i++) {
            var tr = document.createElement("tr");
            tr.setAttribute("index", g[i].index);
            tr.onmouseover = trOnMouseOver;
            if (i === 0) {
                var gtd = document.createElement("td");
                gtd.innerHTML = g[i][groupValue];
                gtd.setAttribute("rowspan", g.length);
                tr.appendChild(gtd);
            }

            orders.forEach(function (item) {
                var td = document.createElement("td");
                td.innerHTML = g[i][item];
                tr.appendChild(td);
            });

            g[i].sale.forEach(function (sa, index) {
                var td = document.createElement("td");
                td.innerHTML = sa;
                td.setAttribute("class", "sale");
                td.setAttribute("data-id", g[i].index);
                td.setAttribute("data-index", index);
                td.onclick = tdOnClick;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        }
    });
}

function trOnMouseOver() {
    var index = this.getAttribute("index");
    if (hoverCallBack) {
        hoverCallBack(originData.filter(function (s) {
            return s.index.toString() === index;
        }).reduce(function (pre, cur) {
            pre.push(cur.sale);
            return pre;
        }, []));
    }
}

function tableOnMouseOut() {
    if (hoverCallBack) {
        hoverCallBack(originData.reduce(function (pre, cur) {
            pre.push(cur.sale);
            return pre;
        }, []));
    }
}

function tdOnClick(e) {
    // e.stopPropagation();
    if (this.getAttribute("ifEdit") === "1") {
        return false;
    }
    inputCancelData(e);
    var width = this.clientWidth;
    var height = this.clientHeight;
    var value = this.innerHTML;
    this.innerHTML = "";
    this.setAttribute("ifEdit", "1");
    this.setAttribute("class", "sale ifEdit");
    var container = document.createElement("div");
    container.setAttribute("class", "tdContainer");
    container.id = "tdContainer";
    container.style = `width:${width}px;`;


    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("origin", value);
    input.id = "tdInput";
    input.value = value;
    input.oninput = inputOninput;
    input.onkeydown = inputOnKeydown;

    var inputWrapper = document.createElement("div");
    inputWrapper.setAttribute("class", "inputWrapper");
    inputWrapper.appendChild(input);
    container.appendChild(inputWrapper);

    var options = document.createElement("div");
    options.setAttribute("class", "options");
    var ok = document.createElement("span");
    ok.innerText = "OK";
    ok.onclick = okOnClick;
    var cancel = document.createElement("span");
    cancel.innerText = "Cancel";
    cancel.onclick = cancelOnClick;
    options.appendChild(ok);
    options.appendChild(cancel);
    container.appendChild(options);

    this.appendChild(container);
    return false;
}

function okOnClick(ev) { 
    inputChangeData(ev);
}

function cancelOnClick(ev) {
    inputCancelData(ev);
}

function documentOnClick(ev) {
    inputCancelData(ev);
}

function inputOninput() {
    this.setAttribute("class", "");
}

function inputOnKeydown(e) {
    if (e.keyCode === 13) {
        inputChangeData(e);
    } else if (e.keyCode === 27) {
        inputCancelData(e);
    }
}

function inputChangeData(ev) {    
    var input = document.getElementById("tdInput");
    var value = parseInt(input.value);
    if (isNaN(value)) {
        input.setAttribute("class", "inputError");
        return false;
    }
    var td = document.getElementById("tdContainer").parentNode;
    var id = parseInt(td.getAttribute("data-id"));
    var index = parseInt(td.getAttribute("data-index"));
    changeData[id].sale[index] = value;
    td.innerHTML = value;
    td.setAttribute("ifEdit", "0");
    td.setAttribute("class", "sale");
    ev.stopPropagation();
    return false;
}

function inputCancelData(ev) {
    var input = document.getElementById("tdInput");
    if (input) {
        var td = document.getElementById("tdContainer").parentNode;
        var origin = input.getAttribute("origin");
        td.innerHTML = origin;
        td.setAttribute("ifEdit", "0");
        td.setAttribute("class", "sale");
    }    

    ev.stopPropagation();
    return false;
}
