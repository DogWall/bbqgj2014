
/* global enchant, Class, HEIGHT, WIDTH, SPEED, TRANSITION, PLAYER_LIVES */

//init enchant.js
WIDTH = 800
HEIGHT = 800
SPEED = 800;
TRANSITION = 10;

PLAYER_LIVES = 3;

var FALLING_OBJECTS = [
];

// enchant.ENV.USE_ANIMATION  = false;
enchant.ENV.TOUCH_ENABLED  = false;
enchant.ENV.RETINA_DISPLAY = false;

enchant();

var Marker = Class.create(enchant.Node, { });

////////////////////////////

function Pool () {
  this.pools = [];
}
Pool.prototype.get = function() {
  if ( this.pools.length > 0 ) {
    return this.pools.pop();
  }
  // console.log('pool ran out!');
  return null;
};
Pool.prototype.add = function(v) {
  this.pools.push(v);
};

////////////////////////////



//////////////////  SCENES  /////////////////////

var SceneInfos = Class.create(enchant.Group, {
    initialize: function (game, lives, onLoose) {

      var self = this;

      enchant.Group.call(this);

      this.lives = lives;
      this.onLoose = onLoose;

      this.x = 100;
      this.y = 100;
      this.width = 3 * 70;
      this.height = 70;
      this.game = game;

      this.hearts = [];

      this.coeurgris = this.game.assets['distimg/coeurgris.png'];
      this.coeurrouge = game.assets['distimg/coeurrouge.png'];
      this.coeurrouge.coeurrouge = true;

      for (var i = 0; i < 3; i++) {
        this.hearts[i] = new enchant.Sprite(this.coeurgris.width, this.coeurgris.height);
        this.hearts[i].image = this.coeurrouge;
        this.hearts[i].y = 10;
        this.hearts[i].x = (3-i) * 70;
        this.hearts[i].width = 62;
        this.hearts[i].height = 53;
        this.hearts[i].coeurrouge = true;
        this.addChild(this.hearts[i]);
      }
    },
    lostALife: function () {
      for (var i = 0; i < 3; i++) {
        if (this.hearts[i].image.coeurrouge) {
          this.hearts[i].image = this.coeurgris;
          this.lives--;
          break;
        }
      }
      if (this.lives <= 0) {
        setTimeout(this.onLoose, 20);
      } else {
        setTimeout(function(){
          window.ggj.twist();
        }, 0);
      }
    }
});

var SceneOne = Class.create(enchant.Group, {
  initialize: function (game) {
    var self = this;
    enchant.Group.call(this);

    this.width   = WIDTH;
    this.height  = HEIGHT;

    var backgrounds = [];
    for (var i = 0; i < 3; i++) {
      var asset = game.assets['distimg/BG'+(i+1)+'.jpg'];
      backgrounds[i] = new enchant.Sprite(asset.width, asset.height);
      backgrounds[i].image = asset;
      backgrounds[i].width = WIDTH;
      backgrounds[i].touchEnabled = false;
      backgrounds[i].disableCollection();
      backgrounds[i].opacity = 0;
      this.addChild(backgrounds[i]);
    }

    var currentBG = 0;
    this.tl
      .delay(20)
      .then(function(){
        backgrounds[currentBG].tl.fadeOut(10);
        currentBG = (currentBG + 1) % 3;
        backgrounds[currentBG].tl.fadeIn(10);
      })
      .loop();

  }
});
SceneOne.preload = [
  'distimg/BG1.jpg',
  'distimg/BG2.jpg',
  'distimg/BG3.jpg',
];
for (var i = 0; i < 6; i++) { SceneOne.preload.push('distimg/imm' + (i+1) + '-j-fs8.png'); }


(function () {

var game;

var settings = {
  player: {
    lives: 3,
    sprite: 'distimg/claude.png',
  },
  levels: [
      SceneOne,
  ]
};


// Character
function addCharacter (game, scene, asset) {
  var object = new enchant.Sprite(asset.width, asset.height);
  object.image = asset;
  object.width = 20;
  object.x = WIDTH / 2 - object.width / 2;
  object.y = HEIGHT / 2 - object.height;
  object.touchEnabled = false;
  object.disableCollection();
  scene.addChild(object);
  return object;
}

// Table
function addTable (game, scene, objects) {
  var asset =  game.assets['table'];
  var object = new enchant.Sprite(asset.width, asset.height);
  object.image = asset;
  object.width = 20;
  object.x = WIDTH / 2 - object.width / 2;
  object.y = HEIGHT / 2 - object.height;
  object.touchEnabled = false;
  object.disableCollection();
  scene.addChild(object);
  return object;
}


// Player
var Player = Class.create(enchant.Sprite, {

  initialize: function () {
    this.image_j = game.assets[settings.player.sprite_j];
    this.image_n = game.assets[settings.player.sprite_n];

    enchant.Sprite.call(this, this.image_j.width/5, this.image_j.height);
    this.image = this.image_j;
    this.counter=this.age;
    this.x = WIDTH / 2;
    this.y = HEIGHT / 2 - this.height - 150;
    this.frames = [0,1,2,3,4,3,2,1];
    this.frame = this.frames;
  }

});



/**
 * Main
 */
var Game = function () {

  var self = this;

  game = this.game = new enchant.Core(WIDTH, HEIGHT); //screen res
  game.fps = 30;

  var preload = [
    'distimg/BG1.jpg',
    'distimg/BG2.jpg',
    'distimg/BG3.jpg',
  ];

  game.preload(preload); //preload assets png, wav etc

  game.onload = function () {
    self.loadLevel(0);
  };

  game.rootScene.addEventListener('touchstart', function() {
  });

  function changevisibility() {
    if (document.hidden === false || document.webkitHidden === false) {
      game.resume();
    } else {
      self.game.pause();
    }
  }
  document.addEventListener('visibilitychange', changevisibility, false);
  document.addEventListener('webkitvisibilitychange', changevisibility, false);

  game.start();
};


Game.prototype.loadLevel = function(levelIndex) {

  if (this.scene) {
    game.rootScene.removeChild(this.scene);
  }

  this.scene = new settings.levels[levelIndex](game);
  game.rootScene.addChild(this.scene);

  // this.playerScene = new settings.levels[levelIndex].playerScene();
  // this.player = new Player();
  // game.player = this.player;
  // this.playerScene.addChild(this.player);

  // game.infos = new SceneInfos(game, PLAYER_LIVES, this.loose.bind(this));
  // game.rootScene.addChild(game.infos);
};

Game.prototype.loose = function() {
  this.game.pause();
  setTimeout(function(){
    window.location = 'img/scenes/Game-over.png';
  }, 10);
};

window.ggj = new Game();

})();



