var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _this = this;
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
var TouchEventService = (function () {
    function TouchEventService() {
        this.performerList = [];
    }
    TouchEventService.getInstance = function () {
        if (TouchEventService.instance == null) {
            TouchEventService.instance = new TouchEventService();
        }
        return this.instance;
    };
    TouchEventService.prototype.addPerformer = function (performer) {
        this.performerList.push(performer);
    };
    TouchEventService.prototype.clearList = function () {
        this.performerList.splice(0, this.performerList.length);
    };
    TouchEventService.prototype.toDo = function () {
        for (var i = 0; i <= this.performerList.length - 1; i++) {
            for (var _i = 0, _a = this.performerList[i].listeners; _i < _a.length; _i++) {
                var listner = _a[_i];
                if (listner.type == TouchEventService.currentType) {
                    if (listner.capture) {
                        listner.func();
                        continue;
                    }
                }
            }
        }
        for (var i = this.performerList.length - 1; i >= 0; i--) {
            for (var _b = 0, _c = this.performerList[i].listeners; _b < _c.length; _b++) {
                var listner = _c[_b];
                if (listner.type == TouchEventService.currentType) {
                    if (!listner.capture) {
                        listner.func();
                        continue;
                    }
                }
            }
        }
        this.clearList();
    };
    TouchEventService.stageX = -1;
    TouchEventService.stageY = -1;
    return TouchEventService;
}());
window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    var stage = new DisplayObjectContainer();
    var container = new DisplayObjectContainer();
    var curTarget;
    var staTarget;
    var isMouseDown = false;
    var staPoint = new math.Point(-1, -1);
    var movingPoint = new math.Point(0, 0);
    setInterval(function () {
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context);
        context.restore();
    }, 50);
    var image = document.createElement("img");
    image.src = "mark.png";
    var image2 = document.createElement("img");
    image2.src = "sf.jpg";
    var list = new Bitmap();
    list.image = image;
    list.y = 30;
    list.x = 30;
    //list.relatalpha = 0.2;
    var button = new Bitmap();
    button.image = image2;
    button.y = 30;
    button.x = 100;
    button.relatalpha = 1;
    /*var text1 = new TextField();
    text1.text = "hello!";
    text1.x = 40;
    text1.y = 70;
    text1.size = 20;
    text1.relatalpha = 0.5;

    var text2 = new TextField();
    text2.text = "helloworld!";
    text2.x = 35;
    text2.y = 65;
    text2.size = 50;*/
    image.onload = function () {
        //stage.addChild(text1);
        //stage.addChild(text2);
        stage.addChild(container);
        container.addChild(list);
        container.addChild(button);
    };
    stage.addEventListener(TouchEventsType.MOUSEDOWN, function () {
    }, _this);
    container.addEventListener(TouchEventsType.MOUSEMOVE, function () {
    }, _this);
    list.addEventListener(TouchEventsType.MOUSEMOVE, function () {
        if (curTarget == staTarget) {
            container.x += (TouchEventService.stageX - movingPoint.x);
            container.y += (TouchEventService.stageY - movingPoint.y);
        }
    }, _this);
    button.addEventListener(TouchEventsType.CLICK, function () {
        alert("You have click!");
    }, _this);
    window.onmousedown = function (e) {
        var x = e.offsetX;
        var y = e.offsetY;
        TouchEventService.stageX = x;
        TouchEventService.stageY = y;
        staPoint.x = x;
        staPoint.y = y;
        movingPoint.x = x;
        movingPoint.y = y;
        TouchEventService.currentType = TouchEventsType.MOUSEDOWN;
        curTarget = stage.hitTest(x, y);
        staTarget = curTarget;
        TouchEventService.getInstance().toDo();
        isMouseDown = true;
    };
    window.onmouseup = function (e) {
        var x = e.offsetX;
        var y = e.offsetY;
        TouchEventService.stageX = x;
        TouchEventService.stageY = y;
        var target = stage.hitTest(x, y);
        if (target == curTarget) {
            TouchEventService.currentType = TouchEventsType.CLICK;
        }
        else {
            TouchEventService.currentType = TouchEventsType.MOUSEUP;
        }
        TouchEventService.getInstance().toDo();
        curTarget = null;
        isMouseDown = false;
    };
    window.onmousemove = function (e) {
        if (isMouseDown) {
            var x = e.offsetX;
            var y = e.offsetY;
            TouchEventService.stageX = x;
            TouchEventService.stageY = y;
            TouchEventService.currentType = TouchEventsType.MOUSEMOVE;
            curTarget = stage.hitTest(x, y);
            TouchEventService.getInstance().toDo();
            movingPoint.x = x;
            movingPoint.y = y;
        }
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
            var displayObject = _a[_i];
            displayObject.draw(context2D);
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
    DisplayObjectContainer.prototype.hitTest = function (x, y) {
        for (var i = this.array.length - 1; i >= 0; i--) {
            var child = this.array[i];
            var pointBaseOnChild = math.pointAppendMatrix(new math.Point(x, y), math.invertMatrix(child.matrix));
            var hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
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
    Bitmap.prototype.hitTest = function (x, y) {
        var rect = new math.Rectangle();
        var point = new math.Point(x, y);
        rect.x = 0;
        rect.y = 0;
        rect.width = this.image.width;
        rect.height = this.image.height;
        if (rect.isPointInRectangle(point)) {
            TouchEventService.getInstance().addPerformer(this);
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
    TextField.prototype.hitTest = function (x, y) {
        var rect = new math.Rectangle();
        var point = new math.Point(x, y);
        rect.x = 0;
        rect.y = 0;
        rect.width = this.size * this.text.length;
        rect.height = this.size;
        if (rect.isPointInRectangle(point)) {
            TouchEventService.getInstance().addPerformer(this);
            return this;
        }
        else {
            return null;
        }
    };
    return TextField;
}(DisplayObject));
//# sourceMappingURL=main.js.map