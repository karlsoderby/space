function onDocumentReady() {
    let el = document.body;
  
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerleave', onPointerLeave);
    setInterval(() => {
      displayData();
    }, 100)

    
  }
 
var bolean = 0; 
 


  
  function displayData () {
    let g = pointers.createPointerGroupings();
    let text = "";
    if (g.groupings.length > 0) {
      let pg = g.groupings[0];
       text ="Moving up: " + pg.isMovingUp + "<br/>" +
             "Moving left: " + pg.isMovingLeft + "<br/>" +  
             "number of groupings: " + g.groupings.length + "<br/>" +
             "horizontal speed: " + Math.round(pg.horizontalSpeed)+"<br/>"   +
             "vertical speed: " + Math.round(pg.verticalSpeed)+"<br/>"  +
             "absolut speed: " + Math.round(pg.speed)+"<br/>" +
             "num of pointers: " + pg.numOfPointers.toString() + "<br/>";
    } 

    document.getElementById("data").innerHTML = text;
    
  }


  function onPointerUp(e) {
    pointers.removePointer(e.pointerId);
    let el = getOrCreate(e);
    el.classList.remove('down');
  }
  
  function onPointerDown(e) {
    e.preventDefault();
    pointers.updatePointer(e);
   
      bolean = 1;
      console.log('maskar');
      
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
     let vs = pointers.getPointer(e.pointerId).verticalSpeed;
     let sp = pointers.getPointer(e.pointerId).speed;
     let pup = pointers.getPointer(e.pointerId).isMovingUp;
     let ple = pointers.getPointer(e.pointerId).isMovingLeft;
     let nog = pointers.getPointer(e.pointerId).groupings;

     const test = document.getElementById('test');
     const leftCorner = document.getElementById('topLeftHint');
     const rightCorner = document.getElementById('topRightHint');
     const main = document.getElementById('main');
     const main2 = document.getElementById('main2');

     document.getElementById('main2').innerHTML = '1 <br> 2 <br> 3 <br> 4 <br> 5 <br> 6 <br>';
     document.getElementById('main').innerHTML = 'Message';

    if(vs > 2000){
      
      
      document.body.style.backgroundColor = "white";
      leftCorner.classList.add('topLeftFull');
      leftCorner.classList.remove('topLeft');
      main.classList.remove('mainStyle');
      main2.classList.remove('mainStyle2');
      document.getElementById('main2').innerHTML = '';
      document.getElementById('main').innerHTML = '';
       document.getElementById('topLeftHint').innerHTML = 'You are meeting Johan at the 6th of October at 13.00 to discuss the laws of physics.';
      console.log("moveZit");
      bolean = 2;
    }

    if(vs < -200 && bolean == 1) {
      document.body.style.backgroundColor = "#f3efb1";
       leftCorner.classList.add('topLeft');
      leftCorner.classList.remove('topLeftFull');
      main.classList.add('mainStyle');
      main2.classList.add('mainStyle2');
      document.getElementById('topLeftHint').innerHTML = '';
    }

    if(hs  < -200 ){
      document.body.style.backgroundColor = "white";
      rightCorner.classList.add('topRightFull');
      rightCorner.classList.remove('topRight');
      leftCorner.classList.remove('topLeft');
      main.classList.remove('mainStyle');
      main2.classList.remove('mainStyle2');
      document.getElementById('main2').innerHTML = '';
      document.getElementById('main').innerHTML = '';
      document.getElementById('topRightHint').innerHTML = '1 2 3 4 5<b> 6</b> 7<br><br> You have an important meeting at the 13.00 at the 6th this week. <br><br> <b>Orkanen B:412</b>';
      rightCorner.classList.remove('topRight');
    }

    if(hs > -200) {
      document.body.style.backgroundColor = "#f3efb1";
      rightCorner.classList.add('topRight');
      rightCorner.classList.remove('topRightFull');
      main.classList.add('mainStyle');
      main2.classList.add('mainStyle2');
      document.getElementById('topRightHint').innerHTML = '';
    }
/*
    if (ple == true) {
      leftCorner.classList.remove('topLeftFull');
      leftCorner.classList.add('topLeft');
      rightCorner.classList.remove('topRightFull');
      rightCorner.classList.add('topRight');
      document.getElementById('topLeftHint').innerHTML = '';
      document.getElementById('topRightHint').innerHTML = '';
    }*/
/*
    if (pup == true) {
      test.classList.add('boxBottom');
      test.classList.remove('boxRight');
      test.classList.remove('boxLeft');
      document.getElementById('test').innerHTML = 'Space Deluxe';
    }
*/
   
    

   

    

    

    if(hs > 10000 && hs < 20000 && vs > 10000 && vs < 20000){
     
      document.body.style.backgroundColor = "blue";
    }


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
    
    el.id = id;
    document.body.appendChild(el);
    return el;
  }
  
  if (document.readyState != 'loading') onDocumentReady();
  else document.addEventListener('DOMContentLoaded', onDocumentReady);
  
