/*
//наші посилання на елемнти DOM
blockCount = document.querySelector("#count");
btn2 = document.querySelector("#btn2");
audioGun = document.querySelector("#audioGun");
btn3 = document.querySelector("#btn3");
let countClick = 0;

//звертаємся до властивості кнопки onClick. Те саме, що і addEventListener("click", callback)
// при кліці створюємо посиланння на параграф, робимо його background червоним, а колір white
btn2.onclick = function () {
  p2 = document.querySelector("#p2");
  p2.style.background = "red";
  p2.style.color = "white";
  console.dir(p2);
};

// ф-ія для кліку створена методом onClick
function btnClick() {
  countClick += 1;
  blockCount.innerText = countClick;
  console.dir(countClick);
}

console.dir(btn3);

btn3.onclick = function () {
  audioGun.play();
};
*/
let speed = 10;
let scores = 0;
const duck = document.querySelector(".duck");
const gameArea = document.querySelector(".game-area");
const scoresBlock = document.querySelector(".scores");
const body = document.querySelector("body");
const audioGun = document.querySelector("#audioGun");
const muteBtn = document.querySelector("#mute_btn");
let level = 1;
let dead = 0;
let free = 0;

let bullet = 5;

// передаємо випадкове число для стартової позиції качки
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

// створення розмітки для нової качки
function createDuck() {
  let duck = document.createElement("div");
  let type = getRandomInt(0, 2);

  if (type === 0) type = "black";
  else type = "red";

  duck.className = "duck " + type + "-duck-left";
  duck.style.top = "100%";
  duck.style.left = getRandomInt(0, 100) + "%";

  let timerID = moveDuck(duck, type);
  duck.dataset.timer = timerID;

  gameArea.appendChild(duck);
}

function start() {
  bullet = level * 3;
  speed = level * 1.2;
  let i = 0;
  while (i < bullet) {
    createDuck();
    createBullet();

    i += 1;
  }
}

function createBullet() {
  const bulletBlock = document.querySelector(".bullets-container");
  let bullet = document.createElement("div");
  bullet.className = "bullet";
  bulletBlock.appendChild(bullet);
}

start();

gameArea.onclick = function (e) {
  if (bullet > 0) {
    audioGun.play();
    bullet -= 1;

    let oneBulletBlock = document.querySelector(".bullets-container div");
    oneBulletBlock.remove();
    if (
      e.target.classList.contains("duck") &&
      !e.target.classList.contains("shot")
    ) {
      scores += 100;
      scoresBlock.innerText = scores;
      shotDuck(e.target);

      clearInterval(e.target.dataset.timer);
    }
  } else {
    nextStep();
  }
};

function shotDuck(duck) {
  let type = "black";

  if (duck.classList.contains("red-duck-left")) {
    type = "red";
  }

  duck.classList.add("shot");
  duck.style.backgroundImage =
    "url(assets/images/duck/" + type + "/shot/0.png)";

  setTimeout(function () {
    deadDuck(duck, type);
  }, 200);
}

function deadDuck(duck, type) {
  dead += 1;
  let imageDuck = 0;

  let timerId = setInterval(function () {
    imageDuck += 1;

    if (imageDuck > 2) {
      imageDuck = 0;
    }

    duck.style.backgroundImage =
      "url(assets/images/duck/" + type + "/dead/" + imageDuck + ".png)";
    duck.style.top = duck.offsetTop + speed + "px";

    if (duck.offsetTop >= document.body.clientHeight) {
      console.dir(document.body.clientHeight);
      clearInterval(timerId);
      duck.remove();
    }
  }, 20);
}

// для обраної качки змінюємо раз на 200 мс зображення і зміщуємо по екрану вліво
// якщо вилетіла за екран очищуємо інтервал і прибираємо зображення качки
function moveDuck(duck, type) {
  let imageDuck = 0;
  let direction = directionStart(duck);
  let move = true;

  const timerId = setInterval(function () {
    imageDuck += 1;

    if (imageDuck > 2) {
      imageDuck = 0;
    }
    if (move === false) {
      // todo: create function change direction
      // move = true
      direction = switchDirection(direction);
      move = true;
    }

    switch (direction) {
      case "left":
        move = moveLeft(duck, type, imageDuck);
        break;

      case "right":
        move = moveRight(duck, type, imageDuck);
        break;

      case "top-left":
        move = moveTopLeft(duck, type, imageDuck);
        break;

      case "top-right":
        move = moveTopRight(duck, type, imageDuck);
        break;

      case "down-left":
        move = moveDownLeft(duck, type, imageDuck);
        break;

      case "down-right":
        move = moveDownRight(duck, type, imageDuck);
        break;

      default:
        move = moveTopLeft(duck, type, imageDuck);
        break;
    }

    // повинна повертати чи top-left чи top-right

    // ****** власноруч написана перевірка, виклик власної ф-ії та зміна чи зупинка руху качки  *****
    // if (
    //   duck.offsetLeft < -150 ||
    //   duck.offsetTop < 0 ||
    //   duck.offsetLeft >= body.clientWidth ||
    //   duck.offsetTop >= body.clientHeight
    // ) {
    // clearInterval(timerId);
    // direction = switchDirection(duck);
    // }
  }, 100);
  return timerId;
}

