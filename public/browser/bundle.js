(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//Come back to this..
let Cell = require('./cell')
let Search = require('./search')
let Maze = require('./maze')
function runFunction(board){
  for(let i=0;i<board.boardArr.length;i++){
    for(let j=0;j<board.boardArr[i].length;j++){
      let id = j.toString() + ',' + i.toString()
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
}  

Board.prototype.initialise = function(){
  this.createGrid()
  this.addEventListeners()
}

Board.prototype.createGrid = function(){   
  let  initialHTML = ''
  for(let i=0;i<this.height;i++){
    //Add row HTML
    initialHTML += "<tr id='row"+i.toString()+"'>"
    //Add row boardArr 
    this.boardArr.push([])
    for(let j=0;j<this.width;j++){
        //Add individual table Elements HTML 
        initialHTML += "<td id='"+j.toString()+","+i.toString()+"' class='unexplored'>"+"</td>"
        //Add cell element to boardArr
        let newCell = new Cell(j,i)
        this.boardArr[this.boardArr.length-1].push(newCell)

    }
    //Finish row element HTML
    initialHTML += "</tr>"
  } 
  let board = document.getElementById('board')
  board.innerHTML = initialHTML
  //Set Initial start Node
  let xStartNode =  Math.floor(this.boardArr.length/4)
  let y =  Math.floor(this.boardArr.length/2)
  this.boardArr[y][xStartNode].status = 'startNode'
  this.startNode = this.boardArr[y][xStartNode]
  document.getElementById(this.startNode.id).className = 'startingCell'
  //Set Initial end Node
  let xFinalNode = Math.floor(3*this.boardArr[0].length/4)
  this.finalNode = this.boardArr[y][xFinalNode]
  this.boardArr[y][xFinalNode].status = 'finalNode'
  document.getElementById(this.finalNode.id).className = 'finalCell'

}  

Board.prototype.addEventListeners = function(){        
  let board = this
  //Add window keyDown event 
  window.addEventListener('keydown',function(e){
    e.keyCode === 16 || e.keyCode === 49 ? board.keyDown = e.keyCode : board.keyDown;
  })
  //Add window keyUp event 
  window.addEventListener('keyup',function(){
    board.keyDown = false
  })  

  //Add listeners for table elements  
  for(let i=0;i<this.height;i++){
    for(let j=0;j<this.width;j++){
     let id = j.toString()+','+i.toString()
      let elem = document.getElementById(id)
      elem.addEventListener('mousedown',function(e){
         e.preventDefault()
          if(this.className !== 'startingCell' && (this.className !== 'finalCell' && this.className !== 'finalCellUP' && this.className !== 'finalCellRIGHT' && this.className !== 'finalCellDOWN' && this.className !== 'finalCellLEFT') && this.className !== 'objectCell' && !board.shouldDisable){
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
          else if(board.mouseDown && board.currentCellStatus !== null && this.className !== 'startingCell' && (this.className !== 'finalCell' && this.className !== 'finalCellUP' && this.className !== 'finalCellRIGHT' && this.className !== 'finalCellDOWN' && this.className !== 'finalCellLEFT') && !board.shouldDisable){  
            this.className = board.currentCellStatus
            let idSplit = this.id.split(',')
            let cell = board.getCell(idSplit[0],idSplit[1])
            if(this.className === 'startingCell'){ 
              if(cell.status === 'wall'){board.lastWall = true}
              else if(cell.status === 'unexplored weight'){board.lastWeight = true}
                cell.status = 'startNode'
                board.startNode = cell
                if(board.algoDone){
                  board.clearPath()
                let search = new Search(board.boardArr,board.startNode,board.finalNode,board.currentAlgo,board)
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
                let search = new Search(board.boardArr,board.startNode,board.finalNode,board.currentAlgo,board)
                search.startSearch()
                }
            }
          }
          else if(board.mouseDown && board.currentCellStatus !== null && (this.className === 'startingCell' || (this.className === 'finalCell' || this.className === 'finalCellUP' || this.className === 'finalCellRIGHT' || this.className === 'finalCellDOWN' || this.className === 'finalCellLEFT')) && !board.shouldDisable){
            if(this.className === 'startingCell'){
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
        if((this.className === 'startingCell' || (this.className === 'finalCell' || this.className === 'finalCellUP' || this.className === 'finalCellRIGHT' || this.className === 'finalCellDOWN' || this.className === 'finalCellLEFT')) && !board.shouldDisable){
          if(board.mouseDown && board.currentCellStatus !== null){
              if(board.shouldBe){
                this.className = board.shouldBe
                board.shouldBe = null
              }
              else{
                if(board.lastWall){
                  board.clearPath()
                  let idSplit = this.id.split(',')
                  let cell = board.getCell(idSplit[0],idSplit[1])
                  this.className = 'wall'
                  cell.status = 'wall'
                  board.lastWall = false
                }
                else if(board.lastWeight){
                  board.clearPath()
                  let idSplit = this.id.split(',')
                  let cell = board.getCell(idSplit[0],idSplit[1])
                  this.className = 'unexplored weight'
                  cell.status = 'unexplored weight'
                  cell.weight = 15
                  board.lastWeight = false
                }
                else{
                  board.clearPath()
                  let idSplit = this.id.split(',')
                  let cell = board.getCell(idSplit[0],idSplit[1])
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
      document.getElementById('visualise').innerHTML = 'Visualise Test A*'
      board.algoToRun = 'AStar'
      // search.startSearch()
    }
  })
  //Fake AStar 2
  document.getElementById('startButtonAStar2').addEventListener('click',function(){  
    if(!board.shouldDisable){
      document.getElementById('visualise').innerHTML = 'Visualise Test 2 A*'
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
  document.getElementById('startButtonBidirectional').addEventListener('click',function(){
    document.getElementById('visualise').innerHTML = 'Visualise Bi-Directional'
    board.algoToRun = 'Bidirectional'
    // search.startSearch()
  })
  //Basic Maze 1
  document.getElementById('startButtonBasicMaze').addEventListener('click',function(){
    if(!board.shouldDisable){
      let maze = new Maze(board,board.startNode,board.finalNode,'basicMaze')
      maze.startMaze()
    }
  })
  //Recursive Division 1
  document.getElementById('startButtonBossMaze1').addEventListener('click',function(){
    if(!board.shouldDisable){
      let maze = new Maze(board,board.startNode,board.finalNode,'bossMaze1',true)
      maze.startMaze()
    }
  })
  //Recursive Division 2
  document.getElementById('startButtonBossMaze2').addEventListener('click',function(){
    if(!board.shouldDisable){
      let maze = new Maze(board,board.startNode,board.finalNode,'bossMaze2',true)
      maze.startMaze()
    }
  })
  //Recursive Division 3
  document.getElementById('startButtonBossMaze3').addEventListener('click',function(){
    if(!board.shouldDisable){
      let maze = new Maze(board,board.startNode,board.finalNode,'bossMaze3',true)
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
      let algoName = board.algoToRun
      let search = new Search(board.boardArr,board.startNode,board.finalNode,algoName,board)
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
}   

Board.prototype.getCell = function(x,y){
  return this.boardArr[y][x]
} 

Board.prototype.changeCellClick = function(id){
  let newId = id.split(',')
  let x = parseInt(newId[0])
  let y = parseInt(newId[1])
  let cell = this.getCell(x,y)
  let toggledCell = this.toggle(cell)
  let elem = document.getElementById(id)
  if(toggledCell){
    elem.className = toggledCell
  }

} 

Board.prototype.changeCellDrag = function(id){
  let newId = id.split(',')
  let x = parseInt(newId[0])
  let y = parseInt(newId[1])
  let cell = this.getCell(x,y)
  if(cell.status !== 'finalCell' && cell.status !== 'startingCell'){
    let toggledCell = this.toggle(cell)
    let elem = document.getElementById(id)
    if(toggledCell){
      elem.className = toggledCell
    }
  }
  
}

Board.prototype.toggle = function(cell){ 
  if(cell.status === 'unexplored' && this.keyDown || cell.status === 'explored' && this.keyDown){
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

Board.prototype.clearBoard = function(){
}

Board.prototype.clearPath = function(){     
  document.getElementById(this.finalNode.id).className = 'finalCell'
  // console.log('in clear path')
  for(let i=0;i<this.boardArr.length;i++){
    for(let j=0;j<this.boardArr[i].length;j++){
      let cell = this.boardArr[i][j] 
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
  for(let i=0;i<this.boardArr.length;i++){
    for(let j=0;j<this.boardArr[i].length;j++){
      let cell = this.boardArr[i][j] 
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
  for(let i=0;i<this.boardArr.length;i++){ 
    for(let j=0;j<this.boardArr[i].length;j++){
      let cell = this.boardArr[i][j] 
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

let bar = document.getElementById('navbarDiv').clientHeight + document.getElementById('mainText').clientHeight
let height = Math.floor(document.documentElement.clientHeight) - bar
let width = Math.floor(document.documentElement.clientWidth)
let finalHeight = height/27
let finalWidth = width/25
// let board = new Board(finalHeight,finalWidth-1)
let board = new Board(10,10)
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
	this.toAnimate = true
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

}  

Maze.prototype.basicMaze = function(){
	for(let i=0;i<this.boardArr.length;i++){
		for(let j=0;j<this.boardArr[0].length;j++){
			let elem = document.getElementById(j.toString()+','+i.toString())
			if(Math.random() > 0.75 && elem.className !== 'startingCell' && elem.className !== 'finalCell'){
				// elem.className = 'wall'
				let cell = this.board.getCell(j,i)
				cell.status = 'wall'
				this.listToAnimate.push(cell)
			}
			if(Math.random() > 0.85 && elem.className !== 'startingCell' && elem.className !== 'finalCell'){
					if(Math.random() > 0.5){
						// elem.className = 'unexplored mud'
						// this.board.getCell(j,i).weight = 2
					}
					else{
						// elem.className = 'unexplored water'
						// this.board.getCell(j,i).weight = 5
					}
			}

		}
	}
}

Maze.prototype.mazeGenerator = function(){
	for(let i=0;i<this.maxY;i++){
		for(let j=0;j<this.maxX;j++){
			if(i === 0 || i === this.maxY-1 || j === 0 || j === this.maxX - 1){
				let cell = this.board.getCell(j,i)
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
			let validWall = []
			for(let i=startX;i<endX+1;i+=2){
				validWall.push(i)
			}
			let randomX = validWall[Math.floor(Math.random()*validWall.length)]
			//Draw Wall 
			this.drawWall(randomX,randomX,startY,endY,'vertical')
			//Get possible split points  
			let splitArr = []
			for(let i=startY-1;i<endY+2;i+=2){
				splitArr.push(randomX.toString()+','+i.toString())
			}
			//Choose where to split by 
			let randomPlaceToSplitID = splitArr[Math.floor(Math.random() * splitArr.length)]
			//Make hole 
			let elem = document.getElementById(randomPlaceToSplitID)
			let idArr = randomPlaceToSplitID.split(',')
			let cell = this.board.getCell(parseInt(idArr[0]),parseInt(idArr[1]))
			// elem.className = 'unexplored'
			if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'unexplored'
				this.listToAnimate.push(cell)
			}

			let lengthLargerThanHeightLeft = !this.lengthLargerThanHeight(startX,randomX-2,startY,endY);
			let lengthLargerThanHeightRight; 
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
			let validWall = []
			for(let i=startY;i<endY+1;i+=2){
					validWall.push(i)
			}
			let randomY = validWall[Math.floor(Math.random()*validWall.length)]
			//Draw Wall 
			this.drawWall(startX,endX,randomY,randomY,'horizontal')
			//Get possible split points 
			let splitArr = []
			for(let i=startX-1;i<endX+2;i+=2){
				 splitArr.push(i.toString()+','+randomY.toString())
			}
			//Choose where to split by 
			let randomPlaceToSplitID = splitArr[Math.floor(Math.random() * splitArr.length)]
			//Make hole 
			let elem = document.getElementById(randomPlaceToSplitID)
			let idArr = randomPlaceToSplitID.split(',')
			let cell = this.board.getCell(parseInt(idArr[0]),parseInt(idArr[1]))
			// elem.className = 'unexplored'
			if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'unexplored'
				this.listToAnimate.push(cell)
			}

			let lengthLargerThanHeightTop = !this.lengthLargerThanHeight(startX,endX,startY,randomY-2);
			let lengthLargerThanHeightBottom; 
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
		for(let i=startY-1;i<endY+2;i++){
			let elem = document.getElementById(startX.toString()+','+i.toString())
			// elem.className = 'wall'
			let cell = this.board.getCell(startX,i)
			if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'wall'
				this.listToAnimate.push(cell)
			}
		}
	}
	else if(orientation === 'horizontal'){
		for(let j=startX-1;j<endX+2;j++){
			let elem = document.getElementById(j.toString()+','+startY.toString())
			// elem.className = 'wall'
			let cell = this.board.getCell(j,startY)
			if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'wall'
				this.listToAnimate.push(cell)
			}

		}
	}
}

Maze.prototype.lengthLargerThanHeight = function(startX,endX,startY,endY){
	let returnVal = (endX-startX) - (endY-startY) > 0
	return returnVal
}


Maze.prototype.animate = function(){ 
  let self = this
	let list = this.listToAnimate
	function timeout(index) {
    setTimeout(function () {
        if(index === list.length){
					self.board.shouldDisable = false
					return
        }
        let cell = list[index]
				document.getElementById(cell.id).className = cell.status
        timeout(index+1);
    }, 0.0001);
  }   
  timeout(0)
}

Maze.prototype.instant = function(){
	for(let i in this.listToAnimate){
		let cell = this.list[i]
		document.getElementById(cell.id).className = cell.status
	}
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
		let exploredList = this.searchBFS()
    this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}
	else if(this.currentAlgorithm === 'DFS'){
		let exploredList = this.searchDFS()
    this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}
	else if(this.currentAlgorithm === 'Dijkstra'){
		let exploredList = this.searchDijkstra()
		this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}
	else if(this.currentAlgorithm === 'AStar'){
		let exploredList = this.searchAStar()
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	} 
	else if(this.currentAlgorithm === 'AStar2'){
		let exploredList = this.searchAStar('2')
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	} 
	else if(this.currentAlgorithm === 'Greedy'){
		let exploredList = this.searchGreedy()
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}   
	else if(this.currentAlgorithm === 'RealAStar'){
		let exploredList = this.searchRealAStaar()
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}     
	else if(this.currentAlgorithm === 'Bidirectional'){
		let exploredList = this.searchBidirectional()
		this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}    
}  

Search.prototype.getNeighbours = function(arr,node,algo,exploredList){   
  let neighbourList = []
	//Get Neighbour Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall'){
		let neighbour = arr[node.y-1][node.x]
		
		if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode' && exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Right 
	if(node.x<arr[0].length-1 && arr[node.y][node.x+1].status !== 'wall'){
		let neighbour = arr[node.y][node.x+1]
		// console.log(neighbour.id,arr.finalNode)
			if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode'&& exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Down 
	if((node.y<arr.length-1) && arr[node.y+1][node.x].status !== 'wall'){
		let neighbour = arr[node.y+1][node.x]
	if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode'&& exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Left
	if(node.x>0 && arr[node.y][node.x-1].status !== 'wall'){
		let neighbour = arr[node.y][node.x-1]
	if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode'&& exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	return neighbourList
}       

Search.prototype.searchDFS = function(){  
 let exploredList = [] 
	let listToExplore = [this.startNode]
	let isPresent = function(node){
		let returnVal = false
		for(let i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !==0){
		let currentNode = listToExplore[0]
		if(currentNode === this.finalNode){
			currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
      listToExplore = listToExplore.slice(1)
    }
    else if(!isPresent(currentNode)){
			let neighbours = this.getNeighbours(this.board,currentNode,'DFS',exploredList)
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
  let exploredList = []
	let numOnes = 0
	let listToExplore = [this.startNode]
	let isPresent = function(node){
		let returnVal = false
		for(let i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !==0){ 
		let currentNode = listToExplore[0]
		let inWhileLoop = new Date()
		if(currentNode === this.finalNode){
			// currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
      listToExplore = listToExplore.slice(1)
    }
    else if(!isPresent(currentNode)){
			let neighbours = this.getNeighbours(this.board,currentNode)
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

Search.prototype.searchBidirectional2 = function(){    
	this.startNode.distance = 0
	this.finalNode.distance = 0
	let exploredList = []
	let listToExploreStart = [this.startNode]
	let listToExploreFinal = [this.finalNode]
	let numOnes = 0
	let count = 2
	let currentNode;
	let status;
	let pleaseWork = function(node,status){ 
		let returnVal = false
		for(let i in exploredList){
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
		let value = pleaseWork(currentNode,status)
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
			let neighbours;
			count % 2 === 0 ? neighbours = this.getNeighboursAStar(this.board,currentNode,exploredList,'algo',this.finalNode) : neighbours = this.getNeighboursAStar(this.board,currentNode,exploredList,'algo',this.startNode) 
			// let neighbours = this.getNeighbours(this.board,currentNode)
			//Remove node from listToExplore 
			if(count % 2 === 0){
					listToExploreStart = listToExploreStart.slice(1)
			}
			else{
				listToExploreFinal = listToExploreFinal.slice(1)
			}

			if(count % 2 === 0){
				let newNeighboursList = []
				for(let i in neighbours){
					neighbours[i].exploredBy = 'start'
					// console.log(neighbours[i])
					newNeighboursList.push(neighbours[i])
				}
				listToExploreStart = listToExploreStart.concat(newNeighboursList) 
			}
			else{
				let newNeighboursList = []
				for(let i in neighbours){
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


Search.prototype.searchBidirectional = function(){

}

Search.prototype.searchAStar = function(algo){   
	this.startNode.distance = 0
	let listToExplore = [this.startNode]
	let exploredList = []
	let isPresent = function(node){
		let returnVal = false
		for(let i=0;i<exploredList.length;i++){
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
		let currentNode = listToExplore[0];

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
			let neighbours = this.getNeighboursAStar(this.board,currentNode,exploredList,algo)
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
	let listToExplore = [this.startNode]
	let exploredList = []
	let isPresent = function(node){
		let returnVal = false
		for(let i=0;i<exploredList.length;i++){
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
		let currentNode = listToExplore[0];

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
			let neighbours = this.getNeighboursGreedy(this.board,currentNode,exploredList)
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
//Back here
Search.prototype.showAnimation = function(exploredList){     
	let count = 0
	let self = this
	let startNode = exploredList[0]
  exploredList = exploredList.slice(1)
	let endNode = exploredList[exploredList.length-1]
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
		let elem = document.getElementById(node.id)
		if(node.status === 'unexplored weight'){
			node.status = 'explored weight'
			elem.className = 'explored weight'
		}
		else if(node.status === 'unexplored'){
			node.status = 'explored'
			elem.className = 'explored'
		}
		else if(node.status === 'shortestPath explored weight'){
			// console.log('in')
			elem.className = 'shortestPath explored weight'
			if(node.parent.status === 'shortestPath') document.getElementById(node.parent.id).className = 'shortestPath'
			if(index === length -1 ) self.changeFinalClassName()
		}
		else if(node.status === 'shortestPath'){
			if(node.parent.status !== 'startNode'){
				document.getElementById(node.parent.id).className = 'shortestPath'
				if(index !== length - 1){
					let newClassName = 'shortestPath' + node.direction
					document.getElementById(node.id).className = newClassName
				}
				else {
					document.getElementById(node.id).className = 'shortestPath'
					self.changeFinalClassName()
				}
			}



		}
  } 
	function showPath(node,search){ 
		// console.log(startNode,node)
		count++
		let listPath = []
		let endNode = Object.assign({},node)
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
			timeout(0,listPath.reverse(),200)
		}
		else{
			self.boardA.shouldDisable = false
		}
	}
  timeout(0,exploredList,0.0001)
}

Search.prototype.algoDone = function(){
	this.boardA.algoDone = true
}

Search.prototype.changeFinalClassName = function(){
	let finalCell;
	finalCell = document.getElementsByClassName('finalCell')[1]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellUP')[0]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellRIGHT')[0]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellDOWN')[0]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellLEFT')[0]
	finalCell.className = 'finalCell' + this.finalNode.direction
}

Search.prototype.showAnimationDrag = function(exploredList){
	this.changeFinalClassName()
	for(let i in exploredList){
		let cell = exploredList[i]
		if(cell.status === 'unexplored'){
			cell.status = 'explored'
			document.getElementById(cell.id).className = 'explored'
		}
	}
	let endNode = exploredList[exploredList.length-1]
	let newEndNode = Object.assign({},endNode)
	let shortestPathList = []
	while(endNode !== this.startNode){
		shortestPathList.push(endNode)
		endNode = endNode.parent
	}
	shortestPathList = shortestPathList.reverse()
	if(newEndNode.status === 'finalNode'){
		for(let i in shortestPathList){
			let cell = shortestPathList[i]
			if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'explored'
				document.getElementById(cell.id).className = 'shortestPath'
			}
		}
	}
	this.boardA.shouldDisable = false
	this.boardA.algoDone = true
	 
}  

Search.prototype.getNeighboursDijkstra = function(arr,node,exploredList){   
	let neigbourList = []
	//Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
		//Get Up neighbour 
		let neighbour = arr[node.y-1][node.x] 
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
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
		let neighbour = arr[node.y][node.x+1]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
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
		let neighbour = arr[node.y+1][node.x]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
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
		let neighbour = arr[node.y][node.x-1]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
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
	let neigbourList = [] 
	//Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
		//Get Up neighbour 
		let neighbour = arr[node.y-1][node.x]
		// console.log('neighbour',neighbour.distance)
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		let newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
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
		let neighbour = arr[node.y][node.x+1]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		let newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
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
		let neighbour = arr[node.y+1][node.x]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		let newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
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
		let neighbour = arr[node.y][node.x-1]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		let newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
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
	let neigbourList = []
	//Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
		//Get Up neighbour 
		let neighbour = arr[node.y-1][node.x] 
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
		//Calculate new neighbour distance	
		let newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
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
		let neighbour = arr[node.y][node.x+1]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
		//Calculate new neighbour distance	
		let newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
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
		let neighbour = arr[node.y+1][node.x]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
		//Calculate new neighbour distance	
		let newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
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
		let neighbour = arr[node.y][node.x-1]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
		//Calculate new neighbour distance	
		let newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
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
	let listToExplore = [this.startNode]
	let exploredList = []
	let isPresent = function(node){
		let returnVal = false
		for(let i=0;i<exploredList.length;i++){
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
		let currentNode = listToExplore[0];

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
			let neighbours = this.getNeighboursDijkstra(this.board,currentNode,exploredList)
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
	let returnVal = false
	for(let i in exploredList.length){
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
	let xDiff = Math.abs(node1.x - node2.x)
	let yDiff = Math.abs(node1.y - node2.y)
	let distance = Math.sqrt(Math.pow(xDiff,2)+Math.pow(yDiff,2))
	let sum = xDiff + yDiff
	if((node1.y !== node2.y) && (node1.x !== node2.x)){
		sum += 1
	}
	return sum
}

Search.prototype.realAStar = function(){ 
	this.startNode.distance = 0
	this.startNode.heuristicDistance = this.manhattanDistance(this.startNode,this.finalNode)
	this.startNode.totalDistance = this.startNode.distance + this.startNode.heuristicDistance
	let listToExplore = [this.startNode]
	let exploredList = []
	let isPresent = function(node){
		let returnVal = false
		for(let i=0;i<exploredList.length;i++){
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
		let currentNode = listToExplore[0];

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
			let neighbours = this.getNeighboursRealAStar(this.board,currentNode,exploredList)
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
	let self = this 
	let list = this.getNeighboursDijkstra(arr,node,exploredList)
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
	let listToExplore = [this.startNode]
	let exploredList = []
	let isPresent = function(node){ 
		let returnVal = false
		for(let i=0;i<exploredList.length;i++){
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
		let currentNode = listToExplore[0];

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
			let neighbours = this.getNeighboursRealAStaar(this.board,currentNode,exploredList)
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
		let neigbourList = []
		//Up 
		if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
			//Get Up neighbour 
			let neighbour = arr[node.y-1][node.x] 
			//Get current distance 
			let currentDistance = node.distance 
			//Get My Direction 
			let myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			let numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
			//Calculate new neighbour distance	
			let newNeighbourDistance = node.distance  + 1 + numberOfMoves + node.weight
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
			let neighbour = arr[node.y][node.x+1]
			//Get current distance 
			let currentDistance = node.distance 
			//Get My Direction 
			let myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			let numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
			//Calculate new neighbour distance	
			let newNeighbourDistance = node.distance  + 1 + numberOfMoves + node.weight
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
			let neighbour = arr[node.y+1][node.x]
			//Get current distance 
			let currentDistance = node.distance 
			//Get My Direction 
			let myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			let numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
			//Calculate new neighbour distance	
			let newNeighbourDistance = node.distance  + 1 + numberOfMoves + node.weight
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
			let neighbour = arr[node.y][node.x-1]
			//Get current distance 
			let currentDistance = node.distance 
			//Get My Direction 
			let myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			let numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
			//Calculate new neighbour distance	
			let newNeighbourDistance = node.distance  + 1 + numberOfMoves + node.weight
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
