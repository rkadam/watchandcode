var todoList = {
  nextTodoIdKey: 0,
  todos: {},
  addTodo: function(todoText, key) {
    this.todos[key] = {
      todoText: todoText,
      completed: false
    };
    console.log('Total Elements in Todo List:' + Object.keys(this.todos).length);
  },
  changeTodo: function(position, todoText) {
    this.todos[position].todoText = todoText;
  },
  deleteTodo: function(position) {
    delete this.todos[position];
    console.log('Total Elements in Todo List:' + Object.keys(this.todos).length);
  },
  toggleCompleted: function(position) {
    var todo = this.todos[position];
    todo.completed = !todo.completed;
  }
};

var handlers = {
  addTodo: function() {
    var nextElementKey = todoList.nextTodoIdKey++;
    var addTodoTextInput = document.getElementById('addTodoTextInput');

    var newTodo = {
      todoText: addTodoTextInput.value,
      completed: false
    };

    todoList.addTodo(addTodoTextInput.value, nextElementKey);
    if(view.activeFilterElement && (view.activeFilterElement.getAttribute("href") !== '#/completed')){
      var newLiElement = view.createTodoElement(newTodo, nextElementKey);
      var parentUlElement = view.getFirstElementUsingClassName('todo-list');
      parentUlElement.appendChild(newLiElement);
    }

    addTodoTextInput.value = '';
  },
  changeTodo: function(position, todoText) {
    todoList.changeTodo(position, todoText);
  },
  deleteTodo: function(position) {
    todoList.deleteTodo(position);
  },
  toggleCompleted: function(todoElementPosition) {
    todoList.toggleCompleted(todoElementPosition);
  },
  toggleAll: function() {
    //todoList.toggleAll();

    var totalTodos = Object.keys(todoList.todos).length;
    // Get number of completed todos.
    var completedTodos = 0;
    for (var todo in todoList.todos) {
      if (todoList.todos[todo].completed === true) {
        completedTodos++;
      }
    }

    console.log("total Todos: " + totalTodos + " completed Todos: " + completedTodos);

    for (var todo in todoList.todos) {
      // Case 1: If everything’s true, make everything false.
      if (completedTodos === totalTodos) {
        document.getElementById('li-' + todo.toString()).className = '';
        document.getElementById('checkbox-' + todo.toString()).checked = false;
        todoList.todos[todo].completed = false;
      } else {
        // Case 2: Otherwise, make everything true.
        document.getElementById('li-' + todo.toString()).className = 'completed';
        document.getElementById('checkbox-' + todo.toString()).checked = true;
        todoList.todos[todo].completed = true;
      }
    }
  },
  getTodos: function(todoType){
    //Return all Todos of given type.
    //all - returns all available todos including completed.
    //completed - returns only completed todos
    //active - reurns only active / incomplete todos

    var todoHash = todoList.todos;

    if(todoType === 'all'){
      return todoHash;
    }

    if(todoType === 'completed'){
      var completedTodos = {};
      for(var todoKey in todoHash){
        if(todoHash[todoKey].completed){
          completedTodos[todoKey] = todoHash[todoKey];
        }
      }
      return completedTodos;
    }

    if (todoType === 'active'){
      var activeTodos = {};
      for(var todoKey in todoHash){
        if(!todoHash[todoKey].completed){
          activeTodos[todoKey] = todoHash[todoKey];
        }
      }
      return activeTodos;
    }
  },
  clearCompleted: function(){
    var todosHash = this.getTodos('completed');
    for(var todoKey in todosHash){
      //Get corresponding liElement if available in view and remove it.
      var liElement = document.getElementById('li-' + todoKey);
      if (liElement){
        liElement.parentNode.removeChild(liElement);
      }
      delete todoList.todos[todoKey];
    }
  }
};

