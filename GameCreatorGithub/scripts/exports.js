const canvas = document.getElementById('simulation-window');
const ctx = canvas.getContext('2d');

let game = {
    onUpdate: function(func){
        (function u(){
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            func()
            setTimeout(()=>{
                requestAnimationFrame(u)
            }, 1000 / 60) // fps cap
        })();
    }
}
let scene = {
    backgroundColor: function(color){
        switch(color){
            case 0:
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                break;
            case 1:
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                break;
            case 2:
                ctx.fillStyle = 'gray';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                break;
            case 3:
                ctx.fillStyle = 'skyblue';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                break;
            case 4:
                ctx.fillStyle = 'pink';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                break;
        }
    },
    drawText: function(text, color = 'white', fontSize = 16, dx = 50, dy = 50, otherOptions = {font: 'sans-serif'}){
        ctx.font = fontSize.toString() + 'px' + ' ' + otherOptions.font
        ctx.fillStyle = color
        ctx.fillText(text, dx, dy)
    }
};
let sprite = {
    create: function({ img = '', dx = 0, dy = 0, width = 50, height = 50 }){
        if (img === '' || img === null){
            throw new Error('no image source.')
        }
        const newImage = new Image()
        newImage.src = img

        function draw( { controller = false, options = { speed: 1, x: true, y: true } } = {} ){
            if (controller){
                if(keyState[37] || keyState[65] && options.x == true) dx-=options.speed; //left
                if(keyState[39] || keyState[68] && options.x == true) dx+=options.speed; //right
                if(keyState[40] || keyState[83] && options.y == true) dy+=options.speed; //down
                if(keyState[38] || keyState[87] && options.y == true) dy-=options.speed; //up
            }
            ctx.drawImage(newImage, dx, dy, width, height)
        }
        function x(){ return dx; }
        function y(){ return dy; }
        return { draw, x, y }
    }
}
let Mathf = {
    randInt: function(min, max){
        return Math.floor(Math.random() * (max - min) + min)
    }
}