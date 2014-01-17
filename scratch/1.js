var z2d = {
	VERSION: '0.1',
	LOG_LEVEL: 0,
	Screens: {},
	Logger: {
		LOG_CRIT: 1,
		LOG_WARN: 2,
		LOG_DEBUG: 3,
		STRINGS: {
			1: 'Critical',
			2: 'Warning',
			3: 'Debug'
		}
	},
	Engine: {
		UPDATE_INTERVAL: 1000 / 16
	},
	Loader: {

	},
	Input: {
		Buttons: {
			LEFT: 1,
			RIGHT: 3,
			MIDDLE: 2
		},
		Keys: {
			ANY_KEY: -1,
			NUM_0: 48,
			NUM_1: 49,
			NUM_2: 50,
			NUM_3: 51,
			NUM_4: 52,
			NUM_5: 53,
			NUM_6: 54,
			NUM_7: 55,
			NUM_8: 56,
			NUM_9: 57,
			A: 65,
			ALT: 18,
			APOSTROPHE: 222,
			B: 66,
			BACKSLASH: 220,
			C: 67,
			COMMA: 188,
			D: 68,
			DEL: 46,
			DIVIDE: 111,
			BACKSPACE: 8,
			DOWN: 40,
			LEFT: 37,
			RIGHT: 39,
			UP: 38,
			E: 69,
			ENTER: 13,
			EQUALS: 187,
			F: 70,
			G: 71,
			GRAVE: 192,
			H: 72,
			HOME: 36,
			I: 73,
			J: 74,
			K: 75,
			L: 76,
			LEFT_BRACKET: 219,
			M: 77,
			MINUS: 109,
			MULTIPLY: 106,
			N: 78,
			NUM: 144,
			O: 79,
			P: 80,
			PERIOD: 190,
			PLUS: 107,
			Q: 81,
			R: 82,
			RIGHT_BRACKET: 221,
			S: 83,
			SEMICOLON: 186,
			SHIFT: 16,
			SLASH: 191,
			SPACE: 32,
			T: 84,
			TAB: 9,
			U: 85,
			UNKNOWN: 0,
			V: 86,
			W: 87,
			X: 88,
			Y: 89,
			Z: 90,
			CONTROL: 17,
			ESCAPE: 27,
			END: 35,
			INSERT: 45,
			PAGE_UP: 33,
			PAGE_DOWN: 34,
			NUMPAD_0: 96,
			NUMPAD_1: 97,
			NUMPAD_2: 98,
			NUMPAD_3: 99,
			NUMPAD_4: 100,
			NUMPAD_5: 101,
			NUMPAD_6: 102,
			NUMPAD_7: 103,
			NUMPAD_8: 104,
			NUMPAD_9: 105,
			F1: 112,
			F2: 113,
			F3: 114,
			F4: 115,
			F5: 116,
			F6: 117,
			F7: 118,
			F8: 119,
			F9: 120,
			F10: 121,
			F11: 122,
			F12: 123
		}
	}
};

window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

z2d.Logger = (function(Logger) {
	var log = function(message, level) {
		level = level || z2d.Logger.LOG_DEBUG;
		
		if (!z2d.LOG_LEVEL) return;

		if (level >= z2d.LOG_LEVEL) {
			if (typeof message == "object") {
				console.log(z2d.Logger.STRINGS[level] + ": logged object");
				console.log(message);
			} else {
				console.log(z2d.Logger.STRINGS[level] + ": " + message);
			}
		}
	};
	Logger.log = log;
	return Logger;
}(z2d.Logger));

z2d.Loader = (function(Loader) {
	Loader.onComplete = null;
	Loader.manifest = null;
	Loader.numAssets = 0;
	Loader.loadedAssets = 0;
	Loader.assets = {};
	Loader.loadManifest = function(manifest, complete, assetLoaded) {
		Loader.manifest = manifest;
		Loader.numAssets = manifest.length;
		Loader.loadedAssets = 0;
		Loader.onComplete = complete;

		for (var i = 0; i < Loader.numAssets; i++) {
			var spec = manifest[i];

			if (spec.type == 'img') {
				Loader.assets[spec.name] = new Image();
				Loader.assets[spec.name].onload = Loader.assetLoaded(spec, assetLoaded);
				Loader.assets[spec.name].src = spec.src;
			}

			if (spec.type == 'audio') {
				Loader.assets[spec.name] = new Audio();
				Loader.assets[spec.name].addEventListener('canplaythrough', Loader.assetLoaded(spec, assetLoaded));
				Loader.assets[spec.name].src = spec.src;
			}
		}
	};

	Loader.assetLoaded = function(spec, assetLoaded) {
		Loader.loadedAssets += 1;
		assetLoaded(spec);
		if (Loader.loadedAssets == Loader.numAssets) {
			Loader.onComplete();
		}
	};

	Loader.getNumAssets = function() {
		return Loader.numAssets;
	}

	Loader.getLoadedAssets = function() {
		return Loader.loadedAssets;
	}

	Loader.getAsset = function(name) {
		return Loader.assets[name];
	};
	return Loader;
}(z2d.Loader));

