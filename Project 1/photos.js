var intervalID = [];
var isAnimating = false

function resumeAction(event) {
    if (!isAnimating) {
        var images = getImages()
        for (i = 0; i < images.length; i++) {
            var img = images[i]
            var interval = setInterval(func, 7, img);
            intervalID.push(interval)
            images.forEach(image => {
                if (img.id != image.id) {
                    var inter = setInterval(check2, 7, img, image)
                    intervalID.push(inter)
                }
            });
        }
        isAnimating = true
    } else {
        isAnimating = false
        intervalID.forEach(id => {
            clearInterval(id)
        });
    }
}

function func(img) {
    var sign = 1;
    var court = document.getElementById("court")
    var result = getImageCoordinates(img)
    var borderWidth = court.offsetWidth - court.clientWidth
    img.style.left = result.x + parseFloat(img.getAttribute("vx")) + "px"
    img.style.top = result.y + parseFloat(img.getAttribute("vy")) + "px"
    if (img.offsetLeft <= court.offsetLeft + borderWidth || img.offsetLeft + img.offsetWidth >= court.offsetLeft - borderWidth + court.offsetWidth) {
        var vx = parseFloat(img.getAttribute("vx"))
        sign = -1
        img.setAttribute("vx", sign*vx)
    } else if (img.offsetTop + img.offsetHeight >= court.offsetTop + court.offsetHeight - borderWidth || img.offsetTop <= court.offsetTop + borderWidth) {
        console.log("in Y: ",img)
        var vy = parseFloat(img.getAttribute("vy"))
        sign = -1
        img.setAttribute("vy", sign*vy)
    }
}

// function check(img, image) {
//     var result = getImageCoordinates(img)
//     var imgCoor = getImageCoordinates(image)
//     // When frames of the images intersect, we exchange their speeds (vx and vy)
//     if (((result.x + result.w) == imgCoor.x) && ((result.y >= imgCoor.y && (result.y <= imgCoor.y + imgCoor.h)) || ((result.y + result.h) >= imgCoor.y && result.y + result.h <= imgCoor.y + imgCoor.h))) {
//         var old_vx = img.getAttribute("vx")
//         var new_vx = image.getAttribute("vx")
//         var old_vy = img.getAttribute("vy")
//         var new_vy = image.getAttribute("vy")
//         image.setAttribute("vy", parseFloat(old_vy))
//         img.setAttribute("vy", parseFloat(new_vy))
//         image.setAttribute("vx", parseFloat(old_vx))
//         img.setAttribute("vx", parseFloat(new_vx))
//     }
//     if (((result.y + result.h) == imgCoor.y) && ((result.x >= imgCoor.x && (result.x <= imgCoor.x + imgCoor.w)) || ((result.x + result.w) >= imgCoor.x && result.x + result.w <= imgCoor.x + imgCoor.w))) {
//         var old_vx = img.getAttribute("vx")
//         var new_vx = image.getAttribute("vx")
//         var old_vy = img.getAttribute("vy")
//         var new_vy = image.getAttribute("vy")
//         image.setAttribute("vy", parseFloat(old_vy))
//         img.setAttribute("vy", parseFloat(new_vy))
//         image.setAttribute("vx", parseFloat(old_vx))
//         img.setAttribute("vx", parseFloat(new_vx))
//     }
// }

function areColliding(a, b) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();
    return !(
        ((aRect.top + aRect.height) < (bRect.top)) ||
        (aRect.top > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) < bRect.left) ||
        (aRect.left > (bRect.left + bRect.width))
    );
}

function check2(a, b){
    if(areColliding(a, b)){
        var old_vx = a.getAttribute("vx")
        var new_vx = b.getAttribute("vx")
        var old_vy = a.getAttribute("vy")
        var new_vy = b.getAttribute("vy")
        b.setAttribute("vx", parseFloat(old_vx))
        b.setAttribute("vy", parseFloat(old_vy))
        a.setAttribute("vx", parseFloat(new_vx))
        a.setAttribute("vy", parseFloat(new_vy))
    }
}

function generateRandomNumber(min, max) {
    var randomNumber = Math.random() * (max - min) + min;
    return parseFloat(randomNumber.toFixed(0))
};

function getImageCoordinates(image) {
    return { x: image.offsetLeft, y: image.offsetTop, h: image.offsetHeight, w: image.offsetWidth };
}

function getCourtBoundaries() {
    var court = document.getElementById("court")
    var borderWidth = court.offsetWidth - court.clientWidth
    var x1 = court.offsetLeft
    var y1 = court.offsetTop
    var x2 = x1
    var y2 = court.getBoundingClientRect().bottom
    var x3 = x1 + court.offsetWidth
    var y3 = y1
    var x4 = x3
    var y4 = y2
    return [x1, y1, x2, y2, x3, y3, x4, y4, borderWidth]
}

function getImages() {
    var images = document.getElementsByTagName('img');
    var srcList = [];
    for (i = 0; i < images.length; i++) {
        images[i].id = i
        srcList.push(images[i]);
    }
    return srcList;
}

function setRandomVelocities(images) {
    for (i = 0; i < images.length; i++) {
        var vx = generateRandomNumber(1.0, 2.0)
        var vy = generateRandomNumber(1.0, 2.0)
        images[i].setAttribute("vx", vx)
        images[i].setAttribute("vy", vy)
    }
}

function initialize() {
    var bound = getCourtBoundaries()
    var images = getImages()
    for (image = 0; image < images.length; image++) {
        var img = images[image]
        var rand_x = generateRandomNumber(bound[2], bound[6] - img.width)
        var rand_y = generateRandomNumber(bound[1], bound[3] - img.height)
        img.style.left = rand_x + "px"
        img.style.top = rand_y + "px"
    }
    setRandomVelocities(images)
}