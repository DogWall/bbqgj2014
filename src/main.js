
/* global enchant, Class, HEIGHT, WIDTH, SPEED, TRANSITION, PLAYER_LIVES */

//init enchant.js
HEIGHT = window.innerHeight * 2;
WIDTH = window.innerWidth * 2;
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
    this.originX = WIDTH / 2;
    this.originY = HEIGHT / 2;

  }
});
SceneOne.preload = [
  'sounds/Jour.mp3',
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
    {
      upperScene: SceneOne,
    }
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
    settings.player.sprite_j,
    settings.player.sprite_n,
    'sounds/Transition.mp3',
    'distimg/fantome.png',
    'distimg/coeurgris.png',
    'distimg/coeurrouge.png','distimg/office-j.png','distimg/office-n.png'
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

  // if (this.upperScene || this.lowerScene) {
  //   game.rootScene.removeChild(this.upperScene);
  //   game.rootScene.removeChild(this.upperScenefg);
  //   game.rootScene.removeChild(this.lowerScene);
  //   game.rootScene.removeChild(this.lowerScenefg);
  // }

  // this.upperScene = new settings.levels[levelIndex].upperScene(game);
  // this.upperScenefg = new settings.levels[levelIndex].upperScenefg(game);
  // this.Boss = new Sprite(game.assets['distimg/fantome.png'].width,game.assets['distimg/fantome.png'].height);
  // this.Boss.image= game.assets['distimg/fantome.png'];
  // game.rootScene.addChild(this.upperScene);

  // this.playerScene = new settings.levels[levelIndex].playerScene();
  // this.player = new Player();
  // game.player=this.player;
  // this.playerScene.addChild(this.player);

  // this.lowerScene = new settings.levels[levelIndex].lowerScene(game);
  // this.lowerScenefg = new settings.levels[levelIndex].lowerScenefg(game);
  // this.lowerScene.rotation = -180;
  // this.lowerScenefg.rotation =- 180;
  // game.rootScene.addChild(this.lowerScene);

  // game.rootScene.addChild(this.playerScene);
  // game.rootScene.addChild(this.upperScenefg);
  // game.rootScene.addChild(this.lowerScenefg);
  // var hqn = new Sprite(game.assets['distimg/office-n.png'].width,game.assets['distimg/office-n.png'].height);
  // hqn.image=game.assets['distimg/office-n.png'];
  // hqn.x=WIDTH/2;
  // hqn.y=HEIGHT/2-hqn.height-166;
  // this.lowerScene.addChild(hqn);
  // hqn.tl.moveBy(SPEED*10,0,1000);

  // this.lowerScenefg.addChild(this.Boss);
  // this.upperScenefg.y = HEIGHT / 2;
  // this.playerScene.y = HEIGHT / 2;
  // this.upperScene.y = HEIGHT / 2;
  // this.lowerScene.y = HEIGHT / 2;
  // this.lowerScenefg.y = HEIGHT / 2;

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



