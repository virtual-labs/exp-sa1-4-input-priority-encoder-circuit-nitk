function refreshPage(e) {
  e.preventDefault();
  window.location.reload();
}

var switches = [0, 0, 0, 0],
  d = [0, 0, 0, 0],
  a = [0, 0, 0],
  fault = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  d_table = ["", "", "", ""],
  a_table = ["", "", ""];
var data = ["", "", "", "", "", "", ""];
var t_fault = [0, 0, 0];

//fault array=[d0,d1,d2,d3,a0,a1,a2, NOTD2, ANDD1&D2']

function logic() {
  //logic for d[]
  d[0] = switches[0] || fault[0];
  d[1] = switches[1] || fault[13];
  d[2] = switches[2] || fault[14];
  d[3] = switches[3] || fault[15];

  //logic for a[0]
  let bnotd2 = d[2] || fault[2];
  let notd2 = !bnotd2 || fault[9];
  let bandd1 = d[1] || fault[1];
  let andd1d2 = (notd2 && bandd1) || fault[10];
  let bord31 = d[3] || fault[6];
  a[0] = bord31 || andd1d2 || fault[12];

  //logic for a[1]
  let bord2 = d[2] || fault[5];
  let bord32 = d[3] || fault[3];
  let ord2d3 = bord2 || bord32 || fault[16];
  a[1] = ord2d3 || fault[8];

  //logic for a[2] or V
  let d1v = d[1] || fault[4];
  let d2d3v = ord2d3 || fault[7];
  a[2] = d1v || d2d3v || d[0] || fault[11];
}

function table_logic() {
  t_fault = [0, 0, 0, 0];

  a_table = [a[0], a[1], a[2]];
  if (switches[3] == 1) {
    d_table = ["X", "X", "X", "1"];
    if (!a[0]) t_fault[0] = 1;
    if (!a[1]) t_fault[1] = 1;
    if (!a[2]) t_fault[2] = 1;
  } else if (switches[2] == 1) {
    d_table = ["X", "X", "1", "0"];
    if (a[0]) t_fault[0] = 1;
    if (!a[1]) t_fault[1] = 1;
    if (!a[2]) t_fault[2] = 1;
  } else if (switches[1] == 1) {
    d_table = ["X", "1", "0", "0"];
    if (!a[0]) t_fault[0] = 1;
    if (a[1]) t_fault[1] = 1;
    if (!a[2]) t_fault[2] = 1;
  } else if (switches[0] == 1) {
    d_table = ["1", "0", "0", "0"];
    if (a[0]) t_fault[0] = 1;
    if (a[1]) t_fault[1] = 1;
    if (!a[2]) t_fault[2] = 1;
  } else {
    if (a[2]) t_fault[2] = 1;
    d_table = ["0", "0", "0", "0"];
  }
  if (a[2]) {
    a_table = [a[1], a[0], a[2]];
  } else {
    a_table = ["X", "X", 0];
  }
}

function faulta(ele, x) {
  console.log(ele);
  if (ele.classList.contains("fa-toggle-off")) {
    // ele.className.baseVal = "svg-inline--fa fa-toggle-on fa-w-18";
    // ele.className.animVal = "svg-inline--fa fa-toggle-on fa-w-18";
    ele.classList.remove("fa-toggle-off");
    ele.classList.add("fa-toggle-on");
    fault[x] = 1;
  } else {
    // ele.className.baseVal = "svg-inline--fa fa-toggle-off fa-w-18";
    // ele.className.animVal = "svg-inline--fa fa-toggle-off fa-w-18";
    ele.classList.remove("fa-toggle-on");
    ele.classList.add("fa-toggle-off");
    fault[x] = 0;
  }
  console.log(fault);
  logic();
  changeLed();
}

