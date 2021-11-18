const root = document.getElementById("root");

fetch("./students.json")
  .then((response) => response.json())
  .then((response) =>
    localStorage.setItem("students", JSON.stringify(response))
  )
  .then(displayStudent(localStorage.getItem("students")))
  .catch((err) => alert(err));

function displayStudent(students) {
  JSON.parse(students).forEach((student) => {
    let parents = [];
    Object.keys(student).forEach((key) => {
      if (key === "parents") {
        parents = displayParent(student[key]);
      }
    });
    this.root.innerHTML += renderSingleStudent(student, parents);
    checkChange(student.guid)
  });
  
}
function checkChange(guid){
  document.getElementById(guid).addEventListener("input", function() {
    console.log("input event fired");
  }, false);
}

function renderSingleStudent(student, parents) {
  
  return `<details class="student" id="${
    student.guid
  }"><summary class="name"><span>${
    student.name
  }</span></summary><p>Email: <span class="email" onclick="saveEdits(${student.name}email)">${
    student.email
  }</span></p><p>Section: <span class="section">${
    student.section
  }</span></p><p>Grade: <span >${
    student.grade
  }</span></p><h3>${
    parents.length ? "Parents" : "No parents registered"
  }</h3>${parents}<button onclick="makeEditable('${student.guid}')">Edit</button></details>`;
}

function displayParent(parents) {
  let results = [];
  if (!parents) {
    return [];
  } else if (parents.constructor.name === "Array") {
    parents.forEach((parent) => {
      results += renderSingleParent(parent);
    });
  } else {
    results += renderSingleParent(parents);
  }
  return results;
}

function renderSingleParent(parent) {
  return `<details class="parent"><summary>${parent.name}</summary><p>Email: ${parent.email}</p><p>Phone: ${parent.phone}</p></details>`;
}

function makeEditable(guid) {
  let editBtn = document.getElementById(guid).getElementsByTagName('button');
  let editables = document.getElementById(guid).getElementsByTagName('span')

  console.log(typeof editables)
    if (!editables[0].isContentEditable) {
      Object.keys(editables).forEach((key) => {
        editables[key].contentEditable = 'true';
      });
    } else {
      Object.keys(editables).forEach((key) => {
        editables[key].contentEditable = 'false';
      });
    }
}



function saveEdits(id) {
  document.getElementById(id).addEventListener("input", function() {
    console.log("input event fired");
  }, false);
}

function checkEdits(person) {
  // console.log('checkEdit', person)
  if (localStorage.getItem(person.name) != null) {
    document.getElementById(person).innerHTML = localStorage[person];
  }
}

