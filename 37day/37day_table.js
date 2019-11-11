
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

function tdOnClick() {
    var width = this.clientWidth;
    var height = this.clientHeight;
    var value = this.innerHTML;
    var ele = document.createElement("input");
    ele.setAttribute("type", "text");
    ele.setAttribute("origin", value);
    ele.value = value;
    ele.style = `width:${width}px;height:${height}px;`;
    this.appendChild(ele);

    var options = document.createElement("div");
    options.setAttribute("class", "options");
    var ok = document.createElement("span");
    var cancel = document.createElement("span");
    options.appendChild(ok);
    options.appendChild(cancel);
    this.appendChild(options);
}

function okOnClick() {
    var input = this.parentNode.previousSibing;    
    var value = parseInt(input.value);
    if (isNaN(value)) {
        input.setAttribute("class", "inputError");
        return;
    }
    var td = this.parentNode.parentNode;
    var id = parseInt(td.getAttribute("data-id"));
    var index = parseInt(td.getAttribute("data-index"));
    onChangeData(id, index, value);
    td.innerHTML = value;
}

function cancelClick() {
    var input = this.parentNode.previousSibing;
    var td = this.parentNode.parentNode;
}

function onChangeData(id, index, value) {
    changeData[id].sale[index] = parseInt(value);
}
