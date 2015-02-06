// TodoStore definition.
// Flux stores house application logic and state that relate to a specific domain.
// The store responds to relevant events emitted by the flux dispatcher.
// The store emits change events to any listening views, so that they may react
// and redraw themselves.
'use strict';

import Riot from 'riot';

export default function TodoStore(dispatcher) {
  const LOCALSTORAGE_KEY = 'riot-todo';
  Riot.observable(this); // Riot provides our event emitter.
  var self = this;
  this.CHANGED_EVENT = 'CHANGED_EVENT';
  var json = window.localStorage.getItem(LOCALSTORAGE_KEY);
  this.todos = (json && JSON.parse(json)) || [];
  this.dispatcher = dispatcher;

  this.changed = function() {
    // Brute force update all.
    window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.todos));
    this.trigger(this.CHANGED_EVENT);
  };

  // Event handlers.
  self.on(dispatcher.ADD_TODO, function(todo) {
    self.todos.push(todo);
    self.changed();
  });

  self.on(dispatcher.TOGGLE_TODO, function(todo) {
    todo.done = !todo.done;
    self.changed();
  });
  self.on(dispatcher.CLEAR_TODOS, function() {
    self.todos = self.todos.filter(todoItem => !todoItem.done);
    self.changed();
  });

  self.on(dispatcher.INIT_TODOS, function() {
    self.changed();
  })


}
