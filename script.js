//Initial References
const newTaskInput = document.querySelector("#newTaskInput");
const newTaskDate = document.querySelector("#newTaskDate");
const tasksDiv = document.querySelector("#tasks");
let deleteTasks;
let tasks;
let updateNote = "";
let count;
let errorInfo = document.querySelector(".errorInfo");
let addBtn = document.querySelector("#addBtn");
let searchBar = document.querySelector("#search-bar");
let searchBtn = document.querySelector(".searchButton");
let searchInfoArea = document.querySelector(".searchInfo");


window.onload = () => {
    updateNote = "";
    count = Object.keys(localStorage).length;
    displayTasks();
}

//Display all tasks
const displayTasks = () => {
    if (Object.keys(localStorage).length > 0) {
        tasksDiv.style.display = "inline-block";
    } else {
        tasksDiv.style.display = "none";
        errorInfo.textContent = "Brak zadan";
    }
    tasksDiv.innerHTML = "";

    let tasks = Object.keys(localStorage);
    tasks = tasks.sort();

    for (let key of tasks) {
            let classValue = "";
            //Get all values
            let value = localStorage.getItem(key);
            let taskInnerDiv = document.createElement("li");
            taskInnerDiv.classList.add("task");
            taskInnerDiv.setAttribute("id", key);
            taskInnerDiv.innerHTML = `<span id="taskName">${key.split("_")[1]}</span><span id="taskDate">${key.split("_")[2]}</span>`;
            taskInnerDiv.innerHTML += `<button class="delete"><i class="fa-solid fa-trash"></i></button>`;
            tasksDiv.appendChild(taskInnerDiv);
        }

    //Tasks Delete
    deleteTasks = document.getElementsByClassName("delete");
    Array.from(deleteTasks).forEach((element, index) => {
        element.addEventListener("click", (e) => {
            e.stopPropagation();
            //Delete from LS
            let parent = element.parentElement;
            removeTask(parent.id);
            parent.remove();
            count -= 1;
            searchBar.value = "";
        });
        errorInfo.textContent = "";

    })
}

//Remove from LS
const removeTask = (taskValue) => {
    localStorage.removeItem(taskValue);
    displayTasks();
}

//Add to LS
const updateStorage = (index, taskValue, taskDate, completed) => {
    localStorage.setItem(`${index}_${taskValue}_${taskDate}`, completed);
    displayTasks();
}

// Add new Task
const addNewTask = () => {
    if ((newTaskInput.value.length >=3) && (newTaskInput.value.length <= 255)) {
        let taskDate = Date.parse(newTaskDate.value);
        let nowDate = Date.now();

        let tmpDate = newTaskDate.value;
        //console.log(tmpDate.replace("T", " g."));

        if((taskDate >= nowDate) || (isNaN(taskDate))) {
            //Store locally and display from local storage
            if (updateNote == "") {
                //new task
                updateStorage(count, newTaskInput.value, tmpDate.replace("T", " g."), false);
            } else {
                //update task
                let existingCount = updateNote.split("_")[0];
                removeTask(updateNote);
                updateStorage(existingCount, newTaskInput.value, tmpDate.replace("T", " g."), false);
                updateNote = "";
            }
            count += 1;
            newTaskInput.value = "";
            newTaskDate.value = "";
            errorInfo.textContent = "";
        } else {
            errorInfo.textContent = "Niewlasciwa data, znajduje sie w przeszlosci";
            newTaskDate.value = "";
        }
    } else {
        if (newTaskInput.value.length < 3) {
            errorInfo.textContent = "Nic nie wpisales do ToDosa, wpisz przynajmniej 3 litery.";
        }
        if (newTaskInput.value.length > 255) {
            errorInfo.textContent = "Wpisales za duzo o " + (newTaskInput.value.length - 255) + " znakow.";
        }
        newTaskDate.value = "";
    }
}

//search Task
const searchValue = (e) => {
    searchInfoArea.textContent = "";
    const searchVal = e.target.value.toLowerCase();
    const allTasks = document.querySelectorAll('.task');
    for (let task of allTasks) {
        const item = task.textContent;
        if (searchVal.length >= 3) {
            if (item.toLowerCase().indexOf(searchVal) !== -1) {
                task.style.color = 'green';
                task.style.display = 'flex';
				task.style.fontWeight = 700;
            } else {
				task.style.color = 'red';
                task.style.display = 'flex';
            }
        } else {
            displayTasks();
        }
    }
}

//search Info
searchBtn.addEventListener('click', () => {
    setTimeout(() => {
        const box = document.querySelector('.searchInfo');
        box.style.display = 'block';
        box.textContent = "Wpisz w okno wyszukiwania przynajmniej 3 litery.";
    }, );
});

searchBtn.addEventListener('click', () => {
    setTimeout(() => {
        const box = document.querySelector('.searchInfo');
        box.style.display = 'none';
    }, 5000);
});

addBtn.addEventListener('click', addNewTask);
searchBar.addEventListener('keyup', searchValue);