canvas = document.getElementById("myCanvas");
canvas.width = document.documentElement.clientWidth - 50;
canvas.width = Math.max(600, canvas.width);
canvas.height = document.documentElement.clientHeight - 50;

const d = new drawTool("myCanvas");
d.translate(d.width/2, d.height/2);

var car = new Car(0, 0, 20, 40);

// Control de tecles
var keys = {};
onkeydown = onkeyup = function(e){
    e = e || event; 
    keys[e.keyCode] = e.type == 'keydown';
}

function checkKeys() {
    var vel = 1;
    var rot = 0.13;
    // Up
    if (keys[38]) {
        car.forward(vel);
    }
    // Down
    if (keys[40]) {
        car.back(vel);
    }
    // Left
    if (keys[37]) {
        car.left(rot);
    }
    // Right
    if (keys[39]) {
        car.right(rot);
    }
}

var clicat = false
var roadWalls = []
var temp = {x:0, y:0}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

// onclick = (e) => {
//     let pos = getMousePos(d.canv, e);
//     if (clicat) {
//         roadWalls.push([temp.x, temp.y, pos.x, pos.y]);
//         clicat = false;
//         console.log('---------------------')
//         var str = "["
//         for (let i = 0; i < roadWalls.length; ++i) {
//             str += roadWalls[i] + ',';
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


function update () {
    d.clearAll();
    checkKeys();
    car.move();
    
    console.log(car.dir)

    var c = "green";
    for (let i = 0; i < routeWalls.length; ++i) {
        if (car.collides(routeWalls[i])) {
            c = "red";
        }  
        routeWalls[i].show();
    }
    car.show(c);
    car.checkVel();
}


setUpRoute();
d.setInterval(update, 20);