function directionStart(duck) {
  let direction = "top-left";

  if (duck.offsetLeft <= body.clientWidth / 2) {
    direction = "top-right";
  }

  return direction;
}

// 1. повертати випадковий напрям руху
//  2. якщо напрям руху співпав з попереднім рухом треба повторити ф-ію

function switchDirection(before) {
  let random = getRandomInt(0, 6);

  switch (random) {
    case 0:
      direction = "left";
      break;

    case 1:
      direction = "right";
      break;

    case 2:
      direction = "top-left";
      break;

    case 3:
      direction = "top-right";
      break;

    case 4:
      direction = "down-left";
      break;

    case 5:
      direction = "down-right";
      break;

    default:
      direction = "top-left";
      break;
  }

  if (direction == before) {
    switchDirection(before);
  } else return direction;
}

// 1. ф-ія змінює картинку
// 2. ф-ія змінює координати
// 3. прописати перевірку виходу за межі
function moveLeft(duck, type, imageDuck) {
  duck.style.backgroundImage =
    "url(assets/images/duck/" + type + "/left/" + imageDuck + ".png)";
  duck.style.left = duck.offsetLeft - speed + "px";

  if (duck.offsetLeft <= 10) return false;

  return true;
}

function moveRight(duck, type, imageDuck) {
  duck.style.backgroundImage =
    "url(assets/images/duck/" + type + "/right/" + imageDuck + ".png)";
  duck.style.left = duck.offsetLeft + speed + "px";

  if (duck.offsetLeft + duck.clientWidth >= body.clientWidth - 10) return false;

  return true;
}

function moveTopLeft(duck, type, imageDuck) {
  duck.style.backgroundImage =
    "url(assets/images/duck/" + type + "/top-left/" + imageDuck + ".png)";
  duck.style.left = duck.offsetLeft - speed + "px";
  duck.style.top = duck.offsetTop - speed + "px";

  if (duck.offsetLeft <= 10 || duck.offsetTop <= 10) return false;

  return true;
}

function moveTopRight(duck, type, imageDuck) {
  duck.style.backgroundImage =
    "url(assets/images/duck/" + type + "/top-right/" + imageDuck + ".png)";
  duck.style.left = duck.offsetLeft + speed + "px";
  duck.style.top = duck.offsetTop - speed + "px";

  if (
    duck.offsetLeft + duck.clientWidth >= body.clientWidth - 10 ||
    duck.offsetTop <= 10
  )
    return false;

  return true;
}

function moveDownLeft(duck, type, imageDuck) {
  duck.style.backgroundImage =
    "url(assets/images/duck/" + type + "/top-left/" + imageDuck + ".png)";
  duck.style.left = duck.offsetLeft - speed + "px";
  duck.style.top = duck.offsetTop + speed + "px";

  if (duck.offsetLeft <= 10 || duck.offsetLeft >= gameArea.clientHeight - 10)
    return false;

  return true;
}

function moveDownRight(duck, type, imageDuck) {
  duck.style.backgroundImage =
    "url(assets/images/duck/" + type + "/top-right/" + imageDuck + ".png)";
  duck.style.left = duck.offsetLeft + speed + "px";
  duck.style.top = duck.offsetTop + speed + "px";

  if (
    duck.offsetLeft + duck.clientWidth >= body.clientWidth - 10 ||
    duck.offsetLeft >= gameArea.clientHeight - 10
  )
    return false;

  return true;
}

function moveTop(duck, type, imageDuck) {
  duck.style.backgroundImage =
    "url(assets/images/duck/" + type + "/top-right/" + imageDuck + ".png)";
  duck.style.top = duck.offsetTop - speed + "px";

  if (duck.offsetTop + duck.clientHeight <= 0) return false;

  return true;
}

