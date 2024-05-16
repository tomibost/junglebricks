  var x = 250;
  var y = 350;
  var dx = 1;
  var dy = 1;
  var WIDTH = 400;
  var HEIGHT = 500;
  var r = 20;
  var ctx;
  var paddlex;
  var paddleh;
  var paddlew;
  var rightDown = false;
  var leftDown = false;
  var canvasMinX;
  var canvasMaxX;
  var bricks;
  var NROWS;
  var NCOLS;
  var BRICKWIDTH;
  var BRICKHEIGHT;
  var PADDING;
  var tocke;
  var sekunde =0;
  var sekundeI;
  var minuteI;
  var intTimer;
  var izpisTimer;
  var start = true;
  const jungle = document.getElementById("jungle");
  var anc=0;
  score = 3;
  var hit=0;
  
  document.getElementById("play").addEventListener("click", function(){
    win();
    document.getElementById("play").disabled=true;
  });


  /*function win(){
    Swal.fire({
      title: 'JUNGLE',
      text: 'The objective is to destroy all the bricks',
        imageHeight: 140,
        confirmButtonColor: '#0d8c2f',
      }).then((result) => {
        dy=1.5;
        if (result.isConfirmed) {
          intervalId = setInterval(draw, 10);
        }
      });
    
  }*/

  function end(){
    Swal.fire({
      title: "THE JUNGLE GOT YOU!",
            text: "Better luck next time!",
            confirmButtonText: "Retry",
            confirmButtonColor: "#0d8c2f",
          
          }).then((result) => {
            if (result.isConfirmed) {
              dx = 0;
              dy = 0;
              location.reload(); //RESTART THE GAME
            }
          });
  }

function drawIt() {
  
  function init() {
    ctx = $('#canvas')[0].getContext("2d");
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();
    tocke = 0;
    $("#tocke").html(tocke);
    sekunde = 0;
    izpisTimer = "00:00";
    intTimer = setInterval(timer, 1000);
    intAni = setInterval(animation,100);
    return intervalId = setInterval(draw, 10);
  }

  function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
  }
  function animation(){
    anc++;
  }
  init();
  init_paddle();
  init_mouse();
  initbricks();

  function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }
  function init_paddle() {
    paddlex = (WIDTH / 2) - 45;
    paddleh = 10;
    paddlew = 90;
  }
  function onKeyDown(evt) {
    if (evt.keyCode == 39)
      rightDown = true;
    else if (evt.keyCode == 37) leftDown = true;
  }

  function onKeyUp(evt) {
    if (evt.keyCode == 39)
      rightDown = false;
    else if (evt.keyCode == 37) leftDown = false;
  }
  $(document).keydown(onKeyDown);
  $(document).keyup(onKeyUp);

  function init_mouse() {
    canvasMinX = $("canvas").offset().left;
    canvasMaxX = canvasMinX + WIDTH;
  }

  function onMouseMove(evt) {
    if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
      paddlex = evt.pageX - canvasMinX - paddlew / 2;
    }
  }
  $(document).mousemove(onMouseMove);

  function initbricks() { //oepeke cooblestone moos
    NROWS = 3;
    NCOLS = 4;
    BRICKWIDTH = (WIDTH / NCOLS) - 6;
    BRICKHEIGHT = 55;
    PADDING = 5;
    bricks = new Array(NROWS);
    for (i = 0; i < NROWS; i++) {
      bricks[i] = new Array(NCOLS);
      for (j = 0; j < NCOLS; j++) {
        bricks[i][j] = 1;
      }
    }
  }

  function timer() {
    if (start == true) {
      sekunde++;

      sekundeI = ((sekundeI = (sekunde % 60)) > 9) ? sekundeI : "0" + sekundeI;
      minuteI = ((minuteI = Math.floor(sekunde / 60)) > 9) ? minuteI : "0" + minuteI;
      izpisTimer = minuteI + ":" + sekundeI;

      $("#cas").html(izpisTimer);
    }
    else {
      sekunde = 0;
    }
  }


  function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "#10ff08";//farba
    ctx.fill();
  }

  function draw() {
    clear();

    circle(x, y, 10);

    if (x + dx > WIDTH - r || x + dx < r)
      dx = -dx;
    if (y + dy > HEIGHT -10 || y + dy < r)
      dy = -dy;
    x += dx;
    y += dy;

    
    //premik ploščice levo in desno
    if (rightDown) paddlex += 5;
    else if (leftDown) paddlex -= 5;
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
    if (x + dx > WIDTH - r || x + dx < 0 + r)
      dx = -dx;
    if (y + dy < 0 + r)
      dy = -dy;
    else if (y + dy > HEIGHT - 10) {
      if (x > paddlex && x < paddlex + paddlew) {
        dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
        dy = -dy;
      }
      else if (y + dy > HEIGHT - 10) {
        start = false;
        if (x > paddlex && x < paddlex + paddlew) {
          dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
          dy = -dy;
        }
        else if (y + dy > HEIGHT - 10)
          clearInterval(intervalId);
          start = false;
      }

    }
    x += dx;
    y += dy;

    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

    //riši opeke
    for (i = 0; i < NROWS; i++) {
      for (j = 0; j < NCOLS; j++) {
        if (bricks[i][j] == 1) {
          ctx.drawImage(jungle,j * (BRICKWIDTH + PADDING) + PADDING,i * (BRICKHEIGHT + PADDING) + PADDING,BRICKWIDTH, BRICKHEIGHT);//slika
        }
      }
    }


    rowheight = BRICKHEIGHT + PADDING;
    colwidth = BRICKWIDTH + PADDING;
    row = Math.floor(y / rowheight);
    col = Math.floor(x / colwidth);
    if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
      dy = -dy; bricks[row][col] = 0;
      tocke += 10; 
      $("#tocke").html(tocke);
      hit++;
      if(hit==20){
        dx=0;
        dy=0;
        win();
      }
    }
    if (x + dx > WIDTH - r || x + dx < r)
      dx = -dx;
    if (y + dy < 0 + r)
      dy = -dy;
    else if (y + dy > HEIGHT - 12) {
      if (x > paddlex && x < paddlex + paddlew) {
        dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
        dy = -dy;
      }
      else if (y + dy > HEIGHT - 12) {
        start = false;
        if (x > paddlex && x < paddlex + paddlew) {
          dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
          dy = -dy;
          start = true;
        }
        else if (y + dy > HEIGHT - 12)
          score--;
          if(score==0){
            end();
            clearInterval(intervalId);
          }
          else{
            end();
            init_paddle();
            x = 250;
            y = 350;
            dx=0;
            dy=0;
            paddlex = (WIDTH / 2) - 45;
            
          }
          
      }
    }
  }
}

