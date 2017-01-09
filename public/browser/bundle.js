(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  board.createModal()
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
  //Increment Page
  document.getElementById('nextButton').addEventListener('click',function(){
    board.incrementModal()
  })
  //Decrement Page 
  document.getElementById('previousButton').addEventListener('click',function(){
    board.decrementModal()
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
var board = new Board(finalHeight,finalWidth-1)
// var board = new Board(10,10)
board.initialise() 








},{"./cell":2,"./maze":3,"./search":4}],2:[function(require,module,exports){
function Cell(xPos,yPos){
  this.x = xPos
  this.y = yPos
  this.exploredBy = null
  this.status = 'unexplored' 
  this.id = this.x.toString()+','+this.y.toString()
  this.weight = 0
  this.parent = null
  this.direction = 'UP'
  this.distance = Infinity
  this.heuristicDistance = 0
  this.totalDistance = Infinity
  this.previousStatus = 'unexplored'
} 

Cell.prototype.getCellStatus = function(){
  return this.status
}

module.exports = Cell
// watchify /Users/Hussein/Desktop/testProjects/mazeProject/public/browser/board.js -o /Users/Hussein/Desktop/testProjects/mazeProject/public/browser/bundle.js 
},{}],3:[function(require,module,exports){
function Maze(board,startNode,finalNode,mazeToDo,animate){ 
  this.board = board
	this.boardArr = board.boardArr
  this.startNode = startNode
	this.finalNode = finalNode
	this.listToAnimate = []
	this.mazeToDo = mazeToDo
	this.toAnimate = animate
} 

Maze.prototype.startMaze = function(){
	this.board.shouldDisable = true
	this.board.clearWalls()
	this.board.clearPath()
	this.maxX = this.boardArr[0].length 
	this.maxY = this.boardArr.length
	if(this.mazeToDo === 'basicMaze'){
		this.basicMaze()
		this.toAnimate === true ? this.animate() : this.instant()
	}
	else if(this.mazeToDo === 'bossMaze1'){
		this.mazeGenerator()
		this.toAnimate === true ? this.animate() : this.instant()
	}
	else if(this.mazeToDo === 'bossMaze2'){
		this.mazeGenerator()
		this.toAnimate === true ? this.animate() : this.instant()
	}
	else if(this.mazeToDo === 'bossMaze3'){
		this.mazeGenerator()
		this.toAnimate === true ? this.animate() : this.instant()
	}
	else if(this.mazeToDo === 'basicWeightMaze'){
		this.basicWeightMaze()
		this.toAnimate === true ? this.animate() : this.instant()
	}

}  

Maze.prototype.basicMaze = function(){
	for(var i=0;i<this.boardArr.length;i++){
		for(var j=0;j<this.boardArr[0].length;j++){
			var elem = document.getElementById(j.toString()+','+i.toString())
			if(Math.random() > 0.75 && elem.className !== 'startingCell' && elem.className !== 'finalCell'){
				var cell = this.board.getCell(j,i)
				cell.status = 'wall'
				this.listToAnimate.push(cell)
			}
		}
	}
}

Maze.prototype.basicWeightMaze = function(){
	for(var i=0;i<this.boardArr.length;i++){
		for(var j=0;j<this.boardArr[0].length;j++){
			var elem = document.getElementById(j.toString()+','+i.toString())
			if(Math.random() > 0.75 && elem.className !== 'startingCell' && elem.className !== 'finalCell'){
				var cell = this.board.getCell(j,i)
				cell.status = 'unexplored weight'
				cell.weight = 15
				this.listToAnimate.push(cell)
			}
		}
	}
}

Maze.prototype.mazeGenerator = function(){
	for(var i=0;i<this.maxY;i++){
		for(var j=0;j<this.maxX;j++){
			if(i === 0 || i === this.maxY-1 || j === 0 || j === this.maxX - 1){
				var cell = this.board.getCell(j,i)
				if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
					cell.status = 'wall'
					this.listToAnimate.push(cell)
				}
				// document.getElementById(cell.id).className = 'wall'
			}
		}
	}
	this.bossMaze(2,this.boardArr[0].length-3,2,this.boardArr.length-3,'horizontal')
} 

Maze.prototype.bossMaze = function(startX,endX,startY,endY,orientation){   
	if(orientation === 'vertical'){  
		//Get Wall
		if(startX % 2 === 0 && (endY - startY) > -1 && (endX-startX) > -1){
			//Get Valid Walls 
			var validWall = []
			for(var i=startX;i<endX+1;i+=2){
				validWall.push(i)
			}
			var randomX = validWall[Math.floor(Math.random()*validWall.length)]
			//Draw Wall 
			this.drawWall(randomX,randomX,startY,endY,'vertical')
			//Get possible split points  
			var splitArr = []
			for(var i=startY-1;i<endY+2;i+=2){
				splitArr.push(randomX.toString()+','+i.toString())
			}
			//Choose where to split by 
			var randomPlaceToSplitID = splitArr[Math.floor(Math.random() * splitArr.length)]
			//Make hole 
			var elem = document.getElementById(randomPlaceToSplitID)
			var idArr = randomPlaceToSplitID.split(',')
			var cell = this.board.getCell(parseInt(idArr[0]),parseInt(idArr[1]))
			// elem.className = 'unexplored'
			if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'unexplored'
				this.listToAnimate.push(cell)
			}

			var lengthLargerThanHeightLeft = !this.lengthLargerThanHeight(startX,randomX-2,startY,endY);
			var lengthLargerThanHeightRight; 
			if(this.mazeToDo === 'bossMaze 1' || this.mazeToDo === 'bossMaze2'){
 				lengthLargerThanHeightRight = !this.lengthLargerThanHeight(randomX+2,endX,startY,endY);
				 
			}
			else if(this.mazeToDo === 'bossMaze3'){
				lengthLargerThanHeightRight = this.lengthLargerThanHeight(randomX+2,endX,startY,endY);
			}
			//Left One 
				//Left Orientation should be vertical 
				if(lengthLargerThanHeightLeft){
					this.bossMaze(startX,randomX - 2,startY,endY,'horizontal')
				}
				//Left Orientation should be horizontal 
				else{
					this.bossMaze(startX,randomX - 2,startY,endY,'vertical')
				}
			//Right One 
				//Right Orientation should be vertical 
				if(lengthLargerThanHeightRight){
					this.bossMaze(randomX+2,endX,startY,endY,'horizontal')
				}
				//Right Orientation should be horizontal 
				else{	
					this.bossMaze(randomX+2,endX,startY,endY,'vertical')
				}
		}
		else{
				return;
		}
	}
 
	else if(orientation === 'horizontal'){  
		//Get Wall
		if(startY % 2 === 0 && (endY - startY) > -1 && (endX-startX) > -1){
			//Get Valid Walls 
			var validWall = []
			for(var i=startY;i<endY+1;i+=2){
					validWall.push(i)
			}
			var randomY = validWall[Math.floor(Math.random()*validWall.length)]
			//Draw Wall 
			this.drawWall(startX,endX,randomY,randomY,'horizontal')
			//Get possible split points 
			var splitArr = []
			for(var i=startX-1;i<endX+2;i+=2){
				 splitArr.push(i.toString()+','+randomY.toString())
			}
			//Choose where to split by 
			var randomPlaceToSplitID = splitArr[Math.floor(Math.random() * splitArr.length)]
			//Make hole 
			var elem = document.getElementById(randomPlaceToSplitID)
			var idArr = randomPlaceToSplitID.split(',')
			var cell = this.board.getCell(parseInt(idArr[0]),parseInt(idArr[1]))
			// elem.className = 'unexplored'
			if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'unexplored'
				this.listToAnimate.push(cell)
			}

			var lengthLargerThanHeightTop = !this.lengthLargerThanHeight(startX,endX,startY,randomY-2);
			var lengthLargerThanHeightBottom; 
			if(this.mazeToDo === 'bossMaze1' || this.mazeToDo === 'bossMaze3'){
				lengthLargerThanHeightBottom = !this.lengthLargerThanHeight(startX,endX,randomY+2,endY);
			}
			else if(this.mazeToDo === 'bossMaze2'){
				lengthLargerThanHeightBottom = this.lengthLargerThanHeight(startX,endX,randomY+2,endY);
			}
			//Top One 
				//Top Orientation should be horizontal 
				if(lengthLargerThanHeightTop){
					this.bossMaze(startX,endX,startY,randomY - 2,'horizontal')
				}
				//Bottom Orientation should be vertical
				else{
					this.bossMaze(startX,endX,startY,randomY - 2,'vertical')
				}
			//Bottom One 
				//Bottom Orientation should be horizontal
				if(lengthLargerThanHeightBottom){
					this.bossMaze(startX,endX,randomY + 2,endY,'horizontal')
				}
				//Right Orientation should be vertical 
				else{	
					this.bossMaze(startX,endX,randomY+2,endY,'vertical')
				}
		}
		else{
				return;
		}
	}
}

