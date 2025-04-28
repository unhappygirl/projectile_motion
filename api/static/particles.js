const canvas = document.getElementById("myCanvas");
let W = canvas.width;
let H = canvas.height;

const G = 32.2;
const ORIGIN = math.matrix([0, 0]);

class CircularParticle {
  constructor(position, velocity, radius, color) {
    this.position = math.matrix(position); // Using math.js matrix
    this.velocity = math.matrix(velocity);
    this.radius = radius;
    this.color = color;
    this.density = 1;
    this.area = Math.PI * this.radius ** 2;
    this.mass = this.density * this.area;
    this.net_force = math.matrix([0, 0]);
  }

  apply_impulse(impulse) {
    const dv = math.divide(impulse, this.mass);
    this.velocity = math.add(this.velocity, dv);
  }

  apply_gravity() {
    const mg = math.multiply(this.mass, [0, gravitation]);
    this.net_force = math.add(this.net_force, mg);
  }

  integrate(dt) {
    this.net_force = math.matrix([0, 0]);
    this.apply_gravity();
    const accel = math.divide(this.net_force, this.mass);
    let dv = math.multiply(accel, dt);
    this.velocity = math.add(this.velocity, dv);
    let dtri = math.divide(math.multiply(dv, dt), 2);
    this.position = math.add(
      this.position,
      math.add(math.multiply(this.velocity, dt), dtri)
    );
  }
}

function border_collisions(particle, cof) {
  const pos = particle.position.valueOf();
  const vel = particle.velocity.valueOf();
  if (pos[0] + particle.radius > W) {
    particle.position = math.matrix([W - particle.radius, pos[1]]);
    particle.apply_impulse(math.multiply(particle.mass, [-2 * vel[0], 0]));
    return true;
  }
  if (pos[0] - particle.radius < 0) {
    particle.position = math.matrix([particle.radius, pos[1]]);
    particle.apply_impulse(math.multiply(particle.mass, [-2 * vel[0], 0]));
    return true;
  }
  if (pos[1] + particle.radius > H) {
    particle.position = math.matrix([pos[0], H - particle.radius]);
    particle.velocity = math.matrix([0, 0]);
    return true;
  }
  if (pos[1] - particle.radius < 0) {
    particle.position = math.matrix([pos[0], particle.radius]);
    particle.apply_impulse(math.multiply(particle.mass, [0, -2 * vel[1]]));
    return true;
  }

  return false;
}
