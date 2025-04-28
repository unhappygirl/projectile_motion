// Sync Gravity
document.getElementById("gravitySlider").addEventListener("input", function () {
  document.getElementById("gravityInput").value = this.value;
});
document.getElementById("gravityInput").addEventListener("input", function () {
  document.getElementById("gravitySlider").value = this.value;
});

// Sync Speed
document.getElementById("speedSlider").addEventListener("input", function () {
  document.getElementById("speedInput").value = this.value;
});
document.getElementById("speedInput").addEventListener("input", function () {
  document.getElementById("speedSlider").value = this.value;
});

// Sync Angle
document.getElementById("angleSlider").addEventListener("input", function () {
  document.getElementById("angleInput").value = this.value;
});
document.getElementById("angleInput").addEventListener("input", function () {
  document.getElementById("angleSlider").value = this.value;
});

// Sync Height
document.getElementById("heightSlider").addEventListener("input", function () {
  document.getElementById("heightInput").value = this.value;
});
document.getElementById("heightInput").addEventListener("input", function () {
  document.getElementById("heightSlider").value = this.value;
});
