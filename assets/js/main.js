

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
            TweenLite.to('.assembly', 0.1, {
                rotationY:'-=30',
                transformOriginZ: '500px'
            })
        break;

        case 38: // up
            TweenLite.to('.rotational-assembly', 0.1, {
                z: '+=50',
                transformOrigin: '50% 0%'
            })
        break;
        case 39: // right
            TweenLite.to('.assembly', 0.1, {
                rotationY:'+=30', 
                transformOriginZ: '500px'
            })
        break;

        case 40:// down
            TweenLite.to('.rotational-assembly', 0.1, {
                z: '-=50',
                transformOrigin: '50% 0%'
            })
        break;
            
        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

$('.picture').on('click', function() {
    console.log("picture clicked!");
});