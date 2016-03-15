var $door = document.querySelector('.door');
var $rotAssembly = document.querySelector('.rotational-assembly');
var $assembly = document.querySelector('.assembly');
var $intro = document.querySelector('.intro');
var $introBackground = document.querySelector('.intro--background');
var posZ;
var rotationNumber = 0;
var cameraRotationX = 0;
var cameraRotationZ = 0;
var rotationNumberReset = function() {
    if (rotationNumber <= -360) {
        rotationNumber = 0;
    } else if (rotationNumber >= 360) {
        rotationNumber = 0;
    }
}

/* Getting Z Coordinate */

var getZPosition = function() {
    var results = $($rotAssembly).css('transform').match(/matrix(?:(3d)\(-{0,1}\d+\.?\d*(?:, -{0,1}\d+\.?\d*)*(?:, (-{0,1}\d+\.?\d*))(?:, (-{0,1}\d+\.?\d*))(?:, (-{0,1}\d+\.?\d*)), -{0,1}\d+\.?\d*\)|\(-{0,1}\d+\.?\d*(?:, -{0,1}\d+\.?\d*)*(?:, (-{0,1}\d+\.?\d*))(?:, (-{0,1}\d+\.?\d*))\))/)

    if(!results) return [0, 0, 0];
    if(results[1] == '3d') return results.slice(4,5);

    results.push(0);
    return results.slice(7, 8);
};

var zChecker = function() {
    getZPosition();
    posZ = getZPosition()[0];
    console.log(posZ);
};

/* Movement Controllers */

var moveForward = function() {
    
    if ( posZ >= 2850 && (!$($door).hasClass('clicked')) ) {
        
        return false;
    } else {
        
        TweenLite.to($rotAssembly, 0.1, {
            z: '+=50',
            transformOrigin: '50% 0%'
        });
    }    
};

var rotateLeft = function () {
    
    TweenLite.to('.assembly', 0.1, {
        rotationY:'-=30',
        transformOriginZ: '500px'
    });
};

var rotateRight = function() {
    
    TweenLite.to('.assembly', 0.1, {
        rotationY:'+=30', 
        transformOriginZ: '500px'
    });
};

var moveBack = function() {
    
    if ( posZ >= 4700 && (-270 < rotationNumber < -90) ) {
        
        return false;
    } else if ( posZ <= 0) {
        
        return false;
    } else {
        TweenLite.to('.rotational-assembly', 0.1, {
            z: '-=50',
            transformOrigin: '50% 0%'
        });
    }
};

// functions to call in switch function

var upArrowClicked = function() {
    
    if ($($intro).hasClass('hidden')) {
        setTimeout(zChecker(), 100);
        moveForward();
    } else {
        return false;
    }  
};

var leftArrowClicked = function() {
    
    if ($($intro).hasClass('hidden')) {
        rotateLeft();
        rotationNumber -= 30;
        rotationNumberReset();
        console.log(rotationNumber);
    } else {
        return false;
    }
};

var rightArrowClicked = function() {
    
    if ($($intro).hasClass('hidden')) {
        rotateRight();
        rotationNumber += 30;
        rotationNumberReset();
        console.log(rotationNumber);
    } else {
        return false;
    }
    
}

var backArrowClicked = function() {
    if ($($intro).hasClass('hidden')) {
        setTimeout(zChecker(), 100);
        moveBack();
    } else {
        return false;
    }
}

var wPressed = function() {
    zChecker();
    moveCameraUp();
}


$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
            leftArrowClicked();
        break;
        case 38: // up
            if ( (rotationNumber > -90 && rotationNumber < 90) || rotationNumber < -270 || rotationNumber > 270 ) {
                upArrowClicked();
            } else if ( (rotationNumber < -90 && rotationNumber > -270) || (rotationNumber > 90 && rotationNumber < 270) ) {
                backArrowClicked();
            }
        break;
        case 39: // right
            rightArrowClicked();
        break;

        case 40:// down
            if ( (rotationNumber > -90 && rotationNumber < 90) || rotationNumber < -270 || rotationNumber > 270) {
                backArrowClicked();
            } else if ( (rotationNumber < -90 && rotationNumber > -270) || (rotationNumber > 90 && rotationNumber < 270) ) {
                upArrowClicked();
            }
        break;
        case 87: // W
            upArrowClicked();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

$('.door').on('click', function() {
    $(this).addClass('clicked');
//    $($rotAssembly).append('<div class="light-face big-floor"></div><div class="dark-face big-ceiling"></div><div class="dark-face mini-left-wall"></div><div class="dark-face mini-right-wall"></div><div class="light-face big-far-wall"><div class="lights"><div class="light"></div><div class="light"></div><div class="light"></div></div><h1 class="shadow">YancyShmancy Portfolio</h1><h2 class="shadow">Developer / Designer</h2><div class="projects-container"><div class="top-row"><div class="project-square" id="safe-house"><div class="project-square--front"></div></div><div class="project-square" id="yosemite"><div class="project-square--front"></div></div><div class="project-square" id="advanced-js"><div class="project-square--front"></div></div></div><div class="bottom-row"><div class="project-square" id="game-dev"><div class="project-square--front"></div></div><div class="project-square" id="hot-sauce"><div class="project-square--front"></div></div></div></div></div><div class="light-face big-left-side"></div><div class="light-face big-right-side"></div>')
});

$($introBackground).on('click', function() {
    
    $(this).parent().addClass('hidden');
})
