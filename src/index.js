/*
 Simple Todo app. Port of React/Flux Todo app https://github.com/srackham/flux-backbone-todo
 I did this to compare Riot with React.
 */
'use strict';

import riot from 'riot';
import TodoStore from './todo-store.js';
import dispatcher from './dispatcher.js';
import './tags.tag'

let todoStore = new TodoStore(dispatcher);
dispatcher.addStore(todoStore);
riot.mount('todo-app', {store: todoStore});
