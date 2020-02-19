canvas = document.getElementById("myCanvas");
canvas.width = document.documentElement.clientWidth - 50;
canvas.width = Math.max(600, canvas.width);
canvas.height = document.documentElement.clientHeight - 50;

const d = new drawTool("myCanvas");
d.translate(d.width/2, d.height/2);

// Control de tecles
var keys = {};
onkeydown = onkeyup = function(e){
    e = e || event; 
    keys[e.keyCode] = e.type == 'keydown';
}

function moveCarKeys() {
    // Up
    if (keys[38]) {
        car.action(0);
    }
    // Down
    if (keys[40]) {
        car.action(1);
    }
    // Left
    if (keys[37]) {
        car.action(2);
    }
    // Right
    if (keys[39]) {
        car.action(3);
    }
}

// var clicat = false
// var checkpoints = []
// var temp = {x:0, y:0}

// function getMousePos(canvas, evt) {
//     var rect = canvas.getBoundingClientRect();
//     return {
//       x: evt.clientX - rect.left,
//       y: evt.clientY - rect.top
//     };
// }

// onclick = (e) => {
//     let pos = getMousePos(d.canv, e);
//     pos.x -= d.width/2;
//     pos.y -= d.height/2;

//     if (clicat) {
//         checkpoints.push([temp.x, temp.y, pos.x, pos.y]);
//         clicat = false;
//         console.log('---------------------')
//         var str = "["
//         for (let i = 0; i < checkpoints.length; ++i) {
//             str += checkpoints[i] + ',';
//         }
//         console.log(str + ']');
//     }
//     else {
//         clicat = true;
//         temp.x = pos.x;
//         temp.y = pos.y;
//     }
// }

var routeWalls = []
function setUpRoute () {
    var route = [274,549,174,522,174,522,99,432,100,435,104,306,104,308,119,206,119,210,176,123,176,125,334,91,334,92,481,90,478,
        92,751,101,749,102,1012,142,1011,143,1082,202,1082,203,1094,252,1094,253,1072,314,1074,314,961,332,962,332,823,316,825,317,
        687,312,689,313,537,300,539,301,522,299,310,486,232,451,233,452,189,404,191,406,188,291,189,294,229,212,228,215,366,174,
        365,177,505,171,504,172,641,169,638,171,824,183,823,184,947,210,947,211,964,231,964,232,957,244,956,244,915,240,917,241,
        697,240,697,240,596,237,595,238,514,236,514,237,412,225,412,225,341,227,342,228,277,263,278,264,264,333,264,332,250,372,
        251,372,275,404,275,403,365,444,521,300,470,303,470,303,408,315,408,316,396,332,395,333,399,349,399,350,414,367,415,367,
        579,403,579,405,743,405,743,407,866,425,866,426,937,432,937,432,1032,412,1032,413,1092,379,1092,380,1112,314,1113,316,1118,
        48,1119,51,1201,22,1201,24,1302,35,1302,37,1315,72,1315,72,1314,368,1315,368,1281,515,1282,516,1109,558,1112,559,896,568,
        898,569,710,582,712,583,500,575,504,577,356,563,357,564,273,549,365,444,598,454,598,455,807,475,808,477,1028,477,1027,479,
        1151,406,1152,407,1202,264,1202,266,1213,178,1214,181,1217,140,1218,142,1226,196,1227,197,1221,337,1222,335,1201,421,1204,
        420,1073,491,1074,491,827,491,829,493,618,491,621,493,429,486,429,487,303,483];

    for (let i = 0; i < route.length; i += 4) {
        let w = new Wall(route[i] - d.width/2, route[i + 1] - d.height/2, route[i + 2] - d.width/2, route[i + 3] - d.height/2);
        routeWalls.push(w);
    }
}

function drawRoute() {
    // Pintar carretera  
    for (let i = 0; i < routeWalls.length; ++i) {
        routeWalls[i].show();
    }
}

