'use strict';

import React from 'react';

class AutoresizeTextarea extends React.Component{
	constructor(props) {
		super(props);

		this.autoresize = null;
		this.heightOffset = null;
		this.overflowY = null;
		this.clientWidth = null;

		this.state = {
			setOverflowX: true,
			setOverflowY: true
		}

		this._bind('_init');
		this._bind('_updateNode');
		this._bind('_resize');
		this._bind('_changeOverflow');
		this._bind('_destroy');
		this._bind('_update');
	}

	_bind(...methods) {
		methods.forEach((method) => {
			this[method] = this[method].bind(this);
		});
	}

	_init() {
		const node = this.refs.autoresize_ta;
		const style = window.getComputedStyle(node, null);

		this.overflowY = style.overflowY;

		if (style.resize === 'vertical') {
			node.style.resize = 'none';
		} else if (style.resize === 'both') {
			node.style.resize = 'horizontal';
		}

		if (style.boxSizing === 'content-box') {
			this.heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
		} else {
			this.heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
		}
		// Fix when a textarea is not on document body and heightOffset is Not a Number
		if (isNaN(this.heightOffset)) {
			this.heightOffset = 0;
		}

		this._updateNode();
	}

	_updateNode() {
		const node = this.refs.autoresize_ta;
		const startHeight = node.style.height;

		this._resize();

		const style = window.getComputedStyle(node, null);

		if (style.height !== node.style.height) {
			if (this.overflowY !== 'visible') {
				this._changeOverflow('visible');
			}
		} else {
			if (this.overflowY !== 'hidden') {
				this._changeOverflow('hidden');
			}
		}

		if (startHeight !== node.style.height) {
			const evt = document.createEvent('Event');
			evt.initEvent('autosize:resized', true, false);
			node.dispatchEvent(evt);
		}
	}

	_resize() {
		const node = this.refs.autoresize_ta;
		const htmlTop = window.pageYOffset;
		const bodyTop = document.body.scrollTop;
		const originalHeight = node.style.height;

		node.style.height = 'auto';

		let endHeight = node.scrollHeight + this.heightOffset;

		if (node.scrollHeight === 0) {
			// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
			node.style.height = originalHeight;
			return;
		}

		node.style.height = endHeight+'px';

		// used to check if an update is actually necessary on window.resize
		this.clientWidth = node.clientWidth;

		// prevents scroll-position jumping
		document.documentElement.scrollTop = htmlTop;
		document.body.scrollTop = bodyTop;
	}

	_changeOverflow(value) {
		const node = this.refs.autoresize_ta;
		{
			// Chrome/Safari-specific fix:
			// When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
			// made available by removing the scrollbar. The following forces the necessary text reflow.
			const width = node.style.width;
			
			node.style.width = '0px';
			// Force reflow:
			/* jshint ignore:start */
			node.offsetWidth;
			/* jshint ignore:end */
			node.style.width = width;
		}

		this.overflowY = value;

		if (this.state.setOverflowY) {
			node.style.overflowY = value;
		}

		this._resize();
	}

	//分发销毁事件
	_destroy(node) {
		if(!(node && node.nodeName && node.nodeName === 'TEXTAREA')) {
			return;
		}
		const event = document.createEvent('Event');
		event.initEvent('autoresize:destroy', true, false);
		node.dispatchEvent(event);
	}

	//分发更新事件
	_update(node) {
		if(!(node && node.nodeName && node.nodeName === 'TEXTAREA')) {
			return;
		}
		const event = document.createEvent('Event');
		event.initEvent('autoresize:update', true, false);
		node.dispatchEvent(event);
	}

  render() {
  	return (
  		<textarea ref="autoresize_ta">
  			{this.props.children}
  		</textarea>
  	);
  }

  componentDidMount() {
  	let self = this;
  	const node = self.refs.autoresize_ta;
  	self.clientWidth = node.clientWidth;

  	self._init();
  	self._changeOverflow();
  	self._resize();
  	self._updateNode();

  	const pageResize = () => {
  		if(node.clientWidth !== self.clientWidth) {
  			self._updateNode();
  		}
  	}

  	const destroy = function(style){
  		window.removeEventListener('resize', pageResize, false);
			node.removeEventListener('input', self._updateNode, false);
			node.removeEventListener('keyup', self._updateNode, false);
			node.removeEventListener('autosize:destroy', self._destroy, false);
			node.removeEventListener('autosize:update', self._update, false);

			Object.keys(style).forEach(key => {
				node.style[key] = style[key];
			});
  	}.bind(node, {
  		height: node.style.height,
			resize: node.style.resize,
			overflowY: node.style.overflowY,
			overflowX: node.style.overflowX,
			wordWrap: node.style.wordWrap
  	});

  	node.addEventListener('autosize:destroy', this._destroy, false);

		// IE9 does not fire onpropertychange or oninput for deletions,
		// so binding to onkeyup to catch most of those events.
		// There is no way that I know of to detect something like 'cut' in IE9.
		if ('onpropertychange' in node && 'oninput' in node) {
			node.addEventListener('keyup', self._updateNode, false);
		}

		window.addEventListener('resize', pageResize, false);
		node.addEventListener('input', self._updateNode, false);
		node.addEventListener('autosize:update', self._update, false);
		

		if (this.state.setOverflowX) {
			node.style.overflowX = 'hidden';
			node.style.wordWrap = 'break-word';
		}

		self._init();


  	// self.autoresize = (el, options) => {
  	// 	if(el) {
  	// 		Array.prototype.forEach.call(el.length ? el : [el], x => assign(x, options));
  	// 	}
  	// 	return el;
  	// }

  	//绑定当前Node destroy事件
  	node.destroy = () => {
  		node._bind('_destroy');
  	}

  	//绑定当前Node update事件
  	node.update = () => {
  		node._bind('_update');
  	}


  }
}

export default AutoresizeTextarea

