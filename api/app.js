const express = require("express");
const app = express();

/* ROUTE HANDLERS */

/* LIST HANDLERS */

/**
 * GET /lists
 * Purpose: Get all lists
 */

app.get("/lists", (req, res) => {
  // Return an array of all the lists in the database
});

/**
 * POST /lists
 * Purpose: Create a list
 */
app.post("/lists", (req, res) => {
  // Create a new list and return the new list document back to the user (which includes the id)
  // The list information (fields) will be passed in via the JSON request body
});

/**
 * PATH /lists/:id
 * Purpose: Update a specified list
 */
app.patch("list/:id", (req, res) => {
  // Update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
});

/**
 * DELETE /lists/:id
 * Purpose: Delete a list
 */
app.delete("/lists/id", (req, res) => {
  // Delete the specified list (document with id in the URL)
});
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
