// a copy of jQuery.swap()
// A method for quickly swapping in/out CSS properties to get correct calculations
function $swap(el, options, fn){
	var old = {};
	// Remember the old values, and insert the new ones
	for (var name in options){
		old[name] = el.style[name];
		el.style[name] = options[name];
	}

	fn.call(el);

	// Revert the old values
	for(var name in options) el.style[name] = old[name];
};

Native.implement([Window, Document], {

	/*****   EVENTS   *****/
	
	// Page Load

	ready: function(fn){
		window.addEvent('domready', fn);
		return this;
	},
	
	// Event Helpers
	
	scroll: function(fn){
		return this.addEvent('scroll', fn);
	}
	
});

Window.implement({
	
	/*****   EVENTS   *****/
	
	// Event Helpers
	
	load: function(fn){
		return this.addEvent('load', fn);
	},
	
	resize: function(fn){
		return this.addEvent('resize', fn);
	}

});

Native.implement([Element, Document, Window], {

	/*****   EVENTS   *****/
	
	// Event Handling
	
	bind: function(type, fn){
		type.split(' ').each(function(event){ // accepts multiple event types!
			this.addEvent(event, fn);
		}, this);
		return this;
	},
	
	one: function(type, fn){
		// TODO: Make this cleaner. Looks like a hack now.
		var removeOne = function(){
			this.removeEvent(type, fn).removeEvent(type, removeOne);
		}
		return this.addEvent(type, fn).addEvent(type, removeOne);
	},
	
	trigger: function(type, args){
		return this.fireEvent(type, args);
	},
	
	unbind: function(type, fn){
		return this.removeEvent(type, fn);
	},
	
	// Interaction Helpers
	
	hover: function(fnOver, fnOut){
		return this.addEvents({
			'mouseenter': fnOver,
			'mouseleave': fnOut
		});
	}
	
});
	
// EVENTS - Event Helpers
(function(type){
	var methods = {};
	type.each(function(name){
		if (!Native[name]) methods[name] = function(fn){
			var un_name = name.replace('_', '');
			return fn ? this.addEvent(un_name, fn) : this.fireEvent(un_name);
		};
	});
	Native.implement([Element, Document, Window], methods);
})(['_blur', 'change', 'click', '_click', 'dblclick', 'error', '_focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', '_select', '_submit', 'unload']);

