var z2d = {
	VERSION: '0.1',
	LOG_LEVEL: 1,
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
}(z2d.Logger || (z2d.Logger = {})));

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

	onEnter: function() {

	},

	onLeave: function() {

	},

	onRender: function() {

	},

	onUpdate: function() {

	}
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

engine.run();

//sm.addScreen(s1.name, s1);
//sm.addScreen(s2.name, s2);

//sm.transition(s1.name);
//sm.transition(s2.name);