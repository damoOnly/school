import {initCheckList} from './31day_check';
import {region, products, sourceData} from './31day_data';
import { renderTable } from './31day_table';
import * as bar from '../34day/bar';
import * as line from '../34day/line';

// HTMLCollection.prototype.forEach = function (callback) {
//     [].slice.call(this).forEach(callback);
// };

window.onload = function () {
    var list = [{id: "region_wrapper", data: region},
{id: "produc_wrapper", data: products}];
    initCheckList(list, checkCallback);
}

function checkCallback(filterStr, orders) {
    var dl = sourceData.filter(function (s) {
        return filterStr.indexOf(s.region) > -1 &&
        filterStr.indexOf(s.product) > -1;
    });
    for(var i=0; i < dl.length; i++) {
        dl[i].index = i;
    }
    renderTable(dl, orders, rowHovrRollBack);
}

function rowHovrRollBack(data) {

}


