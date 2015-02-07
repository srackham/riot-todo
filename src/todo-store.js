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
  this.CHANGED_EVENT = 'CHANGED_EVENT';
  let json = window.localStorage.getItem(LOCALSTORAGE_KEY);
  this.todos = (json && JSON.parse(json)) || [];
  this.dispatcher = dispatcher;

  let triggerChanged = () => {
    // Brute force update all.
    window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.todos));
    this.trigger(this.CHANGED_EVENT);
  };

  // Event handlers.
  this.on(dispatcher.ADD_TODO, (todo) => {
    this.todos.push(todo);
    triggerChanged();
  });

  this.on(dispatcher.TOGGLE_TODO, (todo) => {
    todo.done = !todo.done;
    triggerChanged();
  });

  this.on(dispatcher.CLEAR_TODOS, () => {
    this.todos = this.todos.filter(todoItem => !todoItem.done);
    triggerChanged();
  });

  this.on(dispatcher.INIT_TODOS, () => {
    triggerChanged();
  });

}
