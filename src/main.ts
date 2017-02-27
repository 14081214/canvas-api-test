enum TouchEventsType{
    MOUSEDOWN = 0,
    MOUSEUP = 1,
    CLICK = 2,
    MOUSEMOVE = 3
}

class TouchEvents {
    type: TouchEventsType;
    func: Function;
    obj: any;
    capture = false;
    priority = 0;


    constructor(type: TouchEventsType, func: Function, obj: any, capture?: boolean, priority?: number) {
        this.type = type;
        this.func = func;
        this.obj = obj;
        this.capture = capture || false;
        this.priority = priority || 0;
    }
}

class TouchEventService{
    private static instance;
    private performerList : DisplayObject[] = [];
    static currentType : TouchEventsType;
    static stageX = -1;
    static stageY = -1;
    static getInstance() : TouchEventService{
        if(TouchEventService.instance == null){
            TouchEventService.instance = new TouchEventService();
        }
        return this.instance;
    }

    addPerformer(performer : DisplayObject){
        this.performerList.push(performer);
    }

    clearList(){
        this.performerList.splice(0,this.performerList.length);
    }

    toDo(){
        for(var i = 0;i <= this.performerList.length - 1;i++){
            for(var listner of this.performerList[i].listeners){
                if(listner.type == TouchEventService.currentType){
                    if(listner.capture){
                        listner.func();
                        continue;
                    }
                }
            }
        }

        for(var i = this.performerList.length - 1;i >= 0;i--){
            for(var listner of this.performerList[i].listeners){
                if(listner.type == TouchEventService.currentType){
                    if(!listner.capture){
                        listner.func();
                        continue;
                    }
                }
            }
        }
        this.clearList();
    }
}

window.onload = () => {
    var canvas=document.getElementById("myCanvas") as HTMLCanvasElement;
    var context=canvas.getContext("2d");
    
    var stage = new DisplayObjectContainer();
    var container = new DisplayObjectContainer();
    
    var curTarget;
    var staTarget;
    var isMouseDown = false;
    var staPoint = new math.Point(-1,-1);
    var movingPoint = new math.Point(0,0);

    setInterval(() => {
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context);
        context.restore();
    }, 50)

    var image = document.createElement("img");
    image.src="mark.png"
    var image2 = document.createElement("img");
    image2.src="sf.jpg"
    
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

    image.onload = () => {
        //stage.addChild(text1);
        //stage.addChild(text2);
        stage.addChild(container);
        container.addChild(list);
        container.addChild(button);
    }

    stage.addEventListener(TouchEventsType.MOUSEDOWN,()=>{

    },this)

    container.addEventListener(TouchEventsType.MOUSEMOVE,()=>{

    },this)

    list.addEventListener(TouchEventsType.MOUSEMOVE,()=>{
        if(curTarget == staTarget){
        container.x += (TouchEventService.stageX - movingPoint.x);
        container.y += (TouchEventService.stageY - movingPoint.y);
        }
    },this);

    button.addEventListener(TouchEventsType.CLICK,()=>{
        alert("You have click!");
    },this);

    window.onmousedown = (e) =>{
        let x = e.offsetX;
        let y = e.offsetY;
        TouchEventService.stageX = x;
        TouchEventService.stageY = y;
        staPoint.x = x;
        staPoint.y = y;
        movingPoint.x = x;
        movingPoint.y = y;
        TouchEventService.currentType = TouchEventsType.MOUSEDOWN;
        curTarget = stage.hitTest(x,y);
        staTarget = curTarget;
        TouchEventService.getInstance().toDo();
        isMouseDown = true;
    }

    window.onmouseup = (e) =>{
        let x = e.offsetX;
        let y = e.offsetY;
        TouchEventService.stageX = x;
        TouchEventService.stageY = y;
        var target = stage.hitTest(x,y);
        if(target == curTarget){
            TouchEventService.currentType = TouchEventsType.CLICK;
        }
        else{
            TouchEventService.currentType = TouchEventsType.MOUSEUP
        }
        TouchEventService.getInstance().toDo();

        curTarget = null;
        isMouseDown = false;
    }

    window.onmousemove = (e) =>{
        if(isMouseDown){
            let x = e.offsetX;
            let y = e.offsetY;
            TouchEventService.stageX = x;
            TouchEventService.stageY = y;
            TouchEventService.currentType = TouchEventsType.MOUSEMOVE;
            curTarget = stage.hitTest(x,y);
            TouchEventService.getInstance().toDo();
            movingPoint.x = x;
            movingPoint.y = y;
        }
    }
};

