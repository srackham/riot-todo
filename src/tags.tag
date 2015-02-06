<todo-app>
  <h3>Todos</h3>
  <todo-form store={opts.store}></todo-form>
  <todo-list store={opts.store}></todo-list>
  <p>
    Want a second fully synchronized list? Just declare another list component: no code required,
    no events to wire up!
  </p>
  <todo-list store={opts.store}></todo-list>

  <script>
    var dispatcher = this.opts.store.dispatcher;
    this.on('mount', function() {
      dispatcher.trigger(dispatcher.INIT_TODOS)
    });

  </script>
</todo-app>


<todo-form>
  <form onsubmit={add}>
    <input name='input' type='text' placeholder='New Todo' autofocus='true'>
    <input type='submit' value='Add Todo'>
  </form>
  <button onclick={clear}>Clear Completed</button>
  <script>

    // TODO: Don't need self because event functions are bound to 'this'.
    var self = this;
    var store = this.opts.store;
    var dispatcher = store.dispatcher;

    // this.update() called automatically after this event handler has executed.
    add(e) {
      if (self.input.value) {
        // Trigger event to all stores registered in central dispatch.
        // This allows loosely coupled stores/components to react to same events.
        dispatcher.trigger(dispatcher.ADD_TODO, { title: self.input.value, done: false });
        self.input.value = ''
      }
    }

    // this.update() called automatically after this event handler has executed.
    // But doesn't actually need to in this case.
    clear(e) {
      dispatcher.trigger(dispatcher.CLEAR_TODOS);
    }

  </script>
</todo-form>


<todo-list>
  <ul>
    <li each={opts.store.todos}>
      <todo-item store={parent.opts.store} todo={__item}>
    </li>
  </ul>

  <script>
    var self = this;
    var store = this.opts.store;
    // Register a listener for store change events.
    store.on(store.CHANGED_EVENT, function() {
      self.update()
    });
  </script>
</todo-list>


<todo-item>
  <span class={done: opts.todo.done} onclick={toggle}>
    {opts.todo.title}
  </span>

  <script>
    // Separate todo-item is probably overkill, but this is a didactic app.
    var dispatcher = this.opts.store.dispatcher;
    // this.update() called automatically after this event handler has executed.
    toggle() {
      dispatcher.trigger(dispatcher.TOGGLE_TODO, opts.todo);
    }

  </script>
</todo-item>
