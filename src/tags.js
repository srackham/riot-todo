import riot from 'riot';

riot.tag('todo-app',

  `<h3>Todos</h3>
   <todo-form store="{opts.store}"></todo-form>
   <todo-list store="{opts.store}"></todo-list>
   <p>
     Want a second fully synchronized list? Just declare another list component:
     no code required, no events to wire up!
   </p>
   <todo-list store="{opts.store}"></todo-list>`,

  function(opts) {
    let dispatcher = this.opts.store.dispatcher;
    this.on('mount', () => dispatcher.trigger(dispatcher.INIT_TODOS));
  }

);


riot.tag('todo-form',

  `<form onsubmit="{add}">
     <input name="input" type="text" placeholder="New Todo" autofocus="true">
     <input type="submit" value="Add Todo">
   </form>
   <button onclick="{clear}">Clear Completed</button>`,

  function(opts) {
    let store = this.opts.store;
    let dispatcher = store.dispatcher;

    this.add = (e) => {
      if (this.input.value) {
        dispatcher.trigger(dispatcher.ADD_TODO, {title: this.input.value, done: false});
        this.input.value = ''
      }
    };

    this.clear = (e) => {
      dispatcher.trigger(dispatcher.CLEAR_TODOS);
    };
  }

);


riot.tag('todo-list',

  `<ul>
     <li each="{todo in opts.store.todos}">
       <todo-item store="{parent.opts.store}" todo="{todo}">
     </li>
   </ul>`,

  function(opts) {
    let store = this.opts.store;
    store.on(store.CHANGED_EVENT, () => this.update());
  }

);


riot.tag('todo-item',

  `<span class="{done: opts.todo.done}" onclick="{toggle}">
     {opts.todo.title}
   </span>`,

  function(opts) {
    let dispatcher = this.opts.store.dispatcher;

    this.toggle = () => {
      dispatcher.trigger(dispatcher.TOGGLE_TODO, opts.todo);
    }
  }

);
