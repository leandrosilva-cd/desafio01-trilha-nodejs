const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  return next();
}

app.post('/users', (request, response) => {
  const {name, username} = request.body;

  const userAlreadyExists = users.some(user => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({error: "User already exists!"});
  }

  users.push(
    {
      name,
      username,
      id: uuidv4(),
      todos: []
    }
  );

  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers;

  const user = users.find(user => user.username === username);

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  
  const {title, deadline} = request.body;
  const {username} = request.headers;
  const user = users.find(user => user.username === username);
  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }


  user.todos.push(todo);

  return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body;
  const {username} = request.headers;
  const {id} = request.params;

  const user = users.find(user => user.username === username);
  const todo = user.todos.find(todo => todo.id === id);

  todo.title = title;
  todo.deadline = deadline;
  return response.status(201).send();
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers;
  const {id} = request.params;
  const {done} = request.body;

  const user = users.find(user => user.username === username);
  const todo = user.todos.find(todo => todo.id === id);

  todo.done = done;
  return response.status(201).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers;
  const {id} = request.params;

  const user = users.find(user => user.username === username);
  const todo = user.todos.find(todo => todo.id === id);

  user.todos.splice(todo, 1);
  return response.status(201).send();
});

module.exports = app;