
function syncInput(sliderId, inputId) {
  const slider = document.getElementById(sliderId);
  const input = document.getElementById(inputId);
  input.addEventListener("input", function () {
    const newValue = parseFloat(input.value);
    slider.value = newValue;
  });
  slider.addEventListener("input", function () {
    input.value = this.value;
  });
}

sliderIds = [
  "gravitySlider",
  "speedSlider",
  "angleSlider",
  "heightSlider",
  "radiusSlider",
];

sliderIds.forEach((sliderId) => {
  const inputId = sliderId.replace("Slider", "Input");
  const slider = document.getElementById(sliderId);
  const input = document.getElementById(inputId);

  // Set the initial value of the input to match the slider
  input.value = slider.value;

  // Sync the slider and input values
  syncInput(sliderId, inputId);
}
);
