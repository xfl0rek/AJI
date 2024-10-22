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
    let todoListDiv = document.getElementById("todoListView").getElementsByTagName("tbody")[0];

    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    let filterInput = document.getElementById("inputSearch");
    let searchTerm = filterInput.value.toUpperCase();

    let startDateInput = document.getElementById("startDate").value;
    let endDateInput = document.getElementById("endDate").value;

    let startDate = startDateInput ? new Date(startDateInput) : null;
    let endDate = endDateInput ? new Date(endDateInput) : null;

    let filteredTodos = todoList.filter((todo) => {
        let todoDate = new Date(todo.dueDate);

        let isWithinDateRange = true;
        if (startDate && todoDate < startDate) {
            isWithinDateRange = false;
        }
        if (endDate && todoDate > endDate) {
            isWithinDateRange = false;
        }

        return (
            isWithinDateRange && 
            (searchTerm === "" || 
            todo.title.toUpperCase().includes(searchTerm) || 
            todo.description.toUpperCase().includes(searchTerm))
        );
    });

    filteredTodos.forEach((todo, index) => {
        let newRow = todoListDiv.insertRow();

        let titleCell = newRow.insertCell(0);
        let descriptionCell = newRow.insertCell(1);
        let placeCell = newRow.insertCell(2);
        let categoryCell = newRow.insertCell(3);
        let dueDateCell = newRow.insertCell(4);
        let actionCell = newRow.insertCell(5);

        titleCell.textContent = todo.title;
        descriptionCell.textContent = todo.description;
        placeCell.textContent = todo.place;
        categoryCell.textContent = todo.category;
        dueDateCell.textContent = new Date(todo.dueDate).toLocaleDateString();
        actionCell.className = "text-center";

        let newDeleteButton = document.createElement("input");
        newDeleteButton.type = "button";
        newDeleteButton.value = "x";
        newDeleteButton.className = "btn btn-danger btn-sm";
        newDeleteButton.addEventListener("click", function() {
            deleteTodo(index);
        });

        actionCell.appendChild(newDeleteButton);
    });
};

setInterval(updateTodoList, 1000);

let deleteTodo = function(index) {
    todoList.splice(index,1);
    updateJSONbin();
}

let addTodo = async function() {
    let inputTitle = document.getElementById("inputTitle");
    let inputDescription = document.getElementById("inputDescription");
    let inputPlace = document.getElementById("inputPlace");
    let inputDate = document.getElementById("inputDate");

    if (inputTitle.value === "" || inputDescription.value === "" || inputPlace.value === "" || inputDate.value === "") {
        alert("Wszystkie pola muszą być wypełnione.");
        return;
    }

    let newTitle = inputTitle.value;
    let newDescription = inputDescription.value;
    let newPlace = inputPlace.value;
    let newDate = new Date(inputDate.value);

    let category = await fetchCategoryFromGroq(newTitle, newDescription);

    let newTodo = {
        title: newTitle,
        description: newDescription,
        place: newPlace,
        category: category,
        dueDate: newDate
    };

    todoList.push(newTodo);

    window.localStorage.setItem("todos", JSON.stringify(todoList));

    updateJSONbin();

    inputTitle.value = "";
    inputDescription.value = "";
    inputPlace.value = "";
    inputDate.value = "";
}

window.addTodo = addTodo;

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

import Groq from "groq-sdk";

const groq = new Groq({
    dangerouslyAllowBrowser: true,
    apiKey: "xd"
});

export async function fetchCategoryFromGroq(todoTitle, todoDescription) {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Na podstawie tytułu zadania: '${todoTitle}' i opisu: '${todoDescription}', jaką kategorię byś przypisał? Wybierz między Prywatne a Uniwersytet i odpowiedz tylko jednym słowem: Prywatne albo Uniwersytet.`,
        },
      ],
      model: "llama3-8b-8192",
    });
  
    const categoryResponse = chatCompletion.choices[0]?.message?.content || "Brak kategorii";
    return categoryResponse;
  }