var checkpoints = [];
function setUpCheckpoints() {
    let dots = [127,201.5,131,284.5,100,198.5,102,285.5,65,200.5,66,288.5,35,290.5,33,198.5,-6,197.5,-5,288.5,-45,199.5,-38,286.5,-80,197.5,-78,285.5,-112,198.5,-116,282.5,-145,196.5,-155,281.5,-184,194.5,-187,280.5,-216,193.5,-221,277.5,-249,194.5,-254,274.5,-278,192.5,-286,272.5,-316,192.5,-317,267.5,-345,190.5,-360,262.5,-374,183.5,-397,250.5,-403,170.5,-437,241.5,-430,152.5,-474,231.5,-497,212.5,-448,135.5,-461,117.5,-528,174.5,-468,106.5,-553,143.5,-557,105.5,-468,86.5,-468,63.5,-555,58.5,-555,25.5,-469,33.5,-550,-9.5,-469,1.5,-543,-53.5,-452,-35.5,-441,-51.5,-536,-94.5,-520,-114.5,-431,-76.5,-492,-148.5,-414,-82.5,-443,-171.5,-401,-88.5,-396,-187.5,-365,-97.5,-365,-192.5,-343,-104.5,-322,-199.5,-308,-113.5,-282,-198.5,-280,-116.5,-223,-204.5,-227,-118.5,-188,-201.5,-181,-119.5,-148,-198.5,-146,-122.5,-110,-195.5,-106,-122.5,-74,-195.5,-65,-122.5,-25,-194.5,-19,-124.5,13,-194.5,17,-119.5,52,-193.5,57,-119.5,97,-189.5,97,-114.5,126,-186.5,124,-112.5,166,-179.5,161,-111.5,197,-173.5,192,-104.5,233,-168.5,225,-97.5,265,-159.5,243,-93.5,262,-92.5,309,-157.5,289,-83.5,370,-137.5,304,-68.5,412,-99.5,305,-55.5,435,-54.5,300,-49.5,416,15.5,287,-47.5,356,27.5,267,-48.5,285,36.5,233,-50.5,236,32.5,195,-51.5,197,26.5,162,-52.5,160,19.5,117,22.5,120,-54.5,87,-52.5,89,18.5,53,18.5,57,-55.5,28,-54.5,19,18.5,-8,-53.5,-10,16.5,-48,-54.5,-44,12.5,-85,-55.5,-86,2.5,-112,-57.5,-114,3.5,-143,-58.5,-143,8.5,-189,-60.5,-181,11.5,-227,-65.5,-213,17.5,-239,18.5,-300,-65.5,-258,32.5,-358,-36.5,-261,46.5,-392,21.5,-255,60.5,-404,81.5,-241,75.5,-351,126.5,-225,82.5,-272,149.5,-195,84.5,-209,151.5,-147,94.5,-161,157.5,-98,104.5,-108,163.5,-39,113.5,-37,165.5,3,111.5,1,166.5,59,110.5,55,173.5,107,119.5,112,174.5,147,125.5,148,181.5,181,130.5,185,183.5,219,133.5,222,182.5,246,138.5,250,176.5,283,136.5,299,185.5,323,132.5,331,178.5,355,123.5,369,182.5,379,116.5,421,157.5,417,96.5,453,139.5,436,82.5,497,106.5,447,51.5,513,65.5,455,14.5,528,21.5,459,-25.5,535,-8.5,460,-71.5,546,-60.5,459,-111.5,553,-92.5,464,-158.5,559,-138.5,549,-161.5,469,-242.5,561,-151.5,549,-268.5,563,-140.5,616,-257.5,566,-136.5,653,-238.5,567,-121.5,658,-168.5,573,-111.5,657,-108.5,571,-75.5,654,-74.5,571,-44.5,653,-35.5,569,-9.5,656,-5.5,566,18.5,655,32.5,566,55.5,657,83.5,554,82.5,650,117.5,550,113.5,643,152.5,538,133.5,628,204.5,513,147.5,591,233.5,476,167.5,513,241.5,435,189.5,461,261.5,405,195.5,411,267.5,369,196.5,376,264.5,331,199.5,340,276.5,290,197.5,303,274.5,250,194.5,259,267.5,215,200.5,229,280.5]
        for (let i = 0; i < dots.length; i += 4) {
        checkpoints.push(new Wall(dots[i], dots[i + 1], dots[i + 2], dots[i + 3]));
    }
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function checkKeys() {
    // 1
    if (keys[49]) {
        velocity = 1;
        d.stopInterval();
        d.setInterval(update, 20);
    }
    // 2
    if (keys[50]) {
        velocity = 2;
        d.stopInterval();
        d.setInterval(update, 10);
    }
    // 3
    if (keys[51]) {
        velocity = 3;
        d.stopInterval();
        d.setInterval(update, 5);
    }
    // W - show checkpoints
    if (keys[87]) {
        showRewards = !showRewards;
        sleep(100);
    }

    // S - show sense
    if (keys[83]) {
        showSense = !showSense;
        sleep(100);
    }

    // N - next gen
    if (keys[78]) {
        nextGen = true;
        sleep(100);
    }

    // P - pause
    if (keys[80]) {
        pause = !pause;
        if (pause) {
            d.stopInterval();
            d.setInterval(checkKeys, 10);
        }
        else {
            d.stopInterval();
            d.setInterval(update, 10);
        }   
        sleep(100);
    }
}

var displayStep = document.getElementById("steps");
var displayGen = document.getElementById("generation");
var displayVel = document.getElementById("velocity");

var generation = 0;
var step = 0;
var velocity = 1;
var showRewards = false;
var showSense = false;
var pause = false;
var nextGen = false;
var stepsForGen = 800;
var nPeople = 100;
var population = new Population(nPeople, stepsForGen, routeWalls, checkpoints);

function update () {
    d.clearAll();

    drawRoute();    
    checkKeys();
    // moveCarKeys();
    if (showRewards) {
        // Pintar checkpoints  
        for (let i = 0; i < checkpoints.length; i++) {
            checkpoints[i].show("green");
        }
    }
    step = population.run(step);

    displayStep.textContent = "Step: " + step;
    displayGen.textContent = "Generation: " + generation;
    displayVel.textContent = "Velocity: " + velocity;

    if (step >= stepsForGen || nextGen) {
        nextGen = false;
        step = 0;
        ++generation;
        population.selection();
        population.reproduction();
    }
}

setUpRoute();
setUpCheckpoints();
d.setInterval(update, 20);