var view = {
  //It holds active Filter element of type "All", "Active" or "Completed"
  activeFilterElement: null,

  //Creates new Todo Element.
  createTodoElement: function(toDo, nextElementIntId) {

    var liElement = document.createElement('li');
    liElement.id = 'li-' + nextElementIntId.toString();
    liElement.name = 'todoLi';
    if(toDo.completed){
      liElement.className = 'completed';
    }else{
      liElement.className = '';
    }

    var divElement = document.createElement('div');
    divElement.className = 'view'

    var checkboxElement = document.createElement('input');
    checkboxElement.type = 'checkbox';
    checkboxElement.className = 'toggle';
    checkboxElement.id = 'checkbox-' + nextElementIntId.toString();
    if(toDo.completed){
      checkboxElement.checked = true;
    }else{
      checkboxElement.checked = false;
    }

    var label = document.createElement('label');
    label.appendChild(document.createTextNode(toDo.todoText));
    var deleteButton = document.createElement('button');
    deleteButton.className = 'destroy';

    divElement.appendChild(checkboxElement);
    divElement.appendChild(label);
    divElement.appendChild(deleteButton);

    liElement.appendChild(divElement);
    return liElement;
  },
  getLiAncsetor: function(inElement) {
    //http://stackoverflow.com/questions/22119673/find-the-closest-ancestor-element-that-has-a-specific-class
    //Get Parent Li element

    while ((inElement = inElement.parentElement) && (inElement.name !== 'todoLi')) {
      //do nothing;
    }
    return inElement;
  },
  displayTodos: function(todoType){
    //This function comes in play when user click on one of these links: 'All', 'Active', 'Completed'
    var todoScopeList = handlers.getTodos(todoType);

    var ulElement = this.getFirstElementUsingClassName('todo-list');
    while (ulElement.hasChildNodes())
      ulElement.removeChild(ulElement.lastChild);

    for(var todoKey in todoScopeList){
      liElement = this.createTodoElement(todoScopeList[todoKey], todoKey);
      ulElement.appendChild(liElement);
    }
  },
  getFirstElementUsingClassName: function(className){
    var elements = document.getElementsByClassName(className);
    if (elements.length > 0){
      return elements[0];
    }

    return null;
  },
  regiserInitialListeners: function(todoUlElement, filtersUlElement) {

    todoUlElement.addEventListener('click', function(event) {
      var targetElement = event.target;
      var selectedLiElement = view.getLiAncsetor(targetElement);
      var liId = selectedLiElement.id;
      var todoKey = parseInt(liId.split('-')[1]);

      if (targetElement.className == 'destroy') {
        console.log('We should delete this element...' + selectedLiElement.id);
        handlers.deleteTodo(todoKey);
        selectedLiElement.parentNode.removeChild(selectedLiElement);
      }

      if (targetElement.className === 'toggle') {
        console.log('We should toggle this element status...' + selectedLiElement.id);
        handlers.toggleCompleted(todoKey);
        if(selectedLiElement.className === ''){
          selectedLiElement.className = 'completed';
        }
        else{
          selectedLiElement.className = '';
        }
      }
    });

    todoUlElement.addEventListener('dblclick', function(event){
      var targetElement = event.target;
      var elementType = targetElement.tagName;
      console.log("Element Type - " + elementType);
      if(elementType === 'LABEL'){
        //create a input text element so that user can update ToDo.
        var editElement = view.getFirstElementUsingClassName('edit');
        if (!editElement){
          editElement = document.createElement('input');
          editElement.type = 'text';
          editElement.className = 'edit';
          targetElement.parentNode.parentNode.appendChild(editElement);

          editElement.value = targetElement.textContent;
          targetElement.parentNode.parentNode.className= targetElement.parentNode.parentNode.className + " editing";

          editElement.addEventListener('blur', function(event){
            var targetElement = event.target;
            var liElement = targetElement.parentNode;

            //Update value of todo in our storage.
            var todoIndex = liElement.id.split('-')[1];
            handlers.changeTodo(todoIndex, targetElement.value);

            var label = liElement.getElementsByTagName('label')[0];
            label.textContent = targetElement.value;
            liElement.removeChild(targetElement);
            var liClass = '';
            if (todoList.todos[todoIndex].completed){
              liClass = 'completed '
            }
            liElement.className = liClass;
          });
        }
      }
    });

    var todoInputElement = document.getElementById("addTodoTextInput");
    todoInputElement.addEventListener("keyup", function(event) {
      event.preventDefault();
      if (event.keyCode == 13) {
        console.log("Adding new Todo here...");
        handlers.addTodo();
      }
    });

    var toggleAllElement = document.getElementById('toggleAllCheckbox');
    toggleAllElement.addEventListener("click", function(event) {
      handlers.toggleAll();
    });

    var clearCompletedButton = this.getFirstElementUsingClassName('clear-completed');
    clearCompletedButton.addEventListener("click", function(){
      handlers.clearCompleted();
    });

    filtersUlElement.addEventListener('click', function(event){
      var targetElement = event.target;
      var hrefValue = targetElement.getAttribute("href");

      if(hrefValue){

        if(hrefValue === '#/'){
          view.displayTodos('all');
        }else if(hrefValue === '#/active'){
          view.displayTodos('active');
        }
        else if(hrefValue === '#/completed'){
          view.displayTodos('completed');
        }

        var oldActiveFilterElement = view.activeFilterElement;
        if (oldActiveFilterElement){
          oldActiveFilterElement.className = '';
        }

        targetElement.className = 'selected';
        view.activeFilterElement = targetElement;
      }

    });
  }
};

var todoUlElement = view.getFirstElementUsingClassName('todo-list');
var filtersUlElement = view.getFirstElementUsingClassName('filters');
view.regiserInitialListeners(todoUlElement, filtersUlElement);

var allFilterElement = document.getElementById("all-filter");
allFilterElement.className = 'selected';
view.activeFilterElement = allFilterElement;