var areaHeight = 500;
var areaWidth = 500;

function draw(data) {
    var axis_x_length = 400;
    var axis_y_length = 400;
    var pillarsWidth = 20;
    var pillarsInterval = 15;
    var pillarsColor = "red";
    var axisColor = "black";
    var max = Math.max.apply(null, data);
    var pro = axis_y_length/max;

    var areaDiv = document.createElement('div');
    // areaDiv.setAttribute('style', `width:${areaWidth}px;height: ${areaHeight}px;`);
    var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');    
    svg.setAttribute('width', areaWidth+'px');
    svg.setAttribute('height', areaHeight + 'px');
    svg.setAttribute('version', 1.1);
    var zerox = 20;
    var zeroy = axis_y_length + 50;
    draw_axis(svg, axis_x_length, axis_y_length, zerox, zeroy, axisColor);
    var dl = calc_pillars(data, pro, zerox, zeroy, pillarsWidth, pillarsInterval);
    dl.forEach(function (item) {
        draw_pillars(item.x, item.y, item.width, item.height, pillarsColor, svg);
    });
    areaDiv.appendChild(svg);
    document.body.appendChild(areaDiv);
}

function draw_axis(svg, x_length, y_length, zerox, zeroy, color) {
    var axis_x = document.createElementNS('http://www.w3.org/2000/svg','line');
    axis_x.setAttribute('x1', zerox);
    axis_x.setAttribute('y1', zeroy);
    axis_x.setAttribute('x2', zerox + x_length);
    axis_x.setAttribute('y2', zeroy);
    axis_x.setAttribute('style', `stroke:${color};stroke-width:2`);
    svg.appendChild(axis_x);
    var axis_y = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    axis_y.setAttribute('x1', zerox);
    axis_y.setAttribute('y1', zeroy);
    axis_y.setAttribute('x2', zerox);
    axis_y.setAttribute('y2', zeroy - y_length);
    axis_y.setAttribute('style', `stroke:${color};stroke-width:2`);
    svg.appendChild(axis_y);
}

function draw_pillars(x,y,width,height,color,svg) {
    var pillar = document.createElementNS('http://www.w3.org/2000/svg','rect');
    pillar.setAttribute('x', x);
    pillar.setAttribute('y', y);
    pillar.setAttribute('width', width);
    pillar.setAttribute('height', height);
    pillar.setAttribute('style', `fill:${color};`)
    svg.appendChild(pillar);
}

function calc_pillars(data, pro, zerox, zeroy, width, interval) {
    var result = [];
    for (var i = 0; i < data.length; i ++) {
        var obj = {};
        obj.height = data[i] * pro;
        obj.x = zerox + interval* (i+1) + width* (i);
        obj.y = zeroy - obj.height;
        obj.width = width;
        
        result.push(obj);
    }
    return result;
}

var list = [120, 100, 140, 160, 180, 185, 190, 210, 230, 245, 255, 270];
draw(list);

