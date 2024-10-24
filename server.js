const express = require("express");
const app = express();
const port = 4000;
const bodyParser = require("body-parser");

//Middleware to parse json requests
app.use(bodyParser.json());

//Task list
let tasks = [];

//Function to execute tasks
const executeTask = (task) => {
  console.log(`Executing task: ${task.name}`);
  //Add your task execution logic here
};

//Schedule tasks
const scheduleTasks = () => {
  tasks.forEach((task) => {
    setTimeout(() => {
      executeTask(task);
    }, task.schedule);
  });
};

//Route to add a new task
app.post("/task", (req, res) => {
  const { name, schedule, description } = req.body;
  if (!name || !schedule) {
    return res.status(400).send("Both name and schedule are required");
  }
  const task = {
    id: tasks.length + 1,
    name,
    schedule,
    description,
  };
  tasks.push(task);
  res.status(201).json(task);
});

//Route to edit a task
app.put("/task/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const { name, schedule, description } = req.body;
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).send("Task not found");
  }
  if (!name || !schedule) {
    return res.status(400).send("Both name and schedule are required");
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    name,
    schedule,
    description,
  };
  res.json(tasks[taskIndex]);
});

//Route to delete a task
app.delete("/task/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).send("Task not found");
  }
  const deletedTask = tasks.splice(taskIndex, 1);
  res.json(deletedTask[0]);
});

//Route to get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

//Route to get a task by ID
app.get("/task/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).send("Task not found");
  }
});

//start the scheduler
scheduleTasks();

//start the server
app.listen(port, () => {
  console.log(`Task scheduler app listening at http://localhost:${port}`);
});
