const fs = require("fs");
const path = require("path");
const readline = require("readline");

const filePath = path.join(__dirname, "tasks.txt");

// Create readline interface
const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});

// Load tasks from the .txt file
function loadTasks() {
   if (!fs.existsSync(filePath)) return [];
   const data = fs.readFileSync(filePath, "utf8").trim();
   return data ? JSON.parse(data) : [];
}

// Save tasks as JSON to the .txt file
function saveTasks(tasks) {
   fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), "utf8");
}

// Add a new task
function addTask() {
   rl.question("Enter task description: ", (desc) => {
      const tasks = loadTasks();
      tasks.push({ completed: false, description: desc });
      saveTasks(tasks);
      console.log("Task added successfully!");
      mainMenu();
   });
}

// View tasks
function viewTasks() {
   const tasks = loadTasks();
   if (tasks.length === 0) {
      console.log("No tasks found.");
   } else {
      console.log("\nTask List:");
      tasks.forEach((task, index) => {
         console.log(
            `${index + 1}. [${task.completed ? "Completed" : "Pending"}] ${
               task.description
            }`
         );
      });
   }
   //   mainMenu();
}

// Mark task as complete
function markTaskComplete() {
   let tasks = loadTasks();
   if (tasks.length === 0) {
      console.log("No tasks available.");
      return mainMenu();
   }

   viewTasks();
   rl.question("\nEnter task number to mark as complete: ", (num) => {
      const index = parseInt(num) - 1;
      if (index >= 0 && index < tasks.length) {
         tasks[index].completed = true;
         saveTasks(tasks);
         console.log("Task marked as complete!");
      } else {
         console.log("Invalid task number.");
      }
      mainMenu();
   });
}

// Remove a task
function removeTask() {
   let tasks = loadTasks();
   if (tasks.length === 0) {
      console.log("No tasks available.");
      return mainMenu();
   }

   viewTasks();
   rl.question("\nEnter task number to remove: ", (num) => {
      const index = parseInt(num) - 1;
      if (index >= 0 && index < tasks.length) {
         tasks.splice(index, 1);
         saveTasks(tasks);
         console.log("Task removed successfully!");
      } else {
         console.log("Invalid task number.");
      }
      mainMenu();
   });
}

// Main menu
function mainMenu() {
   console.log("\nTask Manager");
   console.log("1. Add Task");
   console.log("2. View Tasks");
   console.log("3. Mark Task as Complete");
   console.log("4. Remove Task");
   console.log("5. Exit");

   rl.question("\nChoose an option: ", (choice) => {
      switch (choice) {
         case "1":
            addTask();
            break;
         case "2":
            viewTasks();
            mainMenu();
            break;
         case "3":
            markTaskComplete();
            break;
         case "4":
            removeTask();
            break;
         case "5":
            console.log("Goodbye!");
            rl.close();
            break;
         default:
            console.log("Invalid choice, try again.");
            mainMenu();
      }
   });
}

// Start the application
mainMenu();
