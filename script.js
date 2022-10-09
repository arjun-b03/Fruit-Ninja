"use strict";

const radius = 50;  // Radius of the circle
let x = 0;          // height (/vertical) of the circle within the viewport
let body = document.querySelector('body');
let elements = [];
let hp = 3;
let num = false;
let difficulty = 15;
let points = 0;
const grav = 0.5;
const yspeed = 18;
let pointCounter = document.querySelector('#pointCounter');
let hpCounter = document.querySelector('#hpCounter');
let game = document.querySelector('#gameOver');
let boom = false;
const explosion = document.createElement("div");
game.textContent = '';
let title = document.querySelector('h1');
let start = document.querySelector('h2');
let difficulties = document.querySelectorAll('p');
difficulties[0].style.border = `4px solid black`;
start.addEventListener('click', main);
for (let i = 0; i < 4; i++) {
  difficulties[i].addEventListener('click', setDifficulty);
}
const audio = document.querySelector('audio');
const source = document.querySelector('source');
const muteButton = document.querySelector('#mute');
let mute = false;
muteButton.addEventListener('click', muteMusic);

function muteMusic (event) {
  if (mute == false) {
    audio.pause();
    mute = true;
    muteButton.style.backgroundColor = `lightgreen`;
  } else {
    audio.play();
    mute = false;
    muteButton.style.backgroundColor = `lightgrey`;
  }
}

function main() {
  if (mute == false) {
    audio.pause();
    source.src = 'audio/slice.mp3';
    audio.load();
  }
  body.removeChild(title);
  body.removeChild(start);
  for (let i = 0; i < 4; i++) {
    body.removeChild(difficulties[i]);
  }
  let time = 0;
  requestAnimationFrame(animationLoop);
  while (time < 100000000 && game.classList.contains('selected') == true) {
    time = time += Math.random()*100*difficulty + 100*difficulty;
    setTimeout(() => {createCircle(Math.random()*200);}, time);
  }
}

function setDifficulty (event) {
  for (let i = 0; i < 4; i++) {
    difficulties[i].style.border = `2px solid grey`;
  }
  if (event.currentTarget.textContent == 'EASY') {
    let difficulty = 15;
    event.currentTarget.style.border = `4px solid black`;
  } else if (event.currentTarget.textContent == 'MEDIUM') {
    difficulty = 10;
    event.currentTarget.style.border = `4px solid black`;
  } else if (event.currentTarget.textContent == 'HARD') {
    difficulty = 5;
    event.currentTarget.style.border = `4px solid black`;
  } else if (event.currentTarget.textContent == 'INSANE') {
    difficulty = 2;
    event.currentTarget.style.border = `4px solid black`;
  }
}

// Creates a new element randomly
function createCircle(y) {
  if (game.classList.contains('selected') == true) {
    const circleElement = document.createElement("div");
    circleElement.classList.add('circle');
    const fruit = Math.floor(Math.random() * 12)
    const side = Math.floor(Math.random() * 2);
    let xspeed = Math.floor(Math.random()*(20-3+1)+3);

    if (fruit == 0 || fruit == 1 || fruit == 2 || fruit == 3 || fruit == 4) {
      circleElement.style.backgroundImage = "url('images/kiwi.png')"
      circleElement.addEventListener('mouseover', slice);
    } else if (fruit == 5 || fruit == 6 || fruit == 7) {
      circleElement.style.backgroundImage = "url('images/strawberry.png')";
      circleElement.addEventListener('mouseover', slice);
    } else if (fruit == 8) {
      circleElement.style.backgroundImage = "url('images/watermelon.webp')";
      circleElement.addEventListener('mouseover', slice);
    } else {
      circleElement.style.backgroundImage = "url(images/bomb.png)";
      circleElement.addEventListener('mouseover', slice);
    }

    if (side == 0) {
      circleElement.style.left = `${x}px`;
    } else {
      circleElement.style.right = `${x}px`;
    }
    
    circleElement.style.bottom = `${y-radius}px`;
    body.appendChild(circleElement);
    elements.push({element:circleElement, y:y, x:x, grav:1, xspeed:xspeed, yspeed:yspeed, side:side, fruit:fruit, selection: 0});
  }
}

function animationLoop(currentTime) {
  for (let i = 0; i < elements.length; i++) {
    const circle = elements[i];
    if (circle.fruit < 9 && circle.y<0) {
      body.removeChild(circle.element);
      elements.splice(i, 1);
      if (circle.element.classList.contains('selected') == false) {
        hp--;
        hpCounter.textContent = `Hp: ` + hp;
        if (hp <= 0) {
          hp = 0;
          hpCounter.textContent = `Hp: 0`;
          gameOver();
      }
    }
    } else {
        if (circle.side == 0) {
        circle.x = circle.x + circle.xspeed;
        circle.element.style.left = `${circle.x+radius}px`;
        } else {
          circle.x = circle.x + circle.xspeed;
          circle.element.style.right = `${circle.x-radius}px`;
        }
      circle.y = circle.y + circle.yspeed;
      circle.yspeed = circle.yspeed - grav;
      circle.element.style.bottom = `${circle.y-radius}px`;
    }
  }
  if (game.classList.contains('selected') == true) {
    requestAnimationFrame(animationLoop);
  }
}

// Eliminates an element
function slice (event) {
  if (mute == false) {
    audio.play();
  }
  if (event.currentTarget.style.backgroundImage == 'url("images/bomb.png")' && event.currentTarget.classList.contains('explosion') == false) {
    boom = true;
  } else {
    if (event.currentTarget.style.backgroundImage == 'url("images/kiwi.png")') {
      points = points + 25;
    } else if (event.currentTarget.style.backgroundImage == 'url("images/strawberry.png")') {
      points = points + 50;
    } else if (event.currentTarget.style.backgroundImage == 'url("images/watermelon.webp")') {
      points = points + 100;
    }
  }

  event.currentTarget.classList.add('selected');
  event.currentTarget.style.backgroundImage = "none";
  
  if (boom == true){
    gameOver();
  }
  
  pointCounter.textContent = `Points: ` + points;
}

// Takes one life away
function looseLife (event) {
  if (hp > 0) {
    hp--;
    hpCounter.textContent = `Hp: ` + hp;
  }
  if (hp <= 0) {
    gameOver();
  }
}

// Finished Game
function gameOver (event) {
  body.style.backgroundImage = "url('images/lose.gif')";
  if (mute==false) {
    source.src = 'audio/sad.mp3';
    audio.load();
    audio.play();
    audio.loop = true;
  }
  game.classList.remove('selected');
  if (boom == true) {
    explosion.style.position = 'fixed';
    explosion.style.top = '0%';
    explosion.style.left = '0%';
    explosion.style.width = '100%';
    explosion.style.height = '100%';
    explosion.style.backgroundImage = 'url("images/boom.gif")';
    explosion.style.zIndex = "-1";

    body.appendChild(explosion);
    boom = false
  }
  for (let i = 0; i < elements.length; i++) {
    body.removeChild(elements[i].element);
  }
  const playAgain = document.createElement("div");
  playAgain.classList.add('playAgain');
  playAgain.textContent = 'PLAY AGAIN';
  body.appendChild(playAgain);
  playAgain.addEventListener('click', refreshPage);
  game.textContent = 'GAME OVER';
}

function refreshPage (event) {
  window.location.reload();
}