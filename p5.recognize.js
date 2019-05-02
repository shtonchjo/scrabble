var shapes = [];

// p5.prototype.createEllipse = function (x, y, width, height, color) {
//     this.x = x;
//     this.y = y;
//     var ellipse_obj = {
//         type: width==height ? "circle" : "ellipse",
//         x: this.x,
//         y: this.y,
//         w: width,
//         h: height,
//         center: [this.x, this.y],
//         col: color
//     };
//     shapes.push(ellipse_obj);
// }

p5.prototype.createRect = function (x, y, width, height, color) {
    this.x = x;
    this.y = y;
    var rect_obj = {
        type : width==height ? "square" : "rectangle",
        x: this.x,
        y: this.y,
        w: width,
        h: height,
        center: [this.x+width/2, this.y+height/2],
        col: color
    };
    shapes.push(rect_obj);
}

// p5.prototype.createTriangle = function (x1, y1, x2, y2, x3, y3, color) {
//     this.x1 = x1;
//     this.y1 = y1;
//     this.x2 = x2;
//     this.y2 = y2;
//     this.x3 = x3;
//     this.y3 = y3;

//     var cx = (this.x1+this.x2+this.x3)/3;
//     var cy = (this.y1+this.y2+this.y3)/3;

//     //console.log("cx: " + cx + " cy: " + cy);

//     var tri_obj = {
//         type: "triangle",
//         x1: this.x1,
//         y1: this.y1,
//         x2: this.x2,
//         y2: this.y2,
//         x3: this.x3,
//         y3: this.y3,
//         center: [cx, cy],
//         col: color
//     };
//     shapes.push(tri_obj);
// }

p5.prototype.display = function () {
    for(var i=0; i<shapes.length; i++){
        // if(shapes[i].type == "circle" || shapes[i].type == "ellipse"){
        //     fill(shapes[i].col);
        //     ellipse(shapes[i].x, shapes[i].y, shapes[i].w, shapes[i].h);
        // }
        // else if(shapes[i].type == "square" || shapes[i].type == "rectangle"){
            fill(shapes[i].col);
            rect(shapes[i].x, shapes[i].y, shapes[i].w, shapes[i].h);
        // }
        // else if(shapes[i].type == "triangle"){
        //     fill(shapes[i].col);
        //     triangle(shapes[i].x1, shapes[i].y1, shapes[i].x2, shapes[i].y2, shapes[i].x3, shapes[i].y3);
        // }
    }
}

p5.prototype.findShapeType = function(mx, my) {
    var mini = Infinity;
    var mini_obj;
    for(var i=0; i<shapes.length; i++){
        var d = dist(shapes[i].center[0], shapes[i].center[1], mx, my);
        if(d <= mini){
            mini = d;
            mini_obj = shapes[i];
        }
    }

    if(mini_obj != undefined){
        // if(mini_obj.type == "circle"){
        //     var radius = mini_obj.w/2;
        //     if(dist(mx, my, mini_obj.x, mini_obj.y) <= radius){
        //         return ["circle", mini_obj];
        //     }
        //     else{
        //         return ["background", undefined];
        //     }
        // }
        // else if(mini_obj.type == "ellipse"){
        //     if((abs(mx - mini_obj.x) <= mini_obj.w/2) && (abs(my - mini_obj.y) <= mini_obj.h/2)){
        //         return ["ellipse", mini_obj];
        //     }
        //     else{
        //         return ["background", undefined];
        //     }
        // }
        // else if(mini_obj.type == "rectangle"){
        //     if((abs(mx - mini_obj.center[0]) <= mini_obj.w/2) && (abs(my - mini_obj.center[1]) <= mini_obj.h/2)){
        //         return ["rectangle", mini_obj];
        //     }
        //     else{
        //         return ["background", undefined];
        //     }
        // }
        // else if(mini_obj.type == "square"){
            if((abs(mx - mini_obj.center[0]) <= mini_obj.w/2) && (abs(my - mini_obj.center[1]) <= mini_obj.h/2)){
                return ["square", mini_obj];
            // }
            // else{
            //     return ["background", undefined];
            // }
        }
        // else if(mini_obj.type == "triangle"){
        //     //for (x1, y1), (x2, y2) and (x3, y3)
        //     //Using linear inequality to check if point is inside the triangle
        //     var x1 = mini_obj.x1*1.0;
        //     var y1 = mini_obj.y1*1.0;
        //     var x2 = mini_obj.x2*1.0;
        //     var y2 = mini_obj.y2*1.0;
        //     var x3 = mini_obj.x3*1.0;
        //     var y3 = mini_obj.y3*1.0;

        //     var m1 = (y2-y1)/(x2-x1);
        //     var c1 = y1 - (m1*x1);
        //     //console.log("m1 = " + m1 + " c1 = " + c1);

        //     var m2 = (y3-y2)/(x3-x2);
        //     var c2 = y2 - (m2*x2);
        //     //console.log("m2 = " + m2 + " c2 = " + c2);

        //     var m3 = (y1-y3)/(x1-x3);
        //     var c3 = y3 - (m3*x3);
        //     //console.log("m3 = " + m3 + " c3 = " + c3);

        //     var c_new_1 = my - (m1*mx);
        //     //console.log("c_new_1 = " + c_new_1);

        //     var c_new_2 = my - (m2*mx);
        //     //console.log("c_new_2 = " + c_new_2);

        //     var c_new_3 = my - (m3*mx);
        //     //console.log("c_new_3 = " + c_new_3);

        //     if((c_new_1 >= c1) && (c_new_2 >= c2) && (c_new_3 <= c3)){
        //         return ["triangle", mini_obj];
        //     }
        //     else{
        //         return ["background", undefined];
        //     }
        // }
    }
    else return ["background", undefined];
}