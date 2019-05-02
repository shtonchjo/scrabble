var isDragging = false;

//Calculates the new position for the shape which is being dragged
//Gets called when mouse is released OR at end of dragging
//Needs to be called in mousePressed() function of p5
p5.prototype.drag = function (obj, mx, my) {
    isDragging = false;
    this.shape_obj = obj[1];
    this.shape_type = obj[0];
    var index = shapes.indexOf(this.shape_obj);

    if(index > -1){
        shapes.splice(index, 1);
    }

    // if(this.shape_type == "circle" || this.shape_type == "ellipse"){
    //     var repositioned_obj = {
    //         type: this.shape_type,
    //         x: mx,
    //         y: my,
    //         w: this.shape_obj.w,
    //         h: this.shape_obj.h,
    //         center: [mx, my],
    //         col: this.shape_obj.col
    //     };
    //     shapes.push(repositioned_obj);
    // }

    if(this.shape_type == "square" || this.shape_type == "rectangle"){
        var repositioned_obj = {
            type: this.shape_type,
            x: mx - this.shape_obj.w/2,
            y: my - this.shape_obj.h/2,
            w: this.shape_obj.w,
            h: this.shape_obj.h,
            center: [mx, my],
            col: this.shape_obj.col
        };
        shapes.push(repositioned_obj);
    }

    // if(this.shape_type == "triangle"){
    //     var x_diff = mx - this.shape_obj.center[0];
    //     var y_diff = my - this.shape_obj.center[1];

    //     var new_x1 = this.shape_obj.x1 + x_diff;
    //     var new_y1 = this.shape_obj.y1 + y_diff;

    //     var new_x2 = this.shape_obj.x2 + x_diff;
    //     var new_y2 = this.shape_obj.y2 + y_diff;

    //     var new_x3 = this.shape_obj.x3 + x_diff;
    //     var new_y3 = this.shape_obj.y3 + y_diff;

    //     var repositioned_obj = {
    //         type: this.shape_type,
    //         x1: new_x1,
    //         y1: new_y1,
    //         x2: new_x2,
    //         y2: new_y2,
    //         x3: new_x3,
    //         y3: new_y3,
    //         center: [mx, my],
    //         col: this.shape_obj.col
    //     };
    //     shapes.push(repositioned_obj);
    // }
}

//Creates a shadow of the object (currently being dragged) under the cursor
//Needs to be called in draw() after display() if isDragging is true
p5.prototype.shadow = function (obj) {
    this.shape_type = obj[0];
    this.shape_obj = obj[1];
    push();
    fill('rgba(220, 222, 226, 0.30)');
    // if(this.shape_type == "circle" || this.shape_type == "ellipse"){
    //     ellipse(mouseX, mouseY, this.shape_obj.w, this.shape_obj.h);
    // }
    if(this.shape_type == "square" || this.shape_type == "rectangle"){
        rect(mouseX - this.shape_obj.w/2, mouseY - this.shape_obj.h/2, this.shape_obj.w, this.shape_obj.h);
    }
    // if(this.shape_type == "triangle"){
    //     var x_diff = mouseX - this.shape_obj.center[0];
    //     var y_diff = mouseY - this.shape_obj.center[1];

    //     var new_x1 = this.shape_obj.x1 + x_diff;
    //     var new_y1 = this.shape_obj.y1 + y_diff;

    //     var new_x2 = this.shape_obj.x2 + x_diff;
    //     var new_y2 = this.shape_obj.y2 + y_diff;

    //     var new_x3 = this.shape_obj.x3 + x_diff;
    //     var new_y3 = this.shape_obj.y3 + y_diff;

    //     triangle(new_x1, new_y1, new_x2, new_y2, new_x3, new_y3);
    // }
    pop();
}