Element.implement({

	/*****   CORE   *****/
	
	// Data Cache
	
	data: function(property, value){
		return value ? this.store(property, value) : this.retrieve(property);
	},
	
	
	
	/*****   ATTRIBUTES   *****/

	// Attr

	attr: function(prop, value){
		switch ($type(prop)){
			case 'object':
				this.set(prop);
				break;
			case 'string':
				if (value){
					// Note: first attempt() arg is supposed to be index of elements array, but can't be done in Mootools
					if ($type(value)=='function') value = value.attempt(this, this);
					this.set(prop, value)
				}
				else return this.get(prop);
		}
		return this;
	},
	
	// HTML
	
	html: function(value){
		return value ? this.set('html', value) : this.get('html');
	},
	
	// Text
	
	text: function(text){
		return text ? this.set('text', text) : this.get('text');
	},
	
	// Value
	
	val: function(value){
		// Note: Array type value not implemented
		return value ? this.set('value', value) : this.get('value');
	},
	
	
	
	/*****   TRAVERSING   *****/
	
	// Finding
	
	siblings: function(match){
		return $$( this.getAllNext(match), this.getAllPrevious(match) );
	},
	
	
	
	/*****   MANIPULATION   *****/
	
	// Inserting Inside
	
	append: function(content){
		switch ($type(content)){
			case 'element': content.inject(this); break;
			case 'string': this.set('html', this.get('html') + content); break;
		}
		return this;
	},
	
	appendTo: function(el){
		return this.inject($(el));
	},

	prepend: function(content){
		switch ($type(content)){
			case 'element': content.inject(this, 'top'); break;
			case 'string': this.set('html', content + this.get('html')); break;
		}
		return this;
	},
	
	prependTo: function(el){
		return this.inject($(el), 'top');
	},
	
	// Inserting Outside

	after: function(content){
		switch ($type(content)){
			case 'element': content.inject(this, 'after'); break;
			/* TODO: TextNode.inject is missing
			case 'string':
				var parent = this.getParent();
				var wrapper = new Element('div').wraps(this);
				wrapper.set('html', wrapper.get('html') + content);
				console.log(wrapper.childNodes);
				for (var i = 0, k = wrapper.childNodes.length; i < k; i++){
					var node = wrapper.childNodes[i];
				}
				break;
			*/
		}
		return this;
	},
	
	insertAfter: function(el){
		return this.inject($(el), 'after');
	},

	before: function(content){
		switch ($type(content)){
			case 'element': content.inject(this, 'before'); break;
			/* TODO: same as 'after'
			case 'string': this.set('html', content + this.get('html')); break;
			*/
		}
		return this;
	},
	
	_insertBefore: function(el){
		return this.inject($(el), 'before');
	},
	
	// Inserting Around
	
	wrap: function(el){
		el.wraps(this);
		return this;
	},
	
	wrapInner: function(el){
		var html = this.get('html');
		el.set('html', html).inject(this.empty());
		return this;
	},
	
	// Replacing
	
	replaceWith: function(el){
		el.replaces(this);
		return this;
	},
	
	replaceAll: function(el){
		switch ($type(el)){
			case 'element': this.replaces(el); break;
			case 'string':
				$$(el).each(function(elem){
					this.clone(true).replaces(elem);
				}, this);
				break;
		}
		return this;
	},
	
	// Removing
	
	remove: function(match){
		return this.match(match) ? this.dispose() : this;
	},
	
	
	
	/*****   CSS   *****/
	
	// CSS
	
	css: function(property, value){
		switch ($type(property)){
			case 'object':
				this.setStyles(property);
				break;
			case 'string':
				if (value) this.setStyle(property, value)
				else return this.getStyle(property);
		}
		return this;
	},
	
	// Positioning
	
	offset: function(){
		var pos = this.getPosition();
		pos.left = pos.x;
		pos.top = pos.y;
		return pos;
	},
	
	position: function(){
		var pos = this.getPosition(this.getOffsetParent());
		pos.left = pos.x;
		pos.top = pos.y;
		return pos;
	},
	
	_scrollTop: function(y){
		return y ? this.scrollTo(this.getScroll().x, y) : this.getScroll().y;
	},
	
	_scrollLeft: function(x){
		return x ? this.scrollTo(x, this.getScroll().y) : this.getScroll().x;
	},
	
	height: function(val){
		if (val) return this.setStyle('height', val);
		var props = {position: 'absolute', visibility: 'hidden', display: 'block'};
		var value, el = this;
		var getHeight = function(){
			value = el.getStyle('height').toInt();
		}
		if (this.getStyle('display') == 'none'){
			$swap(el, props, getHeight);
		}
		else {
			getHeight();
		}
		return value;
	},
	
	width: function(val){
		if (val) return this.setStyle('width', val);
		var props = {position: 'absolute', visibility: 'hidden', display: 'block'};
		var value, el = this;
		var getWidth = function(){
			value = el.getStyle('width').toInt();
		}
		if (this.getStyle('display') == 'none'){
			$swap(el, props, getWidth);
		}
		else {
			getWidth();
		}
		return value;
	},
	
	innerHeight: function(){
		return this.height() + this.getStyle('padding-top').toInt() + this.getStyle('padding-bottom').toInt();
	},
	
	innerWidth: function(){
		return this.width() + this.getStyle('padding-left').toInt() + this.getStyle('padding-top').toInt();
	},
	
	outerHeight: function(margin){
		return (!margin) ? this.innerHeight() + this.getStyle('border-top').toInt() + this.getStyle('border-bottom').toInt() :
			this.outerHeight()  + this.getStyle('margin-top').toInt() + this.getStyle('margin-bottom').toInt()
	},
	
	outerWidth: function(margin){
		return (!margin) ? this.innerWidth() + this.getStyle('border-left').toInt() + this.getStyle('border-right').toInt() :
			this.outerWidth()  + this.getStyle('margin-left').toInt() + this.getStyle('margin-right').toInt();
	},
	
	
	
	/*****   EFFECTS   *****/
	
	// Basics
	
	show: function(speed, fn){
		if (this.getStyle('display') == 'none')
			if (speed){
				var currentStyle = this.getStyles('width', 'height', 'overflow');
				var computedStyle = { 'height': this.height() };
				var self = this;
				this.setStyles({
					'height': 1,
					'overflow': 'hidden',
					'display': '',
					'opacity': 0
				});
				// calculate width here in case of width: auto, a little more special than height: auto
				computedStyle.width = this.width();
				this.setStyle('width', 1).set('morph', {
					duration: speed,
					onComplete: function(){
						self.setStyles({
							'width': (currentStyle.width == 'auto') ? '': computedStyle.width,
							'height': (currentStyle.height == 'auto') ? '': computedStyle.height,
							'overflow': currentStyle.overflow
						});
						if (fn) fn.attempt(self, self);
					}
				}).morph({
					opacity: 1,
					width: computedStyle.width,
					height: computedStyle.height
				});
			}
			else
				this.setStyle('display', '');
		return this;
	},
	
	hide: function(speed, fn){
		if (this.getStyle('display') != 'none')
			if (speed){
				var currentStyle = this.getStyles('width', 'height', 'overflow');
				var self = this;
				this.setStyles({
					'overflow': 'hidden'
				}).set('morph', {
					duration: speed,
					onComplete: function(){
						self.setStyles($extend(currentStyle, {'display': 'none'}));
						if (fn) fn.attempt(self, self);
					}
				}).morph({
					opacity: 0,
					width: 0,
					height: 0
				});
			}
			else
				this.setStyle('display', 'none');
		return this;
	},
	
	toggle: function(){
		return (this.getStyle('display') == 'none') ? this.show() : this.hide();
	},
	
	// Sliding
	
	slideDown: function(speed, fn){
		if (this.getStyle('display') == 'none'){
			var currentStyle = this.getStyles('height', 'overflow');
			var computedStyle = { 'height': this.height() };
			var self = this;
			this.setStyles({
				'height': 1,
				'overflow': 'hidden',
				'display': 'block',
			}).set('tween', {
				duration: speed || 'normal',
				onComplete: function(){
					self.setStyles({
						'height': (currentStyle.height == 'auto') ? '': computedStyle.height,
						'overflow': currentStyle.overflow
					});
					if (fn) fn.attempt(self, self);
				}
			}).tween('height', computedStyle.height);
		}
		return this;
	},
	
	slideUp: function(speed, fn){
		if (this.getStyle('display') != 'none'){
			var currentStyle = this.getStyles('height', 'overflow');
			var self = this;
			this.setStyles({
				'overflow': 'hidden',
				'display': 'block',
			}).set('tween', {
				duration: speed || 'normal',
				onComplete: function(){
					self.setStyles($extend(currentStyle, {'display': 'none'}));
					if (fn) fn.attempt(self, self);
				}
			}).tween('height', 0);
		}
		return this;
	},
	
	slideToggle: function(speed, fn){
		return (this.getStyle('display') == 'none') ? this.slideDown() : this.slideUp();
	},
	
	// Fading
	
	fadeIn: function(speed, fn){
		if (this.getStyle('display') == 'none'){
			var options = {};
			if (speed) options.duration = speed;
			if (fn) options.onComplete = fn;
			this.set('tween', options).fade('hide').setStyle('display', '').fade('in');
		}
		return this;
	},
	
	fadeOut: function(speed, fn){
		if (this.getStyle('display') != 'none'){
			var options = {};
			if (speed) options.duration = speed;
			options.onComplete = function(){
				this.hide();
				if (fn) fn.attempt(this, this);
			}.bind(this);
			this.set('tween', options).fade('out');
		}
		return this;
	},
	
	fadeTo: function(speed, opacity, fn){
		var options = {};
		if (speed) options.duration = speed;
		if (fn) options.onComplete = fn;
		return this.set('tween', options).fade(opacity);
	},
	
	// Fading
	
	animate: function(params, duration, easing, fn){ // no easing.
		var opts = ($type(duration) == 'object') ? duration : {
			'duration': duration || 'normal',
			'transition': easing || 'linear' // defaults to linear instead of sine
		}
		if (fn) opts.onComplete = fn;
		return this.set('morph', opts).morph(params);
	}
	
}).alias({

	// CORE - Data Cache
	eliminate : 'removeData',
	
	// ATTRIBUTES - Attr
	removeProperty : 'removeAttr',
	
	// TRAVERSING - Filtering
	match: 'is',

	// TRAVERSING - Finding
	getChildren: 'children',
	getElements: 'find',
	getNext: 'next',
	getAllNext: 'nextAll',
	getParent: 'parent',
	getParents: 'parents',
	getPrevious: 'prev',
	getAllPrevious: 'prevAll',
	
	// AJAX - Misc
	toQueryString: 'serialize'
	
});

