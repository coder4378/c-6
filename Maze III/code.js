var p5Inst = new p5(null, 'sketch');

window.preload = function () {
  initMobileControls(p5Inst);

  p5Inst._predefinedSpriteAnimations = {};
  p5Inst._pauseSpriteAnimationsByDefault = false;
  var animationListJSON = {"orderedKeys":[],"propsByKey":{}};
  var orderedKeys = animationListJSON.orderedKeys;
  var allAnimationsSingleFrame = false;
  orderedKeys.forEach(function (key) {
    var props = animationListJSON.propsByKey[key];
    var frameCount = allAnimationsSingleFrame ? 1 : props.frameCount;
    var image = loadImage(props.rootRelativePath, function () {
      var spriteSheet = loadSpriteSheet(
          image,
          props.frameSize.x,
          props.frameSize.y,
          frameCount
      );
      p5Inst._predefinedSpriteAnimations[props.name] = loadAnimation(spriteSheet);
      p5Inst._predefinedSpriteAnimations[props.name].looping = props.looping;
      p5Inst._predefinedSpriteAnimations[props.name].frameDelay = props.frameDelay;
    });
  });

  function wrappedExportedCode(stage) {
    if (stage === 'preload') {
      if (setup !== window.setup) {
        window.setup = setup;
      } else {
        return;
      }
    }
// -----

World.frameRate = 20;

noStroke();

var speed = (2.0 / 20.0);
var downscale_factor = 4;
var borderwidth = 0.1;

var w = World.width;
var h = World.height;

var fov = 90;

var d = w / (2.0 * downscale_factor * tan(fov/2));
var yaw = 0;

var pY = -4;
var pX = -5;
var pdX = 0.5;
var pdY = 0.5;


function isBlockSolid(fx,fy) {
  if(abs(fx) > 5 || abs(fy) > 5) return true;
  if(abs(fx) > 4 || abs(fy) > 4 ) {
    if(fx == -5 && fy == -4) return false;
    if(fx == 5 && fy == 4) return false;  
    
    return true;
  }
  if(fy == -4) {
    if(fx == -1) return true;
    return false;
  }
  if(fy == -3) {
    if(abs(fx) == 4 || fx == 0) return false;
    return true;
  }
  if(fy == -2) {
    if(fx == 1 || fx == 3) return true;
    return false;
  }
  if(fy == -1) {
    if(fx == -4 || fx == 2) return false;
    return true;
  }
  if(fy == 0) {
    if(fx == -1) return true;
    return false;
  }
  if(fy == 1) {
    if(fx == 4 || fx == -2) return false;
    return true;
  }
  if(fy == 2) {
    if(fx == -1 || fx == -3) return true;
    return false;
  }
  if(fy == 3) {
    if(abs(fx) == 4 || fx == 0 || fx == -2) return false;
    return true;
  }
  if(fy == 4) {
    if(fx == 1) return true;
    return false;
  }
}


function isWallSolid(x,y) {
  var fx = floor(x);
  var fy = floor(y);
  
  if(x - fx < y - fy) {
    return isBlockSolid(fx,fy) || isBlockSolid(fx-1,fy);
  } else {
    return isBlockSolid(fx,fy) || isBlockSolid(fx,fy-1);
  }
}

function isWallBorder(x,y) {
  var fx = floor(x);
  var fy = floor(y);
  
  if(x - fx < y - fy) {
    return y - fy < borderwidth || 1 - y + fy < borderwidth;
  } else {
    return x - fx < borderwidth || 1 - x + fx < borderwidth;
  }
}

function isBlockWin(fx,fy) {
  return fx == 6 && fy == 4;
}

function isWallWin(x,y) {
  var fx = floor(x);
  var fy = floor(y);
  
  if(x - fx < y - fy) {
    return isBlockWin(fx,fy) || isBlockWin(fx-1,fy);
  } else {
    return isBlockWin(fx,fy) || isBlockWin(fx,fy-1);
  }
}

var isStart = true;
var isWin = false;
function draw() {
  
  if(isStart) {
    fill("black");
    background("lime");
    textSize(20);
    text("Hello to my game. Press WASD to move\n    you have t0 touch a yellow wall \n    and left and right arrow to turn. \n            Press A to start",25,180);
    if(keyDown("a")) {
      isStart = false;
      
      yaw = 0;
      pY = -4;
      pX = -5;
      pdX = 0.5;
      pdY = 0.5;
    }
    return;
  }
  
  if(isWin) {
    fill("black");
    background("gold");
    textSize(20);
    text("You win! press A to restart!",75,180);
    if(keyDown("a")) {
      isWin = false;
      
      yaw = 0;
      pY = -4;
      pX = -5;
      pdX = 0.5;
      pdY = 0.5;
    }
    return;
  }
  
  if(keyDown("left")) {yaw += 12;}
  if(keyDown("right")) {yaw -= 12;}
  
  var betaX = cos(yaw);
  var betaY = sin(yaw);
  
  var mx = 0;
  var my = 0;
  
  if(keyDown("w")) {mx += betaX * speed;my += betaY * speed;} 
  if(keyDown("a")) {mx -= betaY * speed;my += betaX * speed;} 
  if(keyDown("s")) {mx -= betaX * speed;my -= betaY * speed;} 
  if(keyDown("d")) {mx += betaY * speed;my -= betaX * speed;} 
  
  if(isBlockWin(floor(pX + pdX + mx),floor(pY + pdY + my))) {
    isWin = true;
    return;
  }  
  
  if(!isBlockSolid(floor(pX + pdX + mx),floor(pY + pdY + my))) {
    pdX += mx;
    pdY += my;
    
    while(pdX >= 1) {pdX -= 1;pX += 1;}
    while(pdX < 0) {pdX += 1;pX -= 1;}
    while(pdY >= 1) {pdY -= 1;pY += 1;}
    while(pdY < 0) {pdY += 1;pY -= 1;}
  }
  
  if(yaw < 0) {yaw += 360;}
  if(yaw >= 360) {yaw -= 360;}
  
  for(var i = 0; i < w / downscale_factor;i++) {
    var theta = atan((w / (2.0 * downscale_factor) - i) / d) + yaw;
    
    if(theta < 0) {theta += 360;}
    if(theta >= 360) {theta -= 360;}
    
    var tStepX = theta < 90 || theta > 270 ? 1 : -1;
    var tStepY = theta < 180 ? 1 : -1;
    var tann = tan(theta);
    var ytann = 1.0 / tann;
    
    if(theta == 0.0 || theta == 180.0) {
      ytann = 10000;
      tann = 0.0;
    }
    if(theta == 90.0 || theta == 270.0) {
      ytann = 0.0;
      tann = 10000;
    }
    var xTraceY = pY + (tStepY + 1) * 0.5;
    var xTraceX = -pdY * ytann + pX + pdX;
    if(theta < 180) {
      xTraceX += ytann;
    }
    while(!isWallSolid(xTraceX,xTraceY)) {
      xTraceY += tStepY;
      xTraceX += abs(ytann) * tStepX;
    }
    var yTraceX = pX + (tStepX + 1) * 0.5;
    var yTraceY = -pdX * tann + pY + pdY;
    if(theta < 90 || theta > 270) {
      yTraceY += tann;
    }
    while(!isWallSolid(yTraceX,yTraceY)) {
      yTraceX += tStepX;
      yTraceY += abs(tann) * tStepY;
    }
    var xy = (yTraceX - pX - pdX) * betaX + (yTraceY - pY - pdY) * betaY < (xTraceX - pX - pdX) * betaX + (xTraceY - pY - pdY) * betaY;
    
    if(tann == 0.0) {
      xy = true;
    }
    if(ytann == 0.0) {
      xy = false;
    }
    
    var hitX = xy ? yTraceX : xTraceX;
    var hitY = xy ? yTraceY : xTraceY;
    
    var dist = (hitX - pX - pdX) * betaX + (hitY - pY - pdY) * betaY;
    var wallheight = min(h * 0.5 * (w / h) / dist,h);
    var rest = h - wallheight;
    fill("red");
    rect(i * downscale_factor,0,downscale_factor,rest/2);
    fill("white");
    
    if(isWallWin(hitX,hitY)) {
      fill("gold");
    }
    if(isWallBorder(hitX,hitY)) {
      fill("black");
    }
    
    rect(i * downscale_factor,rest/2,downscale_factor,wallheight);
    fill("blue");
    rect(i * downscale_factor,rest/2+wallheight+1,downscale_factor,rest/2);
  }
}




// -----
    try { window.draw = draw; } catch (e) {}
    switch (stage) {
      case 'preload':
        if (preload !== window.preload) { preload(); }
        break;
      case 'setup':
        if (setup !== window.setup) { setup(); }
        break;
    }
  }
  window.wrappedExportedCode = wrappedExportedCode;
  wrappedExportedCode('preload');
};

window.setup = function () {
  window.wrappedExportedCode('setup');
};
