import { columHeader, sourceData } from './31day_data';

var hoverCallBack = null;
var originData = [];

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

export function renderTable(data, orders, callBack) {
    hoverCallBack = callBack;
    originData = data;
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

            g[i].sale.forEach(function (sa) {
                var td = document.createElement("td");
                td.innerHTML = sa;
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
