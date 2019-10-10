import {initCheckList} from './31day_check';
import {region, products} from './31day_data';

// HTMLCollection.prototype.forEach = function (callback) {
//     [].slice.call(this).forEach(callback);
// };

window.onload = function () {
    initCheckList("region_wrapper", region);
    initCheckList("produc_wrapper", products);
}

