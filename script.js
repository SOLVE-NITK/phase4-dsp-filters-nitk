const URLS = [
  {
    name: "Study of sampling theorem",
    url: "assets/sampling/index.html",
  },
  {
    name: "Verification of Linear Convolution",
    url: "assets/linear/index.html",
  },
  {
    name: "Verification of Circular Convolution",
    url: "assets/circular/index.html",
  },
];

function displayExperiment(element) {
  console.log(element.textContent.trim());
  URLS.map((ele) => {
    if (ele.name == element.textContent.trim()) {
      document.getElementById("frame").src = ele.url;
    }
  });
}
