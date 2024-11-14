// const { NONE } = require("@jsplumb/browser-ui");

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
document.getElementById("notify1").innerHTML =
  "Click on sine generator to begin the experiment and follow the instructions given in control section. ";
// bla bla
// const image = document.getElementById("image");
// const spinnerDiv = document.getElementById("variables-sections");
// const spinners = document.querySelectorAll("#variables-sections input");
// image.addEventListener("click", function () {
//   spinnerDiv.style.display = "block";
//   spinners.forEach(spinner => {
//     spinner.disabled = false;
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("result").style.display = "none";
  const actionDropdown = document.getElementById("actionDropdown");
  const frequencyInput = document.getElementById("frequency");
  const cfrequencyInput = document.getElementById("cfrequency");
  const amplitudeInput = document.getElementById("ampInput");

  const canvascontainer = document.getElementById("canvas-container");

  actionDropdown.disabled = true;

  const imageElement = document.getElementById("image");
  const sample = document.getElementById("sampleblock");
  // Add a click event listener to the image element
  imageElement.addEventListener("click", function () {
    // Call your function when the image is clicked
    $("#frequency").spinner("enable");
    $("#dampSlider").slider("enable");
    $("#ampInput").spinner("enable");
    $("#ampSlider").slider("enable");
    $("#cfrequency").spinner("enable");
    $("#massSlider").slider("enable");
    document.getElementById("notify1").style.display = "none";
    actionDropdown.disabled = false;
    notify.innerHTML =
      "Provide initial values and select option to view signal";
  });

  // Define a function to update options based on spinner value
  function updateOptions() {
    const spinnerValue = $("#cfrequency").spinner("value");
    const optionToEnable1 = actionDropdown.querySelector(
      'option[value="generate"]'
    );
    const optionToEnable2 = actionDropdown.querySelector(
      'option[value="generate_sample"]'
    );
    const optionToEnable3 = actionDropdown.querySelector(
      'option[value="reconstruction"]'
    );

    if (spinnerValue === 0) {
      optionToEnable1.removeAttribute("disabled");
      optionToEnable2.setAttribute("disabled", "disabled");
      optionToEnable3.setAttribute("disabled", "disabled");
    } else {
      optionToEnable1.removeAttribute("disabled");
      optionToEnable2.removeAttribute("disabled");
      optionToEnable3.removeAttribute("disabled");
    }
  }

  // Attach a click event listener to actionDropdown
  actionDropdown.addEventListener("click", function () {
    // Call the updateOptions function
    updateOptions();
  });

  // Use an interval to repeatedly update options until the user clicks actionDropdown
  const updateInterval = setInterval(function () {
    if (!actionDropdown.classList.contains("open")) {
      updateOptions();
    }
  }, 1000); // Adjust the interval time as needed

  actionDropdown.addEventListener("change", function () {
    const selectedOption = actionDropdown.value;
    const resultElement1 = document.getElementById("result");
    resultElement1.textContent = "";

    if (selectedOption === "generate") {
      document.getElementById("signal-generator").style.display = "none";
      document.getElementById("result").style.display = "none";
      const frequencyInput = document.getElementById("frequency");
      const cfrequencyInput = document.getElementById("cfrequency");
      const amplitudeInput = document.getElementById("ampInput");

      const div = document.getElementById("signal-generator");
      div.style.display = "none";
      const frequency = parseFloat(frequencyInput.value);
      const ampInput = parseFloat(amplitudeInput.value);
      generateSignal(frequency, ampInput);
    } else if (selectedOption === "generate_sample") {
      document.getElementById("signal-generator").style.display = "none";
      document.getElementById("result").style.display = "none";
      const selectedOption = actionDropdown.value;
      const resultElement = document.getElementById("result");
      resultElement.textContent = "";
      const frequency = parseFloat(frequencyInput.value);
      const cfrequency = parseFloat(cfrequencyInput.value);
      const ampInput = parseFloat(amplitudeInput.value);
      generateSampleSignal(frequency, cfrequency, ampInput);
    } else if (selectedOption == "reconstruction") {
      document.getElementById("signal-generator").style.display = "none";
      notify.innerHTML = "Check the result section";
      const frequency = parseFloat(frequencyInput.value);
      const ampInput = parseFloat(amplitudeInput.value);
      const cfrequency = parseFloat(cfrequencyInput.value);
      fs = 2 * frequency;
      if (cfrequency >= fs) {
        // generateSampleSignal(frequency, cfrequency, ampInput);
        generateRSignal(frequency, cfrequency, ampInput);

        document.getElementById("result").style.display = "block";
        var resultElement = document.getElementById("result");
        resultElement.innerHTML =
          "fmax=" +
          frequency +
          "<br>2*fmax=" +
          2 * frequency +
          "<br>fs=" +
          cfrequency +
          "<br>fs >= 2*fmax" +
          "<br>Hence,the given input frequency  follows Nyquist theorem(fs>=Cf) " +
          "<br>Signal can be reconstructed";
      } else {
        generateSampleSignal(frequency, cfrequency, ampInput);
        var resultElement = document.getElementById("result");
        document.getElementById("result").style.display = "block";
        resultElement.innerHTML =
          "fmax=" +
          frequency +
          "<br>2*fmax=" +
          2 * frequency +
          "<br>fs=" +
          cfrequency +
          "<br>fs < 2*fmax" +
          "<br>Hence,the given input frequency  does not follow Nyquist theorem(fs>=Cf) " +
          "<br>Signal cannot be reconstructed";
      }
    }
  });

  //real
  function generateSignal(frequency, ampInput) {
    const samplingRate = 1000;
    const time = [];
    const signal = [];

    for (let t = 0; t <= 1; t += 1 / samplingRate) {
      time.push(t);
      signal.push(ampInput * Math.sin(2 * Math.PI * frequency * t));
    }

    // Create the Plotly chart
    const trace = {
      x: time,
      y: signal,
      mode: "lines",
      type: "scatter",
    };

    const layout = {
      title: `Input Signal for Sampling Theorem (Frequency: ${frequency} Hz, Amplitude: ${ampInput})`,
      xaxis: { title: "Time" },
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

    Plotly.newPlot("canvas-container", [trace], layout, config);
  }

  function continuousSignal(t, frequency, ampInput) {
    return ampInput * Math.sin(2 * Math.PI * frequency * t);
  }

  // function generateRSignal(frequency, cfrequency, ampInput) {
  //   const Ts = 1 / cfrequency;
  //   const nValues = [];
  //   const maxN = Math.floor(cfrequency);
  //   for (let n = 0; n <= maxN; n++) {
  //     nValues.push(n);
  //   }

  //   const timeValues = nValues.map((n) => n * Ts);
  //   const sampledSignal = timeValues.map((t) =>
  //     continuousSignal(t, frequency, ampInput)
  //   );
  //   const verticalLineTraces = nValues.map((n) => ({
  //     x: [n * Ts, n * Ts],
  //     y: [0, sampledSignal[n]],
  //     mode: "lines",
  //     type: "scatter",
  //     name: "Vertical Line",
  //     line: {
  //       color: "green",
  //     },
  //   }));

  //   const traceSampling = {
  //     x: timeValues,
  //     y: sampledSignal,
  //     mode: "lines+markers",
  //     type: "scatter",
  //     name: "Sampled Signal",
  //   };

  //   const samplingRate = 1000;
  //   const time = [];
  //   const signal = [];

  //   for (let t = 0; t <= 1; t += 1 / samplingRate) {
  //     time.push(t);
  //     signal.push(ampInput * Math.sin(2 * Math.PI * frequency * t));
  //   }

  //   // Create the Plotly chart for the original sine wave
  //   const traceOriginalSine = {
  //     x: time,
  //     y: signal,
  //     mode: "lines",
  //     type: "scatter",
  //     name: "Original Sine Wave",
  //     line: {
  //       color: "blue", // Change the color here
  //     },
  //   };

  //   const reconstructedSignal = timeValues.map((t) =>
  //     continuousSignal(t, frequency, ampInput)
  //   );

  //   // Create the Plotly chart for the reconstructed signal
  //   const traceReconstructed = {
  //     x: timeValues,
  //     y: reconstructedSignal,
  //     mode: "lines",
  //     type: "scatter",
  //     name: "Reconstructed Signal",
  //   };

  //   const layout = {
  //     title:
  //       "Signals: Original Sine Wave, Sampled Signal, Reconstructed Signal",
  //     xaxis: {
  //       title: "Time",
  //     },
  //     yaxis: {
  //       title: "Amplitude",
  //     },
  //   };

  //   const config = {
  //     modeBarButtonsToRemove: [
  //       "zoom2d",
  //       "pan2d",
  //       "select2d",
  //       "lasso2d",
  //       "resetScale2d",
  //       "autoScale2d",
  //       "compareDataOnHover",
  //       "toggleSpikelines",
  //     ],
  //   };

  //   const data = [
  //     verticalLineTraces,
  //     traceSampling,
  //     traceOriginalSine,
  //     traceReconstructed,
  //   ];
  //   Plotly.newPlot("canvas-container", data, layout, config);
  // }
  function generateRSignal(frequency, cfrequency, ampInput) {
    // const Ts = 1 / cfrequency;
    // const nValues = [];
    // const maxN = Math.floor(cfrequency);
    // for (let n = 0; n <= maxN; n++) {
    //   nValues.push(n);
    // }

    // const timeValues = nValues.map((n) => n * Ts);
    // const sampledSignal = timeValues.map((t) =>
    //   continuousSignal(t, frequency, ampInput)
    // );

    // const verticalLineTraces = nValues.map((n) => ({
    //   x: [n * Ts, n * Ts],
    //   y: [0, sampledSignal[n]],
    //   mode: "lines",
    //   type: "scatter",
    //   name: "Vertical Line",
    //   line: {
    //     color: "green",
    //   },
    // }));

    const Ts = 1 / cfrequency;
    const nValues = [];
    const maxN = Math.floor(cfrequency);
    for (let n = 0; n <= maxN; n++) {
      nValues.push(n);
    }

    const timeValues = nValues.map((n) => n * Ts);
    const sampledSignal = timeValues.map((t) =>
      continuousSignal(t, frequency, ampInput)
    );
    const verticalLineTraces = nValues.map((n) => ({
      x: [n * Ts, n * Ts],
      y: [0, sampledSignal[n]],
      mode: "lines",
      type: "scatter",
      name: "Vertical Line",
      line: {
        color: "green",
      },
    }));
    const traceSampling = {
      x: timeValues,
      y: sampledSignal,
      mode: "lines+markers",
      type: "scatter",
      name: "Sampled Signal",
    };

    const samplingRate = 1000;
    const time = [];
    const signal = [];

    for (let t = 0; t <= 1; t += 1 / samplingRate) {
      time.push(t);
      signal.push(ampInput * Math.sin(2 * Math.PI * frequency * t));
    }

    const traceOriginalSine = {
      x: time,
      y: signal,
      mode: "lines",
      type: "scatter",
      name: "Original Sine Wave",
      line: {
        color: "blue", // Change the color here
      },
    };

    const reconstructedSignal = timeValues.map((t) =>
      continuousSignal(t, frequency, ampInput)
    );

    const traceReconstructed = {
      x: timeValues,
      y: reconstructedSignal,
      mode: "lines",
      type: "scatter",
      name: "Reconstructed Signal",
    };

    const layout = {
      title:
        "Signals: Original Sine Wave, Sampled Signal, Reconstructed Signal",
      xaxis: {
        title: "Time",
      },
      yaxis: {
        title: "Amplitude",
      },
      updatemenus: [
        {
          buttons: [
            {
              args: [
                { visible: [true, false, false, false] },
                { title: "Sampled Sine Wave" },
              ],
              label: "Sampled",
              method: "update",
            },
            {
              args: [
                { visible: [false, false, true, false] },
                { title: "Original Signal Only" },
              ],
              label: "Original",
              method: "update",
            },
            {
              args: [
                { visible: [true, false, false, true] },
                { title: "Reconstructed Signal Only" },
              ],
              label: "Reconstructed",
              method: "update",
            },
            // {
            //   args: [
            //     { visible: [true, false, false, true] },
            //     { title: " Reconstructed Signal" },
            //   ],
            //   label: "Reconstructed",
            //   method: "update",
            // },
            //{
            //   args: [
            //     { visible: [false, true, true, false] },
            //     { title: "Sampled Signal & Reconstructed Signal" },
            //   ],
            //   label: "Sampled & Reconstructed",
            //   method: "update",
            // },
            {
              args: [
                { visible: [true, true, true, true] },
                { title: "All Signals" },
              ],
              label: "All",
              method: "update",
            },
          ],
          showactive: true,
          x: 0.05,
          xanchor: "left",
          y: 1.1,
          yanchor: "top",
        },
      ],
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

    const data = [
      ...verticalLineTraces, // Spread the array to include individual traces
      traceSampling,
      traceOriginalSine,
      traceReconstructed,
    ];

    Plotly.newPlot("canvas-container", data, layout, config);
  }

  //real code

  function generateSampleSignal(frequency, cfrequency, ampInput) {
    const Ts = 1 / cfrequency;
    const nValues = [];
    const maxN = Math.floor(cfrequency);
    for (let n = 0; n <= maxN; n++) {
      nValues.push(n);
    }

    const timeValues = nValues.map((n) => n * Ts);
    const sampledSignal = timeValues.map((t) =>
      continuousSignal(t, frequency, ampInput)
    );

    const traceSampling = {
      x: timeValues,
      y: sampledSignal,
      mode: "markers", // Only markers without lines
      type: "scatter",
      name: "Sampled Signal",
    };

    const verticalLineTraces = nValues.map((n) => ({
      x: [n * Ts, n * Ts],
      y: [0, sampledSignal[n]],
      mode: "lines",
      type: "scatter",
      name: "Vertical Line",
      line: {
        color: "green",
      },
    }));

    const layout = {
      title: "Sampled  Signal",
      xaxis: {
        title: "Time",
      },
      yaxis: {
        title: "Amplitude",
      },
    };

    const data = [traceSampling, ...verticalLineTraces];
    Plotly.newPlot("canvas-container", data, layout);
  }
});
// frequencyInput.addEventListener("input", function () {
//   const frequency = parseFloat(frequencyInput.value);
//   const ampInput = parseFloat(amplitudeInput.value);

