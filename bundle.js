/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 Simple Todo app. Port of React/Flux Todo app https://github.com/srackham/flux-backbone-todo
	 */
	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var riot = _interopRequire(__webpack_require__(4));
	
	var TodoStore = _interopRequire(__webpack_require__(2));
	
	var dispatcher = _interopRequire(__webpack_require__(3));
	
	__webpack_require__(1);
	
	var todoStore = new TodoStore(dispatcher);
	dispatcher.addStore(todoStore);
	riot.mount("todo-app", { store: todoStore });

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var riot = _interopRequire(__webpack_require__(4));
	
	riot.tag("todo-app", "<h3>Todos</h3>\n   <todo-form store=\"{opts.store}\"></todo-form>\n   <todo-list store=\"{opts.store}\"></todo-list>\n   <p>\n     Want a second fully synchronized list? Just declare another list component:\n     no code required, no events to wire up!\n   </p>\n   <todo-list store=\"{opts.store}\"></todo-list>", function (opts) {
	  var dispatcher = this.opts.store.dispatcher;
	  this.on("mount", function () {
	    return dispatcher.trigger(dispatcher.INIT_TODOS);
	  });
	});
	
	
	riot.tag("todo-form", "<form onsubmit=\"{add}\">\n     <input name=\"input\" type=\"text\" placeholder=\"New Todo\" autofocus=\"true\">\n     <input type=\"submit\" value=\"Add Todo\">\n   </form>\n   <button onclick=\"{clear}\">Clear Completed</button>", function (opts) {
	  var _this = this;
	  var store = this.opts.store;
	  var dispatcher = store.dispatcher;
	
	  this.add = function (e) {
	    if (_this.input.value) {
	      dispatcher.trigger(dispatcher.ADD_TODO, { title: _this.input.value, done: false });
	      _this.input.value = "";
	    }
	  };
	
	  this.clear = function (e) {
	    dispatcher.trigger(dispatcher.CLEAR_TODOS);
	  };
	});
	
	
	riot.tag("todo-list", "<ul>\n     <li each=\"{item in opts.store.todos}\">\n       <todo-item store=\"{parent.opts.store}\" todo=\"{item}\">\n     </li>\n   </ul>", function (opts) {
	  var _this = this;
	  var store = this.opts.store;
	  store.on(store.CHANGED_EVENT, function () {
	    return _this.update();
	  });
	});
	
	
	riot.tag("todo-item", "<span class=\"{done: opts.todo.done}\" onclick=\"{toggle}\">\n     {opts.todo.title}\n   </span>", function (opts) {
	  var dispatcher = this.opts.store.dispatcher;
	
	  this.toggle = function () {
	    dispatcher.trigger(dispatcher.TOGGLE_TODO, opts.todo);
	  };
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// TodoStore definition.
	// Flux stores house application logic and state that relate to a specific domain.
	// The store responds to relevant events emitted by the flux dispatcher.
	// The store emits change events to any listening views, so that they may react
	// and redraw themselves.
	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	module.exports = TodoStore;
	var Riot = _interopRequire(__webpack_require__(4));
	
	function TodoStore(dispatcher) {
	  var _this = this;
	  var LOCALSTORAGE_KEY = "riot-todo";
	  Riot.observable(this); // Riot provides our event emitter.
	  this.CHANGED_EVENT = "CHANGED_EVENT";
	  var json = window.localStorage.getItem(LOCALSTORAGE_KEY);
	  this.todos = json && JSON.parse(json) || [];
	  this.dispatcher = dispatcher;
	
	  var triggerChanged = function () {
	    // Brute force update all.
	    window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(_this.todos));
	    _this.trigger(_this.CHANGED_EVENT);
	  };
	
	  // Event handlers.
	  this.on(dispatcher.ADD_TODO, function (todo) {
	    _this.todos.push(todo);
	    triggerChanged();
	  });
	
	  this.on(dispatcher.TOGGLE_TODO, function (todo) {
	    todo.done = !todo.done;
	    triggerChanged();
	  });
	
	  this.on(dispatcher.CLEAR_TODOS, function () {
	    _this.todos = _this.todos.filter(function (todoItem) {
	      return !todoItem.done;
	    });
	    triggerChanged();
	  });
	
	  this.on(dispatcher.INIT_TODOS, function () {
	    triggerChanged();
	  });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	// RiotControl dispatcher with Todo actions and formatted as node commonjs module.
	// https://github.com/jimsparkman/RiotControl
	
	module.exports = {
	
	  // Dispatcher actions.
	  ADD_TODO: "ADD_TODO",
	  TOGGLE_TODO: "TOGGLE_TODO",
	  CLEAR_TODOS: "CLEAR_TODOS",
	  INIT_TODOS: "INIT_TODOS",
	
	  _stores: [],
	
	  addStore: function addStore(store) {
	    this._stores.push(store);
	  },
	
	  trigger: function trigger() {
	    var args = [].slice.call(arguments);
	    console.log("dispatcher: trigger: " + args);
	    this._stores.forEach(function (el) {
	      el.trigger.apply(null, args);
	    });
	  },
	
	  on: function on(ev, cb) {
	    this._stores.forEach(function (el) {
	      el.on(ev, cb);
	    });
	  },
	
	  off: function off(ev, cb) {
	    this._stores.forEach(function (el) {
	      if (cb) el.off(ev, cb);else el.off(ev);
	    });
	  },
	
	  one: function one(ev, cb) {
	    this._stores.forEach(function (el) {
	      el.one(ev, cb);
	    });
	  }
	
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* Riot v2.0.8, @license MIT, (c) 2015 Muut Inc. + contributors */
	
	;(function() {
	
	var riot = { version: 'v2.0.8', settings: {} }
	
	'use strict'
	
	riot.observable = function(el) {
	
	  el = el || {}
	
	  var callbacks = {}
	
	  el.on = function(events, fn) {
	    if (typeof fn == 'function') {
	      events.replace(/\S+/g, function(name, pos) {
	        (callbacks[name] = callbacks[name] || []).push(fn)
	        fn.typed = pos > 0
	      })
	    }
	    return el
	  }
	
	  el.off = function(events, fn) {
	    if (events == '*') callbacks = {}
	    else if (fn) {
	      var arr = callbacks[events]
	      for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
	        if (cb == fn) { arr.splice(i, 1); i-- }
	      }
	    } else {
	      events.replace(/\S+/g, function(name) {
	        callbacks[name] = []
	      })
	    }
	    return el
	  }
	
	  // only single event supported
	  el.one = function(name, fn) {
	    if (fn) fn.one = 1
	    return el.on(name, fn)
	  }
	
	  el.trigger = function(name) {
	    var args = [].slice.call(arguments, 1),
	        fns = callbacks[name] || []
	
	    for (var i = 0, fn; (fn = fns[i]); ++i) {
	      if (!fn.busy) {
	        fn.busy = 1
	        fn.apply(el, fn.typed ? [name].concat(args) : args)
	        if (fn.one) { fns.splice(i, 1); i-- }
	         else if (fns[i] !== fn) { i-- } // Makes self-removal possible during iteration
	        fn.busy = 0
	      }
	    }
	
	    return el
	  }
	
	  return el
	
	}
	;(function(riot, evt) {
	
	  // browsers only
	  if (!this.top) return
	
	  var loc = location,
	      fns = riot.observable(),
	      current = hash(),
	      win = window
	
	  function hash() {
	    return loc.hash.slice(1)
	  }
	
	  function parser(path) {
	    return path.split('/')
	  }
	
	  function emit(path) {
	    if (path.type) path = hash()
	
	    if (path != current) {
	      fns.trigger.apply(null, ['H'].concat(parser(path)))
	      current = path
	    }
	  }
	
	  var r = riot.route = function(arg) {
	    // string
	    if (arg[0]) {
	      loc.hash = arg
	      emit(arg)
	
	    // function
	    } else {
	      fns.on('H', arg)
	    }
	  }
	
	  r.exec = function(fn) {
	    fn.apply(null, parser(hash()))
	  }
	
	  r.parser = function(fn) {
	    parser = fn
	  }
	
	  win.addEventListener ? win.addEventListener(evt, emit, false) : win.attachEvent('on' + evt, emit)
	
	})(riot, 'hashchange')
	/*
	
	//// How it works?
	
	
	Three ways:
	
	1. Expressions: tmpl('{ value }', data).
	   Returns the result of evaluated expression as a raw object.
	
	2. Templates: tmpl('Hi { name } { surname }', data).
	   Returns a string with evaluated expressions.
	
	3. Filters: tmpl('{ show: !done, highlight: active }', data).
	   Returns a space separated list of trueish keys (mainly
	   used for setting html classes), e.g. "show highlight".
	
	
	// Template examples
	
	tmpl('{ title || "Untitled" }', data)
	tmpl('Results are { results ? "ready" : "loading" }', data)
	tmpl('Today is { new Date() }', data)
	tmpl('{ message.length > 140 && "Message is too long" }', data)
	tmpl('This item got { Math.round(rating) } stars', data)
	tmpl('<h1>{ title }</h1>{ body }', data)
	
	
	// Falsy expressions in templates
	
	In templates (as opposed to single expressions) all falsy values
	except zero (undefined/null/false) will default to empty string:
	
	tmpl('{ undefined } - { false } - { null } - { 0 }', {})
	// will return: " - - - 0"
	
	
	// Customizable brackets
	
	  riot.settings.brackets = '[ ]'
	  riot.settings.brackets = '<% %>'
	
	*/
	
	var tmpl = (function() {
	
	  var cache = {},
	      brackets,
	      re_expr,
	      re_vars = /("|').+?[^\\]\1|\.\w*|\w*:|\b(?:(?:new|typeof|in|instanceof) |(?:this|true|false|null|undefined)\b|function *\()|([a-z_]\w*)/gi
	              // [ 1            ][ 2  ][ 3 ][ 4                                                                                  ][ 5       ]
	              // find variable names:
	              // 1. skip quoted strings: "a b", 'a b', 'a \'b\''
	              // 2. skip object properties: .name
	              // 3. skip object literals: name:
	              // 4. skip javascript keywords
	              // 5. match var name
	
	  return function(str, data) {
	
	    // make sure we use current brackets setting
	    var b = riot.settings.brackets || '{ }'
	    if(b != brackets){
	      brackets = b.split(' ')
	      re_expr = re(/({[\s\S]*?})/)
	    }
	
	    // build a template (or get it from cache), render with data
	    // (or just test if string has expression when called w/o data)
	    return data
	      ? str && (cache[str] = cache[str] || tmpl(str))(data)
	      : re_expr.test(str)
	
	  }
	
	
	  // create a template instance
	
	  function tmpl(s, p) {
	
	    // default template string to {}
	    p = (s || brackets.join(''))
	
	      // temporarily convert \{ and \} to a non-character
	      .replace(re(/\\{/), '\uFFF0')
	      .replace(re(/\\}/), '\uFFF1')
	      
	      // split string to expression and non-expresion parts
	      .split(re_expr)
	
	    return new Function('d', 'return ' + (
	
	      // is it a single expression or a template? i.e. {x} or <b>{x}</b>
	      !p[0] && !p[2] && !p[3]
	
	        // if expression, evaluate it
	        ? expr(p[1])
	
	        // if template, evaluate all expressions in it
	        : '[' + p.map(function(s, i) {
	
	            // is it an expression or a string (every second part is an expression)
	            return i % 2
	
	              // evaluate the expressions
	              ? expr(s, 1)
	
	              // process string parts of the template:
	              : '"' + s
	
	                  // preserve new lines
	                  .replace(/\n/g, '\\n')
	
	                  // escape quotes
	                  .replace(/"/g, '\\"')
	
	                + '"'
	
	          }).join(',') + '].join("")'
	      )
	
	      // bring escaped { and } back
	      .replace(/\uFFF0/g, brackets[0])
	      .replace(/\uFFF1/g, brackets[1])
	
	    )
	
	  }
	
	
	  // parse { ... } expression
	
	  function expr(s, n) {
	    s = s
	
	      // convert new lines to spaces
	      .replace(/\n/g, ' ')
	
	      // trim whitespace, curly brackets, strip comments
	      .replace(re(/^[{ ]+|[ }]+$|\/\*.+?\*\//g), '')
	
	    // is it an object literal? i.e. { key : value }
	    return /^\s*[\w-"']+ *:/.test(s)
	
	      // if object literal, return trueish keys
	      // e.g.: { show: isOpen(), done: item.done } -> "show done"
	      ? '[' + s.replace(/\W*([\w-]+)\W*:([^,]+)/g, function(_, k, v) {
	
	          // safely execute vars to prevent undefined value errors
	          return v.replace(/\w[^,|& ]*/g, function(v) { return wrap(v, n) }) + '?"' + k + '":"",'
	
	        }) + '].join(" ")'
	
	      // if js expression, evaluate as javascript
	      : wrap(s, n)
	
	  }
	
	
	  // execute js w/o breaking on errors or undefined vars
	
	  function wrap(s, nonull) {
	    return '(function(v){try{v='
	
	        // prefix vars (name => data.name)
	        + (s.replace(re_vars, function(s, _, v) { return v ? '(d.'+v+'===undefined?window.'+v+':d.'+v+')' : s })
	
	          // break the expression if its empty (resulting in undefined value)
	          || 'x')
	
	      + '}finally{return '
	
	        // default to empty string for falsy values except zero
	        + (nonull ? '!v&&v!==0?"":v' : 'v')
	
	      + '}}).call(d)'
	  }
	
	
	  // change regexp to use custom brackets
	
	  function re(r) {
	    return RegExp(r.source
	                   .split('{').join('\\'+brackets[0])
	                   .split('}').join('\\'+brackets[1]),
	                  r.global ? 'g' : '')
	  }
	
	})()
	// { key, i in items} -> { key, i, items }
	function loopKeys(expr) {
	  var ret = { val: expr },
	      els = expr.split(/\s+in\s+/)
	
	  if (els[1]) {
	    ret.val = '{ ' + els[1]
	    els = els[0].slice(1).trim().split(/,\s*/)
	    ret.key = els[0]
	    ret.pos = els[1]
	  }
	  return ret
	}
	
	function _each(dom, parent, expr) {
	
	  remAttr(dom, 'each')
	
	  var template = dom.outerHTML,
	      prev = dom.previousSibling,
	      root = dom.parentNode,
	      rendered = [],
	      tags = [],
	      checksum
	
	  expr = loopKeys(expr)
	
	  // clean template code after update (and let walk finish it's parse)
	  parent.one('update', function() {
	    root.removeChild(dom)
	
	  }).one('mount', function() {
	    if (!hasParent(root)) root = parent.root
	
	  }).on('update', function() {
	
	    var items = tmpl(expr.val, parent)
	    if (!items) return
	
	    // object loop. any changes cause full redraw
	    if (!Array.isArray(items)) {
	      var testsum = JSON.stringify(items)
	      if (testsum == checksum) return
	      checksum = testsum
	
	      // clear old items
	      tags.map(function(tag) {
	        tag.unmount()
	      })
	
	      tags = rendered = []
	
	      items = Object.keys(items).map(function(key, i) {
	        var obj = {}
	        obj[expr.key] = key
	        obj[expr.pos] = items[key]
	        return obj
	      })
	
	    }
	
	    // unmount redundant
	    arrDiff(rendered, items).map(function(item) {
	      var pos = rendered.indexOf(item),
	          tag = tags[pos]
	
	      if (tag) {
	        tag.unmount()
	        rendered.splice(pos, 1)
	        tags.splice(pos, 1)
	      }
	    })
	
	    // mount new
	    var nodes = root.childNodes,
	        prev_index = Array.prototype.indexOf.call(nodes, prev)
	
	    arrDiff(items, rendered).map(function(item, i) {
	
	      var pos = items.indexOf(item)
	
	      if (!checksum && expr.key) {
	        var obj = {}
	        obj[expr.key] = item
	        obj[expr.pos] = pos
	        item = obj
	      }
	
	      var tag = new Tag({ tmpl: template }, {
	        before: nodes[prev_index + 1 + pos],
	        parent: parent,
	        root: root,
	        loop: true,
	        item: item
	      })
	
	      tags.splice(pos, 0, tag)
	
	    })
	
	    rendered = items.slice()
	
	  })
	
	}
	function parseNamedElements(root, tag, expressions) {
	  walk(root, function(dom) {
	    if (dom.nodeType != 1) return
	
	    each(dom.attributes, function(attr) {
	      if (/^(name|id)$/.test(attr.name)) tag[attr.value] = dom
	    })
	  })
	}
	
	function parseLayout(root, tag, expressions) {
	
	  function addExpr(dom, value, data) {
	    if (tmpl(value) || data) {
	      var expr = { dom: dom, expr: value }
	      expressions.push(extend(expr, data || {}))
	    }
	  }
	
	  walk(root, function(dom) {
	
	    var type = dom.nodeType
	
	    // text node
	    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
	    if (type != 1) return
	
	    /* element */
	
	    // loop
	    var attr = dom.getAttribute('each')
	    if (attr) { _each(dom, tag, attr); return false }
	
	    // child tag
	    var impl = tag_impl[dom.tagName.toLowerCase()]
	    if (impl) {
	      impl = new Tag(impl, { root: dom, parent: tag })
	      return false
	    }
	
	    // attributes
	    each(dom.attributes, function(attr) {
	      var name = attr.name,
	          value = attr.value
	
	      // expressions
	      var bool = name.split('__')[1]
	      addExpr(dom, value, { attr: bool || name, bool: bool })
	
	      if (bool) {
	        remAttr(dom, name)
	        return false
	      }
	
	    })
	
	  })
	
	}
	function Tag(impl, conf) {
	
	  var self = riot.observable(this),
	      expressions = [],
	      attributes = {},
	      parent = conf.parent,
	      is_loop = conf.loop,
	      root = conf.root,
	      opts = conf.opts,
	      item = conf.item
	
	  // cannot initialize twice on the same root element
	  if (!is_loop && root.riot) return
	  root.riot = 1
	
	  opts = opts || {}
	
	  extend(this, { parent: parent, root: root, opts: opts, children: [] })
	  extend(this, item)
	
	
	  // attributes
	  each(root.attributes, function(attr) {
	    var name = attr.name,
	        val = attr.value
	
	    attributes[name] = val
	
	    // remove dynamic attributes from node
	    if (val.indexOf('{') >= 0) {
	      remAttr(root, name)
	      return false
	    }
	  })
	
	  // options
	  function updateOpts() {
	    Object.keys(attributes).map(function(name) {
	      opts[name] = tmpl(attributes[name], parent || self)
	    })
	  }
	
	  updateOpts()
	
	  // child
	  parent && parent.children.push(this)
	
	  var dom = mkdom(impl.tmpl),
	      loop_dom
	
	  // named elements
	  parseNamedElements(dom, this)
	
	  this.update = function(data, init) {
	    extend(self, data)
	    extend(self, item)
	    self.trigger('update')
	    updateOpts()
	    update(expressions, self, item)
	    self.trigger('updated')
	  }
	
	  this.unmount = function() {
	
	    if (is_loop) {
	      root.removeChild(loop_dom)
	
	    } else {
	      var p = root.parentNode
	      p && p.removeChild(root)
	    }
	
	    // splice from parent.children[]
	    if (parent) {
	      var els = parent.children
	      els.splice(els.indexOf(self), 1)
	    }
	
	    self.trigger('unmount')
	
	    // cleanup
	    parent && parent.off('update', self.update)
	    mounted = false
	  }
	
	  function mount() {
	    while (dom.firstChild) {
	      if (is_loop) {
	        loop_dom = dom.firstChild
	        root.insertBefore(dom.firstChild, conf.before || null) // null needed for IE8
	
	      } else {
	        root.appendChild(dom.firstChild)
	      }
	    }
	
	    if (!hasParent(root)) self.root = root = parent.root
	
	    self.trigger('mount')
	
	    // one way data flow: propagate updates and unmounts downwards from parent to children
	    parent && parent.on('update', self.update).one('unmount', self.unmount)
	
	  }
	
	  // initialize
	  if (impl.fn) impl.fn.call(this, opts)
	
	  // layout
	  parseLayout(dom, this, expressions)
	
	  this.update()
	  mount()
	
	}
	
	
	function setEventHandler(name, handler, dom, tag, item) {
	
	  dom[name] = function(e) {
	
	    // cross browser event fix
	    e = e || window.event
	    e.which = e.which || e.charCode || e.keyCode
	    e.target = e.target || e.srcElement
	    e.currentTarget = dom
	    e.item = item
	
	    // prevent default behaviour (by default)
	    if (handler.call(tag, e) !== true) {
	      e.preventDefault && e.preventDefault()
	      e.returnValue = false
	    }
	
	    tag.update()
	  }
	
	}
	
	function insertTo(root, node, before) {
	  if (root) {
	    root.insertBefore(before, node)
	    root.removeChild(node)
	  }
	}
	
	// item = currently looped item
	function update(expressions, tag, item) {
	
	  each(expressions, function(expr) {
	    var dom = expr.dom,
	        attr_name = expr.attr,
	        value = tmpl(expr.expr, tag)
	
	    if (value == null) value = ''
	
	    // no change
	    if (expr.value === value) return
	    expr.value = value
	
	    // text node
	    if (!attr_name) return dom.nodeValue = value
	
	    // remove attribute
	    if (!value && expr.bool || /obj|func/.test(typeof value)) remAttr(dom, attr_name)
	
	    // event handler
	    if (typeof value == 'function') {
	      setEventHandler(attr_name, value, dom, tag, item)
	
	    // if- conditional
	    } else if (attr_name == 'if') {
	
	      remAttr(dom, attr_name)
	
	      var stub = expr.stub
	
	      // add to DOM
	      if (value) {
	        stub && insertTo(stub.parentNode, stub, dom)
	
	      // remove from DOM
	      } else {
	        stub = expr.stub = stub || document.createTextNode('')
	        insertTo(dom.parentNode, dom, stub)
	      }
	
	    // show / hide
	    } else if (/^(show|hide)$/.test(attr_name)) {
	      remAttr(dom, attr_name)
	      if (attr_name == 'hide') value = !value
	      dom.style.display = value ? '' : 'none'
	
	    // normal attribute
	    } else {
	      if (expr.bool) {
	        dom[attr_name] = value
	        if (!value) return
	        value = attr_name
	      }
	
	      dom.setAttribute(attr_name, value)
	    }
	
	  })
	
	}
	function each(nodes, fn) {
	  for (var i = 0; i < (nodes || []).length; i++) {
	    if (fn(nodes[i], i) === false) i--
	  }
	}
	
	function remAttr(dom, name) {
	  dom.removeAttribute(name)
	}
	
	function extend(obj, from) {
	  from && Object.keys(from).map(function(key) {
	    obj[key] = from[key]
	  })
	  return obj
	}
	
	function mkdom(template) {
	  var tag_name = template.trim().slice(1, 3).toLowerCase(),
	      root_tag = /td|th/.test(tag_name) ? 'tr' : tag_name == 'tr' ? 'tbody' : 'div'
	      el = document.createElement(root_tag)
	
	  el.stub = true
	  el.innerHTML = template
	  return el
	}
	
	function walk(dom, fn) {
	  dom = fn(dom) === false ? dom.nextSibling : dom.firstChild
	
	  while (dom) {
	    walk(dom, fn)
	    dom = dom.nextSibling
	  }
	}
	
	function arrDiff(arr1, arr2) {
	  return arr1.filter(function(el) {
	    return arr2.indexOf(el) < 0
	  })
	}
	
	// HTMLDocument == IE8 thing
	function hasParent(el) {
	  var p = el.parentNode,
	      doc = window.HTMLDocument
	
	  return p && !(doc && p instanceof doc)
	}
	
	/*
	 Virtual dom is an array of custom tags on the document.
	 Each tag stores an array of child tags.
	 Updates and unmounts propagate downwards from parent to children.
	*/
	
	var virtual_dom = [],
	    tag_impl = {}
	
	riot.tag = function(name, html, fn) {
	  tag_impl[name] = { name: name, tmpl: html, fn: fn }
	}
	
	var mountTo = riot.mountTo = function(root, tagName, opts) {
	  var impl = tag_impl[tagName], tag
	
	  if (impl) tag = new Tag(impl, { root: root, opts: opts })
	
	  if (tag) {
	    virtual_dom.push(tag)
	    return tag.on('unmount', function() {
	      virtual_dom.splice(virtual_dom.indexOf(tag), 1)
	    })
	  }
	}
	
	riot.mount = function(selector, opts) {
	  if (selector == '*') selector = Object.keys(tag_impl).join(', ')
	
	  var tags = []
	
	  each(document.querySelectorAll(selector), function(root) {
	
	    var tagName = root.tagName.toLowerCase(),
	        tag = mountTo(root, tagName, opts)
	
	    if (tag) tags.push(tag)
	  })
	
	  return tags
	}
	
	// update everything
	riot.update = function() {
	  virtual_dom.map(function(tag) {
	    tag.update()
	  })
	  return virtual_dom
	}
	
	
	// support CommonJS
	if (true)
	  module.exports = riot
	
	// support AMD
	else if (typeof define === 'function' && define.amd)
	  define(function() { return riot })
	
	// support browser
	else
	  this.riot = riot
	
	})();


/***/ }
/******/ ])
//# sourceMappingURL=bundle.js.map