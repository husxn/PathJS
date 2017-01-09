//Come back to this..
var Cell = require('./cell')
var Search = require('./search')
var Maze = require('./maze')
function runFunction(board){
  for(var i=0;i<board.boardArr.length;i++){
    for(var j=0;j<board.boardArr[i].length;j++){
      var id = j.toString() + ',' + i.toString()
      console.log(document.getElementById(id).className)
    }
  }
}

function Board(height,width){  
  this.height = height
  this.width = width 
  this.boardArr = []
  this.mouseDown = false
  this.keyDown = false 
  this.startNode;
  this.finalNode;
  this.objectNode;
  this.currentCellStatus = null
  this.mode = 0
  this.currentPlace = null
  this.shouldBe = null
  this.algoDone = false
  this.currentAlgo = null
  this.lastWall = false
  this.lastWeight = false
  this.algoToRun = null
  this.canPress = true
  this.shouldDisable = false
  this.modalIndex = 0
  this.modalArr = [
    `<div>
      <h1>Welcome to Path.JS</h1>
      <p>Path.JS is an educational tool used for visualisation pathfinding algorithms</p>
      <p>If you're here to learn, play, or kill some time ENJOY</p>
      <p> This short tutorial will walk you through all of the features of this application.</p>
      <p> If you want to dive straight in you can click the "X", if not click next and ENJOY!</p>
     </div>`,
    //  `<div>
    //     <h1> What is a Pathfinding Algorithm? </h1>
    //     <p> Pathfinding algorithms aim to find distances, primarily the shortest distance between any 2 points </p>
    //     <p> To learn more about pathfinding algorithms click this link </p>
    //  </div>`,
    // `<div>
    //   <h1> Basic Controls of Grid and Walls</h1>
    //   <div class='monica'>
    //     <p> You can drag the start and target pieces as follows:</p>
    //     <img src='https://i.gyazo.com/503258d633d9b1fb10391752dcdbcb18.gif'/>
    //   </div>
    //   <div class='monica'>
    //     <p> By holding down the mouse + dragging you can create walls. Mouse + holding w will create weights</p>
    //     <img src='https://i.gyazo.com/a0ae47879957037311e95ac4cf10b28d.gif'/>
    //     <p> Walls are inpenetrable, weights are not. However they add considerable resistance. </p>
    //   </div>
    // </div>`,
    // `<div>
    //   <h1> Picking an Algorithm </h1>
    //   <p> Select an algorithm from the drop down menu </p>
    //   <img src='https://i.gyazo.com/9bfab6c619cbe04176bd69cc4d109f87.gif'/>
    // </div>`,
    // `<div>
    //   <h1> Algorithm information</h1>
    //   <p> Dijkstra's Algorithm </p>
    //   <p> A* Search </p>
    //   <p> Breadth First Search </p>
    //   <p> Depth First Search </p>
    //   <p> Swarm Search </p>
    //   <p> Convergent Swarm Search </p>
    // </div>`,
    // `<div>
    //   <h1>Picking a maze</h1>
    //   <p>This step is optional.</p>
    //   <p>Either you can create walls+weights by dragging or you can select a maze from the drop down menu</p>
    //   <img src='https://i.gyazo.com/9c3439aff58611894d5c82da9c2b8a89.gif'/>
    // </div>`,
    // `<div>
    //   <h1> Final Step: Visualise </h1>
    //   <p> Click the Visualise Algorithm Button. </p>
    //   <img src='https://i.gyazo.com/a9ba0ae7b014f86549e64a784c13a3c0.gif' id='big'>
    // </div>`,
    // `
    // <div>
    //   <h1> Post Visualisation </h1> 
    //   <p> After your visualisation is complete, you can drag both the start node and end node to see an instant exploration map </p>
    //   <p> You can also clear the Path, Walls and Weights to start a new visualisation </p>
    //   <img src=''/>
    // </div>`,
    // `<div>
    //   <h1> Got any ideas? </h1>
    //   <p> If you've found a bug/want a new feature please email me at 
    //   myemaildawgs@troll.com</p>
    //   <h3>ENJOY!!</h3>
    // </div>`
  ]
}  

Board.prototype.initialise = function(){
  this.createGrid()
  this.addEventListeners()
}

