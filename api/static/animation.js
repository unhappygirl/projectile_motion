let gravitation = G;
TIME_STEP = 0.0025 * 2;
const ctx = canvas.getContext("2d");
const scrollable = document.getElementById("scrollable");

function pixels_to_feet(pixels) {
  return pixels / PIXEL_PER_FOOT;
}

function feet_to_pixels(feet) {
  return feet * PIXEL_PER_FOOT;
}

function rest_position() {
  return math.matrix([myparticle.radius, canvas.height-myparticle.radius]);
}

function max_by_key(arr, key) {
  return arr.reduce((maxElement, currentElement) => {
    return key(currentElement) > key(maxElement) ? currentElement : maxElement;
  });
}

function getSliderValues() {
  // Accessing the slider values
  const gravity = document.getElementById("gravitySlider").value;
  const ispeed = document.getElementById("speedSlider").value;
  const angle = document.getElementById("angleSlider").value;
  const iheight = document.getElementById("heightSlider").value;

  return {
    sgravity: parseFloat(gravity),
    sispeed: feet_to_pixels(parseFloat(ispeed)),
    sangle: parseFloat(angle),
    siheight: feet_to_pixels(parseFloat(iheight)),
  };
}

function getInputValues() {
  // Get the values from the input boxes
  const gravity = document.getElementById("gravityInput").value;
  const ispeed = document.getElementById("speedInput").value;
  const angle = document.getElementById("angleInput").value;
  const iheight = document.getElementById("heightInput").value;
  const radius = document.getElementById("radiusInput").value;

  // Return an object with the values
  return {
    tgravity: feet_to_pixels(gravity),
    tispeed: feet_to_pixels(ispeed),
    tangle: angle,
    tiheight: feet_to_pixels(iheight),
    tradius: feet_to_pixels(radius),
  };
}

function reset(particle, event) {
  maxh = [0, 0];
  dt = 0;
  time = 0;
  positions = [];
  document.getElementById("gravityInput").value = G;
}

function init_loop_vars() {
  dt = 0;
  time = 0;
  height = pixels_to_feet(H - myparticle.position.valueOf()[1]);
  positions = [];
  frames = 0;
  maxh = 0;
}

function play() {
  dt = TIME_STEP;
}

function draw_sequence(ppos, angle) {
  drawGridDynamic(W / PIXEL_PER_FOOT, H / PIXEL_PER_FOOT);
  draw_particle(myparticle);
  draw_dotted_line(
    ctx,
    [ppos[0], H],
    [ppos[0], ppos[1]],
    "blue",
    `${height.toFixed(2)} feet`,
    0,
    60
  );
  draw_dotted_line(
    ctx,
    [ppos[0], ppos[1]],
    [0, ppos[1]],
    "red",
    `${pixels_to_feet(ppos[0]).toFixed(2)} feet`,
    -200,
    -60
  );
  draw_dotted_line(ctx, [maxh[0], H], [maxh[0], maxh[1]], "red", "max", 0, 80);
  if (time == 0) {
    draw_angle([ppos[0], ppos[1]], myparticle.radius * 0.6, angle);
  }
  draw_vector(
    ppos,
    math
      .add(
        myparticle.position,
        math.divide(myparticle.velocity, PIXEL_PER_FOOT / 3)
      )
      .valueOf()
  );
  draw_lines(positions);
}

function calculate_flight_properties(vx, vy, iheight, gravity) {
  // Maximum height (in feet)
  const h_max = iheight + (vy * vy) / (2 * gravity);

  // Total time of flight (solving quadratic equation for when the projectile reaches y = 0)
  const discriminant = vy * vy + 2 * gravity * iheight;
  const t_total = (-vy + Math.sqrt(discriminant)) / gravity;

  // Horizontal distance (in feet)
  const horizontal_distance = vx * t_total;

  // Return an object containing the properties
  return {
    t_flight: t_total.toFixed(2), // Time in seconds
    h_max: h_max.toFixed(2), // Maximum height in feet
    x_distance: horizontal_distance.toFixed(2) + 1, // Distance in feet
  };
}

function adjust() {
  const { tgravity, tispeed, tangle, tiheight, tradius} = getInputValues();
  if (time == 0) {
    const angleInRadians = math.unit(tangle, "deg").toNumber("rad");

    // Set initial velocity using speed and angle
    const vx = tispeed * Math.cos(angleInRadians); // Horizontal velocity
    const vy = -tispeed * Math.sin(angleInRadians); // Vertical velocity (negative because canvas Y increases downward)

    myparticle.velocity = math.matrix([vx, vy]);
    myparticle.radius = tradius;
    myparticle.position = math.add(rest_position(), [0, -tiheight]);
    const { t_flight, x_distance, h_max } = calculate_flight_properties(
      pixels_to_feet(vx),
      pixels_to_feet(vy),
      pixels_to_feet(tiheight),
      pixels_to_feet(tgravity)
    );
    canvas.width =
      ((feet_to_pixels(x_distance) + myparticle.radius) % 10000) + 600;
    canvas.height = ((feet_to_pixels(h_max) + myparticle.radius) % 10000) + 600;
    W = canvas.width;
    H = canvas.height;
    myparticle.position = math.add(rest_position(), [0, -tiheight]);
  }
  gravitation = tgravity;
  return tangle;
}

let myparticle = new CircularParticle(
  [feet_to_pixels(1), H - feet_to_pixels(1)],
  [60, 0],
  1,
  "blue"
);
init_loop_vars();

function animate() {
  ctx.clearRect(0, 0, W, H); // Clear the canvas
  angle = adjust();
  let collided = border_collisions(myparticle, 0.9);

  // Update the particle's position and velocity
  myparticle.integrate(dt); // Assuming a 60 FPS frame time of ~16ms
  const pos = myparticle.position.valueOf();
  const vel = myparticle.velocity.valueOf();

  height = pixels_to_feet(H - pos[1]);
  if (time != 0) {
    positions.push(pos);
    maxh = max_by_key(positions, (t) => H - t[1]);
  }
  //console.log(pos)

  draw_sequence(pos, angle);

  if (!collided) {
    time += dt;
    scrollable.scrollLeft = pos[0] - scrollable.clientWidth / 2;
    scrollable.scrollTop = pos[1] - scrollable.clientHeight / 2;
  }
  document.getElementById("timeLabel").innerHTML = `${time.toPrecision(2)}s`;
  frames += 1;
  requestAnimationFrame(animate); // Recursively call animate to create animation
}

function bind_events() {
  document.getElementById("resetButton").addEventListener("click", (event) => {
    reset(myparticle, event);
  });
  document.getElementById("playButton").addEventListener("click", play);
}

bind_events();
animate(); // Start the animation loop
