
/* global enchant, Class, HEIGHT, WIDTH, SPEED, TRANSITION, PLAYER_LIVES */

//init enchant.js
WIDTH = 2048;
HEIGHT = 1152;
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

function spritefromAsset (asset) {
    var sprite = new enchant.Sprite(asset.width, asset.height);
    sprite.image = asset;
    sprite.touchEnabled = false;
    sprite.disableCollection();
    return sprite;
}



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
      }
    }
});

var SceneOne = Class.create(enchant.Group, {
  initialize: function (game) {
    var self = this;

    this.game = game;
    enchant.Group.call(this);

    this.width   = WIDTH;
    this.height  = HEIGHT;

    // Preload backgounds
    var backgrounds = [];
    for (var i = 0; i < 3; i++) {
      backgrounds[i] = spritefromAsset(game.assets['distimg/BG'+(i+1)+'.jpg']);
      backgrounds[i].width = WIDTH;
      this.addChild(backgrounds[i]);
    }

    // Loop backgrounds
    var currentBG = 0;
    this.tl
      .delay(20)
      .then(function(){
        if (! self.lightsAreOff()) {
          backgrounds[currentBG].tl.fadeOut(10);
          currentBG = (currentBG + 1) % 3;
          backgrounds[currentBG].tl.fadeIn(10);
        }
      })
      .loop();


    // Load characters
    var character;
    this.characters = [];

    // Claudette
    character = spritefromAsset(game.assets['distimg/claudette1.png']);
    character.x = WIDTH / 5;
    this.characters.push(character);
    this.addChild(character);

    /*
    // Inspecteur
    character = spritefromAsset(game.assets['distimg/claudette1.png']);
    character.x = WIDTH / 5;
    this.characters.push(character);
    this.addChild(character);
    */


    // Preload spots
    var spots = this.spots = [];
    for (var i = 0; i < 3; i++) {
      spots[i] = spritefromAsset(game.assets['distimg/spot'+(i+1)+'.png']);
      spots[i].width = WIDTH;
      this.addChild(spots[i]);
    }

    // Load bath
    var theBath = spritefromAsset(game.assets['distimg/bain.png']);
    theBath.width = WIDTH;
    this.addChild(theBath);


    // Loop spots
    var currentSpot = 0;
    this.tl
      .delay(20)
      .then(function(){
        if (! self.lightsAreOff()) {
          spots[currentSpot].tl.fadeOut(10);
          currentSpot = (currentSpot + 1) % 3;
          spots[currentSpot].tl.fadeIn(10);
        }
      })
      .loop();


    // The "lights off" layer
    var lightsOff = this.lightsOff = new enchant.Sprite(WIDTH, HEIGHT);
    lightsOff.backgroundColor = 'black';
    lightsOff.opacity = 0;
    this.addChild(lightsOff);


    // Load switch
    var theSwitch = this.theSwitch = spritefromAsset(game.assets['distimg/interrupteur.png']);
    theSwitch.x = WIDTH * 0.9;
    theSwitch.y = HEIGHT * 0.3;
    theSwitch.touchEnabled = true;
    this.addChild(theSwitch);

    // Plug switch
    theSwitch.addEventListener('touchstart', function() {
      self.toggleLights();
    });


    // Load throwables
    var object = spritefromAsset(game.assets['distimg/interrupteur.png']);
    object.name = 'heart';
    object.x = object.original_x = WIDTH * 0.8;
    object.y = object.original_y = HEIGHT * 2;
    object.touchEnabled = true;
    this.addChild(object);


    setInterval(function () {
      self.game.throwObject(object, { name:'chick', x:WIDTH/2 * Math.random(), y:-100 });
    }, 1000);

  },


  lightsAreOff: function () {
    return this.lightsOff.opacity > 0.5;
  },

  toggleLights: function (event) {
    this.lightsOff.opacity = this.lightsAreOff() ? 0 : 0.8;
    this.theSwitch.image = this.lightsAreOff() ? this.game.assets['distimg/interrupteur.png'] : this.game.assets['distimg/interrupteur2.png'];

    for (var i = 0; i < 3; i++) {
        this.spots[i].opacity = this.lightsAreOff() ? 0 : 1;
    }

  },

});
SceneOne.preload = [
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
    'distimg/spot1.png',
    'distimg/spot2.png',
    'distimg/spot3.png',
    'distimg/bain.png',
    'distimg/interrupteur.png',
    'distimg/interrupteur2.png',
    'distimg/coeurgris.png',
    'distimg/coeurrouge.png',
    'distimg/jeanmichel.png',
    'distimg/claudette1.png',
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


  game.throwObject = function(object, to) {
    object.tl
      .moveTo(to.x, to.y, 10)
      .then(function(){

          // heart on chick
          if (object.name == 'heart' && to.name == 'chick') {

          }

          // money on chick
          if (object.name == 'money' && to.name == 'chick') {

          }

          object.x = object.original_x;
          object.y = object.original_y;
      });
  };


  game.start();
};


Game.prototype.loadLevel = function(levelIndex) {

  if (this.scene) {
    game.rootScene.removeChild(this.scene);
  }

  this.scene = new settings.levels[levelIndex](game);
  game.rootScene.addChild(this.scene);

  game.infos = new SceneInfos(game, PLAYER_LIVES, this.loose.bind(this));
  game.rootScene.addChild(game.infos);
};

Game.prototype.loose = function() {
  this.game.pause();
  setTimeout(function(){
    alert('You loose');
  }, 10);
};

window.bbqggj = new Game();

})();



