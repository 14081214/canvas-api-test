class Greeter {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }

    start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }

    stop() {
        clearTimeout(this.timerToken);
    }

}

window.onload = () => {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();

    var canvas=document.getElementById("myCanvas") as HTMLCanvasElement;
    var context=canvas.getContext("2d");
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
    
    setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context);
    }, 50)

    var image = document.createElement("img");
    image.src="mark.png"
    var bitmap = new Bitmap();
    bitmap.image = image;
    bitmap.y = 40;
    bitmap.x = 50;
    bitmap.relatalpha = 0.2;

    var text1 = new TextField();
    text1.text = "hello!";
    text1.x = 100;
    text1.y = 50;
    text1.size = 100;
    //text1.relatalpha = 0.2;
    //stage.globalAlpha = 1;
    //context.globalAlpha = 1;

    var text2 = new TextField();
    text2.text = "helloworld!";
    text2.x = 100;
    text2.y = 10;
    text2.size = 100;
    text2.relatalpha = 1;

    image.onload = () => {
        stage.addChild(bitmap);
        stage.addChild(text1);
        stage.addChild(text2);
    }
};

interface Drawable {
    draw(context2D: CanvasRenderingContext2D);
    remove();
}

class DisplayObject implements Drawable {
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
    render(context2D: CanvasRenderingContext2D) {

    }
}

class DisplayObjectContainer extends DisplayObject {
    array: Drawable[] = [];

    addChild(displayObject: DisplayObject) {
        this.removeChild(displayObject);
        this.array.push(displayObject);
        displayObject.parent = this;
    }

    draw(context2D: CanvasRenderingContext2D) {
        for (let drawable of this.array) {
            drawable.draw(context2D);
        }
    }

    removeChild(child:Drawable) {
        var tempArrlist=this.array.concat();
        for (let each of tempArrlist){
            if(each==child){
                var index=this.array.indexOf(child);
                tempArrlist.splice(index,1);
                this.array=tempArrlist;
                child.remove();
                break;
            }
        }
    }
}

class Bitmap extends DisplayObject {
    image: HTMLImageElement;

    render(context2D: CanvasRenderingContext2D) {
        context2D.drawImage(this.image, this.x, this.y);
    }
}

class TextField extends DisplayObject {

    text : string = "";
    size : number = 0;
    color : string = "";

    draw(context2D: CanvasRenderingContext2D) {
        //context2D.font = this.size + "px" + " " + this.font;
        context2D.fillStyle = this.color;
        context2D.fillText(this.text, this.x, this.y);
    }
}

