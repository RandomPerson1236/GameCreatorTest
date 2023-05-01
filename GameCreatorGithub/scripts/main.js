"use strict"

const run = document.getElementById('run-code')
const stop = document.getElementById('stop-code')

const loadd = document.getElementById('sim-load')

require.config({
    paths: { vs: "./node_modules/monaco-editor/min/vs" }
});

let code = null
require(['vs/editor/editor.main'], function () {

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
    {
        noLib: true,
        allowNonTsExtensions: true
    });

    // extra libraries
    const libSource = exports
    const libUri = "ts:filename/sprites.d.ts";
    monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
    monaco.editor.createModel(libSource, "typescript", monaco.Uri.parse(libUri));

    let editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: [
            '/* Welcome to your new empty project!', 
            '   If you need help, check out the examples:', 
            '   https://notdoneyet.com/blah.html */', 
            '', 
            '// Called once every frame.', 
            'game.onUpdate(function(){', 
            '   ',
            '})'
        ].join('\n'),
        language: 'javascript',
        roundedSelection: false,
        theme: 'vs-light',
        minimap: { enabled: false },
        automaticLayout: true,
        fontSize: '18px'
    });

    run.addEventListener('click', _=>{
        code = editor.getValue()
    })
});

const iframe = document.getElementById('sim-win').contentWindow;

let frameCode = null

function loadFrame(){
    iframe.location.reload()
    loadd.style.display = 'flex'
    setTimeout(()=>{
        frameCode = '<link href="https://fonts.cdnfonts.com/css/arcade-classic" rel="stylesheet">' +
        '<style>body{margin:0 !important; background-color: black !important; font-family: "ArcadeClassic", sans-serif; image-rendering: pixelated}</style>'+
        '<canvas id="simulation-window" height="300" width="300"></canvas>' + 
        `<script>${otherExports}</script>` +
        `<script>${exports}</script>` +
        `<script type="module"> \n${code}</script>`
        iframe.document.open();
        iframe.document.write(frameCode);
        iframe.document.close()
        loadd.style.display = 'none'
    }, 1000)
}

run.addEventListener('click', _=>{
    loadFrame()
})
stop.addEventListener('click', _=>{
    iframe.location.reload()
})

let exports = `
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
    drawText: function(text, color = 'white', fontSize = 16, dx = 50, dy = 50, otherOptions = {font: 'sans-serif', timer: 0}){
        let active = true
        if (otherOptions.timer === undefined || otherOptions.timer === 0 || otherOptions.timer === null || active){
            ctx.font = fontSize.toString() + 'px' + ' ' + otherOptions.font
            ctx.fillStyle = color
            ctx.fillText(text, dx, dy)
        } else {
            setTimeout(()=>{
                active = false
            }, otherOptions.timer)
        }
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
`
let otherExports = `
let keyState = {  }
window.addEventListener('keydown', e=>{ keyState[e.keyCode] = true; })
window.addEventListener('keyup', e=>{ keyState[e.keyCode] = false })

const canvas = document.getElementById('simulation-window');
const ctx = canvas.getContext('2d');
`