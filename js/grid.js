// p5 sketch
let cols, rows, cellSize;
let trail = [];
let shapeType = []; // 0=square,1=triangle,2=quarterCircle
let shapeOri = []; // 0..3 orientations (0,90,180,270)
const fadeSpeed = 0.005; // per frame

function setup(){
    const cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent('sketch-holder');
    pixelDensity(1);
    background(255);
    initGrid();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    initGrid();
}

function initGrid(){
    cellSize = Math.max(10, Math.floor(min(windowWidth, windowHeight)/16));
    cols = Math.ceil(windowWidth / cellSize);
    rows = Math.ceil(windowHeight / cellSize);
    // initialize trail alpha map
    trail = new Array(cols * rows).fill(0);
    // initialize randomized shape types & orientations per cell
    shapeType = new Array(cols * rows);
    shapeOri = new Array(cols * rows);
    for(let i=0;i<cols*rows;i++){
        shapeType[i] = floor(random(0,3));
        shapeOri[i] = floor(random(0,4));
    }
    // white background
    background(255);
}

function draw(){
    // clear to white
    clear();
    background(255);

    // fade trail values
    for(let i=0;i<trail.length;i++){
        trail[i] = max(0, trail[i] - fadeSpeed);
    }

    // if mouse in window, add stronger value
    if(mouseX>=0 && mouseX<=width && mouseY>=0 && mouseY<=height &&  (millis()%30<15)){
        const c = floor(mouseX / cellSize);
        const r = floor(mouseY / cellSize);
        if(c>=0 && c<cols && r>=0 && r<rows){
            const idx = r*cols + c;
            trail[idx] = min(1, trail[idx] + 0.35);
        }
    }

    // draw grid
    for(let r=0;r<rows;r++){
        for(let c=0;c<cols;c++){
            const idx = r*cols + c;
            const v = trail[idx];
            const x = c*cellSize;
            const y = r*cellSize;
            // subtle grid lines
            stroke(74, 144, 224, 50);
            strokeWeight(1);
            noFill();
            rect(x+0.5,y+0.5,cellSize-1,cellSize-1);

            if(v>0.005){
                const t = map(c,0,cols-1,0,1);
                const col = lerpColor(color('#FF853C'), color('#4A90E0'), t);
                const drawCol = lerpColor(color('#FFFFFF'), col, v);
                fill(red(drawCol), green(drawCol), blue(drawCol), v*255);
                noStroke();
                // draw randomized shape per cell
                const type = shapeType[idx];
                const ori = shapeOri[idx];
                push();
                translate(x, y);
                if(type===0){
                    // square
                    rect(1,1,cellSize-2,cellSize-2);
                }else if(type===1){
                    // right triangle with orientation
                    if(ori===0){
                        triangle(1,1, cellSize-1,1, 1,cellSize-1);
                    }else if(ori===1){
                        triangle(cellSize-1,1, cellSize-1,cellSize-1, 1,1);
                    }else if(ori===2){
                        triangle(cellSize-1,cellSize-1, 1,cellSize-1, cellSize-1,1);
                    }else{
                        triangle(1,cellSize-1, 1,1, cellSize-1,cellSize-1);
                    }
                }else{
                    // quarter circle: draw arc in one corner
                    const r = cellSize-2;
                    if(ori===0){
                        arc(1,1, 2*r, 2*r, 0, HALF_PI);
                    }else if(ori===1){
                        arc(cellSize-1,1, 2*r, 2*r, HALF_PI, PI);
                    }else if(ori===2){
                        arc(cellSize-1,cellSize-1, 2*r, 2*r, PI, PI+HALF_PI);
                    }else{
                        arc(1,cellSize-1, 2*r, 2*r, PI+HALF_PI, TWO_PI);
                    }
                }
                pop();
            }
        }
    }
}

function mouseMoved(){
    const c = floor(mouseX / cellSize);
    const r = floor(mouseY / cellSize);
    if(c>=0 && c<cols && r>=0 && r<rows){
        const idx = r*cols + c;
        trail[idx] = min(1, trail[idx] + 0.45);
    }
}

function touchStarted(){mouseMoved();}
function touchMoved(){mouseMoved();return false;}