Board.prototype.createGrid = function(){   
  var  initialHTML = ''
  for(var i=0;i<this.height;i++){
    //Add row HTML
    initialHTML += "<tr id='row"+i.toString()+"'>"
    //Add row boardArr 
    this.boardArr.push([])
    for(var j=0;j<this.width;j++){
        //Add individual table Elements HTML 
        initialHTML += "<td id='"+j.toString()+","+i.toString()+"' class='unexplored'>"+"</td>"
        //Add cell element to boardArr
        var newCell = new Cell(j,i)
        this.boardArr[this.boardArr.length-1].push(newCell)

    }
    //Finish row element HTML
    initialHTML += "</tr>"
  } 
  var board = document.getElementById('board')
  board.innerHTML = initialHTML
  //Set Initial start Node
  var xStartNode =  Math.floor(this.boardArr.length/4)
  var y =  Math.floor(this.boardArr.length/2)
  this.boardArr[y][xStartNode].status = 'startNode'
  this.startNode = this.boardArr[y][xStartNode]
  document.getElementById(this.startNode.id).className = 'startingCell'
  //Set Initial end Node
  var xFinalNode = Math.floor(3*this.boardArr[0].length/4)
  this.finalNode = this.boardArr[y][xFinalNode]
  this.boardArr[y][xFinalNode].status = 'finalNode'
  document.getElementById(this.finalNode.id).className = 'finalCell'

}  