z2d.Input = (function(Input) {
	Input.inputProcessor = null;
	Input.enabled = false;
	Input.enable = function() {
		Input.enabled = true;
		document.addEventListener("keyup", Input.keyUp, false);
		document.addEventListener("keydown", Input.keyDown, false);
		document.addEventListener("mousemove", Input.mouseMoved, false);
		document.addEventListener("mousewheel", Input.scrolled, false);
		document.addEventListener("click", Input.touchUp, false);
		document.addEventListener("contextmenu", Input.touchUp, false); // for right mouse click
	};

	Input.disable = function() {
		Input.enabled = false;
		document.removeEventListener("keyup", Input.keyUp, false);
		document.removeEventListener("keydown", Input.keyDown, false);
		document.removeEventListener("mousemove", Input.mouseMoved, false);
		document.removeEventListener("mousewheel", Input.scrolled, false);
		document.removeEventListener("click", Input.touchUp, false);
		document.removeEventListener("contextmenu", Input.touchUp, false); // for right mouse click
	};

	Input.setInputProcessor = function(processor) {
		Input.inputProcessor = processor;
	};

	Input.keyUp = function(event) {
		z2d.Logger.log('keyup');
		z2d.Logger.log(event);
		if (Input.inputProcessor) {
			Input.inputProcessor.onKeyUp(event.keyCode);
		}
	};

	Input.keyDown = function(event) {
		z2d.Logger.log('keydown');
		z2d.Logger.log(event);
		if (Input.inputProcessor) {
			Input.inputProcessor.onKeyDown(event.keyCode);
		}
	};

	Input.mouseMoved = function(event) {
		z2d.Logger.log('mousemoved');
		z2d.Logger.log(event);
		if (Input.inputProcessor) {
			Input.inputProcessor.onMouseMoved(event.clientX, event.clientY);
		}
	};

	Input.scrolled = function(event) {
		z2d.Logger.log('scrolled');
		z2d.Logger.log(event);
		if (Input.inputProcessor) {
			Input.inputProcessor.onScrolled(event.wheelDelta);
		}
	};

	Input.touchUp = function(event) {
		z2d.Logger.log('touchup');
		z2d.Logger.log(event);
		if (Input.inputProcessor) {
			Input.inputProcessor.onTouchUp(event.clientX, event.clientY, event.which);
		}
	};

	Input.touchDown = function(event) {
		z2d.Logger.log('touchdown');
		z2d.Logger.log(event);
		if (Input.inputProcessor) {
			
		}
	};

	return Input;
}(z2d.Input));

z2d.Engine = function(options)
{
	this.options = options || {};
	this.screenMachine = null;

	if (this.options.screenMachine) {
		this.screenMachine = this.options.screenMachine;
	}
}
z2d.Engine.prototype = {
	constructor: z2d.Engine,

	render: function() {
		requestAnimFrame(this.render.bind(this));
		z2d.Logger.log('Engine::render');
		this.screenMachine.getCurrentScreen().onRender();
	},

	update: function() {
		z2d.Logger.log('Engine::update');
		this.screenMachine.getCurrentScreen().onUpdate();
	},

	run: function() {
		z2d.Logger.log('Engine::run');
		this.init();
		this.render();
		setInterval(this.update.bind(this), z2d.Engine.UPDATE_INTERVAL);
	},

	init: function() {
		z2d.Logger.log('Engine::init');
	}
};

z2d.ScreenMachine = function(options)
{
	this.options = options || {};
	this.currentScreen = null;
	this.screens = {};
	this.screenReady = false;

	if (this.options.screens) {
		this.setScreens(this.options.screens);
	}

	if (this.options.currentScreen) {
		this.transition(this.options.currentScreen);
	}
}

z2d.ScreenMachine.prototype = {
	constructor: z2d.ScreenMachine,

	setScreens: function(screens)
	{
		this.clearScreens();
		for (var name in screens) {
			this.addScreen(name, screens[name]);
		}
	},

	clearScreens: function()
	{
		this.screens = {};
	},

	addScreen: function(name, screen)
	{
		screen.screenMachine = this;
		this.screens[name] = screen;
	},

	getScreen: function(name)
	{
		return this.screens[name];
	},

	getCurrentScreen: function()
	{
		return this.currentScreen;
	},

	transition: function(nextScreen)
	{
		z2d.Logger.log('next screen: ' + nextScreen);
		z2d.Logger.log(this.screens[nextScreen]);
		if (this.currentScreen) {
			this.currentScreen.onLeave();
		}

		this.currentScreen = this.screens[nextScreen];

		z2d.Logger.log(this.currentScreen);

		this.currentScreen.onEnter();
	}
};

