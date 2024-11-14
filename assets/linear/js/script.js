const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
var flag = false;

var novalue1 = false;
var novalue2 = false;
document.getElementById("selectGraph").disabled = true;
document.getElementById("check").disabled = true;

document.getElementById("notify").innerHTML = "Click on Set Length";
// document.getElementById("notify1").innerHTML =
//   "1) Set length and values and check for the correctness. Check the control section for all step by step instructions. Follow the instructions properly to complete the experiment.";
// new try
const instructions = [
  "1) Set length and values and check for the correctness.",
  "2) Check the control section for all step by step instructions.",
  "3) Follow the instructions properly to complete the experiment."
];

function displayInstructions(instructions) {
  let displayText = "";
  for (let i = 0; i < instructions.length; i++) {
    displayText += instructions[i] + "<br>"; // Adding <br> for a new line
  }
  document.getElementById("notify1").innerHTML = displayText;
}

// Call the function to display instructions
displayInstructions(instructions);

// end try
const setbtn = document.getElementById("len");
setbtn.onclick = setlength;

//not a number
function validateInput(event) {
  const input = event.target;
  const value = input.value;

  // Check if the input is not a number
  if (isNaN(value)) {
    document.getElementById("notify").innerHTML = "Provide numerical value";
    input.value = ""; // Clear the input field
  }
}
function setlength() {
  document.getElementById("notify").innerHTML =
    "Provide the length of x[n] and h[n] sequences and click on Set Values";
  $("#lengthSpinner").spinner("enable");
  $("#lengthSlider").slider("enable");
  $("#dampSpinner").spinner("enable");
  $("#dampSlider").slider("enable");
  document.getElementById("val").disabled = false;
  document.getElementById("variableSection").style.display = "none";
  document.getElementById("variable1Section").style.display = "none";
  xValuesResult.style.display = "none";
  hValuesResult.style.display = "none";
  yValuesResult.style.display = "none";
}

function setsequence() {
  document.getElementById("notify").innerHTML =
    "Provide the input sequences and click on Check";
  xValuesResult.style.display = "none";
  hValuesResult.style.display = "none";
  yValuesResult.style.display = "none";
  document.getElementById("check").disabled = false;
  // Get the value from the lengthSpinner
  // const lengthValue = $("#lengthSpinner").spinner("value");
  // const DampValue = $("#dampSpinner").spinner("value");

  // Clear any existing text fields in the "variableSection"
  $("#variableSection").empty();
  $("#variable1Section").empty();

  const lengthValue = $("#lengthSpinner").spinner("value");
  const DampValue = $("#dampSpinner").spinner("value");
  if (DampValue > lengthValue) {
    document.getElementById("notify").innerHTML =
      "Length of x[n] should be greater then length of h[n]";
      alert("Length of x[n] should be greater then length of h[n]");
    document.getElementById("check").disabled = true;
  } else {
    // Create and append text fields based on the lengthValue
    for (let i = 0; i < lengthValue; i++) {
      const textField = document.createElement("input");
      textField.type = "text";
      textField.id = `textFieldx${i}`;
      // textField.placeholder = `Text Field ${i + 1}`;
      textField.addEventListener("input", validateInput);
      $("#variableSection").append(textField);
    }

    for (let j = 0; j < DampValue; j++) {
      const textField1 = document.createElement("input");
      textField1.type = "text";
      textField1.id = `textFieldh${j}`;
      // textField1.placeholder = `Text Field ${j + 1}`;
      textField1.addEventListener("input", validateInput);
      $("#variable1Section").append(textField1);
    }

    $("#lengthSpinner").spinner("disable");
    $("#lengthSlider").slider("disable");
    $("#dampSpinner").spinner("disable");
    $("#dampSlider").slider("disable");
    document.getElementById("variableSection").style.display = "block";
    document.getElementById("variable1Section").style.display = "block";
  }
}

