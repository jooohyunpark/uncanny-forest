$(document).ready(() => $('.container').delay(2000).fadeOut(2000));
$(document).ready(() => $('.board').delay(3000).fadeOut(1000));
$('#button').click(() => $('.info').fadeOut(1200));
$('#button').click(() => $('.info-wrapper').fadeOut(1200));


let cam = document.querySelector('.camera');
let scene = document.querySelector('a-scene');
let object = scene.querySelectorAll('.object');
let light = scene.querySelector('#light');
let volume = 0;
let trigger = false

$('#button').click(() => {
    for (let i = 0; i < object.length; i++) {
        object[i].components.sound.playSound();
    }
    trigger = true;
})


function draw() {
    wall(cam, 90);

    if (trigger) {
        if (volume < 2) {
            volume += 0.01;
            for (let i = 0; i < object.length; i++) {
                object[i].setAttribute('sound', 'volume', volume);
            }
        } else {
            trigger = false;
        }
    }
    requestAnimationFrame(draw)
}

draw()


for (let i = 0; i < object.length; i++) {

    object[i].setAttribute('position', {
        x: 90 - Math.random() * 180,
        y: 2,
        z: 90 - Math.random() * 180
    });
    object[i].setAttribute('material', 'color', getRandomColor());
    object[i].setAttribute('sound', 'volume', '0');
}



lightSystem(4, 0, 360, 0);
lightSystem(4, 0, -360, 0);


function lightSystem(num, xVal, yVal, zVal) {

    for (let i = 0; i < num; i++) {

        let entityWrapper = document.createElement('a-entity');
        let entity = document.createElement('a-entity');

        entityWrapper.setAttribute('animation', {
            property: "rotation",
            dur: 20000,
            easing: "linear",
            loop: true,
            to: {
                x: xVal,
                y: yVal,
                z: zVal
            }
        });

        entity.setAttribute('position', {
            x: 70 - Math.random() * 140,
            y: 5, // 5 + Math.random() * 10
            z: 70 - Math.random() * 140
        });
        entity.setAttribute('mixin', "light");
        entity.setAttribute('light', {
            color: getRandomColor(),
            distance: 80, //120
            intensity: 1, //0.2
            type: "point"
        });

        entityWrapper.appendChild(entity);
        scene.appendChild(entityWrapper);
    }

}


function wall(target, threshold) {
    if (target.getAttribute('position').x > threshold) {
        target.setAttribute('position', {
            x: threshold,
            y: 2,
            z: target.getAttribute('position').z
        });
    }
    if (target.getAttribute('position').x < -1 * threshold) {
        target.setAttribute('position', {
            x: -1 * threshold,
            y: 2,
            z: target.getAttribute('position').z
        });
    }
    if (target.getAttribute('position').z > threshold) {
        target.setAttribute('position', {
            x: target.getAttribute('position').x,
            y: 2,
            z: threshold
        });
    }
    if (target.getAttribute('position').z < -1 * threshold) {
        target.setAttribute('position', {
            x: target.getAttribute('position').x,
            y: 2,
            z: -1 * threshold
        });
    }

}



function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
