let canvas;
let emoji = [];

function preload() {
    for (let i = 0; i < 12; i++) {
        emoji[i] = loadImage("assets/" + i + ".png");
    }
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5canvas');
    canvas.style('position', 'absolute');
    imageMode(CENTER);
}

function draw() {
    background(235, 234, 230);

    let index = 0;
    for (let i = 0; i < 6; i++) {
        let x = map(i, 0, 5, width * 0.1, width * 0.9);
        let y = height * 0.2 + 100;
        if (i <= 1 || i >= 4) {
            image(emoji[index], x, y, 80, 80);
            index++;
        }
    }
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            let x = map(i, 0, 5, width * 0.1, width * 0.9);
            let y = map(j, 0, 1, height * 0.6, height * 0.7) + 150;
            image(emoji[index], x, y, 80, 80);
            index++;
        }
    }
    for (let i = 4; i < 6; i++) {
        for (let j = 0; j < 2; j++) {
            let x = map(i, 0, 5, width * 0.1, width * 0.9);
            let y = map(j, 0, 1, height * 0.6, height * 0.7) + 150;
            image(emoji[index], x, y, 80, 80);
            index++;
        }
    }
}

function windowResized() {
    canvas = resizeCanvas(windowWidth, windowHeight);
}

window.addEventListener('load', () => {

    let but = document.getElementById('randomButton');
    let category = document.getElementById('category');
    let foodName = document.getElementById('foodName');
    let desc = document.getElementById('desc');
    let foodList = document.getElementById('foodList');
    let send = document.getElementById('send');
    let message = document.getElementById('message');
    let chatList = document.getElementById('chatList');

    but.addEventListener('click', function () {
        socket.emit('makeDish', category.value);
    });

    let socket = io();

    //Listen for confirmation of connection
    socket.on('connect', () => {
        console.log("Connected");
    });

    //Listen for an event named 'finish dish' from the server
    socket.on('finishDish', (data) => {
        console.log(data);

        foodList.innerHTML += `
            <div class="foodItem">
                <h2 class="foodName">${data.name}</h2>
                <p class="desc">${data.description}</p>
            </div>
        `

        foodList.scrollTo({
            top: foodList.scrollHeight,
            behavior: 'smooth'
        });
    });

    //Listen for an event named 'finish dish' from the server
    socket.on('message', (data) => {
        console.log(data);

        chatList.innerHTML += `
            <div class="messageItemReverse">
                <p class="userName">Other User: </p>
                <p class="content">${data}</p>
            </div>
        `

        chatList.scrollTo({
            top: chatList.scrollHeight,
            behavior: 'smooth'
        });
    });

    send.addEventListener("click", () => {
        if (message.value) {
            socket.emit('message', message.value);
            chatList.innerHTML += `
                <div class="messageItem">
                    <p class="content">${message.value}</p>
                    <p class="userName"> : Me</p>
                </div>
            `
            chatList.scrollTo({
                top: chatList.scrollHeight,
                behavior: 'smooth'
            });
            message.value = ""
        }
    })
});
