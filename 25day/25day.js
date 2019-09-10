function loadd() {
    initSelect();
    setInterval(getNowTime(), 1000);
};

function getNowTime() {
    var format = 'YYYY 年 MM 月 DD 日 D HH:mm:ss';
    var ele = document.getElementById('currentTime');
    ele.innerHTML = getFormatTime((new Date()), format);

    var format2 = 'yyyy-MM-dd D hh:mm:ss';
    var ele2 = document.getElementById('currentTime2');
    ele2.innerHTML = getFormatTime((new Date()), format2, 1, 1);
    return getNowTime;
}

function getFormatTime(date, format, type = 0, is12 = 0) {
    var year = date.getFullYear();
    var month = getDoubleNum(date.getMonth());
    var day = getDoubleNum(date.getDate());
    var week = getWeek(date, type);
    var tempHour = date.getHours();
    if (is12) {
        tempHour = tempHour % 12;
        if (tempHour === 0) {
            tempHour = 12;
        }
    }
    var hour = getDoubleNum(tempHour);
    var minute = getDoubleNum(date.getMinutes());
    var second = getDoubleNum(date.getSeconds());
    var result = format.replace(/Y{4}/i, year);
    result = result.replace(/M{2}/, month);
    result = result.replace(/D{2}/i, day);
    result = result.replace(/D{1}/i, week);
    result = result.replace(/H{2}/i, hour);
    result = result.replace(/m{2}/, minute);
    result = result.replace(/s{2}/, second);
    if (is12) {
        result = result + (date.getHours() > 12 ? ' PM' : ' AM');
    }
    return result;
}

function getWeek(date, type) {
    var day = date.getDay();
    var week = '';
    switch (day) {
        case 0:
            week = type === 0 ? '星期天' : 'Sunday';
            break;
        case 1:
            week = type === 0 ? '星期一' : 'Monday';
            break;
        case 2:
            week = type === 0 ? '星期二' : 'TuesDay';
            break;
        case 3:
            week = type === 0 ? '星期三' : 'Wednesday';
            break;
        case 4:
            week = type === 0 ? '星期四' : 'Thursday';
            break;
        case 5:
            week = type === 0 ? '星期五' : 'Friday';
            break;
        case 6:
            week = type === 0 ? '星期六' : 'Saterday';
            break;
        default:
            week = type === 0 ? '星期天' : 'Sunday';
            break;
    }
    return week;
}

function getDoubleNum(num) {
    if (num < 10) {
        return '0' + num;
    }
    return num;
}

function initSelect() {
    var year = document.getElementById('year-select');
    for (var i = 2000; i <= 2030; i++) {
        var option = document.createElement('option');
        option.setAttribute('value', i);
        option.text = i;
        year.appendChild(option);
    }
    var month = document.getElementById('month-select');
    for (var i = 1; i <= 12; i++) {
        var option = document.createElement('option');
        option.setAttribute('value', i);
        option.text = i;
        month.appendChild(option);
    }
    month.onchange = monthSelectedCallBack;
    initDaySelect(2000, 1);
    var hour = document.getElementById('hour-select');
    for (var i = 0; i <= 23; i++) {
        var option = document.createElement('option');
        option.setAttribute('value', i);
        option.text = i;
        hour.appendChild(option);
    }
    var minite = document.getElementById('minite-select');
    for (var i = 0; i <= 59; i++) {
        var option = document.createElement('option');
        option.setAttribute('value', i);
        option.text = i;
        minite.appendChild(option);
    }
    var second = document.getElementById('second-select');
    for (var i = 0; i <= 59; i++) {
        var option = document.createElement('option');
        option.setAttribute('value', i);
        option.text = i;
        second.appendChild(option);
    }

    var select = document.getElementsByTagName('select');
    for (i = 0; i < select.length; i++) {
        select[i].onchange = changeCallBack;
    }
}

function calcMonthDay(year, month) {
    var isLeapYear = ((year % 400) === 0) ||
        (((year % 100) !== 0) && ((year % 4) === 0))
    var isOddMonth = month % 2 !== 0;
    var day = 30;
    if (isOddMonth) {
        day = 31;
    }
    if (month === 2 && isLeapYear) {
        day = 28;
    } else if (month === 2) {
        day = 29;
    } else if (month === 8) {
        day = 31;
    }
    return day;
}

function initDaySelect(year, month) {
    var day = document.getElementById('day-select');
    var dayValue = +day.value;
    day.innerHTML = "";
    for (i = 1; i <= calcMonthDay(year, month); i++) {
        var option = document.createElement('option');
        option.setAttribute('value', i);
        option.text = i;
        day.appendChild(option);
    }
    if (dayValue > 0) {
        day.value = dayValue;
    }

}

function monthSelectedCallBack() {
    var month = document.getElementById('month-select');
    var year = document.getElementById('year-select');
    initDaySelect(+year.value, +month.value);
}

function changeCallBack() {
    var year = document.getElementById('year-select');
    var month = document.getElementById('month-select');
    var day = document.getElementById('day-select');
    var hour = document.getElementById('hour-select');
    var minite = document.getElementById('minite-select');
    var second = document.getElementById('second-select');
    var selectTime = new Date(+year.value, +month.value, +day.value, +hour.value, +minite.value, +second.value);
    var nowTime = new Date();
    var timespan = nowTime.getTime() - selectTime.getTime();
    var diff = getDiffTime(nowTime, selectTime);
    var difftxt = diff.days + " 天 " + diff.hours + " 小时 " + diff.minutes + " 分 " + diff.seconds + " 秒 ";
    var text = "现在距离 " + getFormatTime(selectTime, "yyyy年MM月DD日D HH:mm:ss");
    if (timespan <= 0) {
        text = text + " 还有 " + difftxt;
    } else {
        text = text + " 已经过去 " + difftxt;
    }
    var result = document.getElementById('result-wrapper');
    result.innerHTML = text;
}

function getDiffTime(date1, date2) {
    var date3 = date1.getTime() - date2.getTime();
    var timespan = Math.abs(date3);
    var days = Math.floor(timespan / (24 * 3600 * 1000));
    var leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000);     //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    return { days, hours, minutes, seconds };
}
