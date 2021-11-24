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
      parents = displayParent(student[key]);
    }
  });
  this.root.innerHTML += renderSingleStudent(student, parents);
}

function renderSingleStudent(student, parents) {
  return `<details class="student-card" id="${
    student.guid
  }"><summary class="student name"><span data-type="name">${
    student.name
  }</span></summary><p>Email: <span class="student email" data-type="email">${
    student.email
  }</span></p><p>Section: <span class="student section" data-type="section">${
    student.section
  }</span></p><p>Grade: <span class="student grade" data-type="grade">${
    student.grade
  }</span></p><button onclick="makeEditable('${
    student.guid
  }', 'student')">Edit</button><h3>${
    parents.length ? "Parents" : "No parents registered"
  }</h3>${parents}</details>`;
}

function displayParent(parents) {
  let results = [];
  if (!parents) {
    return [];
  } else if (parents.constructor.name === "Array") {
    parents.forEach((parent) => {
      //localStorage.setItem(parent.guid, JSON.stringify(parent));
      results += renderSingleParent(parent); 
    });
  } else {
    //localStorage.setItem(parents.guid, JSON.stringify(parents));
    results += renderSingleParent(parents);
  }
  return results;
}

function renderSingleParent(parent) {
  return `<details class="parent-card" id="${parent.guid}"><summary><span class="parent name" data-type="name">${parent.name}</span></summary><p>Email: <span class="parent email" data-type="email">${parent.email}</span></p><p>Phone: <span class="parent phone" data-type="phone">${parent.phone}</span></p> <button onclick="makeEditable('${parent.guid}', 'parent')">Edit</button></details>`;
}

function makeEditable(guid, cardClass) {
  let editBtn = document.getElementById(guid).querySelector("button");
  let editables = document.getElementById(guid).getElementsByClassName(cardClass);
  for (var i = 0; i < localStorage.length; i++) {
    Object.keys(editables).forEach((key) => {
      if (!editables[key].isContentEditable) {
        editables[key].contentEditable = "true";
        editables[key].addEventListener(
          "input",
          function () {
            let person = localStorage.getItem(guid);
            let keyName = editables[key].getAttribute("data-type");
            person[keyName] = editables[key].innerHTML;
            console.log('person', person)
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
  // console.log("student", student);
  // saveChanges(guid, student)
}

function saveChanges(guid, student) {
  localStorage.setItem(guid, student);
}