interface Drawable {
    render(context2D: CanvasRenderingContext2D);
    remove();
}

abstract class DisplayObject implements Drawable {
    matrix: math.Matrix = null;
    globalMatrix: math.Matrix = null;

    x: number = 0;
    y: number = 0;
    scaleX: number = 1;
    scaleY: number = 1;
    rotation: number = 0;
    relatalpha: number = 1;
    globalAlpha: number = 1;                           
    parent: DisplayObject = null;

    listeners: TouchEvents[] = [];
    remove(){};

    constructor() {
        this.matrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();
    }

    draw(context2D: CanvasRenderingContext2D) {
        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.relatalpha;
            this.globalMatrix = math.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);
        } 
        if(this.parent == null){
            this.globalAlpha = this.relatalpha;
            this.globalMatrix = this.matrix;
        }

        context2D.globalAlpha = this.globalAlpha;
        context2D.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        this.render(context2D);
    }

    addEventListener(type : TouchEventsType,touchFunction : Function,object : any,ifCapture? : boolean,priority?: number){
        var touchEvent = new TouchEvents(type,touchFunction,object,ifCapture,priority);
        this.listeners.push(touchEvent);
      }
    abstract render(context2D: CanvasRenderingContext2D);
    abstract hitTest(x: number, y: number): DisplayObject;
}

class DisplayObjectContainer extends DisplayObject {
    array: DisplayObject[] = [];

    addChild(child: DisplayObject) {
        this.removeChild(child);
        this.array.push(child);
        child.parent = this;
    }

    render(context2D: CanvasRenderingContext2D) {
        for (let displayObject of this.array) {
            displayObject.draw(context2D);
        }
    }

    removeChild(child:Drawable) {
        var tempArrlist=this.array.concat();
        for (let each of tempArrlist){
            if(each==child){
                var index=this.array.indexOf(each);
                tempArrlist.splice(index,1);
                this.array=tempArrlist;
                child.remove();
                break;
            }
        }
    }

    hitTest(x: number, y: number) {
        for (let i = this.array.length - 1; i >= 0; i--) {
            var child = this.array[i];
            var pointBaseOnChild = math.pointAppendMatrix(new math.Point(x, y), math.invertMatrix(child.matrix));
            var hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
            if (hitTestResult) {
                return hitTestResult;
            }
        }
        return null;
    }
}

class Bitmap extends DisplayObject {
    image: HTMLImageElement;

    render(context2D: CanvasRenderingContext2D) {
        context2D.drawImage(this.image, this.x, this.y);
    }

    hitTest(x: number, y: number) {
        var rect = new math.Rectangle();
        var point = new math.Point(x,y);
        rect.x = 0;
        rect.y = 0;
        rect.width = this.image.width;
        rect.height = this.image.height;

        if (rect.isPointInRectangle(point)) {
            TouchEventService.getInstance().addPerformer(this);
            return this;
        } else {
            return null;
        }
    }
}

class TextField extends DisplayObject {
    text : string = "";
    size : number = 10;
    color : string = "";

    render(context2D: CanvasRenderingContext2D) {
        context2D.fillStyle = this.color;
        context2D.fillText(this.text, this.x, this.y);
    }

    hitTest(x : number,y :number){
        var rect = new math.Rectangle();
        var point = new math.Point(x, y);
        rect.x = 0;
        rect.y = 0;
        rect.width =this.size * this.text.length;
        rect.height = this.size;
        
        if(rect.isPointInRectangle(point)){
            TouchEventService.getInstance().addPerformer(this);
            return this;
        }
        else{
            return null;
        }
    }
}

