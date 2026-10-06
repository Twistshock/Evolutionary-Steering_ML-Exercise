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
    // Food weight
    this.dna[0] = random(-5,5);
    // Poison Weight
    this.dna[1] = random(-5,5);

    //Food detection
    this.dna[2] = random(this.maxspeed,100);
    //poison detection
    this.dna[3] = random(this.maxspeed,100);
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
        var steerG = this.eat(good, 0.25, this.dna[2]);
        if(steerG)
          {
            steerG.mult(this.dna[0]);
            this.applyForce(steerG);
          }

      }
    if(bad.length > 0)
      {
        var steerB = this.eat(bad, -0.5, this.dna[3]);
        if(steerB)
          {
            steerB.mult(this.dna[1]);
            this.applyForce(steerB);
          }
      }
  }

  eat(list, nutrition, perception) {
    let record = Infinity;
    let closest = -1;

    for (let i = 0; i < list.length; i++) {
      const d = p5.Vector.dist(this.position, list[i]);
      if (d < record && d < perception) {
        record = d;
        closest = i;
      }
    }

    if (closest !== -1) {
      const target = list[closest];
      if (record < 5) {
        this.health += nutrition;
        this.health = min(this.health, 1);
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


    fill(0,0,0,0);
    stroke(0,255,0); // food
    line(0,0,0,-this.dna[0]*10);
    ellipse(0,0,this.dna[2]*2);
  
    stroke(255,0,0); // Poison
    ellipse(0,0,this.dna[3]*2);
    line(0,0,0,-this.dna[1]*10);
    pop();
  }

  boundaries(d)
  {
    if(!d){d=25}
    var desired = null;

    if (this.position.x < d)
      {
        desired = createVector(this.maxspeed*2, this.velocity.y);
      }
    else if (this.position.x > width -d)
      {
        desired = createVector(-this.maxspeed*2, this.velocity.y)
      }

          if (this.position.y < d)
      {
        desired = createVector(this.velocity.x, this.maxspeed*2);
      }
    else if (this.position.y > height -d)
      {
        desired = createVector(this.velocity.x, -this.maxspeed*2)
      }

    if (desired !== null)
      {
        desired.normalize();
        desired.mult(this.maxspeed);
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        this.applyForce(steer);
      }
  }
}