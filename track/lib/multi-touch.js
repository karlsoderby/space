
/** library that helps keeping track of multi-touch pointers events */


/** calculates the distance between two points  */
function distance(point1, point2) {
  return Math.hypot(point1.x-point2.x, point1.y-point2.y);
}

/** a pointer class represents data about a pointer and its movements  */
class Pointer {
  constructor (e, lastPos, currentTime, lastTime) {
    this.e = e;
    this.lastPos = lastPos;
    this.currentTime = currentTime;
    this.lastTime = lastTime;
 
  }

  updatePointer (e, newTime) {
    this.lastPos = this.currentPos;  
    this.e = e;
    this.lastTime = this.currentTime;
    this.currentTime = newTime;
  } 

  get id () {return this.e.pointerId};
  get currentPos () {return {x: this.e.clientX, y: this.e.clientY}};
  get timeElapsed () {return (this.currentTime - this.lastTime)/1000} // in seconds
  get distanceTraveled () {return {x: this.currentPos.x-this.lastPos.x, y: this.currentPos.y-this.lastPos.y}}
  get horizontalSpeed () {
    let speed = 0;
    if (this.timeElapsed > 0) 
      speed = this.distanceTraveled.x / this.timeElapsed
    else
      speed = 0;
    return speed;
  }
  get verticalSpeed () {
    if (this.timeElapsed > 0) 
      return this.distanceTraveled.y / this.timeElapsed
    else
      return 0;
  }

  get speed () {return Math.hypot(this.horizontalSpeed, this.verticalSpeed)}
  get isMovingLeft () {return this.horizontalSpeed < 0}
  get isMovingRight () {return this.horizontalSpeed > 0}
  get isMovingUp () {return this.verticalSpeed < 0}
  get isMovingDown () {return this.verticalSpeed > 0}
  get isNotMovingUpOrDown () {return (!this.isMovingDown && !this.isMovingUp)}
  get isNotMovingLeftOrRight () {return (!this.isMovingLeft && !this.isMovingRight)}
  get isNotMoving () {return (this.isNotMovingLeftOrRight && this.isNotMovingUpOrDown)}
}

//** A pointer grouping represents a set of pointers that belong together and their movements. pointers are grouped together based on proximity. currently if two pointers (e.g two fingers) are closer than 50px they are considered belonging together */

// number of pixels that define the proximity of two pointers 
const proximity = 100;
let pointerGroupId = 0;

class PointerGrouping { 

  constructor () {
    this.id = ++pointerGroupId;
    this.pointers = [];
  } 

  get numOfPointers () {return this.pointers.length};

  /** true if pointer is already member of the set */  
  isMember (pointerId) {
    let isMember = false;
    for (const pointer of this.pointers) {
       isMember = (pointer.id == pointerId);
       if (isMember)
         break;
    }
    return isMember;
  }

  /** tests if a pointer is in proximity of any of the pointers in the set apart from itself  */
  isInProximity (pointer) {
    let inProximity = false;
    for (const pointerInGroup of this.pointers) {
         // if the pointer is being tested against itself we don't test for proximity 
         if (pointerInGroup.id == pointer.id) 
            continue;    
         inProximity = distance(pointer.currentPos, pointerInGroup.currentPos) <= proximity;
         if (inProximity) break; 
    }
    return inProximity;
  }

  /** add pointer to set if in proximity of any other pointer in set. if set is empty always add */
  addPointer (pointer) {
   
    if ((this.pointers.length > 0) && (this.isMember(pointer.id) || (!this.isInProximity(pointer))))
      return false;
    
//    this.pointers.push(new Pointer(pointer.e, pointer.lastPos, pointer.currentTime, pointer.lastTime));
    this.pointers.push(pointer);
    return true;
  } 

  /** returns the average horizontal speed of the pointers in the set */
  get horizontalSpeed () { 
    if (this.pointers.length > 0) 
        return this.pointers.reduce((sum, pointer) => {return sum+pointer.horizontalSpeed}, 0) / this.pointers.length;
    else
      return 0;
  }
  
