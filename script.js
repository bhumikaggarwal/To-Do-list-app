const openTaskFormBtn = document.getElementById("open-task-form-btn");
const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-form-btn");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const cancelBtn = document.getElementById("close-button");
const discardBtn = document.getElementById("discard-button");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const tasksContainer = document.getElementById("tasks-container");

const taskData = JSON.parse(localStorage.getItem("data")) || [];       
/*This array will store all the tasks along with their associated data,
 including title, due date, and description. This storage will enable us to keep 
 track of tasks,display them on the page, and save them to localStorage  */

let currentTask = {};
/*This variable will be used to track the state 
when editing and discarding tasks.*/
if (taskData.length) {
    updateTaskContainer();
  }
  
openTaskFormBtn.addEventListener("click",() => {
    taskForm.classList.toggle("hidden")
});
closeTaskFormBtn.addEventListener("click",() => {
 const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value
 const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

 if(formInputsContainValues && formInputValuesUpdated){
    confirmCloseDialog.showModal();
  }else{
    reset();
  } ;
});
/*The HTML dialog element has a showModal() method 
that can be used to present a modal dialog box on a web page.*/
cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

/*The HTML dialog element has a close() method 
that can be used to close a modal dialog box on a web page.*/
discardBtn.addEventListener("click" , () => {
confirmCloseDialog.close();
reset();
});
//TILL HERE WE WORKED ON OPENING AND CLOSING THE MODAL.

//NOW WE WILL UPDATE OUR INPUT FIELDS ENTRY INTO TASKDATA AND MAKE THEM AVAILABLE ON LOCAL STORAGE

taskForm.addEventListener("submit", (e) => {
    e.preventDefault()
    addOrUpdateTask();
});
    
//to clear the input fields automatically
    const reset = () => {
        addOrUpdateTaskBtn.innerText = "Add Task";
        titleInput.value = "";
        dateInput.value = "";
        descriptionInput.value = "";
        taskForm.classList.toggle("hidden");
        currentTask = {}
        
      }


const addOrUpdateTask = () => {
    const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
    const taskObj = {
        id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
        title: titleInput.value,
        date: dateInput.value,
        description: descriptionInput.value,
      };
    
       if (dataArrIndex === -1) {
        taskData.unshift(taskObj);
      }else{
        taskData[dataArrIndex] = taskObj ;
      }
      localStorage.setItem("data",JSON.stringify(taskData));
      updateTaskContainer();
      reset();

    };

    const updateTaskContainer = () => {
        tasksContainer.innerHTML = "";
        taskData.forEach(({id,title,date,description}) => {
            tasksContainer.innerHTML += `
                   <div class="task" id="${id}">
                   <p><strong>Title:</strong>${title}</p>
                   <p><strong>Date:</strong>${date}</p>
                   <p><strong>Description:</strong>${description}</p>
                   <button class="button" id="btn" onclick="editTask(this)">Edit</button>
                   <button class="button" id="btn" onclick="deleteTask(this)">Delete</button>
                   </div>                  
            `});
        };
    const deleteTask = (buttonEl) => {
        const dataArrIndex = taskData.findIndex((item) => 
            {item.id === buttonEl.parentElement.id}
    );
    buttonEl.parentElement.remove();
    taskData.splice(dataArrIndex,1);
    localStorage.setItem("data",JSON.stringify(taskData));

    }

    const editTask = (buttonEl) => {
        const dataArrIndex = taskData.findIndex(
        (item) => item.id === buttonEl.parentElement.id
      );
    
      currentTask = taskData[dataArrIndex];
    
      titleInput.value = currentTask.title;
      dateInput.value = currentTask.date;
      descriptionInput.value = currentTask.description;
      addOrUpdateTaskBtn.innerText = "Update Task";
      taskForm.classList.toggle("hidden");
      
    }