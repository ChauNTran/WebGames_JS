export function loadGame(){
   const game = new FlappyBird();
   game.init();
}

const GAME_STATE = {
   start: 'start',
   intro : 'intro',
   inGame : 'inGame',
   endGame : 'endGame'
}

function getRandomIntFromRange(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkOverlap(div1, div2) {
   // Get the bounding rectangle of each div
   const rect1 = div1.getBoundingClientRect();
   const rect2 = div2.getBoundingClientRect();
 
   // Check for overlap
   if (
     rect1.left < rect2.right &&
     rect1.right > rect2.left &&
     rect1.top < rect2.bottom &&
     rect1.bottom > rect2.top
   ) {
     // Elements overlap
     return true;
   } else {
     // Elements do not overlap
     return false;
   }
 }
class FlappyBird
{
   constructor()
   {
      this.score = 0;
 
      this.playerSize = 60;
      this.columnMargin = 50;
      this.columnWidth = 60;
      this.columnHeight = 400;
      this.columnSpacing = 200;
      this.columnGap = 200;
      this.groundHeight = 20;

      this.ceiling = 0;
      this.oldtimeStamp = 0;
      this.jumpTimelapse = 0;
      this.moveDirectionY = 0;
      this.columnSpeed = 110;
      this.jumpSpeed = 4.6;
      this.gravity = -0.46;

      this.score = 0;

      this.gameState = GAME_STATE.intro;
   }
   init()
   {
      this.loadAssets();
      this.setupUI();
      this.setState(GAME_STATE.intro);
      requestAnimationFrame((timeStamp)=> this.update(timeStamp));
   }

   loadAssets()
   {
      this.container = document.getElementById('gameContainer');
      this.assets = {};

      this.add2D('assets/background.jpg', 'background',this.container.clientWidth, this.container.clientHeight);
      this.add2D('assets/ground.jpg', 'ground', this.container.clientWidth, this.groundHeight);
      this.add2D('assets/orioles.png', 'bird', this.playerSize, this.playerSize);
      this.addAudio('assets/Sounds/collect.wav', 'collect', false);
      this.addAudio('assets/Sounds/jump.wav', 'jump', false);
      this.addAudio('assets/Sounds/land.wav', 'land', false);
      this.addAudio('assets/Sounds/loop.wav', 'loop', true);

      this.createColumns(
         'assets/pipe-top.png',
         'assets/pipe-bottom.png',
         this.columnWidth,
         this.columnHeight,
      )
      this.assets['ground'].style.bottom = 0;
   }

   setupUI()
   {
      this.uiContainer = document.getElementById('uiContainer');
      this.uiElements = {};

      this.uiElements.startScreen = document.getElementById('startScreen');
      this.uiElements.startButton = document.getElementById('startButton');

      this.uiElements.mainScreen = document.getElementById('mainScreen');
      this.uiElements.score = document.getElementById('score');

      this.uiElements.endScreen = document.getElementById('endScreen');
      this.uiElements.finaScore = document.getElementById('finaScore');
      this.uiElements.playAgainButton = document.getElementById('playAgainButton');

      this.uiElements.startButton.addEventListener('click', (e)=> {
         e.stopPropagation()
         this.setState(GAME_STATE.inGame);
         this.jump();
      });

      this.uiElements.playAgainButton.addEventListener('click', (e)=> {
         e.stopPropagation()
         this.setState(GAME_STATE.intro);
      });

      this.uiContainer.addEventListener('click', (e)=> {
         e.stopPropagation()
         this.tapScreen();
      });
   }

   add2D(path, id, width, height)
   {
      let div = document.createElement('div');

      div.style.backgroundImage = `url(${path})`;
      div.style.backgroundSize = 'contain';
      div.style.width = width + 'px';
      div.style.height = height + 'px';
      div.style.position = 'absolute';

      this.assets[id] = div;
      this.container.appendChild(div);
   }

   addAudio(path, id, loop = false)
   {
      let audio = document.createElement('audio');

      audio.src = path;
      audio.id = id;
      audio.loop = loop;

      this.assets[id] = audio;
      this.container.appendChild(audio);
   }

   createColumns(topPath, bottomPath, width, height)
   {
      this.assets.columnGroup = [];
      this.assets.activeColumnGroup = [];
      for(let i = 0; i < 8; i++)
      {
         let offset = (this.container.clientHeight+this.columnGap) / 2;

         let columnDiv = document.createElement('div');
         columnDiv.name = 'column_' + i;
         columnDiv.style.width = width + 'px';
         columnDiv.style.height = this.container.clientHeight + 'px';
         columnDiv.style.position = 'absolute';

         let topDiv = document.createElement('div');
         topDiv.style.backgroundImage = `url(${topPath})`;
         topDiv.style.backgroundSize = '100% 100%';
         topDiv.style.width = width + 'px';
         topDiv.style.height = height + 'px';
         topDiv.style.position = 'absolute';
         topDiv.style.bottom = `${offset}px`;
         columnDiv.top = topDiv;
         columnDiv.appendChild(topDiv);

         let bottomDiv = document.createElement('div');
         bottomDiv.style.backgroundImage = `url(${bottomPath})`;
         bottomDiv.style.backgroundSize = '100% 100%';
         bottomDiv.style.width = width + 'px';
         bottomDiv.style.height = height + 'px';
         bottomDiv.style.position = 'absolute';
         bottomDiv.style.top = `${offset}px`;
         columnDiv.bottom = bottomDiv;
         columnDiv.appendChild(bottomDiv);

         columnDiv.style.display = 'none';

         this.assets.columnGroup.push(columnDiv);
         this.container.appendChild(columnDiv);
      }
   }

   centerBird()
   {
      this.birdPosition =
      {  
         x: (this.container.clientWidth - this.playerSize)/2,
         y: (this.container.clientHeight - this.playerSize)/2
      };
      // place bird at center of game
      this.assets.bird.style.bottom = this.birdPosition.y + 'px';
      this.assets.bird.style.left =  this.birdPosition.x + 'px';
   }
   
   resetGame()
   {
      for(let activeColumn of this.assets.activeColumnGroup)
      {
         activeColumn.style.display = 'none';
         this.assets.columnGroup.push(activeColumn);
      }
      this.assets.activeColumnGroup = [];
      this.score = 0;
      this.jumpTimelapse = 0;
      this.moveDirectionY = 0;
      this.uiContainer.score = this.score.toString();
      this.uiContainer.finalScore = this.score.toString();
   }

   tapScreen(e)
   {
      if(this.gameState !== GAME_STATE.inGame)
         return;
      this.jump();
   }

   spawnColumn()
   {
      let nextColumn = this.assets.columnGroup.shift();
      // select gap pos
      let gapPos = getRandomIntFromRange(-2, 2);
      while(this.oldGapPos === gapPos)
         gapPos = getRandomIntFromRange(-2, 2); // do not repeat

      let columnY = 75 * gapPos; // needs work
      let columnX = this.container.clientWidth;

      nextColumn.position = {x: columnX , y: columnY};
      nextColumn.lastPosition = nextColumn.position;
      nextColumn.style.display = '';
      nextColumn.style.left = nextColumn.position.x + 'px';
      nextColumn.style.top = nextColumn.position.y + 'px';
      this.assets.activeColumnGroup.push(nextColumn);

      this.oldGapPos = gapPos;
   }

   jump()
   {
      this.moveDirectionY = this.jumpSpeed;
      this.jumpTimelapse = 0;
      this.assets.jump.play();
   }

   applyGravity()
   {
      this.jumpTimelapse += this.deltaTime;

      this.moveDirectionY += this.gravity * this.jumpTimelapse;
      this.birdPosition.y += this.moveDirectionY;
      // move the bird
      this.assets.bird.style.bottom = this.birdPosition.y + 'px';
      
      if(this.birdPosition.y <= this.groundHeight)
         this.gameOver();
   }

   updateColumns()
   {
      for(let activeColumn of this.assets.activeColumnGroup)
      {
         activeColumn.position.x -= this.columnSpeed * this.deltaTime;
         activeColumn.style.left = activeColumn.position.x + 'px';

         if(activeColumn.position.x <= this.birdPosition.x + this.playerSize &&
            activeColumn.position.x > this.birdPosition.x - this.playerSize) {
            
            if(this.birdPosition.y >= this.container.clientHeight)
               this.gameOver();

            if(activeColumn.position.x <= this.container.clientWidth/2  &&
               activeColumn.lastPosition.x > this.container.clientWidth/2)
               this.increaseScore();

            if(checkOverlap(this.assets.bird, activeColumn.top) ||
               checkOverlap(this.assets.bird, activeColumn.bottom))
               this.gameOver();
         }


         if(activeColumn.position.x < -this.columnWidth)
            this.hideColumn(activeColumn);


         activeColumn.lastPosition = {...activeColumn.position};
      }
   }

   increaseScore()
   {
      this.score += 1;
      this.assets.collect.play();
      this.uiElements.score.innerHTML = this.score.toString();
   }

   gameOver()
   {
      this.setState(GAME_STATE.endGame);
      this.assets.land.play();
   }

   hideColumn(activeColumn)
   {
      let toRemove = this.assets.activeColumnGroup.findIndex(x=> x.name === activeColumn.name);
      activeColumn.style.display = 'none';
      this.assets.columnGroup.push(activeColumn);
      this.assets.activeColumnGroup.splice(toRemove, 1);
   }

   update(timeStamp)
   {
      this.deltaTime = (timeStamp - this.oldtimeStamp) * 0.001; // ms to s

      switch(this.gameState)
      {
         case GAME_STATE.start:
            break;
         case GAME_STATE.intro:
            break;
         case GAME_STATE.inGame:
            this.applyGravity();
            this.updateColumns();
            break;
         case GAME_STATE.endGame:
            break;
      }
      this.oldtimeStamp = timeStamp;

      requestAnimationFrame((timeStamp) => this.update(timeStamp));
   }

   showFinalScore()
   {
      this.uiElements.finaScore.innerHTML = this.score.toString();
   }
   hideUi(id)
   {
      this.uiElements[id].style.display = 'none';
   }
   showUi(id)
   {
      this.uiElements[id].style.display = '';
   }
   setState(newState)
   {
      this.gameState = newState;

      switch(this.gameState)
      {
         case GAME_STATE.start:
            this.showUi('startScreen');
            this.hideUi('mainScreen');
            this.hideUi('endScreen');
            break;

         case GAME_STATE.intro:
            this.showUi('startScreen');
            this.hideUi('mainScreen');
            this.hideUi('endScreen');
            this.centerBird();
            this.resetGame();
            break;

         case GAME_STATE.inGame:
            this.hideUi('startScreen');
            this.showUi('mainScreen');
            this.hideUi('endScreen');
            this.assets.loop.play();

            this.spawnColumn();
            this.spawnColumnInterval = setInterval(()=> {
               this.spawnColumn();
            }, (this.columnSpacing / this.columnSpeed) * 1000)

            break;
         case GAME_STATE.endGame:
            this.hideUi('startScreen');
            this.hideUi('mainScreen');
            this.showUi('endScreen');
            this.assets.loop.pause();
            this.showFinalScore();
            clearInterval(this.spawnColumnInterval);
            break;
      }
   }
}