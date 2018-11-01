let newPos = 0;
let pages = [];
let pageSize = 500;
let currentScroll = 0;
let currentPage = 0;
let oldScroll = 0;
let newScroll = 0;
let destination = 0;
let animating = false;
let center = {x: 0, y: 0};
let swipeDistance = 0;
let lerpVal = 0;
let numberOfFingers = 0;
let months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
let years = ["2016", "2017", "2018"]
let iterator = 0;

function onDocumentReady() {
    let el = document.body;

    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerleave', onPointerLeave);

    // prevent default gestures in iOS
    el.addEventListener('gesturestart', e => e.preventDefault());
    el.addEventListener('gesturechange', e => e.preventDefault());
    el.addEventListener('gestureend', e => e.preventDefault());

    el = document.getElementById("data");
    // prevent default gestures in iOS
    el.addEventListener('gesturestart', e => e.preventDefault());
    el.addEventListener('gesturechange', e => e.preventDefault());
    el.addEventListener('gestureend', e => e.preventDefault());

    /* for(let i = 0; i < 16; i++) {
     
      //document.body.style.height = i * 50 + "px";
    } */

    while(months.length > 0) {
      pages.push(new page(iterator * pageSize));
      iterator ++;
    }
  
    setInterval(() => {
      displayData();
      
    }, 16)
  }

  function page(i) {
    this.yPos = i;
    this.pageDiv = document.createElement("div");
    this.pageDiv.style.backgroundColor = "white";
    this.pageDiv.style.position = "absolute";
    this.pageDiv.style.left = this.yPos + "px";
    this.pageDiv.style.height = pageSize - 50 + "px";
    this.pageDiv.style.width = pageSize - 50 + "px";
    this.pageDiv.style.margin = "5%"
    if(Math.random() > .3) {
      this.month = document.createElement("H1");
      this.month.style.position = "absolute";
      this.month.style.left = this.yPos + "px";
      this.month.style.top = pageSize + 100 + "px";
      this.month.style.width = pageSize - 50 + "px";
      this.month.style.textAlign = "center";
      this.month.innerHTML = months[0];
      months.shift();
      this.pageDiv.appendChild(this.month);
    }
    //this.pageDiv.style.left = "10%"
    this.pageDiv.style.backgroundColor = random_rgba();
   /*  for(let i = 0; i < 10; i++) {
      this.pageDiv.innerHTML += Math.random().toString(36).substring(7);
    } */
    
    document.body.appendChild(this.pageDiv);
  }

    //Interpolation
function lerp(v0, v1, t) {
  return v0*(1-t)+v1*t;
}

  function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

Math.clamp = function(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

function random_rgba() {
  var o = Math.round, r = Math.random, s = 255;
  return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 1 + ')';
  //r().toFixed(1)
}
  
  function displayData () {
    numberOfFingers = pointers.numOfPointers;
    oldScroll = currentScroll;
    let g = pointers.createPointerGroupings();
    let text = "";
    if (pointers.numOfPointers > 1) 
      var { distance, isApproaching } = pointers.comparePointers(pointers.pointerIds[0], pointers.pointerIds[1]);
    if (g.numOfGroupings > 0) {
      let pg = g.groupings[0];
      if(pointers.numOfPointers === 1) {
        if(pg.horizontalSpeed > 10 && !animating) {
          destination = 50;
          playAnimation(destination, 16);
        }
        else if( pg.horizontalSpeed < - 10 && !animating) {
          destination = - 50;
          playAnimation(destination, 16);
        }
      }
      if(pointers.numOfPointers  === 2) { 
        if(pg.horizontalSpeed > 50 && !animating) {
          destination = pageSize;
          playAnimation(destination, 300);
          center = {x: center.x + 500, y: 0};
        }
        else if(pg.horizontalSpeed < - 50 && !animating) {
          destination = -pageSize;
          playAnimation(destination, 300);
          center = {x: center.x - 500, y: 0};
        }
      }
    } 
    /*  for(page of pages) {
      if(Math.abs(parseFloat(page.pageDiv.style.left) - (parseFloat(page.pageDiv.style.left) + center.x)) > 10) {
        animating = true;
        lerpVal += 0.01;
      } 
      else {
        animating = false;
        lerpVal = 0;
      } 
      console.log(lerpVal)
      if(animating) {
        page.pageDiv.style.left = lerp(parseFloat(page.pageDiv.style.left), parseFloat(page.pageDiv.style.left) + center.x, lerpVal) + "px";
        if(lerpVal >= 1) {
          lerpVal = 0;
          animating = false;
        }
      }
     
      //console.log(page.pageDiv.style.left)
    } */
  }

  function playAnimation(distance, time) {
    animating = true;
    for(page of pages) {
      let centerX = parseFloat(page.pageDiv.style.left) - (pageSize / 2);
      let newSize = map_range(Math.abs(window.innerWidth - parseFloat(page.pageDiv.style.left)), 0, 7000, 0, 1);
      const keyframes = [
        {transform: "translateX(0px)"},
        {transform: "translateX(" + distance + "px)"},
        /* {transform: "scale(1)"},
        {transform: "scale(" + newSize + ")"} */
      ];
      let anim = page.pageDiv.animate(keyframes, {
        iterations: 1,
        duration: time,
        easing: 'ease-out',
        fill: 'both'
      }) 
      page.pageDiv.style.left = (parseFloat(page.pageDiv.style.left) + distance) + "px";
      anim.onfinish = () => {
        if(animating) animating = false;
      }
    }
  }

  function onPointerUp(e) {
    console.log(numberOfFingers)
    if(numberOfFingers == 2) {
      
    }
    numberOfFingers = 0;
    pointers.removePointer(e.pointerId);
    let el = getOrCreate(e);
    el.classList.remove('down');
  }
  
  function onPointerDown(e) {
    e.preventDefault();
    pointers.updatePointer(e);
  }
  
  function onPointerLeave(e) {
    //console.log(numberOfFingers)
    pointers.removePointer(e.pointerId);
    e.preventDefault();
    let el = getOrCreate(e);
    document.body.removeChild(el);
  }
  
  function onPointerMove(e) {
     pointers.updatePointer(e);  
     let el = getOrCreate(e);
     let hs = pointers.getPointer(e.pointerId).horizontalSpeed;
  
     e.preventDefault();
  
    // Position the element from its middle
    let rect = el.getBoundingClientRect();
    el.style.left = (e.clientX-rect.width/2) + 'px';
    el.style.top = (e.clientY-rect.height/2) + 'px';
  }
  
  // Returns an existing element for a pointer id, or makes a new one
  function getOrCreate(evt) {
    const id = 'pointer-' + evt.pointerId;
    let el = document.getElementById(id);
    if (el) return el;
    el = document.createElement('div');
    el.classList.add('pointer');
    // prevent default gestures in iOS
    el.addEventListener('gesturestart', e => e.preventDefault());
    el.addEventListener('gesturechange', e => e.preventDefault());
    el.addEventListener('gestureend', e => e.preventDefault());
    el.id = id;
    document.body.appendChild(el);
    return el;
  }
  
  if (document.readyState != 'loading') onDocumentReady();
  else document.addEventListener('DOMContentLoaded', onDocumentReady);
  