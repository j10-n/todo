const express = require("express");
const app = express();

const { mongoose } = require("./db/mongoose");

const bodyParser = require("body-parser");

// Load in the mongoose models
const { List, Task, User } = require("./db/models");

// Load middleware
app.use(bodyParser.json());

// CORS HEADERS MIDDLEWARE
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
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
    res.send({ message: "Update Successful" });
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

/* USER ROUTES */

/**
 * POST /users
 * Purpose: Sign up
 */
app.post("/users", (req, res) => {
  // User sign up
  let body = req.body;
  let newUser = new User(body);

  newUser
    .save()
    .then(() => {
      return newUser.createSession();
    })
    .then(refreshToken => {
      // Session created successfully - refreshToken returned
      // Now generate an access auth token for the user

      return newUser.generateAccessAuthToken().then(accessToken => {
        // access auth token generated successfully, return an object containing the auth tokens
        return { accessToken, refreshToken };
      });
    })
    .then(authTokens => {
      // construct and send the repsonse to the user with their auth tokens in the header and the user object in the body
      res
        .header("x-refresh-token", authTokens.refreshToken)
        .header("x-access-token", authTokens.accessToken)
        .send(newUser);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

/**
 * POST /users/login
 * Purpose: Login
 */

app.post("/users/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findByCredentials(email, password)
    .then(user => {
      return user
        .createSession()
        .then(refreshToken => {
          // Session created successfully - refreshToken returned
          // Now generate an access auth token for the user

          return user.generateAccessAuthToken().then(accessToken => {
            // Access auth token generated successfully, now return an object containing the auth tokens
            return { accessToken, refreshToken };
          });
        })
        .then(authTokens => {
          // Now construct and send the response to the user with their auth tokens in the header and the user object in the body
          res
            .header("x-refresh-token", authTokens.refreshToken)
            .header("x-access-token", authTokens.accessToken)
            .send(user);
        });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