let next = false;

function nextStep() {
  if (!next) {
    next = true;
    const ducks = document.querySelectorAll(".duck");
    const deadDucks = document.querySelectorAll(".duck.shot");
    if (ducks.length > 0) {
      let i = 0;
      free = ducks.length - deadDucks.length;
      if (free < 0) free = free * -1;

      while (i < ducks.length) {
        let duck = ducks[i];

        let type = "black";
        if (duck.classList.contains("red-duck-left")) {
          type = "red";
        }

        let move = true;
        clearInterval(duck.dataset.timer);
        let imageDuck = 0;

        let timerID = setInterval(function () {
          move = moveTop(duck, type, imageDuck);
          if (imageDuck >= 2) {
            imageDuck = 0;
          }
          imageDuck += 1;

          if (move == false) {
            clearInterval(timerID);
            duck.remove();
          }
        }, 30);

        i += 1;
      } // цикл
    } //якщо є качки
    diedIconDuck();
    freeIconDuck();
    setTimeout(function () {
      next = false;
      nextLevel();
    }, 4000);
  } //next === false
}

function nextLevel() {
  level += 1;
  start();
}

function diedIconDuck() {
  let i = 0;

  let diedBlock = document.querySelector(".died-ducks-cnt-container");
  diedBlock.innerText = "";
  while (i < dead) {
    let div = document.createElement("div"); //.died-duck-icon
    div.className = "died-duck-icon";

    diedBlock.appendChild(div);

    i += 1;
  }
}

function freeIconDuck() {
  let i = 0;

  let freeBlock = document.querySelector(".left-ducks-cnt-container");
  freeBlock.innerText = "";
  while (i < free) {
    let div = document.createElement("div"); //.left-ducks-cnt-container left-duck-icon
    div.className = "left-duck-icon";

    freeBlock.appendChild(div);

    i += 1;
  }
}

// 1. Коли кулі закінчилсь, всі качки повинні вилетіти за межі екрану
// 2. Рахувати к - сть врятованих качок
// 3. Рахувати к-сть збитих качок

// createDuck(getRandomInt(0, 100) + "%", "red");
// createDuck(getRandomInt(0, 100) + "%", "black");
// createDuck(getRandomInt(0, 100) + "%", "red");
// createDuck(getRandomInt(0, 100) + "%", "black");
// createDuck(getRandomInt(0, 100) + "%", "red");
// createDuck(getRandomInt(0, 100) + "%", "red");

// ******** власноруч написана ф-ія до відео-уроку
// function switchDirection(duck) {
//   let num = getRandomInt(1, 7);
//   console.log(num);
//   switch (num) {
//     case 1:
//       if (duck.offsetLeft >= body.clientWidth) return (direction = "left");
//       return (direction = "right");
//       break;

//     case 2:
//       if (duck.offsetLeft < 0) return (direction = "right");
//       return (direction = "left");
//       break;

//     case 3:
//       if (duck.offsetLeft < 0 || duck.offsetTop < 0)
//         return (direction = "down-right");
//       return (direction = "top-left");
//       break;

//     case 4:
//       if (duck.offsetLeft >= body.clientWidth || duck.offsetTop < 0)
//         return (direction = "down-left");
//       return (direction = "top-right");
//       break;

//     case 5:
//       if (duck.offsetLeft < 0 || duck.offsetLeft >= body.clientHeight)
//         return (direction = "top-right");
//       return (direction = "down-left");
//       break;

//     case 6:
//       if (
//         duck.offsetLeft >= body.clientWidth ||
//         duck.offsetLeft >= body.clientHeight
//       )
//         return (direction = "top-left");
//       return (direction = "down-right");
//       break;
//   }
// }

// ************ Роблю кнопочку mute ************

document.addEventListener("keydown", muteHandler);
muteBtn.addEventListener("click", muteHandler);
let muteCounter = 0;

function muteHandler(event) {
  if (event.code === "KeyM" || event.target === muteBtn) {
    muteCounter += 1;
    muteCounter % 2 === 0 ? (audioGun.volume = 0.8) : (audioGun.volume = 0);
  }
}

// 1. Виводити рівні в waves-info
// 2. Якщо після хвилі врятованих качок більше ніж вбитих, виводити you lose  в  message-bar
// 3. додати звук на політ качки
//  4.Зробити початкову анімацію собаки
// 5. Зробити паузу
// 6. Зробити mute - done
// 7. Зробити fullscreen