function dataload() {
  var n = data[0].length;
  if (n > 12) {
    data = ["", "", "", "", "", "", ""];
    n = 0;
  }
  if (n == 0) {
    data[0] += a[0].toString();
    data[1] += a[1].toString();
    data[2] += a[2].toString();
    data[3] += switches[0].toString();
    data[4] += switches[1].toString();
    data[5] += switches[2].toString();
    data[6] += switches[3].toString();
  } else {
    for (var i = 0; i < 3; i++) {
      if (data[i][n - 1] == a[i]) {
        data[i] += ".";
      } else if (data[i][n - 1] == ".") {
        for (var j = n - 2; j >= 0; j--) {
          if (data[i][j] != ".") {
            if (a[i] == data[i][j]) {
              data[i] += ".";
            } else {
              data[i] += a[i].toString();
            }
            break;
          }
        }
      } else {
        data[i] += a[i].toString();
      }
    }
    for (var i = 0; i < 4; i++) {
      if (data[i + 3][n - 1] == switches[i]) {
        data[i + 3] += ".";
      } else if (data[i + 3][n - 1] == ".") {
        for (var j = n - 2; j >= 0; j--) {
          if (data[i + 3][j] != ".") {
            if (switches[i] == data[i + 3][j]) {
              data[i + 3] += ".";
            } else {
              data[i + 3] += switches[i].toString();
            }
            break;
          }
        }
      } else {
        data[i + 3] += switches[i].toString();
      }
    }
  }
}

function changeLed() {
  for (i = 0; i < 3; i++) {
    var v = document.getElementById("led-" + (i + 1).toString());
    if (a[i] == 0) {
      v.src = "images/ledoff.png";
      v.dataset.value = 0;
    } else {
      v.src = "images/ledon.png";
      v.dataset.value = 1;
    }
  }
}

function switchClick(ele) {
  let k = Number(ele.id[ele.id.length - 1]) - 1;
  if (ele.dataset.value == 0) {
    ele.src = "images/switchon.png";
    switches[k] = 1;
    ele.dataset.value = 1;
  } else {
    ele.src = "images/switchoff.png";
    ele.dataset.value = 0;
    switches[k] = 0;
  }
  logic();
  changeLed();
}

function updateDiagram(e) {
  e.preventDefault();
  dataload();
  WaveDrom.ProcessAll();
}

function updateTable(e) {
  e.preventDefault(); // Prevent the default behavior
  table_logic();
  var tbody = document.getElementById("table-body");
  var newRow = tbody.insertRow();
  for (var j = 0; j < 4; j++) {
    var newCell = newRow.insertCell(j);
    var newText = document.createTextNode(d_table[j]);
    newCell.appendChild(newText);
  }
  for (var j = 0; j < 3; j++) {
    var newCell = newRow.insertCell(j + 4);
    if (t_fault[j]) newCell.style.backgroundColor = "#fcb1b7";
    var newText = document.createTextNode(a_table[j]);
    newCell.appendChild(newText);
  }
  updateDiagram(e);
}

function clearTable() {
  data = ["", "", "", "", "", "", ""];
  // event.preventDefault(); // Prevent the default behavior
  WaveDrom.ProcessAll();
  document.getElementById("table-body").innerHTML = "";
}

function submitAnswers() {
  var total = 5;
  var score = 0;

  // Get User Input
  var q1 = document.forms["quizForm"]["q1"].value,
    q2 = document.forms["quizForm"]["q2"].value,
    q3 = document.forms["quizForm"]["q3"].value,
    q4 = document.forms["quizForm"]["q4"].value,
    q5 = document.forms["quizForm"]["q5"].value;

  // Set Correct Answers
  var answers = ["c", "a", "d", "a", "c"];

  // Check Answers
  for (i = 1; i <= total; i++) {
    if (eval("q" + i) === answers[i - 1]) {
      document.getElementById("q" + i).style.color = "green";
      score++;
    } else document.getElementById("q" + i).style.color = "red";
  }

  // Display Results
  var results = document.getElementById("results");
  results.innerHTML =
    '<h3 class="def-heading">You scored <span>' +
    score +
    "</span> out of <span>" +
    total +
    "</span></h3>";

  return false;
}

function submitAnswers2() {
  var total = 5;
  var score = 0;

  // Get User Input
  var q1 = document.forms["quizForm"]["q1"].value,
    q2 = document.forms["quizForm"]["q2"].value,
    q3 = document.forms["quizForm"]["q3"].value,
    q4 = document.forms["quizForm"]["q4"].value,
    q5 = document.forms["quizForm"]["q5"].value;

  // Set Correct Answers
  var answers = ["c", "b", "a", "b", "b"];

  // Check Answers
  for (i = 1; i <= total; i++) {
    if (eval("q" + i) === answers[i - 1]) {
      document.getElementById("q" + i).style.color = "green";
      score++;
    } else document.getElementById("q" + i).style.color = "red";
  }

  // Display Results
  var results = document.getElementById("results");
  results.innerHTML =
    '<h3 class="def-heading">You scored <span>' +
    score +
    "</span> out of <span>" +
    total +
    "</span></h3>";

  return false;
}
