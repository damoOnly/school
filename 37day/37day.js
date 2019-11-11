var originData = {};
var changeData = {};
var dataKey = 'dataKey';
window.onload = function () {
    if (window.localStorage && window.localStorage.getItem(this.dataKey)) {
        originData = JSON.parse(window.localStorage.getItem(this.dataKey));
    } else {
        originData = sourceData;
    }

    originData.forEach(function (item, index) {
        item.index = index;
    });

    renderTable(originData, ["region", "product"], null);
    document.getElementById('save').onclick = save;
}

function save() {    
    if (window.localStorage) {
        changeData = getChangeData();
        window.localStorage.setItem(dataKey, JSON.stringify(changeData));
    }
}