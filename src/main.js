
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

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

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
    character.type = 'chick';
    this.characters.push(character);
    this.addChild(character);

    // Claudette
    character = spritefromAsset(game.assets['distimg/claudette2.png']);
    character.type = 'chick';
    this.characters.push(character);
    this.addChild(character);

    // Inspecteur
    character = spritefromAsset(game.assets['distimg/jeanmichel.png']);
    character.type = 'agent';
    this.characters.push(character);
    this.addChild(character);

    this.shuffleCharacters();

    // Anim characters
    // Loop spots
    this.tl.setTimeBased();
    this.tl
      .then(function(){
        if (! self.lightsAreOff()) {
          for (var i = 0; i < self.characters.length; i++) {
            self.characters[i].tl.setTimeBased();
            self.characters[i].tl.moveTo(
              self.characters[i].x + (Math.random() -1) * Math.sin(window.performance.now()) * 5,
              self.characters[i].y + (Math.random() -1) * Math.sin(window.performance.now()) * 10,
              40);
          };
          spots[currentSpot].tl.fadeOut(10);
          currentSpot = (currentSpot + 1) % 3;
          spots[currentSpot].tl.fadeIn(10);
        }
      })
      .loop();


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

    self.lastFlickering = window.performance.now();

    // Loop spots
    var currentSpot = 0;
    this.tl
      .delay(20)
      .then(function(){
        if (! self.lightsAreOff()) {
          spots[currentSpot].tl.fadeOut(10);
          currentSpot = (currentSpot + 1) % 3;
          spots[currentSpot].tl.fadeIn(10);

          if (self.lastFlickering < window.performance.now() - 3000 - 5000 * Math.random()) {
            self.lastFlickering = window.performance.now();
            self.flickerAndOff();
          }
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
    theSwitch.y = HEIGHT * 0.84;
    theSwitch.touchEnabled = true;
    this.addChild(theSwitch);

    // Plug switch
    theSwitch.addEventListener('touchstart', function(event) {
      self.shuffleCharacters();
      self.toggleLights();
      return false;
    });


    // Load marker
    var marker = this.marker = spritefromAsset(game.assets['distimg/disco1.png']);
    this.placeMarker(0);
    this.addChild(marker);


    // Load throwables
    var object;
    this.throwables = [];

    /* * /
    object = spritefromAsset(game.assets['distimg/objet-argent.png']);
    object.name = 'heart';
    object.x = object.original_x = WIDTH * 0.45;
    object.y = object.original_y = HEIGHT * 0.75;
    object.touchEnabled = true;
    this.addChild(object);
    /* */

    this.throwables.push(spritefromAsset(game.assets['distimg/objet-son.png']));
    this.throwables.push(spritefromAsset(game.assets['distimg/objet-coeur.png']));
    this.throwables.push(spritefromAsset(game.assets['distimg/objet-argent.png']));

    this.queueNext();

    // setInterval(function () {
    //   self.game.throwObject(self.nextThrow, self.currentTarget());
    // }, 1000);

  },

  queueNext: function () {
    var sprite = this.randomSprite();
    sprite.x = sprite.original_x = WIDTH * 0.45;
    sprite.y = sprite.original_y = HEIGHT * 0.75;
    this.nextThrow = sprite;
    this.addChild(sprite);
  },

  currentTarget: function () {
    return this.marked;
  },

  randomTarget: function () {
    return this.characters[~~(Math.random() * this.characters.length)];
  },

  randomSprite: function () {
    return this.throwables[~~(Math.random() * this.throwables.length)];
  },

  marked: null,
  markedIdx: 0,
  moveLeft: function () {
    this.placeMarker( Math.max(this.markedIdx - 1, 0) );
  },
  moveRight: function () {
    this.placeMarker( Math.min(this.markedIdx + 1, this.characters.length - 1) );
  },
  placeMarker: function (characterIdx) {
    this.markedIdx = characterIdx;
    this.marked = this.characters[this.markedIdx];
    this.marker.tl
      .moveTo(this.characters[this.markedIdx].x + this.characters[this.markedIdx].width / 2, -80, 5);
  },

  flickerAndOff: function () {
    var self = this;
    this.tl.setTimeBased();
    this.tl
      .then(function () {
        self.toggleLights(null, true);
      })
      .delay(1)
      .then(function () {
        self.toggleLights(null, true);
      })
      .delay(1)
      .then(function () {
        self.toggleLights(null, true);
      });
  },

  shuffleCharacters: function () {
    shuffle(this.characters);
    this.characters[0].x = WIDTH / 6;
    this.characters[1].x = WIDTH / 6 + this.characters[0].width / 2;
    this.characters[2].x = WIDTH / 6 + this.characters[0].width / 2 + this.characters[1].width / 2;
  },


  lightsAreOff: function () {
    return this.lightsOff.opacity > 0.5;
  },

  toggleLights: function (event, noSwitch) {
    this.lightsOff.opacity = this.lightsAreOff() ? 0 : 0.98;

    if (! noSwitch) {
      this.theSwitch.image = this.lightsAreOff() ? this.game.assets['distimg/interrupteur.png'] : this.game.assets['distimg/interrupteur2.png'];
    }

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
    'distimg/claudette2.png',
    'distimg/disco1.png',
    'distimg/objet-argent.png',
    'distimg/objet-coeur.png',
    'distimg/objet-son.png',
  ];

  game.preload(preload); //preload assets png, wav etc

  game.onload = function () {
    self.loadLevel(0);
  };

  game.rootScene.addEventListener('keydown', function(event) {
    debugger;
  });

  game.rootScene.addEventListener('touchstart', function(event) {
    if (event.localY > HEIGHT * 0.6)
      game.throwObject(self.scene.nextThrow, self.scene.currentTarget());
    else if (event.localX < WIDTH / 2)
      self.scene.moveLeft();
    else
      self.scene.moveRight();
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
      .moveTo(self.scene.marker.x - self.scene.marker.width / 2, HEIGHT * 0.1, 10)
      .then(function(){

          var target = self.scene.marked;

          // heart on chick
          if (object.name == 'heart' && target.type == 'chick') {

          }

          // money on chick
          if (object.name == 'money' && target.type == 'chick') {

          }

          object.remove();
          self.scene.queueNext();
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

  // game.infos = new SceneInfos(game, PLAYER_LIVES, this.loose.bind(this));
  // game.rootScene.addChild(game.infos);
};

Game.prototype.loose = function() {
  this.game.pause();
  setTimeout(function(){
    alert('You loose');
  }, 10);
};

window.bbqggj = new Game();

})();