  /** returns the average horizontal speed of the pointers in the group */
  get verticalSpeed () {
    if (this.pointers.length > 0)
       return this.pointers.reduce((sum, pointer) => { return sum+pointer.verticalSpeed}, 0) / this.pointers.length;
    else 
      return 0;
  }

  /** returns the average absolut speed of the pointers in the group */
  get speed () {
    if (this.pointers.length > 0)
      return (this.pointers.reduce((sum, pointer) => { return sum+pointer.speed}, 0) / this.pointers.length);
    else
      return 0;
  }
  
  /** if any of the pointers in the group moves left the group is moving left that allows for the group to move both left and right at the same time!  */
  get isMovingLeft () {
    return this.pointers.reduce((isMovingLeft, pointer) => {return (isMovingLeft || pointer.isMovingLeft)}, false);
  }

  get isMovingRight () {
    return this.pointers.reduce((isMovingRight, pointer) => {return (isMovingRight || pointer.isMovingRight)}, false);
  }

  /** if any of the pointers in the group moves down the group is moving down. that allows for the group to move both up and down at the same time!  */
  get isMovingUp () {
    return this.pointers.reduce((previous, pointer) => {return (previous || pointer.isMovingUp)}, false);
  }
   
  get isMovingDown () {
    return this.pointers.reduce((isMovingDown, pointer) => {return (isMovingDown || pointer.isMovingDown)}, false);
  }
   
  get isNotMovingUpOrDown () {return (!this.isMovingDown && !this.isMovingUp)}
  get isNotMovingLeftOrRight () {return (!this.isMovingLeft && !this.isMovingRight)}
  get isNotMoving () {return (this.isNotMovingLeftOrRight && this.isNotMovingUpOrDown)}
}

class PointerGroupings {
  constructor (pointers) {
    this.groupings = [];
    pointers.forEach(pointer => {
      let hasBeenAdded = false;
      // runs through existing pointergroups to see if pointer can be added to them
      for (let pointerGroup of this.groupings) {
        hasBeenAdded = (pointerGroup.isMember(pointer.id) || pointerGroup.addPointer(pointer));
        if (hasBeenAdded) break;
      }
      // if pointer did not belong to any existing group a new group is created for it and pointer is added
      if (!hasBeenAdded) {
        let pointerGrouping = new PointerGrouping;
        pointerGrouping.addPointer(pointer);
        this.groupings.push(pointerGrouping);
      }
    })

  }

  get numOfGroupings () {
    return this.groupings.length; 
  }

  getGrouping (id) {
    for (const grouping of this.groupings) 
      if (id == grouping.id) return grouping;
    return null;
  }

}

/** The Pointers class is used to represent data about all the pointers we are interested in. every time a pointer event is fired we should remember to call the updatePointer() method either to create or update the pointer representation via the pointerId. The Pointers class can also return a dynamically created PointerGroupings object that places our pointers into groups based on proximity of the pointers.    */

class Pointers {
  
  constructor () {
    this.pointers = [];
  }

  get numOfPointers () {return this.pointers.length};

  pointerExists (id) {
    return !(this.getPointer(id) === undefined);
  }
  
  getPointer (id) {
    let pointer;
    for (let p of this.pointers) {
     if (p.id == id) { 
        pointer = p;
        break;
      }
    }
   return pointer;
  }

  removePointer (id) {
    this.pointers = this.pointers.filter(pointer => pointer.id != id);
  }

  updatePointer (e) {
    let exists = this.pointerExists(e.pointerId);
    if (!exists) {
       let time = Date.now();
       let pos = {x: e.clientX, y: e.clientY};
       this.pointers.push(new Pointer(e, pos, time, time))
    }
    else  
      this.pointers.forEach(pointer => {
        if (pointer.id == e.pointerId) {
          pointer.updatePointer(e, Date.now());
        }
      })
    // we return the updated pointer
    return this.getPointer(e.pointerId);
  }
  
  createPointerGroupings () {
    let pointerGroupings = new PointerGroupings(this.pointers);

    return pointerGroupings;
  }
}

// object that holds data about our pointers
let pointers = new Pointers; 

