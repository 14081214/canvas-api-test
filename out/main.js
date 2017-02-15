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
    bitmap.y = 0;
    var text1 = new TextField();
    text1.text = "hello!";
    text1.x = 100;
    text1.y = 50;
    text1.size = 30;
    image.onload = function () {
        stage.addChild(bitmap);
        stage.addChild(text1);
    };
};
var DisplayObjectContainer = (function () {
    function DisplayObjectContainer() {
        this.array = [];
    }
    DisplayObjectContainer.prototype.addChild = function (displayObject) {
        this.array.push(displayObject);
    };
    DisplayObjectContainer.prototype.draw = function (context2D) {
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var drawable = _a[_i];
            drawable.draw(context2D);
        }
    };
    return DisplayObjectContainer;
}());
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
    }
    DisplayObject.prototype.draw = function (context2D) {
    };
    return DisplayObject;
}());
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.apply(this, arguments);
    }
    Bitmap.prototype.draw = function (context2D) {
        context2D.drawImage(this.image, this.x, this.y);
    };
    return Bitmap;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
        this.text = "";
        this.size = 0;
        this.color = "";
    }
    TextField.prototype.draw = function (context2D) {
        context2D.font = this.size + "px" + " " + this.font;
        context2D.fillStyle = this.color;
        context2D.fillText(this.text, this.x, this.y);
    };
    return TextField;
}(DisplayObject));
//# sourceMappingURL=main.js.map