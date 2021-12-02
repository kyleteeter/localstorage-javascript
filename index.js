let getGradeElement = ["All"];
const root = document.getElementById("root");

fetch("./students.json")
  .then((response) => response.json())
  .then((response) =>
    response.map((student) => {
      if (!localStorage.getItem(student.guid)) {
        localStorage.setItem(student.guid, JSON.stringify(student));
        displayStudent(student);
      } else {
        student = localStorage.getItem(student.guid);
        displayStudent(JSON.parse(student));
      }
    })
  )
  .catch((err) => alert(err));

function displayStudent(student) {
  let parents = [];
  Object.keys(student).forEach((key) => {
    if (key === "parents") {
      parents = displayParent(student[key], student.guid);
    }
  });
  this.root.innerHTML += renderSingleStudent(student, parents);
}

function renderSingleStudent(student, parents) {
  if (student.grade != null) {
    getGradeElement.push(`${student.grade}`);
  }
  return `<details class="student-card ${student.grade} show" id="${student.guid}"><summary><span class="student name" data-type="name">${student.name}</span></summary><p>Email: <span class="student email" data-type="email">${student.email}</span></p><p>Section: <span class="student section" data-type="section">${student.section}</span></p><p>Grade: <span class="student grade" data-type="grade">${student.grade}</span></p><button onclick="makeEditable('${student.guid}', 'student')">Edit</button><h3>${parents.length ? "Parents" : "No parents registered"}</h3>${parents}</details>`;
}

function displayParent(parents, studentID) {
  let results = [];
  if (!parents) {
    return [];
  } else if (parents.constructor.name === "Array") {
    parents.forEach((parent) => {
      results += renderSingleParent(parent, studentID);
    });
  } else {
    results += renderSingleParent(parents, studentID);
  }
  return results;
}

function renderSingleParent(parent, studentID) {
  let editedParent = localStorage.getItem(parent.guid);
  if (editedParent) {
    parent = JSON.parse(editedParent);
  }
  return `<details class="parent-card" id="${parent.guid}"><summary><span class="parent name" data-type="name">${parent.name}</span></summary><p>Email: <span class="parent email" data-type="email">${parent.email}</span></p><p>Phone: <span class="parent phone" data-type="phone">${parent.phone}</span></p> <button onclick="makeEditable('${parent.guid}', 'parent', '${studentID}')">Edit</button></details>`;
}

function makeEditable(guid, cardClass, studentID) {
  let editBtn = document.getElementById(guid).querySelector("button");
  let editables = document
    .getElementById(guid)
    .getElementsByClassName(cardClass);
  Object.keys(editables).forEach((key) => {
    if (!editables[key].isContentEditable) {
      editables[key].contentEditable = "true";
      editables[key].addEventListener(
        "input",
        function () {
          let person = JSON.parse(localStorage.getItem(guid));
          if (person == null && studentID) {
            person = findParent(studentID, guid);
          }
          let keyName = editables[key].getAttribute("data-type");
          person[keyName] = editables[key].innerText;
          localStorage.setItem(guid, JSON.stringify(person));
        },
        false
      );
      editBtn.innerHTML = "Done Editing";
    } else {
      editables[key].contentEditable = "false";
      editBtn.innerHTML = "Edit";
    }
  });
}

function findParent(studentID, parentGuid) {
  let student = JSON.parse(localStorage.getItem(studentID));
  return student.parents.find((parent) => parent.guid === parentGuid);
}

function getGrades() {
  let grades = removeDuplicates(getGradeElement);
  var selectElem = document.getElementById("filterGrade");
  for (var i = 0; i < grades.length; i++) {
    var element = document.createElement("option");
    element.innerText = grades[i];
    selectElem.append(element);
  }
}

function removeDuplicates(getGradeElement) {
  getGradeElement.sort(function (a, b) {
    return b - a;
  });
  let uniqueValues = [];
  getGradeElement.forEach((element) => {
    if (!uniqueValues.includes(element)) {
      uniqueValues.push(element);
    }
  });
  return uniqueValues;
}

function showCard() {
  let selector = document.getElementById("filterGrade").value;
  let allCards = document.getElementsByClassName("student-card");
  for (var i = 0; i < allCards.length; i++) {
    if (selector === "All") {
      allCards[i].classList.replace("hide", "show");
    } else if (allCards[i].classList.contains(`${selector}`)) {
      allCards[i].classList.replace("hide", "show");
    } else {
      allCards[i].classList.replace("show", "hide");
    }
  }
}

function reset() {
  document.getElementById("filterGrade").value = "All";
  document.getElementById("filterGrade").dispatchEvent(new Event("change"));
}
