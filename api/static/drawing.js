const PIXEL_PER_FOOT = 20;

function draw_lines(points) {
  ctx.strokeStyle = "orange";
  for (let index = 0; index < points.length - 1; index++) {
    const cp = points[index];
    const np = points[index + 1];
    ctx.beginPath();
    ctx.moveTo(cp[0], cp[1]);
    ctx.lineTo(np[0], np[1]);
    ctx.stroke();
  }
}

function draw_point(pos) {
  ctx.beginPath();
  ctx.arc(pos[0], pos[1], 2, 0, Math.PI * 2);
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.closePath();
}

function drawGridDynamic(canvasWidthFeet, canvasHeightFeet) {
  ctx.strokeStyle = "lightgray"; // Color of the grid lines
  ctx.lineWidth = 1; // Line width

  // Draw vertical lines
  for (let x = 0; x <= canvasWidthFeet; x++) {
    ctx.beginPath();
    ctx.moveTo(x * PIXEL_PER_FOOT, 0);
    ctx.lineTo(x * PIXEL_PER_FOOT, canvas.height);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = 0; y <= canvasHeightFeet; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * PIXEL_PER_FOOT);
    ctx.lineTo(canvas.width, y * PIXEL_PER_FOOT);
    ctx.stroke();
  }

  // Optional: Draw labels for the grid
  ctx.fillStyle = "pink";
  ctx.font = "10px Arial";
  for (let i = 0; i <= canvasWidthFeet; i++) {
    ctx.fillText(i.toFixed(0), i * PIXEL_PER_FOOT, canvas.height - 5);
  }
  for (let j = 1; j <= canvasHeightFeet; j++) {
    ctx.fillText(j.toFixed(0), 5, canvas.height - j * PIXEL_PER_FOOT);
  }
}

function draw_particle(particle) {
  ctx.beginPath();
  const pos = particle.position.valueOf(); // Convert matrix to array
  ctx.arc(pos[0], pos[1], particle.radius, 0, Math.PI * 2);
  ctx.fillStyle = particle.color;
  ctx.fill();
  ctx.closePath();
}

function draw_angle(center, radius, angle) {
  //in degrees
  ctx.beginPath(); // Start a new path
  radianAngle = (angle * Math.PI) / 180;

  // Convert angle from degrees to radians
  const startAngle = 2 * Math.PI - radianAngle; // Start at the right (0 degrees)
  const endAngle = 0; // Convert angle to radians

  // Draw the arc
  ctx.arc(center[0], center[1], radius, startAngle, endAngle, false); // Draw arc
  ctx.strokeStyle = "orange"; // Set stroke color
  ctx.lineWidth = 2; // Set line width
  ctx.stroke(); // Render the arc

  // Draw the angle text
  ctx.fillStyle = "orange"; // Set text color
  ctx.font = "16px Arial"; // Set font size and family

  // Calculate text position
  const textX = center[0] + (radius + 10) * Math.cos(endAngle); // Position text to the right of the arc
  const textY = center[1] + (radius + 10) * Math.sin(endAngle); // Position text vertically aligned with the arc

  ctx.fillText(`${angle}°`, textX, textY); // Draw the angle text
}

function draw_dotted_line(
  ctx,
  start_point,
  end_point,
  color,
  text,
  paddingx,
  paddingy
) {
  const dx = end_point[0] - start_point[0];
  const dy = end_point[1] - start_point[1];
  const length = Math.sqrt(dx * dx + dy * dy); // Length of the line
  const dash_length = 5; // Length of each dash
  const gap_length = 3; // Length of the gap between dashes
  const dash_count = Math.floor(length / (dash_length + gap_length)); // Total number of dashes

  // Loop through and draw each dash
  for (let i = 0; i <= dash_count; i++) {
    const x = start_point[0] + dx * ((i * (dash_length + gap_length)) / length);
    const y = start_point[1] + dy * ((i * (dash_length + gap_length)) / length);

    ctx.moveTo(x, y);
    ctx.lineTo(
      x + (dx / length) * dash_length,
      y + (dy / length) * dash_length
    );
  }

  ctx.strokeStyle = color; // Set the stroke color
  ctx.lineWidth = 2; // Set the line width
  ctx.stroke(); // Render the line

  const text_x = start_point[0] + 10; // Offset the text to the right of the line
  const text_y = end_point[1] + 40; // Center the text vertically

  ctx.fillStyle = "white"; // Set text color
  ctx.font = "16px Arial"; // Set text font
  ctx.fillText(text, text_x + paddingx, text_y + paddingy); // Draw the text
}

function draw_vector(start_point, end_point) {
  ctx.beginPath(); // Start a new path

  // Draw the line from the start_point to the end_point
  ctx.moveTo(start_point[0], start_point[1]);
  ctx.lineTo(end_point[0], end_point[1]);

  // Calculate the angle for the arrowhead
  const angle = Math.atan2(
    end_point[1] - start_point[1],
    end_point[0] - start_point[0]
  );

  // Draw the arrowhead
  const arrow_length = 10; // Length of the arrowhead
  const arrow_angle = Math.PI / 6; // Angle of the arrowhead

  ctx.lineTo(
    end_point[0] - arrow_length * Math.cos(angle - arrow_angle),
    end_point[1] - arrow_length * Math.sin(angle - arrow_angle)
  );
  ctx.moveTo(end_point[0], end_point[1]); // Move back to the end_point
  ctx.lineTo(
    end_point[0] - arrow_length * Math.cos(angle + arrow_angle),
    end_point[1] - arrow_length * Math.sin(angle + arrow_angle)
  );

  ctx.strokeStyle = "red"; // Set the stroke color for the vector
  ctx.lineWidth = 2; // Set the line width
  ctx.stroke(); // Render the vector
}
