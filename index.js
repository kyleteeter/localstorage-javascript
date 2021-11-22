const root = document.getElementById("root");

fetch("./students.json")
  .then((response) => response.json())
  .then((response) =>
    response.map((student) => {
      localStorage.setItem(student.guid, JSON.stringify(student));
      displayStudent(student);
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
function checkChange(guid) {
  document.getElementById(guid).addEventListener(
    "input",
    function () {
      console.log("input event fired");
    },
    false
  );
}

function renderSingleStudent(student, parents) {
  return `<details class="student" id="${
    student.guid
  }"><summary class="name"><span data-type="name">${
    student.name
  }</span></summary><p>Email: <span class="email" data-type="email">${
    student.email
  }</span></p><p>Section: <span class="section" data-type="section">${
    student.section
  }</span></p><p>Grade: <span data-type="grade">${student.grade}</span></p><h3>${
    parents.length ? "Parents" : "No parents registered"
  }</h3>${parents}<button onclick="makeEditable('${
    student.guid
  }')">Edit</button></details>`;
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
  for (var i = 0; i < localStorage.length; i++) {
    // console.log(localStorage.getItem(localStorage.key(i)));

    let editBtn = document.getElementById(guid).querySelector("button");
    let editables = document.getElementById(guid).getElementsByTagName("span");
    if (!editables[0].isContentEditable) {
      Object.keys(editables).forEach((key) => {
        editables[key].contentEditable = "true";
        editables[key].addEventListener(
          "input",
          function () {
            let student = JSON.parse(localStorage.getItem(guid));
            let keyName = editables[key].getAttribute('data-type')
            student[keyName] = editables[key].innerHTML;
            localStorage.setItem(guid, JSON.stringify(student));

          },
          false
        );
      });
      editBtn.innerHTML = "Save Changes";
    } else {
      Object.keys(editables).forEach((key) => {
        editables[key].contentEditable = "false";
      });
      editBtn.innerHTML = "Edit";
    }
  }
}
