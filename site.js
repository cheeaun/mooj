hljs.initHighlightingOnLoad('html', 'javascript');

window.addEvent('domready', function(){
	var $debuglog = $('debug-log');
	var $debug = $('debug').setStyles({
		'opacity': '.7',
		'overflow': 'hidden'
	})
	$('debug-toggle').addEvent('click', function(e){
		var height = $debuglog.getStyle('height').toInt();
		console.log(height);
		$debuglog.tween('height', (height==100) ? 0 : (height==0) ? 300 : 100);
	});
	
	function elem2tag(el){
		var elem = el.get('tag');
		if (el.id) elem += '#'+el.id;
		if (el.className) elem += '.'+el.className.split(' ').join('.');
		return elem;
	}
	
	function debug(code){
		var dcode = code;
		
		if (code == null)
			dcode = 'null';
		else
			switch($type(code)){
				case 'array':
					if (code.length){
						dcode = code.flatten().map(function(el){
							return elem2tag(el);
						}).toString();
					}
					else
						dcode = '[]';
					break;
				case 'element':
					dcode = elem2tag(code);
					break;
				default:
					dcode = JSON.encode(code);
			}
			
		$debuglog.set('html', $debuglog.get('html')+'<br />').appendText(String(dcode)).scrollTop = $debuglog.scrollHeight;
		if (console.log) console.log(code); // Firebug console rules
	}
	
	$('debug-clear').addEvent('click', function(e){
		$debuglog.empty();
	});
	
	$$('.section>pre').each(function(el){
		var code = el.get('text');
		var runButton = new Element('button', {
			'text': 'run',
			'class': 'run-button'
		}).inject(el, 'before');
		if (code.contains('/*')) runButton.disabled = true;
		else runButton.addEvent('click', function(e){
			e.stop();
			debug(eval(code));
			document.fireEvent('onSourceChange', this.getPrevious('.example-block').getNext('pre'));
		});
	});
	
	$$('.example-block').each(function(el){
		new Element('pre', {
			'html': '<code class="html"></code>'
		}).inject(el, 'after').getChildren().set('text', el.get('html').clean().replace(/div>\s*?</gi, 'div>\n<'));
		el.store('oriHTML', el.get('html'));
		var resetButton = new Element('a', {
			'href': '#',
			'text': 'reset',
			'class': 'reset-button',
			'events': {
				'click': function(e){
					e.stop();
					window.removeEvents();
					$(document).removeEvents();
					var block = this.getNext('.example-block');
					block.getChildren().removeEvents();
					block.set('html', block.retrieve('oriHTML').clean().replace(/div>\s*?</gi, 'div>\n<'));
					document.fireEvent('onSourceChange', block.getNext('pre'));
				}
			}
		}).inject(el, 'before');
	});
	
	document.addEvent('onSourceChange', function(el){
		el.getChildren('code').set('text', el.getPrevious().get('html').clean().replace(/div>\s*?</gi, 'div>\n<'));
		hljs.highlightBlock(el.getChildren('code')[0]);
	});
});