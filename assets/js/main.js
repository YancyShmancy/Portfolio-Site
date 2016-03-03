var $door = document.querySelector('.door');
var $rotAssembly = document.querySelector('.rotational-assembly');
var $assembly = document.querySelector('.assembly');
var posZ;
var rotationNumber = 0;
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
    
    TweenLite.to('.rotational-assembly', 0.1, {
        z: '-=50',
        transformOrigin: '50% 0%'
    });
};

var upArrowClicked = function() {
    
    setTimeout(zChecker(), 100);
    moveForward();
};

var leftArrowClicked = function() {
    
    rotateLeft();
    rotationNumber -= 30;
    rotationNumberReset();
    console.log(rotationNumber);
};

var rightArrowClicked = function() {
    
    rotateRight();
    rotationNumber += 30;
    rotationNumberReset();
    console.log(rotationNumber);
}

var backArrowClicked = function() {
    
    moveBack();
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
            backArrowClicked();
        break;
            
        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

$(document).keyup(function(e) {
    switch(e.which) {
        case 38: // up
        break;
    }
});

$('.picture').on('click', function() {
    console.log("picture clicked!");
});

$('.door').on('click', function() {
    $(this).addClass('clicked');
    $('.big-floor').addClass('clicked');
});