Maze.prototype.drawWall = function(startX,endX,startY,endY,orientation){ 
	if(orientation === 'vertical'){
		for(var i=startY-1;i<endY+2;i++){
			var elem = document.getElementById(startX.toString()+','+i.toString())
			// elem.className = 'wall'
			var cell = this.board.getCell(startX,i)
			if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'wall'
				this.listToAnimate.push(cell)
			}
		}
	}
	else if(orientation === 'horizontal'){
		for(var j=startX-1;j<endX+2;j++){
			var elem = document.getElementById(j.toString()+','+startY.toString())
			// elem.className = 'wall'
			var cell = this.board.getCell(j,startY)
			if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'wall'
				this.listToAnimate.push(cell)
			}

		}
	}
}

Maze.prototype.lengthLargerThanHeight = function(startX,endX,startY,endY){
	var returnVal = (endX-startX) - (endY-startY) > 0
	return returnVal
}

Maze.prototype.animate = function(){ 
  var self = this
	var list = this.listToAnimate
	function timeout(index) {
    setTimeout(function () {
        if(index === list.length){
					self.board.shouldDisable = false
					return
        }
        var cell = list[index]
				document.getElementById(cell.id).className = cell.status
        timeout(index+1);
    }, 0.0001);
  }   
  timeout(0)
}

