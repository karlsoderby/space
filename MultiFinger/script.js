let pulldown;
let pulldownText;
//let pg = {movingUp: false, movingLeft: false, numGroups: 0, horizontalSpeed: 0, verticalSpeed: 0, absSpeed: 0, numPointers: 0, distance: 0, isApproaching: false};
let newPos = 0;
let pages = [];
let pageHeight = 500;
let currentScroll = 0;
let currentPage = 0;
let oldScroll = 0;
let newScroll = 0;
let destination = 0;

function onDocumentReady() {
    let el = document.body;
    //document.body.style.height = "5000px";
    pulldown = document.getElementById("pulldown");
    pulldownText = document.getElementById("pulldownText");
    pulldown.style.top = -100 + "px";
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

    for(let i = 0; i < 8; i++) {
      pages.push(new page(i * pageHeight));
      //document.body.style.height = i * 50 + "px";
    }
  
    setInterval(() => {
      displayData();
      destination = 0;
    }, 16)
  }

  function page(i) {
    this.yPos = i;
    this.pageDiv = document.createElement("div");
    this.pageDiv.style.backgroundColor = "white";
    this.pageDiv.style.position = "absolute";
    this.pageDiv.style.left = this.yPos + "px";
    this.pageDiv.style.height = pageHeight - 50 + "px";
    this.pageDiv.style.width = "80%";
    this.pageDiv.style.margin = "5%"
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
  return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}
  
  function displayData () {
    oldScroll = currentScroll;
    let g = pointers.createPointerGroupings();
    let text = "";
    if (pointers.numOfPointers > 1) 
      var { distance, isApproaching } = pointers.comparePointers(pointers.pointerIds[0], pointers.pointerIds[1]);      
    
    if (g.numOfGroupings > 0) {
      let pg = g.groupings[0];
      //pg = {movingUp: pg.isMovingUp, movingLeft: pg.isMovingLeft, numGroups: g.numOfGroupings, horizontalSpeed: pg.horizontalSpeed, verticalSpeed: pg.verticalSpeed, absSpeed: pg.speed, numPointers: pointers.numOfPointers, distance: distance, isApproaching: isApproaching};
      pulldown.innerHTML = pointers.numOfPointers;
      //console.log(touchData.verticalSpeed);
      pulldownText.innerHTML = pg.numPointers;
      if(pointers.numOfPointers === 1) {
        if(window.scrollY < document.body.height || window.scrollY > 0) {
          
        }
        
        currentScroll += (pg.verticalSpeed / 32)
        //window.scrollTo(0, );
      }
      if(pointers.numOfPointers  === 2) { 
        
       /*  currentScroll += (pg.verticalSpeed)
        currentPage = Math.abs(map_range(currentScroll, 0, window.innerHeight, 0, 7)); 
        currentScroll = Math.clamp(currentScroll, 0, document.body.style.height);
        if(currentPage >= 0 && currentPage < pages.length) { 

        } */

        if(pg.isMovingUp && pg.verticalSpeed > 100) {
          destination = 500;

            //playAnimation(500);
            
          
        }
        else if(!pg.isMovingUp && pg.verticalSpeed < - 100) {

            
           // playAnimation(-500);
          
          destination = -500;
        }
        //console.log(destination)
        //console.log(destination)
      // console.log(pg.verticalSpeed)
        /* if(pg.isMovingUp) currentPage += 0.05;
        else currentPage -= 0.05;
        currentPage = Math.clamp(currentPage, 0, 7);
        //console.log(parseInt(currentPage))  ;
        currentScroll = pages[parseInt(currentPage)].yPos;
        console.log(pg.verticalSpeed) */
        /* if(pg.isMovingUp) */
      }
      

     /*  if(pg.numPointers === 3) {
        if(pg.isMovingUp) currentScroll = 0;
        else currentScroll = parseFloat(document.body.style.height);
      } */
      
      
      //oldScroll = 
      //pulldown.style.top = newPos + "px";
      //document.body.style.backgroundColor = "rgb("+ touchData.numPointers * 100 + ",255, 255)";
      //console.log(pg.numOfPointers)
      /* text ="Moving up: " + pg.isMovingUp + "<br/>" +
            "Moving left: " + pg.isMovingLeft + "<br/>" +  
            "Number of groupings: " + g.numOfGroupings + "<br/>" +
            "Horizontal speed: " + Math.round(pg.horizontalSpeed)+"<br/>"   +
            "Vertical speed: " + Math.round(pg.verticalSpeed)+"<br/>"  +
            "Absolut speed: " + Math.round(pg.speed)+"<br/>" +
            "Num of pointers: " + pointers.numOfPointers + "<br/>"+
            "Distance between 1. & 2. pointers: " + distance + "<br/>" +
            "Pointer 1 & 2 approaching: " + isApproaching;
            document.getElementById("data").innerHTML = text; */
    } 
    
    /* newScroll = lerp(newScroll, currentScroll, 0.1);
    window.scrollTo(0, newScroll) */
    /* for(page of pages) {
      if(Math.abs(parseFloat(page.pageDiv.style.top) - (parseFloat(page.pageDiv.style.top) + destination)) > 50) {
        page.pageDiv.style.top = lerp(parseFloat(page.pageDiv.style.top), parseFloat(page.pageDiv.style.top) + destination, 0.05) + "px";
      }
      console.log(Math.abs(parseFloat(page.pageDiv.style.top) - (parseFloat(page.pageDiv.style.top) + destination)))
    } */
   /*  newScroll = lerp(newScroll, window.scrollY + destination, 0.1);
    //console.log(newScroll)
    window.scrollTo(0, newScroll) */
    for(page of pages) {
      parseFloat(page.pageDiv.style.left)
    }
  }

  function playAnimation(distance) {
    for(page of pages) {
      const keyframes = [
        /* {transform: "translateY(" + parseFloat(pageDiv.style.top) + "px)"},
        {transform: "translateY(" +parseFloat(pageDiv.style.top) + distance + "px)"} */
        {transform: "translateX(0px)"},
        {transform: "translateX(" + distance + "px)"}
      ];
      page.pageDiv.animate(keyframes, {
        iterations: 1,
        duration: 1000,
        easing: 'ease-in-out',
        fill: 'forwards'
      }) 
    }
       
  }

  function onPointerUp(e) {
    pointers.removePointer(e.pointerId);
    let el = getOrCreate(e);
    el.classList.remove('down');
  }
  
  function onPointerDown(e) {
    e.preventDefault();
    pointers.updatePointer(e);
  }
  
  function onPointerLeave(e) {
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
  