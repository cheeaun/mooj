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
			return $defined(fn) ? this.addEvent(un_name, fn) : this.fireEvent(un_name);
		};
	});
	Native.implement([Element, Document, Window], methods);
})(['_blur', 'change', 'click', '_click', 'dblclick', 'error', '_focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', '_select', '_submit', 'unload']);

Element.implement({

	/*****   CORE   *****/
	
	// Data Cache
	
	data: function(property, value){
		return $defined(value) ? this.store(property, value) : this.retrieve(property);
	},
	
	
	
	/*****   ATTRIBUTES   *****/

	// Attr

	attr: function(prop, value){
		switch ($type(prop)){
			case 'object':
				this.set(prop);
				break;
			case 'string':
				if ($defined(value)){
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
		return $defined(value) ? this.set('html', value) : this.get('html');
	},
	
	// Text
	
	text: function(text){
		return $defined(text) ? this.set('text', text) : this.get('text');
	},
	
	// Value
	
	val: function(value){
		// Note: Array type value not implemented
		return $defined(value) ? this.set('value', value) : this.get('value');
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
				if ($defined(value)) this.setStyle(property, value)
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
		return $defined(y) ? this.scrollTo(this.getScroll().x, y) : this.getScroll().y;
	},
	
	_scrollLeft: function(x){
		return $defined(x) ? this.scrollTo(x, this.getScroll().y) : this.getScroll().x;
	},
	
	height: function(val){
		return $defined(val) ? this.setStyle('height', val) : this.getStyle('height').toInt();
	},
	
	width: function(val){
		return $defined(val) ? this.setStyle('width', val) : this.getStyle('width').toInt();
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
		if (this.getStyle('display')=='none')
			if (speed){
				var size = this.setStyles({'width': 'auto', 'height': 'auto'}).getStyles('width', 'height');
//				console.log(size);
				var options = {duration: speed};
				if (fn) options['onComplete'] = function(){
					fn.attempt(this, this);
					this.setStyles({'width': 'auto', 'height': 'auto'});
				};
				this.setStyles({'width': 0, 'height': 0}).set('morph', options).morph({
					opacity: [0, 1],
					width: size.width,
					height: size.height
				});
			}
			else
				this.setStyle('display', 'block');
		return this;
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
	getAllPrevious: 'prevAll'
	
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
		if ($defined(match)) this.filter(match).dispose();
		else return this.dispose();
		return this;
	}
	
});

// 'normal' are overriden from 500 to 400, 'long' and 'short' are still around
$extend(Fx.Durations, {'fast': 200, 'normal': 400, 'slow': 600});