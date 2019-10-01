const express = require("express");
const app = express();

const { mongoose } = require("./db/mongoose");

const bodyParser = require("body-parser");

// Load in the mongoose models
const { List, Task } = require("./db/models");

// Load middleware
app.use(bodyParser.json());

// CORS HEADERS MIDDLEWARE
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/* ROUTE HANDLERS */

/* LIST HANDLERS */

/**
 * GET /lists
 * Purpose: Get all lists
 */

app.get("/lists", (req, res) => {
  // Return an array of all the lists in the database
  List.find({}).then(lists => {
    res.send(lists);
  });
});

/**
 * POST /lists
 * Purpose: Create a list
 */
app.post("/lists", (req, res) => {
  // Create a new list and return the new list document back to the user (which includes the id)
  // The list information (fields) will be passed in via the JSON request body
  let title = req.body.title;

  let newList = new List({
    title
  });
  newList.save().then(listDoc => {
    // the full list document is returned (including id)
    res.send(listDoc);
  });
});

/**
 * PATH /lists/:id
 * Purpose: Update a specified list
 */
app.patch("/lists/:id", (req, res) => {
  // Update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
  List.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body
    }
  ).then(() => {
    res.sendStatus(200);
  });
});

/**
 * DELETE /lists/:id
 * Purpose: Delete a list
 */
app.delete("/lists/:id", (req, res) => {
  // Delete the specified list (document with id in the URL)
  List.findOneAndRemove({
    _id: req.params.id
  }).then(removedListDoc => {
    res.send(removedListDoc);
  });
});

/**
 * GET /lists/:listId/tasks
 * Purpose: Get all tasks in a specific list
 */

app.get("/lists/:listId/tasks", (req, res) => {
  // Return all tasks that belong to a specific list (specified by listId)
  Task.find({
    _listId: req.params.listId
  }).then(tasks => {
    res.send(tasks);
  });
});

/**
 * GET /lists/:listId/tasks/:taskId
 * Purpose: Get single task from a specific list
 */

app.get("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findOne({
    _id: req.params.taskId,
    _listId: req.params.listId
  }).then(task => {
    res.send(task);
  });
});

/**
 * POST /lists/:listId/tasks
 * Purpose: Create a new task in a specific list
 */
app.post("/lists/:listId/tasks", (req, res) => {
  // Create a new task in a list specified by listId
  let newTask = new Task({
    title: req.body.title,
    _listId: req.params.listId
  });
  newTask.save().then(newTaskDoc => {
    res.send(newTaskDoc);
  });
});

/**
 * PATCH /lists/:listId/tasks/:taskId
 * Purpose: Update an existing task
 */
app.patch("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findOneAndUpdate(
    {
      _id: req.params.taskId,
      _listId: req.params.listId
    },
    {
      $set: req.body
    }
  ).then(() => {
    res.sendStatus(200);
  });
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete a task
 */
app.delete("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findOneAndRemove({
    _id: req.params.taskId,
    _listId: req.params.listId
  }).then(removedTaskDoc => {
    res.send(removedTaskDoc);
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
