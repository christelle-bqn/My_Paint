let context

class mytoolBox {

    constructor() {
        this.tool = '';
        this.ready = '';
        this.canvasOffset = $('#canvas').offset();
        this.offsetX = this.canvasOffset.left;
        this.offsetY = this.canvasOffset.top;
        this.startX;
        this.startY; 
        this.formFilled = false;  
        this.colorStroke = 'black';
        this.lineWidth = 1;
    }

    line(e) {
        context.strokeStyle = this.colorStroke;
        if (!this.ready) {
            context.beginPath()
            context.moveTo(e.pageX - this.offsetX, e.pageY - this.offsetY)
            this.ready = true
        } else {
            context.lineTo(e.pageX - this.offsetX, e.pageY - this.offsetY)
            context.closePath()
            context.stroke()
            this.ready = false
        }
    }

    pencil(e) {
        context.strokeStyle = this.colorStroke;
        this.ready = true
        context.beginPath()
        context.moveTo(e.pageX - this.offsetX, e.pageY - this.offsetY)
    }

    eraser(e) {
        this.ready = true
        context.strokeStyle = 'white'
        context.lineWidth = 10
        context.beginPath()
        context.moveTo(e.pageX - this.offsetX, e.pageY - this.offsetY)
    }

    rectangle(e) {
        context.strokeStyle = this.colorStroke;
        context.fillStyle = this.colorStroke;
        this.mouseX = parseInt(e.pageX - this.offsetX)
        this.mouseY = parseInt(e.pageY - this.offsetY)

        if (this.ready) {
            this.ready = false
            context.beginPath()
            if (this.formFilled == true) {
                context.fillRect(this.startX, this.startY, this.mouseX - this.startX, this.mouseY - this.startY)
            } else {
                context.strokeRect(this.startX, this.startY, this.mouseX - this.startX, this.mouseY - this.startY)
            }
        } else {
            this.ready = true
            this.startX = this.mouseX
            this.startY = this.mouseY
        }
    }

    circle(e) {
        context.strokeStyle = this.colorStroke;
        context.fillStyle = this.colorStroke;
        this.mouseX = parseInt(e.pageX - this.offsetX)
        this.mouseY = parseInt(e.pageY - this.offsetY)

        if (this.ready) {
            this.ready = false
            context.beginPath()
            if (this.formFilled == true) {
                context.arc(this.startX, this.startY, this.mouseX - this.startX, 0, 2 * Math.PI, false)
                context.fill();
            } else {
                context.arc(this.startX, this.startY, this.mouseX - this.startX, 0, 2 * Math.PI, false)
                context.stroke()
            }
        } else {
            this.ready = true
            this.startX = this.mouseX
            this.startY = this.mouseY
        }
    }
}

function changeToolClick(toolBox) {
    $('#tool-line').on('click', (e) => {
        toolBox.tool = 'line'
        $(canvas).css('cursor', 'crosshair')
    });

    $('#tool-pencil').on('click', (e) => {
        toolBox.tool = 'pencil'
        $(canvas).css('cursor', 'default')
    });

    $('#tool-eraser').on('click', (e) => {
        toolBox.tool = 'eraser'
        $(canvas).css('cursor', 'pointer')
    });

    $('#tool-rectangle').on('click', (e) => {
        toolBox.tool = 'rectangle'
        toolBox.formFilled = false;
        $(canvas).css('cursor', 'crosshair')
    });

    $('#tool-filled_rectangle').on('click', (e) => {
        toolBox.tool = 'rectangle'
        toolBox.formFilled = true;
        $(canvas).css('cursor', 'crosshair')
    });

    $('#tool-circle').on('click', (e) => {
        toolBox.tool = 'circle'
        toolBox.formFilled = false;
        $(canvas).css('cursor', 'crosshair')
    });

    $('#tool-filled_circle').on('click', (e) => {
        toolBox.tool = 'circle'
        toolBox.formFilled = true
        $(canvas).css('cursor', 'crosshair')
    });
}

function execToolClick(toolBox, e) {
    switch (toolBox.tool) {
        case 'line':
            toolBox.line(e);
            break;
        
        case 'rectangle':
            toolBox.rectangle(e);
            break;

        case 'circle':
            toolBox.circle(e);
            break;

        default:
            console.warn('No tool selected !');
            break;
    }
}

function execToolMouseDown(toolBox, e) {
    switch (toolBox.tool) {
        case 'pencil':
            toolBox.pencil(e);
            break;
        
        case 'eraser':
            toolBox.eraser(e);
            break;
        
        default:
            console.warn('No tool selected !');
            break;
    }
}

function saveImagePNG() {    
    let link = document.createElement('a');
    link.href = canvas.toDataURL("image/png");
    link.download = "paint_image.png";
    link.click();
}

function saveImageJPEG() {    
    let link = document.createElement('a');
    link.href = canvas.toDataURL("image/jpeg");
    link.download = "paint_image.jpeg";
    link.click();
}