Board.prototype.addEventListeners = function(){        
  $( "#instructions_panel" ).draggable();
  // $("#instructions_panel").css({ top: '200px' });
  var board = this
  //Add window keyDown event 
  window.addEventListener('keydown',function(e){
    e.keyCode === 16 || e.keyCode === 49 ? board.keyDown = e.keyCode : board.keyDown;
  })
  //Add window keyUp event 
  window.addEventListener('keyup',function(){
    board.keyDown = false
  })  
  //Create Modal
  // board.createModal()
  //Add listeners for table elements  
  for(var i=0;i<this.height;i++){
    for(var j=0;j<this.width;j++){ 
     var id = j.toString()+','+i.toString()
      var elem = document.getElementById(id)
      elem.addEventListener('mousedown',function(e){
         e.preventDefault()
          if(this.className !== 'startingCell' && this.className !== 'startingCell shortestPath' && (this.className !== 'finalCell' && this.className !== 'finalCellUP' && this.className !== 'finalCellRIGHT' && this.className !== 'finalCellDOWN' && this.className !== 'finalCellLEFT') && this.className !== 'objectCell' && !board.shouldDisable){
            board.changeCellClick(this.id)
            board.mouseDown = true
          }
          else{
            board.currentCellStatus = this.className
            board.mouseDown = true
          }
      }) 
      elem.addEventListener('mouseup',function(e){
        e.preventDefault()
        board.mouseDown = false
        board.currentCellStatus = null
      })
      elem.addEventListener('mouseenter',function(e){
          //  console.log(this.className)
           e.preventDefault()
          //Normal Wall Creation Drag Event
          if(board.mouseDown && board.currentCellStatus === null && !board.shouldDisable){
            board.changeCellDrag(this.id)
          }
          //Dragging a start/end node 
          else if(board.mouseDown && board.currentCellStatus !== null && this.className !== 'startingCell' && this.className !== 'startingCell shortestPath' && (this.className !== 'finalCell' && this.className !== 'finalCellUP' && this.className !== 'finalCellRIGHT' && this.className !== 'finalCellDOWN' && this.className !== 'finalCellLEFT') && !board.shouldDisable){  
            this.className = board.currentCellStatus
            var idSplit = this.id.split(',')
            var cell = board.getCell(idSplit[0],idSplit[1])
            if(this.className === 'startingCell' || this.className === 'startingCell shortestPath'){ 
              if(cell.status === 'wall'){board.lastWall = true}
              else if(cell.status === 'unexplored weight'){board.lastWeight = true}
                cell.status = 'startNode'
                board.startNode = cell
                if(board.algoDone){
                  board.clearPath()
                var search = new Search(board.boardArr,board.startNode,board.finalNode,board.currentAlgo,board)
                search.startSearch()
                }

            }
            else if(this.className === 'finalCell' || this.className === 'finalCellUP' || this.className === 'finalCellRIGHT' || this.className === 'finalCellDOWN' || this.className === 'finalCellLEFT'){
              if(cell.status === 'wall'){board.lastWall = true}
              else if(cell.status === 'unexplored weight'){board.lastWeight = true}
                cell.status = 'finalNode'
                board.finalNode = cell
                if(board.algoDone){
                  board.clearPath()
                var search = new Search(board.boardArr,board.startNode,board.finalNode,board.currentAlgo,board)
                search.startSearch()
                }
            }
          }
          else if(board.mouseDown && board.currentCellStatus !== null && ((this.className === 'startingCell' || this.className === 'startingCell shortestPath') || (this.className === 'finalCell' || this.className === 'finalCellUP' || this.className === 'finalCellRIGHT' || this.className === 'finalCellDOWN' || this.className === 'finalCellLEFT')) && !board.shouldDisable){
            if(this.className === 'startingCell' || this.className === 'startingCell shortestPath'){
              board.shouldBe = 'startingCell'
            }
            else if(this.className === 'finalCell' || this.className === 'finalCellUP' || this.className === 'finalCellRIGHT' || this.className === 'finalCellDOWN' || this.className === 'finalCellLEFT'){
              board.shouldBe = 'finalCell'
            }
            else if(this.className === 'objectCell'){
              board.shouldBe = 'objectCell'
            }
          }
      })
      elem.addEventListener('mouseout',function(e){
         e.preventDefault()  
        if(((this.className === 'startingCell' || this.className === 'startingCell shortestPath') || (this.className === 'finalCell' || this.className === 'finalCellUP' || this.className === 'finalCellRIGHT' || this.className === 'finalCellDOWN' || this.className === 'finalCellLEFT')) && !board.shouldDisable){
          if(board.mouseDown && board.currentCellStatus !== null){
              if(board.shouldBe){
                this.className = board.shouldBe
                board.shouldBe = null
              }
              else{
                if(board.lastWall){
                  board.clearPath()
                  var idSplit = this.id.split(',')
                  var cell = board.getCell(idSplit[0],idSplit[1])
                  this.className = 'wall'
                  cell.status = 'wall'
                  board.lastWall = false
                }
                else if(board.lastWeight){
                  board.clearPath()
                  var idSplit = this.id.split(',')
                  var cell = board.getCell(idSplit[0],idSplit[1])
                  this.className = 'unexplored weight'
                  cell.status = 'unexplored weight'
                  cell.weight = 15
                  board.lastWeight = false
                }
                else{
                  board.clearPath()
                  var idSplit = this.id.split(',')
                  var cell = board.getCell(idSplit[0],idSplit[1])
                  this.className = 'unexplored'
                  cell.status = 'unexplored'
                }
              }
          }
        }
      })
    }
  }    
  //Add Listeners for Button Panel
  //BFS
  document.getElementById('startButtonBFS').addEventListener('click',function(){    
      if(!board.shouldDisable){
        document.getElementById('visualise').innerHTML = 'Visualise BFS'
        board.algoToRun = 'BFS'
        // search.startSearch()
      }
  })  
  //DFS
  document.getElementById('startButtonDFS').addEventListener('click',function(){ 
      if(!board.shouldDisable){
        document.getElementById('visualise').innerHTML = 'Visualise DFS'
        board.algoToRun = 'DFS'
        // search.startSearch()
      }
  })
  //Dijkstra 
  document.getElementById('startButtonDijkstra').addEventListener('click',function(){ 
    if(!board.shouldDisable){
      document.getElementById('visualise').innerHTML = 'Visualise Dijkstra'
      board.algoToRun = 'Dijkstra'
      // search.startSearch()
    }
  })
  //Fake AStar 1
  document.getElementById('startButtonAStar').addEventListener('click',function(){ 
    if(!board.shouldDisable){
      document.getElementById('visualise').innerHTML = 'Visualise Swarm'
      board.algoToRun = 'AStar'
      // search.startSearch()
    }
  })
  //Fake AStar 2
  document.getElementById('startButtonAStar2').addEventListener('click',function(){  
    if(!board.shouldDisable){
      document.getElementById('visualise').innerHTML = 'Visualise Convergent Swarm'
      board.algoToRun = 'AStar2'
      // search.startSearch()
    }
  })
  //Greedy
  document.getElementById('startButtonGreedy').addEventListener('click',function(){ 
     if(!board.shouldDisable){ 
      document.getElementById('visualise').innerHTML = 'Visualise Best First Search'
      board.algoToRun = 'Greedy'
      // search.startSearch()
     }
  })

  document.getElementById('startButtonRealAStar').addEventListener('click',function(){
    if(!board.shouldDisable){
      document.getElementById('visualise').innerHTML = "Visualise A*"
      board.algoToRun = 'RealAStar'
    }
  })
  //Bi Directional
  // document.getElementById('startButtonBidirectional').addEventListener('click',function(){
  //   document.getElementById('visualise').innerHTML = 'Visualise Bi-Directional'
  //   board.algoToRun = 'Bidirectional'
  //   // search.startSearch()
  // })
  //Basic Maze 1
  document.getElementById('startButtonBasicMaze').addEventListener('click',function(){
    if(!board.shouldDisable){
      var maze = new Maze(board,board.startNode,board.finalNode,'basicMaze')
      maze.startMaze()
    }
  })
  //Recursive Division 1
  document.getElementById('startButtonBossMaze1').addEventListener('click',function(){
    if(!board.shouldDisable){
      var maze = new Maze(board,board.startNode,board.finalNode,'bossMaze1',true)
      maze.startMaze()
    }
  })
  //Recursive Division 2
  document.getElementById('startButtonBossMaze2').addEventListener('click',function(){
    if(!board.shouldDisable){
      var maze = new Maze(board,board.startNode,board.finalNode,'bossMaze2',true)
      maze.startMaze()
    }
  })
  //Recursive Division 3
  document.getElementById('startButtonBossMaze3').addEventListener('click',function(){
    if(!board.shouldDisable){
      var maze = new Maze(board,board.startNode,board.finalNode,'bossMaze3',true)
      maze.startMaze()
    }
  })
  //Basic Weight Maze 
  document.getElementById('startButtonBasicWeightMaze').addEventListener('click',function(){
    console.log(board.shouldDisable)
    if(!board.shouldDisable){
      var maze = new Maze(board,board.startNode,board.finalNode,'basicWeightMaze',false)
      maze.startMaze()
    }
  })
  //Pokemon Theme
  document.getElementById('startButtonPokemonTheme').addEventListener('click',function(){
    //
  }) 
  //Visualise Algorithm
  document.getElementById('startButtonVisualise').addEventListener('click',function(){
    board.algoDone = false
    // console.log(board.shouldDisable)
    if((!board.shouldDisable) && board.algoToRun){
      board.clearPath()
      var algoName = board.algoToRun
      var search = new Search(board.boardArr,board.startNode,board.finalNode,algoName,board)
      search.startSearch()
    }

  })
  //Path
  document.getElementById('path').addEventListener('click',function(){
    location.reload()
  })
  //Clear Path
  document.getElementById('startButtonClearPath').addEventListener('click',function(){ 
     if(!board.shouldDisable){ 
      board.algoDone = false
      board.clearPath()
     }
  }) 
  //Clear Walls
   document.getElementById('startButtonClearWalls').addEventListener('click',function(){
    if(!board.shouldDisable){
      board.clearWalls()
    }
  })
  //Modal Buttons 
  // //Increment Page
  // document.getElementById('nextButton').addEventListener('click',function(){
  //   board.incrementModal()
  // })
  // //Decrement Page 
  // document.getElementById('previousButton').addEventListener('click',function(){
  //   board.decrementModal()
  // }) 
  //Close instructions 
  document.getElementById('x').addEventListener('click',function(){
     document.getElementById('panelParent').innerHTML = ''
  })
}   

