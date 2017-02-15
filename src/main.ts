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
    bitmap.y=0;
    //context.drawImage(img,0,0);

    image.onload = () => {
        stage.addChild(bitmap);

    }
};

interface Drawable {
    draw(context2D: CanvasRenderingContext2D);
}

class DisplayObjectContainer implements Drawable {
    array: Drawable[] = [];

    addChild(displayObject: DisplayObject) {
        this.array.push(displayObject);
    }

    draw(context2D: CanvasRenderingContext2D) {
        for (let drawable of this.array) {
            drawable.draw(context2D);
        }
    }
}

class DisplayObject implements Drawable {
    x: number = 0;
    y: number = 0;

    draw(context2D: CanvasRenderingContext2D) {
    }
}

class Bitmap extends DisplayObject {
    image: HTMLImageElement;

    draw(context2D: CanvasRenderingContext2D) {
        context2D.drawImage(this.image, this.x, this.y);
    }
}

