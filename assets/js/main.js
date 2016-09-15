jQuery(document).ready(function($) {  

// site preloader -- also uncomment the div in the header and the css style for #preloader
//    $(window).load(function(){
//        $('#preloader').delay(3000).fadeOut('slow',function(){$(this).remove();});
//    });
});

var api_url = "https://lit-headland-35601.herokuapp.com";
var url;


var createItemInDOM = function(item) {
    console.log(item);
    var number;
    var wall;
    var posx;
    var posy;
    var $newItem = $("<div>");
    $newItem.addClass("message");
    $newItem.append("<p>"+item.message+"</p>");
    $newItem.css({
        "width": "300px",
        "height": "auto",
        "position": "absolute"
    });
    $newItem.children().css({
        "width": "100%"
    });
    
    var divHeight = $newItem.height();
    var divWidth = 300;

    var randomNumber = function() {
        min = Math.ceil(0);
        max = Math.floor(3);
        number = Math.floor(Math.random() * (max - min + 1)) + min;
        getWall(number);
    }

    var getWall = function(randomNumber) {
        
        console.log(number);
        if (randomNumber <= 1) {

            wall = "left";
            console.log(wall);
        } else if ( randomNumber > 1 && randomNumber <= 2 ) {

            wall = "front";
            console.log(wall);
        } else if ( randomNumber > 2 ) {

            wall = "right";
            console.log(wall);
        }
    }
    
    var placeMessage = function() {
        randomNumber();
        var messageRotation = Math.floor(Math.random() * 61) - 60;
        
        if (wall == "left") {
            posx = (Math.random() * ($('.big-left-side').width() - divWidth)).toFixed();
            posy = (Math.random() * ($('.big-left-side').height() - divHeight)).toFixed();
            console.log(posx, posy);
            
            $newItem.css({
                top: posy + "px",
                left: posx + "px",
                transform: "rotate("+messageRotation+"deg)"
            }).appendTo($('.big-left-side')).fadeIn(100);

        } else if (wall == "right") {
            posx = (Math.random() * ($('.big-right-side').width() - divWidth)).toFixed();
            posy = (Math.random() * ($('.big-right-side').height() - divHeight)).toFixed();
            console.log(posx, posy);
            
            $newItem.css({
                top: posy + "px",
                left: posx + "px",
                transform: "rotate("+messageRotation+"deg)"
            }).appendTo($('.big-right-side')).fadeIn(100);
        } else if (wall == "front") {
            posx = (Math.random() * ($('.big-far-wall').width() - divWidth)).toFixed();
            posy = (Math.random() * ($('.big-far-wall').height() - divHeight)).toFixed();
            
            console.log(posx, posy);
            $newItem.css({
                top: posy + "px",
                left: posx + "px",
                transform: "rotate("+messageRotation+"deg)"
            }).appendTo($('.big-far-wall')).fadeIn(100);
        }
    }
    
    placeMessage();
}

$(document).on('click', 'input[type="submit"]', function(e) {

    e.preventDefault();
    
    var params = {
        message: $('textarea').val()
    }

    $.ajax(api_url + '/items', {
        method: "post",
        data: params,
        dataType: "json"
    }).done(function(data) {
        
        createItemInDOM(data);
        $('textarea').val("").focus();
    })
});

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
    } else if ( posZ >= 4700 && (-90 < rotationNumber < 90)) {
        
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
    
    if ( posZ <= 0) {
        
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
			if ( !($('input, textarea').is(":focus")) ) {
				if ( (rotationNumber > -90 && rotationNumber < 90) || rotationNumber < -270 || rotationNumber > 270 ) {
					upArrowClicked();
				} else if ( (rotationNumber < -90 && rotationNumber > -270) || (rotationNumber > 90 && rotationNumber < 270) ) {
					backArrowClicked();
				}
			} else {
				return true;
			}
            
        break;
        case 65: // A
			if ( !($('input, textarea').is(":focus")) ) {
				leftArrowClicked();
			} else {
				return true;
			}
            
        break;
        case 83: // S
			if ( !($('input, textarea').is(":focus")) ) {
				if ( (rotationNumber > -90 && rotationNumber < 90) || rotationNumber < -270 || rotationNumber > 270) {
					backArrowClicked();
				} else if ( (rotationNumber < -90 && rotationNumber > -270) || (rotationNumber > 90 && rotationNumber < 270) ) {
					upArrowClicked();
				}
			} else {
				return true;
			}
        break;
        case 68: // D
			if ( !($('input, textarea').is(":focus")) ) {
            	rightArrowClicked();
			} else {
				return true;
			}
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

$('.door').on('click', function() {
    $(this).addClass('clicked');
    $($rotAssembly).append('<div class="light-face big-floor texture"></div><div class="dark-face big-ceiling texture"></div><div class="dark-face mini-left-wall texture"></div><div class="dark-face mini-right-wall texture"></div><div class="light-face big-far-wall texture"><h1 class="contact">Scratch Your Message</h1><form class="contactMe"><fieldset class="form-group"><label for="exampleTextarea">Your Message</label><textarea class="form-control" id="exampleTextarea" rows="3" required="true"></textarea></fieldset><input type="submit" class="btn btn-primary btn-lg"></form></div><div class="light-face big-left-side texture"></div><div class="light-face big-right-side texture"></div>');
    
    
    $.ajax(api_url + "/items", {
        method: "get",
        dataType: "json"
    }).done(function(data) {
        console.log(data);
        $(data).each(function(index, item) {
            createItemInDOM(item);
        });
    });
});

$($introBackground).on('click', function() {
    
    $(this).parent().fadeOut('slow',function(){$(this).addClass('hidden');});
});

//<div class="lights"><div class="light"></div><div class="light"></div><div class="light"></div></div><h1 class="shadow">My Portfolio</h1><h2 class="shadow">Developer / Designer</h2><div class="projects-container"><div class="top-row"><div class="project-square" id="safe-house"><button role="button" class="project-square--front" data-toggle="modal" data-target="#sh-modal"></button></div><div class="project-square" id="yosemite"><button role="button" data-toggle="modal" data-target="#yosemite-modal" class="project-square--front"></button></div><div class="project-square" id="advanced-js"><button role="button" data-toggle="modal" data-target="#adv-js-modal" class="project-square--front"></button></div></div><div class="bottom-row"><div class="project-square" id="game-dev"><button role="button" data-toggle="modal" data-target="#game-dev-modal" class="project-square--front"></button></div><div class="project-square" id="hot-sauce"><button role="button" data-target="#hot-sauce-modal" data-toggle="modal" class="project-square--front"></button></div></div></div>

// <div class="aboutMe-container"><h1>About Me</h1><div class="col-xs-6 col-xs-offset-1"><p>Hey, there. I&#39;m Zoey, an interactive designer and developer. I love experimenting with coding, and I enjoy pushing my limits as a developer. Welcome to my first person 3D experience, created with HTML and CSS transforms. Check out my projects to your right, or send me a message with the form behind you.</p></div><div class="col-xs-5"><img src="./assets/img/IMG_0740.JPG" alt=""></div></div>
