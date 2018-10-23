/** library that helps keeping track of multi-touch pointer-events */

/** calculates the distance between two points  */
function distance(point1, point2) {
  return Math.hypot(point1.x - point2.x, point1.y - point2.y);
}

/** calculates whether two points are approaching 
function approaching (points) { 

    let { pos1, speed1 } = points[0];
    let { pos2, speed2 } = points[1];

       // calculate whether the two pointers are approaching
     let diffPos = {x: pos2.x-pos1.x, y: -(pos2.y-pos1.y)};
     let diffSpeed = {x: speed2.horizontalSpeed-speed1.horizontalSpeed, y: speed2.verticalSpeed-speed1.verticalSpeed};
     let anglePos = Math.atan2(diffPos.y, diffPos.x)*180/Math.PI;
     let angleSpeed = Math.atan2(diffSpeed.y, diffSpeed.x)*180/Math.PI;
     let angle = (360 - (Math.abs(anglePos-angleSpeed)*2))/2;
     let isApproaching = (Math.abs(angle) < 90); 

     console.log(`Angle: ${Math.round(angle)} Is approaching: ${isApproaching}`);
     return isApproaching;   
}*/

/** a pointer class represents data about a pointer and its movements  */
class Pointer {
  constructor(e) {
    this.e = e;
    this.lastPos = this.currentPos;
    this.currentTime = Date.now();
    this.lastTime = this.currentTime;
    /**  if the pointer hasn't been updated manually since last interval we intepret it as the pointer
     has stopped moving */
    setInterval(() => {
      this.updatePointer(this.e);
    }, 250);
  }

  updatePointer(e) {
    this.lastPos = this.currentPos;
    this.e = e;
    this.lastTime = this.currentTime;
    this.currentTime = Date.now();
  }

  get id() {
    return this.e.pointerId;
  }
  get currentPos() {
    return { x: this.e.clientX, y: this.e.clientY };
  }
  get timeElapsed() {
    return (this.currentTime - this.lastTime) / 1000;
  } // in seconds
  get distanceTraveled() {
    return {
      x: this.currentPos.x - this.lastPos.x,
      y: this.currentPos.y - this.lastPos.y
    };
  }
  get horizontalSpeed() {
    let speed = 0;
    if (this.timeElapsed > 0)
      speed = this.distanceTraveled.x / this.timeElapsed;
    else speed = 0;
    return speed;
  }
  get verticalSpeed() {
    if (this.timeElapsed > 0)
      return -this.distanceTraveled.y / this.timeElapsed;
    else return 0;
  }

  get speed() {
    return Math.hypot(this.horizontalSpeed, this.verticalSpeed);
  }
  get isMovingLeft() {
    return this.horizontalSpeed < 0;
  }
  get isMovingRight() {
    return this.horizontalSpeed > 0;
  }
  get isMovingUp() {
    return this.verticalSpeed > 0;
  }
  get isMovingDown() {
    return this.verticalSpeed < 0;
  }
  get isNotMovingUpOrDown() {
    return !this.isMovingDown && !this.isMovingUp;
  }
  get isNotMovingLeftOrRight() {
    return !this.isMovingLeft && !this.isMovingRight;
  }
  get isNotMoving() {
    return this.isNotMovingLeftOrRight && this.isNotMovingUpOrDown;
  }
}

//** A pointer grouping represents a set of pointers that belong together and their movements. pointers are grouped together based on proximity. currently if two pointers (e.g two fingers) are closer than 50px they are considered belonging together */

// number of pixels that define the proximity of two pointers
const proximity = 100;
let pointerGroupId = 0;

class PointerGrouping {
  constructor() {
    this.id = ++pointerGroupId;
    this.pointers = [];
  }

  get numOfPointers() {
    return this.pointers.length;
  }

  /** true if pointer is already member of the set */

  isMember(pointerId) {
    let isMember = false;
    for (const pointer of this.pointers) {
      isMember = pointer.id == pointerId;
      if (isMember) break;
    }
    return isMember;
  }

  /** tests if a pointer is in proximity of any of the pointers in the set apart from itself  */
  isInProximity(pointer) {
    let inProximity = false;
    for (const pointerInGroup of this.pointers) {
      // if the pointer is being tested against itself we don't test for proximity
      if (pointerInGroup.id == pointer.id) continue;
      inProximity =
        distance(pointer.currentPos, pointerInGroup.currentPos) <= proximity;
      if (inProximity) break;
    }
    return inProximity;
  }

  /** add pointer to set if in proximity of any other pointer in set. if set is empty always add */
  addPointer(pointer) {
    if (
      this.pointers.length > 0 &&
      (this.isMember(pointer.id) || !this.isInProximity(pointer))
    )
      return false;
    this.pointers.push(pointer);
    return true;
  }

  /** returns the average horizontal speed of the pointers in the set */
  get horizontalSpeed() {
    if (this.pointers.length > 0)
      return (
        this.pointers.reduce((sum, pointer) => {
          return sum + pointer.horizontalSpeed;
        }, 0) / this.pointers.length
      );
    else return 0;
  }

