var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Greeter = (function () {
    function Greeter(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    Greeter.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () { return _this.span.innerHTML = new Date().toUTCString(); }, 500);
    };
    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Greeter;
}());
var TouchEventsType;
(function (TouchEventsType) {
    TouchEventsType[TouchEventsType["MOUSEDOWN"] = 0] = "MOUSEDOWN";
    TouchEventsType[TouchEventsType["MOUSEUP"] = 1] = "MOUSEUP";
    TouchEventsType[TouchEventsType["CLICK"] = 2] = "CLICK";
    TouchEventsType[TouchEventsType["MOUSEMOVE"] = 3] = "MOUSEMOVE";
})(TouchEventsType || (TouchEventsType = {}));
var TouchEvents = (function () {
    function TouchEvents(type, func, obj, capture, priority) {
        this.capture = false;
        this.priority = 0;
        this.type = type;
        this.func = func;
        this.obj = obj;
        this.capture = capture || false;
        this.priority = priority || 0;
    }
    return TouchEvents;
}());
window.onload = function () {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    //context.fillStyle="#FF0000";
    //context.fillRect(0,0,250,75);
    /*var grd=context.createLinearGradient(0,0,175,50);
    grd.addColorStop(0,"#FF0000");
    grd.addColorStop(1,"#00FF00");
    context.fillStyle=grd;
    context.fillRect(0,0,175,50);

    var line=canvas.getContext("2d");
    line.moveTo(10,10);
    line.lineTo(150,50);
    line.lineTo(10,50);
    line.stroke();

    var circle=canvas.getContext("2d");
    circle.fillStyle="#000000";
    circle.beginPath();
    circle.arc(70,18,15,0,Math.PI*2,true);
    circle.closePath();
    circle.fill();*/
    var stage = new DisplayObjectContainer();
    setInterval(function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context);
    }, 50);
    var image = document.createElement("img");
    image.src = "mark.png";
    var bitmap = new Bitmap();
    bitmap.image = image;
    bitmap.y = 30;
    bitmap.x = 30;
    bitmap.relatalpha = 0.2;
    var bitmap2 = new Bitmap();
    bitmap2.image = image;
    bitmap2.y = 30;
    bitmap2.x = 60;
    bitmap2.relatalpha = 1;
    var text1 = new TextField();
    text1.text = "hello!";
    text1.x = 40;
    text1.y = 70;
    text1.size = 20;
    text1.relatalpha = 0.5;
    var text2 = new TextField();
    text2.text = "helloworld!";
    text2.x = 35;
    text2.y = 65;
    text2.size = 50;
    //text2.relatalpha = 1;
    image.onload = function () {
        stage.addChild(text1);
        stage.addChild(text2);
        stage.addChild(bitmap);
        stage.addChild(bitmap2);
    };
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.matrix = null;
        this.globalMatrix = null;
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.relatalpha = 1;
        this.globalAlpha = 1;
        this.parent = null;
        this.listeners = [];
        this.matrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();
    }
    DisplayObject.prototype.remove = function () { };
    ;
    DisplayObject.prototype.draw = function (context2D) {
        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.relatalpha;
            this.globalMatrix = math.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);
        }
        if (this.parent == null) {
            this.globalAlpha = this.relatalpha;
            this.globalMatrix = this.matrix;
        }
        context2D.globalAlpha = this.globalAlpha;
        context2D.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        this.render(context2D);
    };
    DisplayObject.prototype.addEventListener = function (type, touchFunction, object, ifCapture, priority) {
        var touchEvent = new TouchEvents(type, touchFunction, object, ifCapture, priority);
        this.listeners.push(touchEvent);
    };
    return DisplayObject;
}());
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        _super.apply(this, arguments);
        this.array = [];
    }
    DisplayObjectContainer.prototype.addChild = function (child) {
        this.removeChild(child);
        this.array.push(child);
        child.parent = this;
    };
    DisplayObjectContainer.prototype.render = function (context2D) {
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var drawable = _a[_i];
            drawable.draw(context2D);
        }
    };
    DisplayObjectContainer.prototype.removeChild = function (child) {
        var tempArrlist = this.array.concat();
        for (var _i = 0, tempArrlist_1 = tempArrlist; _i < tempArrlist_1.length; _i++) {
            var each = tempArrlist_1[_i];
            if (each == child) {
                var index = this.array.indexOf(each);
                tempArrlist.splice(index, 1);
                this.array = tempArrlist;
                child.remove();
                break;
            }
        }
    };
    DisplayObjectContainer.prototype.hitTest = function (x, y, type) {
        for (var i = this.array.length - 1; i >= 0; i--) {
            var child = this.array[i];
            var pointBaseOnChild = math.pointAppendMatrix(new math.Point(x, y), math.invertMatrix(child.matrix));
            var hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y, type);
            if (hitTestResult) {
                return hitTestResult;
            }
        }
        return null;
    };
    return DisplayObjectContainer;
}(DisplayObject));
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.apply(this, arguments);
    }
    Bitmap.prototype.render = function (context2D) {
        context2D.drawImage(this.image, this.x, this.y);
    };
    Bitmap.prototype.hitTest = function (x, y, type) {
        var rect = new math.Rectangle();
        var point = new math.Point(x, y);
        rect.x = 0;
        rect.y = 0;
        rect.width = this.image.width;
        rect.height = this.image.height;
        if (rect.isPointInRectangle(point)) {
            return this;
        }
        else {
            return null;
        }
    };
    return Bitmap;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
        this.text = "";
        this.size = 10;
        this.color = "";
    }
    TextField.prototype.render = function (context2D) {
        context2D.fillStyle = this.color;
        context2D.fillText(this.text, this.x, this.y);
    };
    TextField.prototype.hitTest = function (x, y, type) {
        var rect = new math.Rectangle();
        var point = new math.Point(x, y);
        rect.x = 0;
        rect.y = 0;
        rect.width = this.size * this.text.length;
        rect.height = this.size;
        if (rect.isPointInRectangle(point)) {
            return this;
        }
        else {
            return null;
        }
    };
    return TextField;
}(DisplayObject));
//# sourceMappingURL=main.js.map