"use strict"
let todoList = [];

let initList = function() {
    let savedList = window.localStorage.getItem("todos");
    if (savedList != null)
        todoList = JSON.parse(savedList);
    else

    todoList.push(
        {
            title: "Learn JS",
            description: "Create a demo application for my TODO's",
            place: "445",
            category: '',
            dueDate: new Date(2024,10,16)
        },
        {
            title: "Lecture test",
            description: "Quick test from the first three lectures",
            place: "F6",
            category: '',
            dueDate: new Date(2024,10,17)
        }
    );
}

let req = new XMLHttpRequest();

req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
        todoList = JSON.parse(req.responseText).record;
    }
};

req.open("GET", "https://api.jsonbin.io/v3/b/670e8e51ad19ca34f8b8fcf1/latest", true);
req.setRequestHeader("X-Master-Key", "$2a$10$HWwe59drZdjTP0eVeMJF1eFkJcfj4uDzHg7xVcVl34ptEHVxpVTT.");
req.send();

//initList();

let updateTodoList = function() {
    let todoListDiv =
        document.getElementById("todoListView").getElementsByTagName("tbody")[0];

    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    let filterInput = document.getElementById("inputSearch");
    for (let todo of todoList) {
        if (
            (filterInput.value == "") ||
            (todo.title.includes(filterInput.value)) ||
            (todo.description.includes(filterInput.value))
        ) {
            let newRow = todoListDiv.insertRow();

            let titleCell = newRow.insertCell(0);
            let descriptionCell = newRow.insertCell(1);
            let placeCell = newRow.insertCell(2);
            let dueDateCell = newRow.insertCell(3);
            let actionCell = newRow.insertCell(4);

            titleCell.textContent = todo.title;
            descriptionCell.textContent = todo.description;
            placeCell.textContent = todo.place;
            dueDateCell.textContent = new Date(todo.dueDate).toLocaleDateString();

            let newDeleteButton = document.createElement("input");
            newDeleteButton.type = "button";
            newDeleteButton.value = "x";
            newDeleteButton.addEventListener("click",
                function() {
                    deleteTodo(todo);
                });

            actionCell.appendChild(newDeleteButton);
        }
    }
}

setInterval(updateTodoList, 1000);

let deleteTodo = function(index) {
    todoList.splice(index,1);
    updateJSONbin();
}

let addTodo = function() {
    let inputTitle = document.getElementById("inputTitle");
    let inputDescription = document.getElementById("inputDescription");
    let inputPlace = document.getElementById("inputPlace");
    let inputDate = document.getElementById("inputDate");
    let newTitle = inputTitle.value;
    let newDescription = inputDescription.value;
    let newPlace = inputPlace.value;
    let newDate = new Date(inputDate.value);
    let newTodo = {
        title: newTitle,
        description: newDescription,
        place: newPlace,
        category: '',
        dueDate: newDate
    };
    todoList.push(newTodo);

    window.localStorage.setItem("todos", JSON.stringify(todoList));

    updateJSONbin();
}

let updateJSONbin = function() {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            console.log(req.responseText);
        }
    };

    req.open("PUT", "https://api.jsonbin.io/v3/b/670e8e51ad19ca34f8b8fcf1", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", "$2a$10$HWwe59drZdjTP0eVeMJF1eFkJcfj4uDzHg7xVcVl34ptEHVxpVTT.");
    req.send(JSON.stringify(todoList));
}