z2d.Screen = function(options)
{
	z2d.Logger.log('new Screen');
	this.options = options || {};
	this.name = '';
	this.screenMachine = null;

	if (this.options.name) {
		this.name = this.options.name;
	}
}

z2d.Screen.prototype = {
	constructor: z2d.Screen,

	onEnter: function() {},

	onLeave: function() {},

	onRender: function() {},

	onUpdate: function() {},

	onKeyUp: function(keyCode) {},

	onKeyDown: function(keyCode) {},

	onMouseMoved: function(x, y) {},

	onScrolled: function(amount) {},

	onTouchUp: function(x, y, button) {},

	onTouchDown: function(x, y, button) {},

};

z2d.Screens.PreloadScreen = function(options)
{
	z2d.Logger.log('new PreloadScreen');
	options = options || {};
	options.name = 'preload';
	z2d.Screen.call(this, options);
}
z2d.Screens.PreloadScreen.prototype = Object.create(z2d.Screen.prototype);
z2d.Screens.PreloadScreen.prototype.constructor = z2d.Screens.PreloadScreen;

z2d.Screens.PreloadScreen.prototype.onEnter = function() {
	z2d.Logger.log('entering preload screen');
	this.screenMachine.transition('title');
};

z2d.Screens.PreloadScreen.prototype.onLeave = function() {
	z2d.Logger.log('leaving preload screen');
};

z2d.Screens.TitleScreen = function(options)
{
	z2d.Logger.log('new TitleScreen');
	options = options || {};
	options.name = 'title';
	z2d.Screen.call(this, options);
}
z2d.Screens.TitleScreen.prototype = Object.create(z2d.Screen.prototype);
z2d.Screens.TitleScreen.prototype.constructor = z2d.Screens.TitleScreen;

z2d.Screens.TitleScreen.prototype.onEnter = function() {
	z2d.Logger.log('entering title screen');
},

z2d.Screens.TitleScreen.prototype.onLeave = function() {
	z2d.Logger.log('leaving title screen');
}


// var sm = new z2d.ScreenMachine({
// 	screens: {
// 		'preload': new z2d.Screens.PreloadScreen(),
// 		'title': new z2d.Screens.TitleScreen()
// 	},
// 	currentScreen: 'preload'
// });

// var engine = new z2d.Engine({
// 	screenMachine: new z2d.ScreenMachine({
// 		screens: {
// 			'preload': new z2d.Screens.PreloadScreen(),
// 			'title': new z2d.Screens.TitleScreen()
// 		},
// 		currentScreen: 'preload'
// 	})
// });


// var testProcessor = function() {
// 	this.neededCode = [z2d.Input.Keys.UP, z2d.Input.Keys.UP, z2d.Input.Keys.DOWN, z2d.Input.Keys.DOWN, z2d.Input.Keys.LEFT, z2d.Input.Keys.RIGHT, z2d.Input.Keys.LEFT, z2d.Input.Keys.RIGHT, z2d.Input.Keys.B, z2d.Input.Keys.A, z2d.Input.Keys.ENTER];
// 	this.sofar = 0;
// };
// testProcessor.prototype = {
// 	constructor: testProcessor,

// 	onKeyUp: function(keyCode) {

// 	},

// 	onKeyDown: function(keyCode) {
// 		if (keyCode == this.neededCode[this.sofar]) {
// 			this.sofar++;
// 		} else {
// 			this.sofar = 0;
// 		}

// 		if (this.sofar == this.neededCode.length) {
// 			alert('30 Lives!');
// 			this.sofar = 0;
// 		}
// 		//console.log(keyCode == z2d.Input.Keys.F);
// 	},

// 	onMouseMoved: function(x, y) {

// 	},

// 	onScrolled: function(amount) {

// 	},

// 	onTouchUp: function(x, y, button) {

// 	},

// 	onTouchDown: function(x, y, button) {

// 	},
// };

// z2d.Input.setInputProcessor(new testProcessor());
// z2d.Input.enable();

z2d.Loader.loadManifest([
	{'type': 'img', 'src': 'data/images/sheet1.png', 'name': 'img1'},
	{'type': 'img', 'src': 'data/images/sheet2.png', 'name': 'img2'},
	{'type': 'img', 'src': 'data/images/sheet3.png', 'name': 'img3'},
	{'type': 'audio', 'src': 'data/audio/audio1.ogg', 'name': 'audio1'},
	{'type': 'audio', 'src': 'data/audio/audio2.ogg', 'name': 'audio2'}
	], function() { console.log('loading complete'); }, function(a) { console.log(a); });

//just to fix #3

//engine.run();

//sm.addScreen(s1.name, s1);
//sm.addScreen(s2.name, s2);

//sm.transition(s1.name);
//sm.transition(s2.name);