Board.prototype.getCell = function(x,y){
  return this.boardArr[y][x]
} 

Board.prototype.changeCellClick = function(id){
  var newId = id.split(',')
  var x = parseInt(newId[0])
  var y = parseInt(newId[1])
  var cell = this.getCell(x,y)
  var toggledCell = this.toggle(cell)
  var elem = document.getElementById(id)
  if(toggledCell){
    elem.className = toggledCell
  }

} 

Board.prototype.changeCellDrag = function(id){
  var newId = id.split(',')
  var x = parseInt(newId[0])
  var y = parseInt(newId[1])
  var cell = this.getCell(x,y)
  if(cell.status !== 'finalCell' && cell.status !== 'startingCell'){
    var toggledCell = this.toggle(cell)
    var elem = document.getElementById(id)
    if(toggledCell){
      elem.className = toggledCell
    }
  }
  
}

Board.prototype.toggle = function(cell){ 
  if(cell.status === 'unexplored' && this.keyDown || cell.status === 'explored' && this.keyDown || cell.status === 'wall' && this.keyDown){
      // cell.status = 'unexplored water'
      if(this.keyDown === 49){  
        cell.weight = 15
        cell.status = 'unexplored weight'
        return cell.status
      }
  }
  else if(cell.status === 'unexplored' || cell.status === 'explored'){
      cell.status = 'wall'
      return cell.status
  }
  else if(cell.status === 'explored weight' || cell.status === 'unexplored weight'){
    cell.status = 'unexplored'
    cell.weight = 0
    return cell.status
  }
  else if(cell.status === 'wall'){
      cell.status = 'unexplored'
      return cell.status
  }
  else{
    return false;
  }
  
}