Maze.prototype.instant = function(){
	for(var i in this.listToAnimate){
		var cell = this.listToAnimate[i]
		document.getElementById(cell.id).className = cell.status
	}
	this.board.shouldDisable = false
}

module.exports = Maze
},{}],4:[function(require,module,exports){
function Search(board,startNode,finalNode,currentAlgorithm,boardA){ 
  this.currentAlgorithm = currentAlgorithm
  this.board = board
  this.startNode = startNode
	this.finalNode = finalNode
	this.boardA = boardA
} 

Search.prototype.startSearch = function(){ 
	this.boardA.shouldDisable = true
	document.getElementById(this.finalNode.id).className = 'finalCell'
	this.finalNode.className = 'finalCell'
	if(this.currentAlgorithm === 'BFS'){
		var exploredList = this.searchBFS()
    this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}
	else if(this.currentAlgorithm === 'DFS'){
		var exploredList = this.searchDFS()
    this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}
	else if(this.currentAlgorithm === 'Dijkstra'){
		var exploredList = this.searchDijkstra()
		this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}
	else if(this.currentAlgorithm === 'AStar'){
		var exploredList = this.searchAStar()
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	} 
	else if(this.currentAlgorithm === 'AStar2'){
		var exploredList = this.searchAStar('2')
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	} 
	else if(this.currentAlgorithm === 'Greedy'){
		var exploredList = this.searchGreedy()
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}   
	else if(this.currentAlgorithm === 'RealAStar'){
		var exploredList = this.searchRealAStaar()
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}     
	else if(this.currentAlgorithm === 'Bidirectional'){
		var exploredList = this.searchBidirectional()
		this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}    
}  

Search.prototype.getNeighbours = function(arr,node,algo,exploredList){   
  var neighbourList = []
	//Get Neighbour Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall'){
		var neighbour = arr[node.y-1][node.x]
		
		if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode' && exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Right 
	if(node.x<arr[0].length-1 && arr[node.y][node.x+1].status !== 'wall'){
		var neighbour = arr[node.y][node.x+1]
		// console.log(neighbour.id,arr.finalNode)
			if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode'&& exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Down 
	if((node.y<arr.length-1) && arr[node.y+1][node.x].status !== 'wall'){
		var neighbour = arr[node.y+1][node.x]
	if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode'&& exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Left
	if(node.x>0 && arr[node.y][node.x-1].status !== 'wall'){
		var neighbour = arr[node.y][node.x-1]
	if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode'&& exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	return neighbourList
}       

Search.prototype.searchDFS = function(){  
 var exploredList = [] 
	var listToExplore = [this.startNode]
	var isPresent = function(node){
		var returnVal = false
		for(var i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !==0){
		var currentNode = listToExplore[0]
		if(currentNode === this.finalNode){
			currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
      listToExplore = listToExplore.slice(1)
    }
    else if(!isPresent(currentNode)){
			var neighbours = this.getNeighbours(this.board,currentNode,'DFS',exploredList)
			listToExplore = listToExplore.slice(1)
			listToExplore = neighbours.concat(listToExplore)
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}
	}
	this.boardA.currentAlgo = 'DFS'
	return exploredList 
} 

Search.prototype.searchBFS = function(){      
  var exploredList = []
	var numOnes = 0
	var listToExplore = [this.startNode]
	var isPresent = function(node){
		var returnVal = false
		for(var i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !==0){ 
		var currentNode = listToExplore[0]
		var inWhileLoop = new Date()
		if(currentNode === this.finalNode){
			// currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
      listToExplore = listToExplore.slice(1)
    }
    else if(!isPresent(currentNode)){
			var neighbours = this.getNeighbours(this.board,currentNode)
			listToExplore = listToExplore.slice(1)
			listToExplore = listToExplore.concat(neighbours)
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}
	}
	this.boardA.currentAlgo = 'BFS'
	return exploredList 
}  

Search.prototype.searchBidirectional = function(){    
	this.startNode.distance = 0
	this.finalNode.distance = 0
	var exploredList = []
	var listToExploreStart = [this.startNode]
	var listToExploreFinal = [this.finalNode]
	var numOnes = 0
	var count = 2
	var currentNode;
	var status;
	var pleaseWork = function(node,status){ 
		var returnVal = false
		for(var i in exploredList){
			if(i < exploredList.length - 1 && exploredList[i].id === node.id && exploredList[i].exploredBy !== status){
					// console.log(exploredList[i].id,node.id,status,exploredList[i].exploredBy)
					returnVal = 'break'
					break
			}
			else if(i < exploredList.length - 1 && exploredList[i].id === node.id && exploredList[i].exploredBy === status){
					// console.log(exploredList[i].id,node.id,status,exploredList[i].exploredBy)
					returnVal = true
			}
		} 
		return returnVal

	}
	whileLoop:
	while(listToExploreStart.length !== 0 && listToExploreFinal.length !== 0){ 
		//Check which list to use currentNode from 
		// console.log(listToExploreStart.length+listToExploreFinal.length)
		listToExploreStart = listToExploreStart.sort(function(nodeA,nodeB){return nodeA.distance - nodeB.distance})
		listToExploreFinal = listToExploreFinal.sort(function(nodeA,nodeB){return nodeA.distance - nodeB.distance})
		currentNode = count % 2 === 0 ? listToExploreStart[0] : listToExploreFinal[0]
		// console.log(currentNode)
		count % 2 === 0 ? status = 'start' : status = 'final'
		var value = pleaseWork(currentNode,status)
		// console.log(value)
		if(value === 'break'){
			console.log("breaking whileLoop")
			break whileLoop
		}
		//Wall 
		if(currentNode.status === 'wall'){
				count % 2 === 0 ? listToExploreStart = listToExploreStart.slice(1) : listToExploreFinal = listToExploreFinal.slice(1)
		}
		else if(value === false){ 
			//Get neighbours 
			var neighbours;
			count % 2 === 0 ? neighbours = this.getNeighboursAStar(this.board,currentNode,exploredList,'algo',this.finalNode) : neighbours = this.getNeighboursAStar(this.board,currentNode,exploredList,'algo',this.startNode) 
			// var neighbours = this.getNeighbours(this.board,currentNode)
			//Remove node from listToExplore 
			if(count % 2 === 0){
					listToExploreStart = listToExploreStart.slice(1)
			}
			else{
				listToExploreFinal = listToExploreFinal.slice(1)
			}

			if(count % 2 === 0){
				var newNeighboursList = []
				for(var i in neighbours){
					neighbours[i].exploredBy = 'start'
					// console.log(neighbours[i])
					newNeighboursList.push(neighbours[i])
				}
				listToExploreStart = listToExploreStart.concat(newNeighboursList) 
			}
			else{
				var newNeighboursList = []
				for(var i in neighbours){
					neighbours[i].exploredBy = 'final'
					// console.log(neighbours[i])
					newNeighboursList.push(neighbours[i])
				}
					listToExploreFinal = listToExploreFinal.concat(newNeighboursList)
			}
			++count
			if(count < 5){console.log(exploredList)}
			exploredList.push(currentNode)
		}
		else{
			count % 2 === 0 ? listToExploreStart = listToExploreStart.slice(1) : listToExploreFinal = listToExploreFinal.slice(1)
		}
		// ++count
	}
	return exploredList
}

Search.prototype.searchBidirectional2 = function(){

}

Search.prototype.searchAStar = function(algo){  	
	this.startNode.distance = 0
	var listToExplore = [this.startNode]
	var exploredList = []
	var isPresent = function(node){
		var returnVal = false
		for(var i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		} 
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !== 0){
		//Sort listToExplore by distance 
		listToExplore = listToExplore.sort(function(nodeA,nodeB){return nodeA.distance - nodeB.distance})
		//Get currentNode 
		var currentNode = listToExplore[0];

		if(currentNode === this.finalNode){
			currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
			listToExplore = listToExplore.slice(1)
		}
		else if(!isPresent(currentNode)){
			//If currentNode is finalNode break 
			if(currentNode === this.finalNode){break whileLoop}
			//Get currentNode's neighbours 
			var neighbours = this.getNeighboursAStar(this.board,currentNode,exploredList,algo,this.finalNode)
			//Add neighbours to listToExplore
			listToExplore = listToExplore.concat(neighbours)
			//Remove currentNode from listToExplore
			listToExplore = listToExplore.slice(1)
			//Add currentNode to exploredList 
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}
	}
	algo === '2' ? this.boardA.currentAlgo = 'AStar2': this.boardA.currentAlgo = 'AStar'
	return exploredList
}

Search.prototype.searchGreedy = function(){
	this.startNode.distance = 0
	var listToExplore = [this.startNode]
	var exploredList = []
	var isPresent = function(node){
		var returnVal = false
		for(var i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !== 0){
		//Sort listToExplore by distance 
		listToExplore = listToExplore.sort(function(nodeA,nodeB){return nodeA.distance - nodeB.distance})
		//Get currentNode 
		var currentNode = listToExplore[0];

		if(currentNode === this.finalNode){
			currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
			listToExplore = listToExplore.slice(1)
		}
		else if(!isPresent(currentNode)){
			//If currentNode is finalNode break 
			if(currentNode === this.finalNode){break whileLoop}
			//Get currentNode's neighbours 
			var neighbours = this.getNeighboursGreedy(this.board,currentNode,exploredList)
			//Add neighbours to listToExplore
			listToExplore = listToExplore.concat(neighbours)
			//Remove currentNode from listToExplore
			listToExplore = listToExplore.slice(1)
			//Add currentNode to exploredList 
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}
	}
	this.boardA.currentAlgo = 'Greedy'
	return exploredList
}

Search.prototype.showAnimation = function(exploredList){   
	// for(var i in exploredList){console.log(exploredList[i].status,exploredList[i].weight)}
	var count = 0
	var self = this
	var startNode = exploredList[0]
  exploredList = exploredList.slice(1)
	var endNode = exploredList[exploredList.length-1]
  function timeout(index,exploredList,timeLength) {   
		setTimeout(function () {
        if(index === exploredList.length){
					if(count === 0) showPath(endNode,self)
					else{ 
						self.boardA.shouldDisable = false
						self.algoDone()

					}
					return
        }
        change(exploredList[index],index,exploredList.length)
        timeout(index+1,exploredList,timeLength);
    }, timeLength);
  }  
  function change(node,index,length){  
		var elem = document.getElementById(node.id)
		if(node.status === 'unexplored weight'){
			node.status = 'explored weight'
			elem.className = 'explored weight'
		}
		else if(node.status === 'unexplored'){
			node.status = 'explored'
			elem.className = 'explored'
		}
		else if(node.status === 'shortestPath explored weight'){
			elem.className = 'shortestPath explored weight'
			if(node.parent.status === 'shortestPath') document.getElementById(node.parent.id).className = 'shortestPath'
			if(index === length -1 ) self.changeFinalClassName()
		}
		else if(node.status === 'shortestPath'){
			if(node.parent.status !== 'startNode'){
				if(node.parent.status === 'shortestPath') document.getElementById(node.parent.id).className = 'shortestPath'
				if(index !== length - 1){
					var newClassName = 'shortestPath' + node.direction
					document.getElementById(node.id).className = newClassName
				}
				else {
					document.getElementById(node.id).className = 'shortestPath'
					self.changeFinalClassName()
				}
			}
			else{
				document.getElementById(node.parent.id).className = 'startingCell shortestPath'
				node.status = 'shortestPath'
				if(self.finalNode.parent === node){
					document.getElementById(node.id).className = 'shortestPath' + node.direction
					self.changeFinalClassName(node)
				}
			}
		}
  } 
	function showPath(node,search){ 
		count++
		var listPath = []
		var endNode = Object.assign({},node)
		while(node !== startNode){
			if(node.status !== endNode.status){
				listPath.push(node)
			}
			node = node.parent
		}
		if(endNode.status === self.finalNode.status){
			listPath.forEach(function(e){
				e.status === 'explored weight' ? e.status = 'shortestPath explored weight' : 	e.status ='shortestPath' 
			})
			timeout(0,listPath.reverse(),35)
		}
		else{
			self.boardA.shouldDisable = false
		}
	}
  timeout(0,exploredList,0.001)
}

Search.prototype.algoDone = function(){
	this.boardA.algoDone = true
}

Search.prototype.changeFinalClassName = function(node){
	if(node) document.getElementById(node.id).className = 'shortestPath'
	var finalCell;
	finalCell = document.getElementsByClassName('finalCell')[1]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellUP')[0]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellRIGHT')[0]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellDOWN')[0]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellLEFT')[0]
	finalCell.className = 'finalCell' + this.finalNode.direction
}

Search.prototype.changeFirstClassName = function(){
	document.getElementById(this.startNode.id).className = 'startingCell shortestPath'
}

Search.prototype.showAnimationDrag = function(exploredList){ 
	for(var i in exploredList){
		var cell = exploredList[i]
		if(cell.status === 'unexplored'){
			cell.status = 'explored'
			document.getElementById(cell.id).className = 'explored'
		}
		else if(cell.status === 'unexplored weight'){
			cell.status = 'explored weight'
			document.getElementById(cell.id).className = 'explored weight'
		}
	} 
	var endNode = exploredList[exploredList.length-1]
	var newEndNode = Object.assign({},endNode)
	var shortestPathList = []
	while(endNode !== this.startNode){
		shortestPathList.push(endNode)
		endNode = endNode.parent
	}
	shortestPathList = shortestPathList.reverse()
	if(newEndNode.status === 'finalNode'){
		this.changeFirstClassName()
		this.changeFinalClassName()
		for(var i in shortestPathList){
			var cell = shortestPathList[i]
			if(cell.status === 'explored weight'){
				cell.status = 'shortestPath explored weight'
				document.getElementById(cell.id).className = 'shortestPath explored weight'
			}
			else if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'explored'
				document.getElementById(cell.id).className = 'shortestPath'
			}
		}
	}
	this.boardA.shouldDisable = false
	this.boardA.algoDone = true
	 
}  

Search.prototype.getNeighboursDijkstra = function(arr,node,exploredList){   
	var neigbourList = []
	//Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
		//Get Up neighbour 
		var neighbour = arr[node.y-1][node.x] 
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'UP'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Right 
	if(node.x<arr[0].length-1 && arr[node.y][node.x+1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x+1],exploredList) === false){ 
		//Get Up neighbour 
		var neighbour = arr[node.y][node.x+1]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'RIGHT'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Down 
	if((node.y<arr.length-1) && arr[node.y+1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y+1][node.x],exploredList) === false){
		//Get Up neighbour 
		var neighbour = arr[node.y+1][node.x]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'DOWN'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Left
	if(node.x>0 && arr[node.y][node.x-1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x-1],exploredList) === false){
		//Get Up neighbour 
		var neighbour = arr[node.y][node.x-1]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'LEFT'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		}  
	}
	return neigbourList
}  

Search.prototype.getNeighboursAStar = function(arr,node,exploredList,algo,finalNode){     
	var neigbourList = [] 
	//Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
		//Get Up neighbour 
		var neighbour = arr[node.y-1][node.x]
		// console.log('neighbour',neighbour.distance)
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		var newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
		algo === '2' ? newNeighbourDistance = newNeighbourDistance2 : newNeighbourDistance;
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			// console.log("here")
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'UP'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Right 
	if(node.x<arr[0].length-1 && arr[node.y][node.x+1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x+1],exploredList) === false){ 
		//Get Up neighbour 
		var neighbour = arr[node.y][node.x+1]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		var newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
		algo === '2' ? newNeighbourDistance = newNeighbourDistance2 : newNeighbourDistance;
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'RIGHT'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Down 
	if((node.y<arr.length-1) && arr[node.y+1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y+1][node.x],exploredList) === false){
		//Get Up neighbour 
		var neighbour = arr[node.y+1][node.x]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		var newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
		algo === '2' ? newNeighbourDistance = newNeighbourDistance2 : newNeighbourDistance;
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'DOWN'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Left
	if(node.x>0 && arr[node.y][node.x-1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x-1],exploredList) === false){
		//Get Up neighbour 
		var neighbour = arr[node.y][node.x-1]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		var newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
		algo === '2' ? newNeighbourDistance = newNeighbourDistance2 : newNeighbourDistance;
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'LEFT'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		}  
	}
	return neigbourList
} 

Search.prototype.getNeighboursGreedy = function(arr,node,exploredList){   
	var neigbourList = []
	//Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
		//Get Up neighbour 
		var neighbour = arr[node.y-1][node.x] 
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
		//Calculate new neighbour distance	
		var newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'UP'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Right 
	if(node.x<arr[0].length-1 && arr[node.y][node.x+1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x+1],exploredList) === false){ 
		//Get Up neighbour 
		var neighbour = arr[node.y][node.x+1]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
		//Calculate new neighbour distance	
		var newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'RIGHT'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Down 
	if((node.y<arr.length-1) && arr[node.y+1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y+1][node.x],exploredList) === false){
		//Get Up neighbour 
		var neighbour = arr[node.y+1][node.x]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
		//Calculate new neighbour distance	
		var newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'DOWN'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Left
	if(node.x>0 && arr[node.y][node.x-1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x-1],exploredList) === false){
		//Get Up neighbour 
		var neighbour = arr[node.y][node.x-1]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
		//Calculate new neighbour distance	
		var newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'LEFT'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		}  
	}
	return neigbourList
} 

