var areaHeight = 500;
var areaWidth = 500;

export function draw(data, container, lineColor) {
    var axis_x_length = areaWidth * 0.9;
    var axis_y_length = areaHeight * 0.9;
    var axis_color = "black";
    var point_radius = 2;
    var point_color = "red";
    var point_interval = axis_x_length / (data[0].length + 1);
    var max = calc_max(data);
    var pro = axis_y_length * 0.95 / max;

    var areaDiv = document.createElement('div');
    areaDiv.setAttribute("style", `width: ${areaWidth}px; height: ${areaHeight}px;`);
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", areaWidth);
    canvas.setAttribute("height", areaHeight);
    var ctx = canvas.getContext("2d");
    ctx.translate(areaWidth * 0.05, areaHeight * 0.95);
    
    draw_axis(ctx, axis_x_length, -axis_y_length, axis_color);
    
    data.forEach(function (lineData, index) {
        var dl = calc_line(lineData, pro, point_interval);
        draw_line(ctx, dl, 1, lineColor[index]);
        dl.forEach(function (item) {
            draw_point(ctx, item.x, item.y, point_radius, point_color);
        }); 
    });       

    areaDiv.appendChild(canvas);
    container.appendChild(areaDiv);
}

function draw_axis(ctx, x_length, y_length, color) {
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.lineTo(x_length, 0);
    ctx.stroke();
    ctx.moveTo(0,0);
    ctx.lineTo(0, y_length);
    ctx.stroke();
    // ctx.restroe();
}

function draw_line(ctx, line, lineWidth, lineColor) {
    ctx.beginPath();
    ctx.moveTo(line[0].x, -line[0].y);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    line.forEach(function (item) {
        ctx.lineTo(item.x, -item.y);
    });
    ctx.stroke();    
}

function draw_point(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x,-y, radius,0, 2* Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function calc_line(data, pro, inerval) {
    var result = [];
    for (var i = 0; i < data.length; i ++) {
        var obj = {};
        obj.x = (i+1) * inerval;
        obj.y = data[i] * pro;
        
        result.push(obj);
    }
    return result;
}

function calc_max(data) {
    var max = 0;
    data.forEach(function (item) {
        var m = Math.max.apply(null, item);
        max = m > max ? m : max;
    });
    return max;
}