Elements.implement({
	
	/*****   MANIPULATION   *****/
	
	// Inserting Around
	
	wrapAll: function(el){
		this.each(function(elem){
			el.wraps(elem);
		});
		return this;
	},
	
	// Removing
	
	remove: function(match){
		if (match) this.filter(match).dispose();
		else return this.dispose();
		return this;
	}
	
});

// Durations
// 'normal' are overriden from 500 to 400
// added 'default' for the old 500
// 'long' and 'short' are still around
$extend(Fx.Durations, {'fast': 200, 'normal': 400, 'slow': 600, 'default': 500});

	
/*****   AJAX   *****/

// Ajax Request

$extend($, {

	ajax: function(options){
		var request;
		options.method = options.type || options.method || 'get'; // default is 'get' for jQuery
		if (options.complete) options.onComplete = options.complete;
		if (options.error) options.onFailure = options.error;
		if (options.success) options.onSuccess = options.success;
		if (options.dataType && options.dataType == 'html' && Request.HTML) request = new Request.HTML(options);
		else if (options.dataType && options.dataType == 'json' && Request.JSON) request = new Request.JSON(options);
		else request = new Request(options);
		if (options.timeout) request.cancel.delay(options.timeout);
		return request.send();
	},
	
	get: function(url, data, fn, type){
		if ($type(data) == 'function'){
			fn = data;
			data = null;
		}
		var request;
		var options = {
			url: url,
			data: data,
			onSuccess: fn,
			dataType: type
		};
		return this.ajax(options);
	},
	
	getJSON: function(url, data, fn){
		return this.get(url, data, fn, 'json');
	},
	
	post: function(url, data, fn, type){
		if ($type(data) == 'function'){
			fn = data;
			data = null;
		}
		var request;
		var options = {
			method: 'post',
			url: url,
			data: data,
			onSuccess: fn,
			dataType: type
		};
		return this.ajax(options);
	}
	
});