Search.prototype.searchDijkstra = function(){ 
	this.startNode.distance = 0
	var listToExplore = [this.startNode]
	var exploredList = []
	var isPresent = function(node){
		var returnVal = false
		for(var i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !== 0){
		//Sort listToExplore by distance 
		listToExplore = listToExplore.sort(function(nodeA,nodeB){return nodeA.distance - nodeB.distance})
		//Get currentNode 
		var currentNode = listToExplore[0];

		if(currentNode === this.finalNode){
			currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
			listToExplore = listToExplore.slice(1)
		}
		else if(!isPresent(currentNode)){
			//If currentNode is finalNode break 
			if(currentNode === this.finalNode){break whileLoop}
			//Get currentNode's neighbours 
			var neighbours = this.getNeighboursDijkstra(this.board,currentNode,exploredList)
			//Add neighbours to listToExplore
			listToExplore = listToExplore.concat(neighbours)
			//Remove currentNode from listToExplore
			listToExplore = listToExplore.slice(1)
			//Add currentNode to exploredList 
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}

	}
	this.boardA.currentAlgo = 'Dijkstra'

	return exploredList
}   

Search.prototype.hasBeenExplored = function(node,exploredList){
	var returnVal = false
	for(var i in exploredList.length){
		if(exploredList[i].id === node.id){
			returnVal = true
		}
	}
	return returnVal
} 

Search.prototype.checkNumberOfMoves = function(currentDirection,direction){
	if(currentDirection === direction){
		return 0
	}
	else if((currentDirection === 'UP' || currentDirection === 'DOWN') && (direction === 'LEFT' || direction === 'RIGHT')){
		return 1
	}
	else if((currentDirection === 'LEFT' || currentDirection === 'RIGHT') && (direction === 'UP' || direction === 'DOWN')){
		return 1
	}
	else if((currentDirection === 'LEFT' || currentDirection === 'RIGHT') && (direction === 'LEFT' || direction === 'RIGHT')){
		return 2
	}
	else if((currentDirection === 'UP' || currentDirection === 'DOWN') && (direction === 'UP' || direction === 'DOWN')){
		return 2
	}
}

Search.prototype.manhattanDistance = function(node1,node2){ 
	var xDiff = Math.abs(node1.x - node2.x)
	var yDiff = Math.abs(node1.y - node2.y)
	var distance = Math.sqrt(Math.pow(xDiff,2)+Math.pow(yDiff,2))
	var sum = xDiff + yDiff
	return sum
}

Search.prototype.realAStar = function(){ 
	this.startNode.distance = 0
	this.startNode.heuristicDistance = this.manhattanDistance(this.startNode,this.finalNode)
	this.startNode.totalDistance = this.startNode.distance + this.startNode.heuristicDistance
	var listToExplore = [this.startNode]
	var exploredList = []
	var isPresent = function(node){
		var returnVal = false
		for(var i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !== 0){
		//Sort listToExplore by distance 
		listToExplore = listToExplore.sort(function(nodeA,nodeB){return (nodeA.totalDistance + nodeA.heuristicDistance) - (nodeB.totalDistance + nodeB.heuristicDistance)})
		//Get currentNode 
		var currentNode = listToExplore[0];

		if(currentNode === this.finalNode){
			currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
			listToExplore = listToExplore.slice(1)
		}
		else if(!isPresent(currentNode)){
			//If currentNode is finalNode break 
			if(currentNode === this.finalNode){break whileLoop}
			//Get currentNode's neighbours 
			var neighbours = this.getNeighboursRealAStar(this.board,currentNode,exploredList)
			//Add neighbours to listToExplore
			listToExplore = listToExplore.concat(neighbours)
			//Remove currentNode from listToExplore
			listToExplore = listToExplore.slice(1)
			//Add currentNode to exploredList 
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}
	}
	this.boardA.currentAlgo = 'RealAStar'
	return exploredList
}

Search.prototype.getNeighboursRealAStar = function(arr,node,exploredList){
	var self = this 
	var list = this.getNeighboursDijkstra(arr,node,exploredList)
	list.forEach((neighbour) =>{
		neighbour.heuristicDistance = self.manhattanDistance(neighbour,self.finalNode) 
		neighbour.totalDistance = neighbour.distance + neighbour.heuristicDistance
		console.log(neighbour)
	})
	return list;
}

Search.prototype.searchRealAStaar = function(){   
	this.startNode.distance = 0
	this.startNode.heuristicDistance = this.manhattanDistance(this.startNode,this.finalNode)
	this.startNode.totalDistance = this.startNode.distance + this.startNode.heuristicDistance
	var listToExplore = [this.startNode]
	var exploredList = []
	var isPresent = function(node){ 
		var returnVal = false
		for(var i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !== 0){
		//Sort listToExplore by distance 
		listToExplore = listToExplore.sort(function(nodeA,nodeB){
			if(nodeA.totalDistance === nodeB.totalDistance){
				return nodeA.heuristicDistance - nodeB.heuristicDistance
			}
			return (nodeA.totalDistance) - (nodeB.totalDistance)
		})
		//Get currentNode 
		var currentNode = listToExplore[0];

		if(currentNode === this.finalNode){ 
			currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
			listToExplore = listToExplore.slice(1)
		}
		else if(!isPresent(currentNode)){ 
			//If currentNode is finalNode break 
			if(currentNode === this.finalNode){break whileLoop}
			//Get currentNode's neighbours 
			var neighbours = this.getNeighboursRealAStaar(this.board,currentNode,exploredList)
			//Add neighbours to listToExplore
			listToExplore = listToExplore.concat(neighbours)
			//Remove currentNode from listToExplore
			listToExplore = listToExplore.slice(1)
			//Add currentNode to exploredList 
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}

	}
	this.boardA.currentAlgo = 'RealAStar'

	return exploredList
}

Search.prototype.getNeighboursRealAStaar = function(arr,node,exploredList){ 
		var neigbourList = []
		//Up 
		if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
			//Get Up neighbour 
			var neighbour = arr[node.y-1][node.x] 
			//Get current distance 
			var currentDistance = node.distance 
			//Get My Direction 
			var myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			var numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
			//Calculate new neighbour distance	
			var newNeighbourDistance = node.distance  + 1 + numberOfMoves + neighbour.weight 
			neighbour.heuristicDistance = this.manhattanDistance(neighbour,this.finalNode)
			//If this is lower than the currentDistance on the neighbour change
			if(newNeighbourDistance < neighbour.distance){
				neighbour.distance = newNeighbourDistance
				neighbour.direction = 'UP'
				neighbour.totalDistance = neighbour.heuristicDistance + neighbour.distance 
				//Add neighbour to neigbourList
				neigbourList.push(neighbour)
				neighbour.parent = node
			} 
		} 
		//Right 
		if(node.x<arr[0].length-1 && arr[node.y][node.x+1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x+1],exploredList) === false){ 
			//Get Up neighbour 
			var neighbour = arr[node.y][node.x+1]
			//Get current distance 
			var currentDistance = node.distance 
			//Get My Direction 
			var myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			var numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
			//Calculate new neighbour distance	
			var newNeighbourDistance = node.distance  + 1 + numberOfMoves + neighbour.weight
			neighbour.heuristicDistance = this.manhattanDistance(neighbour,this.finalNode)
			//If this is lower than the currentDistance on the neighbour change
			if(newNeighbourDistance < neighbour.distance){
				neighbour.distance = newNeighbourDistance
				neighbour.direction = 'RIGHT'
				neighbour.totalDistance = neighbour.heuristicDistance + neighbour.distance 
				//Add neighbour to neigbourList
				neigbourList.push(neighbour)
				neighbour.parent = node
			} 
		} 
		//Down 
		if((node.y<arr.length-1) && arr[node.y+1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y+1][node.x],exploredList) === false){
			//Get Up neighbour 
			var neighbour = arr[node.y+1][node.x]
			//Get current distance 
			var currentDistance = node.distance 
			//Get My Direction 
			var myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			var numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
			//Calculate new neighbour distance	
			var newNeighbourDistance = node.distance  + 1 + numberOfMoves + neighbour.weight
			neighbour.heuristicDistance = this.manhattanDistance(neighbour,this.finalNode)
			//If this is lower than the currentDistance on the neighbour change
			if(newNeighbourDistance < neighbour.distance){
				neighbour.distance = newNeighbourDistance
				neighbour.direction = 'DOWN'
				neighbour.totalDistance = neighbour.heuristicDistance + neighbour.distance 
				//Add neighbour to neigbourList
				neigbourList.push(neighbour)
				neighbour.parent = node
			} 
		} 
		//Left
		if(node.x>0 && arr[node.y][node.x-1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x-1],exploredList) === false){
			//Get Up neighbour 
			var neighbour = arr[node.y][node.x-1]
			//Get current distance 
			var currentDistance = node.distance 
			//Get My Direction 
			var myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			var numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
			//Calculate new neighbour distance	
			var newNeighbourDistance = node.distance  + 1 + numberOfMoves + neighbour.weight
			neighbour.heuristicDistance = this.manhattanDistance(neighbour,this.finalNode)
			//If this is lower than the currentDistance on the neighbour change
			if(newNeighbourDistance < neighbour.distance){
				neighbour.distance = newNeighbourDistance
				neighbour.direction = 'LEFT'
				neighbour.totalDistance = neighbour.heuristicDistance + neighbour.distance 
				//Add neighbour to neigbourList
				neigbourList.push(neighbour)
				neighbour.parent = node
			} 
		}
		return neigbourList
}




module.exports = Search
 
},{}]},{},[1]);