document.getElementById("val").onclick = setsequence;
function checkconditions() {
  var novalue1 = false;
  var novalue2 = false;
  var i = 0;
  var j = 0;

  const textFieldsX = document.querySelectorAll('input[id^="textFieldx"]');
  const arr1 = Array.from(textFieldsX).map((textField) => textField.value);

  // Collect values from textFieldH elements
  const textFieldsH = document.querySelectorAll('input[id^="textFieldh"]');
  const arr2 = Array.from(textFieldsH).map((textField) => textField.value);

  const x = arr1;
  const h = arr2;
  const selectedGraph = document.getElementById("selectGraph");
  const optionToEnable1 = selectedGraph.querySelector('option[value="x"]');
  const optionToEnable2 = selectedGraph.querySelector('option[value="h"]');
  const optionToEnable3 = selectedGraph.querySelector('option[value="output"]');

  while (i < arr1.length) {
    console.log(arr1[i]);
    if (arr1[i] == "") {
      novalue1 = true;
      break;
    }
    i++;
  }
  while (j < arr2.length) {
    console.log(arr2[j]);
    if (arr2[j] == "") {
      novalue2 = true;
      break;
    }
    j++;
  }
  if (novalue1 && novalue2) {
    document.getElementById("notify").innerHTML =
      "Provide valid input sequences";
    document.getElementById("selectGraph").disabled = true;
    const lengthValue = $("#lengthSpinner").spinner("value");
    const DampValue = $("#dampSpinner").spinner("value");

    // Clear any existing text fields in the "variableSection"
  } else if (novalue1 && !novalue2) {
    document.getElementById("notify").innerHTML = "Provide valid x[n] sequence";
    alert("Provide valid x[n] sequence");
    document.getElementById("selectGraph").disabled = false;

    //h[n] enable
    optionToEnable2.removeAttribute("disabled");
    optionToEnable1.setAttribute("disabled", "disabled");
    optionToEnable3.setAttribute("disabled", "disabled");
    const lengthValue = $("#lengthSpinner").spinner("value");
    const DampValue = $("#dampSpinner").spinner("value");

    // Clear any existing text fields in the "variableSection"
  } else if (novalue2 && !novalue1) {
    document.getElementById("notify").innerHTML = "Provide valid h[n] sequence";

    document.getElementById("selectGraph").disabled = false;
    //x[n] enble
    optionToEnable1.removeAttribute("disabled");
    optionToEnable2.setAttribute("disabled", "disabled");
    optionToEnable3.setAttribute("disabled", "disabled");
    const lengthValue = $("#lengthSpinner").spinner("value");
    const DampValue = $("#dampSpinner").spinner("value");

    // Clear any existing text fields in the "variableSection"

    // $("#variableSection").empty();
  } else if (!novalue1 && !novalue2) {
    document.getElementById("notify").innerHTML =
      "Visualize output graph from drop down menu";
    document.getElementById("selectGraph").disabled = false;
    optionToEnable1.removeAttribute("disabled");
    optionToEnable2.removeAttribute("disabled");
    optionToEnable3.removeAttribute("disabled");
  }
}

// document.getElementById("check").onclick = checkconditions;

