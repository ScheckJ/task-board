// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  if (nextId === null) {
    nextId = 1;
  } else {
    nextId++;
  }

  localStorage.setItem("nextId", JSON.stringify(nextId));

  return nextId;
}

// Todo: create a function to create a task card
// create elements with jQuery
function createTaskCard(task) {
  // elements to create card h2 for the title, p for the content, p for the due date, div to
  const taskCard = $("<div>")
    .addClass("card w-75 task-card draggable my-3")
    .attr("data-id", task.id);
  const title = $("<h2>").addClass("card-header h4").text(task.taskName);
  const description = $("<p>").addClass("card-text").text(task.description);
  const dueDate = $("<p>").addClass("card-text").text(task.dueDate);
  const deleteBtn = $("<button>").addClass(`btn btn-danger delete`).attr("data-id", task.id).text(`Delete`);


deleteBtn.click(handleDeleteTask)

const date = dayjs(task.duedate);
const today = dayjs();
let difference = today.diff(date, 'day')

if (difference === 0 ) {
taskCard.addClass('due-today')
} else if (difference > 0) {
  taskCard.addClass('overdue');

}

  taskCard.append(title, description, dueDate, deleteBtn);
  return taskCard;
}
// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // select the elements we will need to append to
  const toDo = $("#todo-cards");
  const inProgress = $("#in-progress-cards");
  const done = $("#done-cards");

  // create a for loop that will check each item

  for (const item of taskList) {

    // create a conditional that will check the status of each item in the array to determine where the item will be appended to
    if (item.status === "to-do") {
      toDo.append(createTaskCard(item));
    } else if (item.status === "in-progress") {
      inProgress.append(createTaskCard(item));
    } else {
      done.append(createTaskCard(item));
    }
  }

  // make the cards draggable
  $('.draggable').draggable({
    snap: '#in-progress-cards, #done-cards, #todo-cards',
    snapMode: 'inner',
    stack: '.swim-lanes',
    appendTo: '.lane'
  })
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {

  const taskData = {
    id: generateTaskId(),
    taskName: $("#taskName").val(),
    description: $("#taskDescription").val(),
    dueDate: $("#dueDate").val(),
    status: "to-do",
  };

  

  taskList.push(taskData);

  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList()
  createTaskCard(taskData)
  $("#taskname").val("");
  $("#taskDescription").val("");
  $("#dueDate").val("");
  location.reload()
  return taskList;
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {

let dataId = $(this).attr('data-id');

taskList = taskList.filter(function(taskData) {
  return taskData.id !== dataId;
});
localStorage.setItem('tasks', JSON.stringify(taskList));
renderTaskList();

}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskElement = ui.draggable[0];
  const taskId = event.target.id; // Get the drop target's id
  const uniqueId = taskElement.dataset.id; // Get the unique ID from the dragged element
  const taskClass = taskElement.classList;

  // Define a map for task states and classes
  const taskStates = {
    'to-do': 'to-do',
    'in-progress': 'in-progress',
    'done': 'done',
  };

  // If the taskId is in taskStates, update the task's class and state
  if (taskStates[taskId]) {
    taskClass.remove('done', 'in-progress', 'to-do');
    taskClass.add(taskStates[taskId]);

    // Update the task's state in the task list
    for (const item of taskList) {
      if (item.id === uniqueId) {
        item.state = taskId;
        break;
      }
    }

    // Save the updated task list to localStorage
    localStorage.setItem('tasks', JSON.stringify(taskList));

    // Re-render the task list
    renderTaskList();
  }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

    renderTaskList()

  const formData = $("#formModal");
  formData.on("submit", handleAddTask);

  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop()
  });

});