function openImage(e) {
    let img = new Image;
    img.onload = function() {
        context.drawImage(img, 20, 20);
    }
    img.src = URL.createObjectURL(e.target.files[0]);
}

function dropImage(e) {
    e.preventDefault();
    let img = new Image;
    img.onload = function() {
        context.drawImage(img, 20, 20);
    }
    img.src = URL.createObjectURL(e.dataTransfer.files[0]);
}

function RGBtoHex(inputRgb) {
    let sep = inputRgb.indexOf(",") > -1 ? "," : " ";
    rgb = inputRgb.substr(4).split(")")[0].split(sep);
    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);
    if (r.length == 1) {
        r = "0" + r;
    }
    if (g.length == 1) {
        g = "0" + g;
    }
    if (b.length == 1) {
        b = "0" + b;
    }    
        return "#" + r + g + b;
}

$().ready(() => {

    let canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    let toolBox = new mytoolBox();

    let holdStarter = null;
    let holdDelay = 100;
    let holdActive = false;

    let setLineWidth = function(newWidth) {
        if (newWidth < minWidth)
            newWidth = minWidth;
        else if (newWidth > maxWidth)
            newWidth = maxWidth;
        toolBox.lineWidth = newWidth
        context.lineWidth = toolBox.lineWidth;

        $('#lineVal').text(toolBox.lineWidth);
    }

    let minWidth = 1,
        maxWidth = 50;

    $('#color-picker').hide();

    let arrayColors = ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff",
    "#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f",
    "#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc",
    "#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd",
    "#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0",
    "#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79",
    "#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47",
    "#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"];
    
    for(let i = 1; i < 64; i++) {
        $('#color-picker').append('<button class="thumb" value='+arrayColors[i]+' style="background-color:'+ arrayColors[i]+'"></button>');
    };

    $('#color-picker').append('<button id="hide-palette">Hide Color Picker</button>');

    $('#decWidth').on('click', () => {
        setLineWidth(toolBox.lineWidth - 1);
    });

    $('#incWidth').on('click', () => {
        setLineWidth(toolBox.lineWidth + 1);
    });

    $('#canvas').on('mousedown', (e) => {
        onMouseDown(e);
    });

    function onMouseDown(e) {
        holdStarter = setTimeout(function() {
            holdStarter = null;
            holdActive = true;
            execToolMouseDown(toolBox, e);
            //console.log(e.pageX, e.pageY);
            console.log('Tool MouseDown :' + toolBox.tool);
        }, holdDelay);
    }  

    $('#canvas').on('mouseup', (e) => {
        onMouseUp(e);
    });

    function onMouseUp(e) {
        if (holdStarter) {
            clearTimeout(holdStarter);
            execToolClick(toolBox, e);
            //console.log(e.pageX, e.pageY);
            console.log('Tool Click :' + toolBox.tool);
        }
        else if (holdActive) {
            if (toolBox.pencil){
                context.strokeStyle = toolBox.colorStroke
                context.lineWidth = toolBox.lineWidth
                holdActive = false;
                toolBox.ready = false;
            } else {
                holdActive = false;
                toolBox.ready = false;
            }
        }
    }

    $('#canvas').on('mousemove', (e) => {
        onMouseMove(e);
    });  
 
    function onMouseMove(e) {
        if (toolBox.ready === true && (toolBox.tool == 'pencil' || toolBox.tool == 'eraser')) {
            context.lineTo(e.pageX - toolBox.offsetX, e.pageY - toolBox.offsetY);
            context.stroke();
        }
    }

    changeToolClick(toolBox);


    //SAVE/OPEN IMAGE

    $('#png-save').on('click', saveImagePNG);
    $('#jpeg-save').on('click', saveImageJPEG);

    $('#uploadimage').on('change', (e) => {
        openImage(e);
    });

    canvas.ondragover = function(e) {
        e.preventDefault();
        return false;
    };

    canvas.ondragenter = function(e) {
        e.preventDefault();
        return false;
    };

    canvas.ondrop = function(e) {
        dropImage(e);
    };


    //COLOR CONVERTION
    $('#button-rgb').on('click', (e) => {
        let inputRgb = $('#color-rgb').val();
        RGBtoHex(inputRgb);
        toolBox.colorStroke = RGBtoHex(inputRgb);
        context.colorStroke = toolBox.colorStroke;
        $('#current-color').text(toolBox.colorStroke);
    });

    $('#reset-color').on('click', (e) => {
        toolBox.colorStroke = 'black';
    });


    //COLOR PICKER 
    $('#show-palette').on('click', (e) => {
        $('#color-picker').show();
    });

    $('#hide-palette').on('click', (e) => {
        $('#color-picker').hide();
    });

    $('.thumb').on('click', function() {
        $color = $(this).val();
        toolBox.colorStroke = $color;
        context.colorStroke = toolBox.colorStroke;
        $('#current-color').text(toolBox.colorStroke);
    });
})