import { sourceData } from './31day_data';

var checkCallBack = null;
export function initCheckList(list, callBack) {
    list.forEach(function (item) {
        document.getElementById(item.id).innerHTML = '';
        createCheckAll(item.id);
        createCheckList(item.id, item.data);
    });
    checkCallBack = callBack;
}

function createCheckList(id, list) {
    var listWrapper = document.createElement("div");
    list.forEach(function (item, index) {
        var cl = document.createElement("input");
        if (index === 0) {
            cl.checked = true;
        }
        cl.type = "checkbox";
        cl.value = index;
        cl.name = "checkbox";
        cl.onchange = onCheckChanged;
        cl.onclick = onCheckClick;
        cl.onmousedown = testMouseDown;
        cl.onmouseup = testMouseUp;
        cl.setAttribute("text", item);
        listWrapper.appendChild(cl);
        listWrapper.appendChild(document.createTextNode(item));
    });
    document.getElementById(id).appendChild(listWrapper);
}

function createCheckAll(id) {
    var allWrapper = document.createElement("div");
    var checkAll = document.createElement("input");
    checkAll.type = "checkbox";
    checkAll.name = "checkAll";
    checkAll.onchange = onCheckAllChange;
    allWrapper.appendChild(checkAll);
    allWrapper.appendChild(document.createTextNode('全选'));
    document.getElementById(id).appendChild(allWrapper);
}

function onCheckAllChange() {
    if (!this.checked) {
        return;
    }
    var ele = this.parentNode.nextSibling;
    var cls = ele.getElementsByTagName("input");
    cls.forEach(function (c) {
        c.checked = true;
    });
    onCheckChanged();
}

function onCheckClick() {
    var parent = this.parentNode;
    var cls = parent.getElementsByTagName("input");
    var isAllUnChecked = true;
    var isAllChecked = true;
    cls.forEach(function (c) {
        if (c.checked) {
            isAllUnChecked = false;
        } else {
            isAllChecked = false;
        }
    });
    var ele = parent.previousSibling;
    var checkAll = ele.getElementsByTagName("input")[0];
    checkAll.checked = isAllChecked;

    if (isAllUnChecked) {
        return false;
    }
}

function testMouseDown(e) {
    // e.preventDefault();
    console.log('mouse down');
}

function testMouseUp(e) {
    console.log('mouse up');
}

function onCheckChanged() {
    if (checkCallBack) {
        checkCallBack(getCheckedTxt(), GetOrders());
    }
}

function getCheckedTxt() {
    var cls = document.getElementsByName('checkbox');
    var param = "";
    for (var i = 0; i < cls.length; i++) {
        if (cls[i].checked) {
            param += cls[i].getAttribute('text');
        }
    }
    return param;
}

function GetOrders() {
    var productCount = 0;
    var regionCount = 0;
    var all = document.getElementsByName("checkAll");
    all.forEach(function (a) {
        var count = 0;
        var ele = a.parentNode.nextSibling;
        var cls = ele.getElementsByTagName("input");
        cls.forEach(function (c) {
            if (c.checked) {
                count++;
            }
        });
        if (a.parentNode.parentNode.id === "region_wrapper") {
            regionCount = count;
        } else {
            productCount = count;
        }
    });

    if (regionCount === 1 && productCount > 1) {
        return ["region", "product"];
    } else {
        return ["product", "region"];
    }
}