function myfun() {
  // Collect values from textFieldX elements
  const textFieldsX = document.querySelectorAll('input[id^="textFieldx"]');
  const arr1 = Array.from(textFieldsX).map((textField) => textField.value);

  // Collect values from textFieldH elements
  const textFieldsH = document.querySelectorAll('input[id^="textFieldh"]');
  const arr2 = Array.from(textFieldsH).map((textField) => textField.value);

  // Convert arr1 and arr2 to comma-separated strings
  // const inp1 = arr1.join(",");
  // const inp2 = arr2.join(",");

  // // Log the comma-separated strings
  // console.log("Values from textFieldX (inp1):", inp1);
  // console.log("Values from textFieldH (inp2):", inp2);

  const x = arr1;
  const h = arr2;
  console.log(arr1);
  // const x = document.getElementById("inputX").value.split(",").map(Number);
  // const h = document.getElementById("inputH").value.split(",").map(Number);

  const convolutionResult = [];

  for (let n = 0; n < x.length + h.length - 1; n++) {
    convolutionResult[n] = 0;
    for (
      let k = Math.max(0, n - h.length + 1);
      k <= Math.min(n, x.length - 1);
      k++
    ) {
      convolutionResult[n] += x[k] * h[n - k];
    }
  }

  const xValues = Array.from({ length: convolutionResult.length }, (_, i) => i);

  const selectedGraph = document.getElementById("selectGraph").value;
  let trace;
  let lines = [];
  if (selectedGraph === "refresh") {
    xValuesResult.style.display = "none";
    hValuesResult.style.display = "none";
    yValuesResult.style.display = "none";
  }
  if (selectedGraph === "x") {
    document.getElementById("notify1").innerHTML = "";
    trace = {
      x: xValues,
      y: x,
      type: "scatter",
      mode: "markers",
      marker: { color: "blue" },
    };

    lines = x.map((value, index) => ({
      x: [index, index],
      y: [0, value],
      type: "scatter",
      mode: "lines",
      line: { color: "blue" },
      showlegend: false,
    }));
    const layout = {
      title: "x[n] graph visualization",
      xaxis: { title: "n" },
      yaxis: { title: "Amplitude" },
    };
    const config = {
      modeBarButtonsToRemove: [
        "zoom2d",
        "pan2d",
        "select2d",
        "lasso2d",
        "resetScale2d",
        "autoScale2d",
        "compareDataOnHover",
        "toggleSpikelines",
      ],
    };
    Plotly.newPlot("convolutionChart", [trace, ...lines], layout, config);
    const xValuesResult = document.getElementById("xValuesResult");
    xValuesResult.style.display = "block";
    xValuesResult.textContent = `x[n] sequence: ${x.join(", ")}`;
    const hValuesResult = document.getElementById("hValuesResult");
    const yValuesResult = document.getElementById("yValuesResult");
    hValuesResult.style.display = "none";
    yValuesResult.style.display = "none";
  } else if (selectedGraph === "h") {
    document.getElementById("notify1").innerHTML = "";
    trace = {
      x: xValues,
      y: h,
      type: "scatter",
      mode: "markers",
      marker: { color: "green" },
    };

    lines = h.map((value, index) => ({
      x: [index, index],
      y: [0, value],
      type: "scatter",
      mode: "lines",
      line: { color: "green" },
      showlegend: false,
    }));
    const layout = {
      title: "h[n] graph visualization",
      xaxis: { title: "n" },
      yaxis: { title: "Amplitude" },
    };
    const config = {
      modeBarButtonsToRemove: [
        "zoom2d",
        "pan2d",
        "select2d",
        "lasso2d",
        "resetScale2d",
        "autoScale2d",
        "compareDataOnHover",
        "toggleSpikelines",
      ],
    };
    Plotly.newPlot("convolutionChart", [trace, ...lines], layout, config);
    const hValuesResult = document.getElementById("hValuesResult");
    const xValuesResult = document.getElementById("xValuesResult");
    hValuesResult.style.display = "block";
    const yValuesResult = document.getElementById("yValuesResult");
    hValuesResult.textContent = `h[n] sequence: ${h.join(", ")}`;
    xValuesResult.textContent = `x[n] sequence: ${x.join(", ")}`;
    yValuesResult.style.display = "none";
  } else if (selectedGraph === "output") {
    document.getElementById("notify1").innerHTML = "";
    trace = {
      x: xValues,
      y: convolutionResult,
      type: "scatter",
      mode: "markers",
      marker: { color: "red" },
    };

    lines = convolutionResult.map((value, index) => ({
      x: [index, index],
      y: [0, value],
      type: "scatter",
      mode: "lines",
      line: { color: "black" },
      showlegend: false,
    }));
    const layout = {
      title: "Output graph visualization",
      xaxis: { title: "n" },
      yaxis: { title: "Amplitude" },
    };
    const config = {
      modeBarButtonsToRemove: [
        "zoom2d",
        "pan2d",
        "select2d",
        "lasso2d",
        "resetScale2d",
        "autoScale2d",
        "compareDataOnHover",
        "toggleSpikelines",
      ],
    };
    Plotly.newPlot("convolutionChart", [trace, ...lines], layout, config);
    const yValuesResult = document.getElementById("yValuesResult");

    const hValuesResult = document.getElementById("hValuesResult");
    const xValuesResult = document.getElementById("xValuesResult");
    xValuesResult.style.display = "block";
    hValuesResult.style.display = "block";
    yValuesResult.style.display = "block";

    hValuesResult.textContent = `h[n] sequence: ${h.join(", ")}`;
    xValuesResult.textContent = `x[n] sequence: ${x.join(", ")}`;
    yValuesResult.textContent = `Linearly convolved sequence: ${convolutionResult.join(
      ", "
    )}`;
  }

  // const layout = {
  //   title: "Graph Visualization",
  //   xaxis: { title: "n" },
  //   yaxis: { title: "Amplitude" },
  // };
  // const config = {
  //   modeBarButtonsToRemove: [
  //     "zoom2d",
  //     "pan2d",
  //     "select2d",
  //     "lasso2d",
  //     "resetScale2d",
  //     "autoScale2d",
  //     "compareDataOnHover",
  //     "toggleSpikelines",
  //   ],
  // };
}

