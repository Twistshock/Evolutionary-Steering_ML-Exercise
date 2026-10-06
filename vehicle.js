// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// The "Vehicle" class

class Vehicle {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 6;
    this.maxspeed = 4;
    this.maxforce = 0.2;
    this.health = 1;

    this.dna = [];
    this.dna[0] = random(-5,5);
    this.dna[1] = random(-5,5);
    this.dna[2] = random(-5,5);
    this.dna[3] = random(-5,5);
  }

  // Method to update location
  update() {
    this.health -= 0.005;
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  behaviors (good, bad)
  {
    


    if(good.length > 0)
      {
        var steerG = this.eat(good, 0.1);
        steerG.mult(this.dna[0]);
        this.applyForce(steerG);
      }
    if(bad.length > 0)
      {
        var steerB = this.eat(bad, -0.5);
        steerB.mult(this.dna[1]);
        this.applyForce(steerB);
      }
  }

  eat(list, nutrition) {
    let record = Infinity;
    let closest = -1;

    for (let i = 0; i < list.length; i++) {
      const d = p5.Vector.dist(this.position, list[i]);
      if (d < record) {
        record = d;
        closest = i;
      }
    }

    if (closest !== -1) {
      const target = list[closest];
      if (record < 5) {
        this.health += nutrition;
        list.splice(closest, 1);
      }
      return this.seek(target);
    }
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {

    let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    return steer;
    //this.applyForce(steer);
  }

  avoid(target){
    let undesired = p5.Vector.sub(target, this.position).mult(-1); // A vector pointing away from the location to the target

    // Scale to maximum speed
    undesired.setMag(this.maxspeed/4);

    // Steering = Desired minus velocity
    let steer = p5.Vector.sub(undesired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    this.applyForce(steer);
  }

  dead()
  {
    return (this.health <= 0)
  }

  display() {
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading() + PI / 2;

    var green = color(0,255,0);
    var red = color(255,0,0);

    // https://p5js.org/reference/p5/lerpColor/
    var col = lerpColor(red,green, this.health);

    fill(col);
    stroke(col);
    strokeWeight(1);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);

    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    stroke(0,255,0);
    line(0,0,0,-this.dna[0]*10);
    stroke(255,0,0);
    line(0,0,0,-this.dna[1]*10);
    pop();
  }
}