//   if (!isNaN(frequency) && !isNaN(ampInput)) {
//     generateSignal(frequency, ampInput);
//     generateSampleSignal(frequency, cfrequency, ampInput);
//     generateRSignal(frequency, ampInput);
//   }
// });

// ampInput.addEventListener("input", function () {
//   const frequency = parseFloat(frequencyInput.value);
//   const ampInput = parseFloat(amplitudeInput.value);

//   if (!isNaN(frequency) && !isNaN(ampInput)) {
//     generateSignal(frequency, ampInput);
//     generateSampleSignal(frequency, cfrequency, ampInput);
//     generateRSignal(frequency, ampInput);
//   }
// });

// Initialise system parameters here

function varinit() {
  varchange();
  //Variable slider and number input types
  $("#dampSlider").slider("value", 10);
  $("#dampSlider").slider("disable");

  // slider initialisation : jQuery widget
  $("#frequency").spinner("value", 10); // number initialisation : jQuery widget
  $("#frequency").spinner("disable");

  $("#massSlider").slider("value", 0);
  $("#massSlider").slider("disable");
  $("#cfrequency").spinner("value", 0);
  $("#cfrequency").spinner("disable");

  $("#ampSlider").slider("value", 1);
  $("#ampSlider").slider("disable");
  $("#ampInput").spinner("value", 1);
  $("#ampInput").spinner("disable");
}
function varchange() {
  $("#dampSlider").slider({ max: 150, min: 1, step: 1 });
  $("#frequency").spinner({ max: 150, min: 1, step: 1 });

  $("#dampSlider").on("slide", function (e, ui) {
    $("#frequency").spinner("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#frequency").on("spin", function (e, ui) {
    $("#dampSlider").slider("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#frequency").on("change", function () {
    varchange();
  });

  $("#massSlider").slider({ max: 300, min: 0, step: 10 });
  $("#cfrequency").spinner({ max: 300, min: 0, step: 10 });

  $("#massSlider").on("slide", function (e, ui) {
    $("#cfrequency").spinner("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#cfrequency").on("spin", function (e, ui) {
    $("#massSlider").slider("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#cfrequency").on("change", function () {
    varchange();
  });

  $("#ampSlider").slider({ max: 50, min: 1, step: 1 });
  $("#ampInput").spinner({ max: 50, min: 1, step: 1 });

  $("#ampSlider").on("slide", function (e, ui) {
    $("#ampInput").spinner("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#ampInput").on("spin", function (e, ui) {
    $("#ampSlider").slider("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#ampInput").on("change", function () {
    varchange();
  });
  $("#CsArea").spinner({ max: 1, min: 0.01, step: 0.0001 });
  $("#Ivalue").spinner({ max: 1, min: 0.01, step: 0.0001 });
}

function varupdate() {
  $("#frequency").spinner("value", $("#dampSlider").slider("value")); //updating slider location with change in spinner(debug)
  $("#ampInput").spinner("value", $("#ampSlider").slider("value"));
  $("#cfrequency").spinner("value", $("#massSlider").slider("value"));
  cf = $("#frequency").spinner("value"); //Updating variables
  fr = $("#cfrequency").spinner("value");
  amp = $("#ampInput").spinner("value");

  if (fr && amp) {
    actionDropdown.disabled = false;
  }
}
notify.innerHTML = "Click on the sine generator to enable input section";
window.addEventListener("load", varinit);
