let pulldown;
let pulldownText;
let touchData = {movingUp: false, movingLeft: false, numGroups: 0, horizontalSpeed: 0, verticalSpeed: 0, absSpeed: 0, numPointers: 0, distance: 0, isApproaching: false};
let newPos = 0;
let pages = [];
let pageHeight = 1000;
let currentScroll = 0;
let currentPage = 0;
let oldThreeFinger = 0;

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
    }, 16)
  }

  function page(i) {
    this.yPos = i;
    let pageDiv = document.createElement("div");
    pageDiv.style.backgroundColor = "white";
    pageDiv.style.position = "absolute";
    pageDiv.style.top = this.yPos + "px";
    pageDiv.style.height = pageHeight - 50 + "px";
    pageDiv.style.width = "80%";
    pageDiv.style.margin = "5%"
    pageDiv.style.left = "10%"
    pageDiv.innerHTML = Math.random().toString(36).substring(7);
    document.body.appendChild(pageDiv);
  }

  function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
  
  function displayData () {
    let g = pointers.createPointerGroupings();
    let text = "";
    if (pointers.numOfPointers > 1) 
      var { distance, isApproaching } = pointers.comparePointers(pointers.pointerIds[0], pointers.pointerIds[1]);      
    
    if (g.numOfGroupings > 0) {
      let pg = g.groupings[0];
      touchData = {movingUp: pg.isMovingUp, movingLeft: pg.isMovingLeft, numGroups: g.numOfGroupings, horizontalSpeed: pg.horizontalSpeed, verticalSpeed: pg.verticalSpeed, absSpeed: pg.speed, numPointers: pointers.numOfPointers, distance: distance, isApproaching: isApproaching};
      pulldown.innerHTML = pointers.numOfPointers;
      //console.log(touchData.verticalSpeed);
      pulldownText.innerHTML = touchData.numPointers;
      if(touchData.numPointers === 1) {
        window.scrollTo(0, currentScroll += (pg.verticalSpeed / 8));
        console.log(currentScroll)
      }
      if(touchData.numPointers === 2) {
        currentScroll += (pg.verticalSpeed / 10)
        /* if(pg.isMovingUp) {
          currentPage --;
        }
        else {
          currentPage ++;
        }
        currentPage = map_range(currentPage, 0, )
        console.log(currentPage) */
        
        currentPage = Math.abs(map_range(currentScroll, 0, window.innerHeight, 0, pages.length - 1)); 
        console.log(parseInt(currentPage))  
        //console.log(pages[parseInt(currentPage)].yPos)
        window.scrollTo(0, pages[parseInt(currentPage)].yPos);
        //window.scrollTo(0, pages[parseInt(currentPage)].scrollIntoView());
       // window.scrollTo(0, pages[parseInt(currentPage)].scrollIntoView());
      }
     // console.log(newPos)
      newPos += (touchData.verticalSpeed / 10);
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
  