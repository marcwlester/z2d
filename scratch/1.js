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
	Input: {
		Buttons: {
			LEFT: 1,
			RIGHT: 3,
			MIDDLE: 2
		},
		Keys: {
			ANY_KEY: -1,
			NUM_0: 7,
			NUM_1: 8,
			NUM_2: 9,
			NUM_3: 10,
			NUM_4: 11,
			NUM_5: 12,
			NUM_6: 13,
			NUM_7: 14,
			NUM_8: 15,
			NUM_9: 16,
			A: 29,
			ALT_LEFT: 57,
			ALT_RIGHT: 58,
			APOSTROPHE: 75,
			AT: 77,
			B: 30,
			BACK: 4,
			BACKSLASH: 73,
			C: 31,
			CALL: 5,
			CAMERA: 27,
			CLEAR: 28,
			COMMA: 55,
			D: 32,
			DEL: 67,
			BACKSPACE: 67,
			FORWARD_DEL: 112,
			DPAD_CENTER: 23,
			DPAD_DOWN: 20,
			DPAD_LEFT: 21,
			DPAD_RIGHT: 22,
			DPAD_UP: 19,
			CENTER: 23,
			DOWN: 20,
			LEFT: 21,
			RIGHT: 22,
			UP: 19,
			E: 33,
			ENDCALL: 6,
			ENTER: 66,
			ENVELOPE: 65,
			EQUALS: 70,
			EXPLORER: 64,
			F: 34,
			FOCUS: 80,
			G: 35,
			GRAVE: 68,
			H: 36,
			HEADSETHOOK: 79,
			HOME: 3,
			I: 37,
			J: 38,
			K: 39,
			L: 40,
			LEFT_BRACKET: 71,
			M: 41,
			MEDIA_FAST_FORWARD: 90,
			MEDIA_NEXT: 87,
			MEDIA_PLAY_PAUSE: 85,
			MEDIA_PREVIOUS: 88,
			MEDIA_REWIND: 89,
			MEDIA_STOP: 86,
			MENU: 82,
			MINUS: 69,
			MUTE: 91,
			N: 42,
			NOTIFICATION: 83,
			NUM: 78,
			O: 43,
			P: 44,
			PERIOD: 56,
			PLUS: 81,
			POUND: 18,
			POWER: 26,
			Q: 45,
			R: 46,
			RIGHT_BRACKET: 72,
			S: 47,
			SEARCH: 84,
			SEMICOLON: 74,
			SHIFT_LEFT: 59,
			SHIFT_RIGHT: 60,
			SLASH: 76,
			SOFT_LEFT: 1,
			SOFT_RIGHT: 2,
			SPACE: 62,
			STAR: 17,
			SYM: 63,
			T: 48,
			TAB: 61,
			U: 49,
			UNKNOWN: 0,
			V: 50,
			VOLUME_DOWN: 25,
			VOLUME_UP: 24,
			W: 51,
			X: 52,
			Y: 53,
			Z: 54,
			META_ALT_LEFT_ON: 16,
			META_ALT_ON: 2,
			META_ALT_RIGHT_ON: 32,
			META_SHIFT_LEFT_ON: 64,
			META_SHIFT_ON: 1,
			META_SHIFT_RIGHT_ON: 128,
			META_SYM_ON: 4,
			CONTROL_LEFT: 129,
			CONTROL_RIGHT: 130,
			ESCAPE: 131,
			END: 132,
			INSERT: 133,
			PAGE_UP: 92,
			PAGE_DOWN: 93,
			PICTSYMBOLS: 94,
			SWITCH_CHARSET: 95,
			BUTTON_CIRCLE: 255,
			BUTTON_A: 96,
			BUTTON_B: 97,
			BUTTON_C: 98,
			BUTTON_X: 99,
			BUTTON_Y: 100,
			BUTTON_Z: 101,
			BUTTON_L1: 102,
			BUTTON_R1: 103,
			BUTTON_L2: 104,
			BUTTON_R2: 105,
			BUTTON_THUMBL: 106,
			BUTTON_THUMBR: 107,
			BUTTON_START: 108,
			BUTTON_SELECT: 109,
			BUTTON_MODE: 110,
			NUMPAD_0: 144,
			NUMPAD_1: 145,
			NUMPAD_2: 146,
			NUMPAD_3: 147,
			NUMPAD_4: 148,
			NUMPAD_5: 149,
			NUMPAD_6: 150,
			NUMPAD_7: 151,
			NUMPAD_8: 152,
			NUMPAD_9: 153,
			COLON: 243,
			F1: 244,
			F2: 245,
			F3: 246,
			F4: 247,
			F5: 248,
			F6: 249,
			F7: 250,
			F8: 251,
			F9: 252,
			F10: 253,
			F11: 254,
			F12: 255
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
			console.log('here');
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

var engine = new z2d.Engine({
	screenMachine: new z2d.ScreenMachine({
		screens: {
			'preload': new z2d.Screens.PreloadScreen(),
			'title': new z2d.Screens.TitleScreen()
		},
		currentScreen: 'preload'
	})
});


var testProcessor = function() {

};
testProcessor.prototype = {
	constructor: testProcessor,

	onKeyUp: function(keyCode) {

	},

	onKeyDown: function(keyCode) {
		console.log('here');
		console.log(keyCode);
		console.log(keyCode == z2d.Input.Keys.F);
	},

	onMouseMoved: function(x, y) {

	},

	onScrolled: function(amount) {

	},

	onTouchUp: function(x, y, button) {

	},

	onTouchDown: function(x, y, button) {

	},
};

z2d.Input.setInputProcessor(new testProcessor());
z2d.Input.enable();

//just to fix #3

//engine.run();

//sm.addScreen(s1.name, s1);
//sm.addScreen(s2.name, s2);

//sm.transition(s1.name);
//sm.transition(s2.name);