//Initialise system parameters here
function varinit() {
  varchange();
  //Variable slider and number input types
  // number initialisation : jQuery widget

  $("#lengthSlider").slider("value", 1);
  $("#lengthSlider").slider("disable");
  $("#lengthSpinner").spinner("value", 1);
  $("#lengthSpinner").spinner("disable");

  $("#dampSlider").slider("value", 1);
  $("#dampSlider").slider("disable");
  $("#dampSpinner").spinner("value", 1);
  $("#dampSpinner").spinner("disable");

  $("#CsArea").spinner("value", 0.01);
  $("#Ivalue").spinner("value", 0.01);
}

function varchange() {
  $("#lengthSlider").slider({ max: 10, min: 1, step: 1 });
  $("#lengthSpinner").spinner({ max: 10, min: 1, step: 1 });

  $("#lengthSlider").on("slide", function (e, ui) {
    $("#lengthSpinner").spinner("value", ui.value);
    time = 0;
    // varupdate();
  });
  $("#lengthSpinner").on("spin", function (e, ui) {
    $("#lengthSlider").slider("value", ui.value);
    time = 0;
    // varupdate();
  });
  $("#lengthSpinner").on("change", function () {
    varchange();
  });
  $("#lengthSpinner").on("touch-start", function () {
    varchange();
  });

  $("#dampSlider").slider({ max: 10, min: 1, step: 1 });
  $("#dampSpinner").spinner({ max: 10, min: 1, step: 1 });

  $("#dampSlider").on("slide", function (e, ui) {
    $("#dampSpinner").spinner("value", ui.value);
    time = 0;
    // varupdate();
  });
  $("#dampSpinner").on("spin", function (e, ui) {
    $("#dampSlider").slider("value", ui.value);
    time = 0;
    // varupdate();
  });
  $("#dampSpinner").on("change", function () {
    varchange();
  });
  $("#CsArea").spinner({ max: 1, min: 0.01, step: 0.0001 });
  $("#Ivalue").spinner({ max: 1, min: 0.01, step: 0.0001 });
}
// function varupdate() {
//   $("#massSpinner").spinner("value", $("#massSlider").slider("value")); //updating slider location with change in spinner(debug)
//   $("#lengthSpinner").spinner("value", $("#lengthSlider").slider("value"));
//   $("#dampSpinner").spinner("value", $("#dampSlider").slider("value"));
//   endmass = $("#massSpinner").spinner("value"); //Updating variables
//   beamlength = $("#lengthSpinner").spinner("value");
//   dampingratio = $("#dampSpinner").spinner("value");
// }

window.addEventListener("load", varinit);