Board.prototype.createModal = function(){
  // Get the modal
  var modal = document.getElementById('myModal');
  modal.style.display = "block";
  modal.height = "500px" 
  document.getElementById('innerDisplay').innerHTML = this.modalArr[this.modalIndex]

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  // window.onclick = function(event) {
  //     if (event.target == modal) {
  //         modal.style.display = "none";
  //     }
  // }
}

Board.prototype.incrementModal = function(){
  console.log('JQUERY',$( "#myModal" ))
  if(this.modalIndex < this.modalArr.length - 1){
    this.modalIndex += 1
    document.getElementById('innerDisplay').innerHTML = this.modalArr[this.modalIndex]
  }
  else if(this.modalIndex === this.modalArr.length - 1){
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
  }
}

Board.prototype.decrementModal = function(){
  if(this.modalIndex > 0){
    this.modalIndex -= 1
    document.getElementById('innerDisplay').innerHTML = this.modalArr[this.modalIndex]
  }
}


Board.prototype.clearPath = function(){     
  document.getElementById(this.finalNode.id).className = 'finalCell'
  document.getElementById(this.startNode.id).className = 'startingCell'
  // console.log('in clear path')
  for(var i=0;i<this.boardArr.length;i++){
    for(var j=0;j<this.boardArr[i].length;j++){
      var cell = this.boardArr[i][j] 
      cell.parent = null
      if(cell.status === 'explored' || cell.status === 'shortestPath'){
        cell.status = 'unexplored'
        document.getElementById(cell.id).className = 'unexplored'
      }
      else if(cell.status === 'shortestPath explored weight' || cell.status === 'explored weight'){
        cell.status = 'unexplored weight'
        document.getElementById(cell.id).className = 'unexplored weight'
      }
      if(cell.status !== 'startNode'){
        cell.direction = 'UP'
        cell.distance = Infinity
      }
    }
  }
} 

Board.prototype.clearParents = function(show){
  console.log("clear Parents")
  for(var i=0;i<this.boardArr.length;i++){
    for(var j=0;j<this.boardArr[i].length;j++){
      var cell = this.boardArr[i][j] 
      if(!show && cell.status !== 'shortestPath' && cell.status !== 'objectNode' && cell.status !== 'startNode'){
        cell.parent = null
        cell.direction = 'UP'
        cell.distance = Infinity
      }
      if(show){
        console.log(cell)
      }
    }
  }
}

Board.prototype.clearWalls = function(){
  for(var i=0;i<this.boardArr.length;i++){ 
    for(var j=0;j<this.boardArr[i].length;j++){
      var cell = this.boardArr[i][j] 
      cell.parent = null
      // console.log(j,i,cell)
      if(cell.status === 'wall' || cell.status === 'unexplored weight'){
        cell.status = 'unexplored'
        cell.weight = 0
        document.getElementById(cell.id).className = 'unexplored'
      }
    }
  }
} 

Board.prototype.generateRandom = function(){
   console.log("Generating random Maze")
} 

var bar = document.getElementById('navbarDiv').clientHeight + document.getElementById('mainText').clientHeight
var height = Math.floor(document.documentElement.clientHeight) - bar
var width = Math.floor(document.documentElement.clientWidth)
var finalHeight = height/27
var finalWidth = width/25
$("#instructions_panel").css({ top: `${finalHeight * 27/4}px`});
$("#instructions_panel").css({ left: `${finalWidth * 25/3.5}px`});
var board = new Board(finalHeight,finalWidth-1)
// var board = new Board(10,10)
board.initialise() 