  /** returns the average horizontal speed of the pointers in the group */
  get verticalSpeed() {
    if (this.pointers.length > 0)
      return (
        this.pointers.reduce((sum, pointer) => {
          return sum + pointer.verticalSpeed;
        }, 0) / this.pointers.length
      );
    else return 0;
  }

  /** returns the average absolute speed of the pointers in the group */
  get speed() {
    if (this.pointers.length > 0)
      return (
        this.pointers.reduce((sum, pointer) => {
          return sum + pointer.speed;
        }, 0) / this.pointers.length
      );
    else return 0;
  }

  /** if any of the pointers in the group moves left the group is moving left that allows for the group to move both left and right at the same time!  */
  get isMovingLeft() {
    return this.pointers.reduce((isMovingLeft, pointer) => {
      return isMovingLeft || pointer.isMovingLeft;
    }, false);
  }

  get isMovingRight() {
    return this.pointers.reduce((isMovingRight, pointer) => {
      return isMovingRight || pointer.isMovingRight;
    }, false);
  }

  /** if any of the pointers in the group moves down the group is moving down. that allows for the group to move both up and down at the same time!  */
  get isMovingUp() {
    return this.pointers.reduce((previous, pointer) => {
      return previous || pointer.isMovingUp;
    }, false);
  }

  get isMovingDown() {
    return this.pointers.reduce((isMovingDown, pointer) => {
      return isMovingDown || pointer.isMovingDown;
    }, false);
  }

  get isNotMovingUpOrDown() {
    return !this.isMovingDown && !this.isMovingUp;
  }
  get isNotMovingLeftOrRight() {
    return !this.isMovingLeft && !this.isMovingRight;
  }
  get isNotMoving() {
    return this.isNotMovingLeftOrRight && this.isNotMovingUpOrDown;
  }
}

class PointerGroupings {
  constructor(pointers) {
    this.groupings = [];
    pointers.forEach(pointer => {
      let hasBeenAdded = false;
      // runs through existing pointergroups to see if pointer can be added to them
      for (let pointerGroup of this.groupings) {
        hasBeenAdded =
          pointerGroup.isMember(pointer.id) || pointerGroup.addPointer(pointer);
        if (hasBeenAdded) break;
      }
      // if pointer did not belong to any existing group a new group is created for it and pointer is added
      if (!hasBeenAdded) {
        let pointerGrouping = new PointerGrouping();
        pointerGrouping.addPointer(pointer);
        this.groupings.push(pointerGrouping);
      }
    });
  }

  get numOfGroupings() {
    return this.groupings.length;
  }

  getGrouping(id) {
    for (const grouping of this.groupings)
      if (id == grouping.id) return grouping;
    return null;
  }
}

/** The Pointers class is used to represent data about all the pointers we are interested in. every time a pointer event is fired we should remember to call the updatePointer() method either to create or update the pointer representation via the pointerId. The Pointers class can also return a dynamically created PointerGroupings object that places our pointers into groups based on proximity of the pointers.    */

class Pointers {
  constructor() {
    this.pointers = [];
  }

  get numOfPointers() {
    return this.pointers.length;
  }
  get pointerIds() {
    return this.pointers.map(pointer => pointer.id);
  }

  pointerExists(id) {
    return !(this.getPointer(id) === undefined);
  }

  getPointer(id) {
    let pointer;
    for (let p of this.pointers) if (p.id == id) return (pointer = p);

    return pointer;
  }

  removePointer(id) {
    this.pointers = this.pointers.filter(pointer => pointer.id != id);
  }

  updatePointer(e) {
    let exists = this.pointerExists(e.pointerId);
    if (!exists) this.pointers.push(new Pointer(e));
    else
      this.pointers.forEach(pointer => {
        if (pointer.id == e.pointerId) {
          pointer.updatePointer(e, Date.now());
        }
      });
    // we return the updated pointer
    return this.getPointer(e.pointerId);
  }

  createPointerGroupings() {
    return new PointerGroupings(this.pointers);
  }

  comparePointers(id1, id2) {
    const p1 = pointers.getPointer(id1),
      p2 = pointers.getPointer(id2);
    if (p1 == undefined || p2 == undefined) return {};

    // calculate whether the two pointers are approaching
    const diffPos = {
      x: p2.currentPos.x - p1.currentPos.x,
      y: -(p2.currentPos.y - p1.currentPos.y)
    };
    const diffSpeed = {
      x: p2.horizontalSpeed - p1.horizontalSpeed,
      y: p2.verticalSpeed - p1.verticalSpeed
    };
    const anglePos = (Math.atan2(diffPos.y, diffPos.x) * 180) / Math.PI;
    const angleSpeed = (Math.atan2(diffSpeed.y, diffSpeed.x) * 180) / Math.PI;
    const angle = (360 - Math.abs(anglePos - angleSpeed) * 2) / 2;
    const isApproaching = Math.abs(angle) < 90;

   // console.log(`Angle: ${Math.round(angle)} Is approaching: ${isApproaching}`);
    return {
      distance: distance(p1.currentPos, p2.currentPos),
      isApproaching: isApproaching
    };
  }
}

// object that holds data about our pointers
let pointers = new Pointers();
