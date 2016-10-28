(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  this.currentCellStatus = null
  this.mode = 0
}  

Board.prototype.initialise = function(){
  this.createGrid()
  this.addEventListeners()
}

Board.prototype.createGrid = function(){
  let initialHTML = ''
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
  var xFinalNode = Math.floor(3*this.boardArr.length/4)
  this.finalNode = this.boardArr[y][xFinalNode]
  document.getElementById(this.finalNode.id).className = 'finalCell'
}  

Board.prototype.addEventListeners = function(){ 
  var board = this
  //Add window keyDown event 
  window.addEventListener('keydown',function(e){
    e.keyCode === 16 || e.keyCode === 49 ? board.keyDown = e.keyCode : board.keyDown;
  })
  //Add window keyUp event 
  window.addEventListener('keyup',function(){
    board.keyDown = false
  }) 

  //Add listeners for table elements
  for(var i=0;i<this.height;i++){ 
    for(var j=0;j<this.width;j++){
      var id = j.toString()+','+i.toString()
      var elem = document.getElementById(id)
      elem.addEventListener('mousedown',function(){
          if(this.className !== 'startingCell' && this.className !== 'finalCell'){
            board.changeCellClick(this.id)
            board.mouseDown = true
          }
          else{
            board.currentCellStatus = this.className
            board.mouseDown = true
          }
      })
      elem.addEventListener('mouseup',function(){
        board.mouseDown = false
        board.currentCellStatus = null
      })
      elem.addEventListener('mouseenter',function(){
          //Normal Wall Creation Drag Event
          if(board.mouseDown && board.currentCellStatus === null){
            board.changeCellDrag(this.id)
          }
          //Dragging a start/end node 
          else if(board.mouseDown && board.currentCellStatus !== null && this.className !== 'startingCell' && this.className !== 'finalCell'){ 
            this.className = board.currentCellStatus
            var idSplit = this.id.split(',')
            var cell = board.getCell(idSplit[0],idSplit[1])
            if(this.className === 'startingCell'){
              cell.status = 'startNode'
              board.startNode = cell
            }
            else if(this.className === 'finalCell'){
              cell.status = 'finalNode'
              board.finalNode = cell
            }
          }
      })
      elem.addEventListener('mouseout',function(){
        if(this.className === 'startingCell' || this.className === 'finalCell'){
          if(board.mouseDown && board.currentCellStatus !== null){
            this.className = 'unexplored'
            var idSplit = this.id.split(',')
            var cell = board.getCell(idSplit[0],idSplit[1])
            cell.status = 'unexplored'
          }
        }
      })
    }
  }    
  //Add Listeners for Button Panel
  //BFS
  document.getElementById('startButtonBFS').addEventListener('click',function(){
      var search = new Search(board.boardArr,board.startNode,board.finalNode,'BFS')
      search.startSearch()
  }) 
  //DFS
  document.getElementById('startButtonDFS').addEventListener('click',function(){
      var search = new Search(board.boardArr,board.startNode,board.finalNode,'DFS')
      search.startSearch()
  })
  //Dijkstra 
  document.getElementById('startButtonDijkstra').addEventListener('click',function(){
    var search = new Search(board.boardArr,board.startNode,board.finalNode,'Dijkstra')
    search.startSearch()
  })
  //AStar 
  document.getElementById('startButtonAStar').addEventListener('click',function(){
    var search = new Search(board.boardArr,board.startNode,board.finalNode,'AStar')
    search.startSearch()
  })
  //Greedy
  document.getElementById('startButtonGreedy').addEventListener('click',function(){
    var search = new Search(board.boardArr,board.startNode,board.finalNode,'Greedy')
    search.startSearch()
  })
  //Random Maze Generation
  document.getElementById('startButtonMazeRecursiveBacktracking').addEventListener('click',function(){
    var maze = new Maze(board,board.startNode,board.finalNode)
    maze.startMaze()
  })
  //Clear Path
  document.getElementById('startButtonClearPath').addEventListener('click',function(){
    board.clearPath()
  }) 
  //Clear Walls
   document.getElementById('startButtonClearWalls').addEventListener('click',function(){
    board.clearWalls()
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
      console.log(toggledCell)
      elem.className = toggledCell
    }
  }
  
}

Board.prototype.toggle = function(cell){
  if(cell.status === 'unexplored' && this.keyDown|| cell.status === 'explored' && this.keyDown){
      cell.status = 'unexplored'
      if(this.keyDown === 16){  
        cell.weight = 2
        return cell.status +' mud'
      }
      else{
        cell.weight = 5
        return cell.status +' water'
      }
      

  }
  else if(cell.status === 'unexplored' || cell.status === 'explored'){
      cell.status = 'wall'
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

Board.prototype.clearPath = function(){ 
  for(var i=0;i<this.boardArr.length;i++){
    for(var j=0;j<this.boardArr[i].length;j++){
      var cell = this.boardArr[i][j] 
      cell.parent = null
      if(cell.status === 'explored' || cell.status === 'shortestPath'){
        cell.status = 'unexplored'
        document.getElementById(cell.id).className = 'unexplored'
      }
      if(cell.status !== 'startNode'){
        cell.direction = 'UP'
        cell.distance = Infinity
      }
    }
  }
} 
Board.prototype.clearWalls = function(){
  for(var i=0;i<this.boardArr.length;i++){
    for(var j=0;j<this.boardArr[i].length;j++){
      var cell = this.boardArr[i][j] 
      cell.parent = null
      if(cell.status === 'wall'){
        cell.status = 'unexplored'
        document.getElementById(cell.id).className = 'unexplored'
      }
    }
  }
} 

Board.prototype.generateRandom = function(){
   console.log("Generating random Maze")
} 
var bar = document.getElementById('Algorithm').clientWidth
var height = Math.floor(document.documentElement.clientHeight)
var width = Math.floor(document.documentElement.clientWidth) - bar
var board = new Board(21,21)
board.initialise()

},{"./cell":2,"./maze":3,"./search":4}],2:[function(require,module,exports){
function Cell(xPos,yPos){
  this.x = xPos
  this.y = yPos
  this.weight = 0
  this.status = 'unexplored' 
  this.id = this.x.toString()+','+this.y.toString()
  this.parent = null
  this.direction = 'UP'
  this.distance = Infinity
  this.previousStatus = 'unexplored'
} 

Cell.prototype.getCellStatus = function(){
  return this.status
}

module.exports = Cell

},{}],3:[function(require,module,exports){
function Maze(board,startNode,finalNode){
  this.board = board
	this.boardArr = board.boardArr
  this.startNode = startNode
	this.finalNode = finalNode
} 

Maze.prototype.startMaze = function(){
	this.board.clearWalls()
	this.maxX = this.boardArr[0].length 
	this.maxY = this.boardArr.length
	this.mazeGenerator()

} 

Maze.prototype.basicMaze = function(){
	for(var i=0;i<this.boardArr.length;i++){
		for(var j=0;j<this.boardArr[0].length;j++){
			var elem = document.getElementById(j.toString()+','+i.toString())
			if(Math.random() > 0.75 && elem.className !== 'startingCell' && elem.className !== 'finalCell'){
				elem.className = 'wall'
				this.board.getCell(j,i).status = 'wall'
			}
			if(Math.random() > 0.85 && elem.className !== 'startingCell' && elem.className !== 'finalCell'){
					if(Math.random() > 0.5){
						elem.className = 'unexplored mud'
						this.board.getCell(j,i).weight = 2
					}
					else{
						elem.className = 'unexplored water'
						this.board.getCell(j,i).weight = 5
					}
			}

		}
	}
}

Maze.prototype.mazeGenerator = function(){
	for(var i=0;i<this.maxY;i++){
		for(var j=0;j<this.maxX;j++){
			if(i === 0 || i === this.maxY-1 || j === 0 || j === this.maxX - 1){
				var cell = this.board.getCell(j,i)
				cell.status = 'wall'
				document.getElementById(cell.id).className = 'wall'
			}
		}
	}
	this.bossMaze(2,this.boardArr[0].length-3,2,this.boardArr.length-3,'vertical')
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
			elem.className = 'unexplored'
			cell.status = 'unexplored'
			var lengthLargerThanHeightLeft = !this.lengthLargerThanHeight(startX,randomX-2,startY,endY);
			var lengthLargerThanHeightRight = this.lengthLargerThanHeight(randomX+2,endX,startY,endY);
			//Left One 
				//Left Orientation should be vertical 
				if(lengthLargerThanHeightLeft){
					console.log("ASFOINOAINS")
					this.bossMaze(startX,randomX - 2,startY,endY,'horizontal')
				}
				//Left Orientation should be horizontal 
				else{
					console.log("VERT")
					this.bossMaze(startX,randomX - 2,startY,endY,'vertical')
				}
			//Right One 
				//Right Orientation should be vertical 
				if(lengthLargerThanHeightRight){
					this.bossMaze(randomX+2,endX,startY,endY,'horizontal')
				}
				//Right Orientation should be horizontal 
				else{	
					console.log("VERT")
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
			elem.className = 'unexplored'
			cell.status = 'unexplored'
			var lengthLargerThanHeightTop = !this.lengthLargerThanHeight(startX,endX,startY,randomY-2);
			var lengthLargerThanHeightBottom = this.lengthLargerThanHeight(startX,endX,randomY+2,endY);
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
				console.log("AIOSFNOIAN")
				return;
		}
	}
}

Maze.prototype.drawWall = function(startX,endX,startY,endY,orientation){ 
	if(orientation === 'vertical'){
		for(var i=startY-1;i<endY+2;i++){
			var elem = document.getElementById(startX.toString()+','+i.toString())
			elem.className = 'wall'
			var cell = this.board.getCell(startX,i)
			cell.status = 'wall'
		}
	}
	else if(orientation === 'horizontal'){
		for(var j=startX-1;j<endX+2;j++){
			var elem = document.getElementById(j.toString()+','+startY.toString())
			elem.className = 'wall'
			var cell = this.board.getCell(j,startY)
			cell.status = 'wall'
		}
	}
}

Maze.prototype.lengthLargerThanHeight = function(startX,endX,startY,endY){
	var returnVal = (endX-startX) - (endY-startY) > 0
	console.log(endX,startX)
	return returnVal
}

Maze.prototype.animate = function(listToExplore){
	
}

module.exports = Maze
},{}],4:[function(require,module,exports){
function Search(board,startNode,finalNode,currentAlgorithm){
  this.currentAlgorithm = currentAlgorithm
  this.board = board
  this.startNode = startNode
	this.finalNode = finalNode
}

Search.prototype.startSearch = function(){
  var startNode = this.startNode
	if(this.currentAlgorithm === 'BFS'){
		var exploredList = this.searchBFS()
    this.showAnimation(exploredList)
	}
	else if(this.currentAlgorithm === 'DFS'){
		var exploredList = this.searchDFS()
    this.showAnimation(exploredList)
	}
	else if(this.currentAlgorithm === 'Dijkstra'){
		var exploredList = this.searchDijkstra()
    this.showAnimation(exploredList)
	}
	else if(this.currentAlgorithm === 'AStar'){
		var exploredList = this.searchAStar()
    this.showAnimation(exploredList)
	} 
	else if(this.currentAlgorithm === 'Greedy'){
		var exploredList = this.searchGreedy()
    this.showAnimation(exploredList)
	}    
}  

Search.prototype.getNeighbours = function(arr,node){
  var neighbourList = []
	//Get Neighbour Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall'){
		var neighbour = arr[node.y-1][node.x]
		
		if(neighbour.parent === null){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Right 
	if(node.x<arr[0].length-1 && arr[node.y][node.x+1].status !== 'wall'){
		var neighbour = arr[node.y][node.x+1]
		// console.log(neighbour.id,arr.finalNode)
			if(neighbour.parent === null){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Down 
	if((node.y<arr.length-1) && arr[node.y+1][node.x].status !== 'wall'){
		var neighbour = arr[node.y+1][node.x]
	if(neighbour.parent === null){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Left
	if(node.x>0 && arr[node.y][node.x-1].status !== 'wall'){
		var neighbour = arr[node.y][node.x-1]
	if(neighbour.parent === null){
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
			var neighbours = this.getNeighbours(this.board,currentNode)
			listToExplore = listToExplore.slice(1)
			listToExplore = neighbours.concat(listToExplore)
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}
	}
	return exploredList 
} 

Search.prototype.searchBFS = function(){
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
			var neighbours = this.getNeighbours(this.board,currentNode)
			listToExplore = listToExplore.slice(1)
			listToExplore = listToExplore.concat(neighbours)
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}
	}
	return exploredList 
}  

Search.prototype.searchAStar = function(){
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
			var neighbours = this.getNeighboursAStar(this.board,currentNode,exploredList)
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
	return exploredList
}
Search.prototype.showAnimation = function(exploredList){ 
  var self = this
	var startNode = exploredList[0]
  exploredList = exploredList.slice(1)
  startNode.status = 'startNode'
	var endNode = exploredList[exploredList.length-1]
  document.getElementById(startNode.id).className = 'startingCell'
  function timeout(index) {
    setTimeout(function () {
        if(index === exploredList.length){
          showPath(endNode,self)
					return
        }
        change(exploredList[index])
        timeout(index+1);
    }, 0.0001);
  } 
  function change(node){
    var elem = document.getElementById(node.id)
		// console.log(node.status)
		if(node.status === 'unexplored'){
			node.status = 'explored'
			elem.className = 'explored'
		}
		else if(node.status === 'finalCell'){
			// console.log("FINAL CELL DISPLAY")
		}
  } 
	function showPath(node,search){
		var listPath = []
		while(node !== search.startNode){
			// console.log(node)
			if(node.status !== 'finalNode'){
				node.status = 'shortestPath'
				document.getElementById(node.id).className = 'shortestPath'
				listPath.push(node)
			}
			node = node.parent
		}
		// listPath = listPath.reverse()
		// for(var i=0;i<listPath.length;i++){
		// 	if(i!==0){
		// 		document.getElementById(listPath[i-1].id).className = 'explored'
				
		// 	}
		// 	console.log(listPath[i])
		// 	listPath[i].status = 'shortestPath'
		// 	document.getElementById(listPath[i].id).className = 'shortestPath'
		// }
	}
  timeout(0)
	// showPath(endNode,this)
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

Search.prototype.getNeighboursAStar = function(arr,node,exploredList){   
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
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,this.finalNode) + neighbour.weight
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
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,this.finalNode) + neighbour.weight
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
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,this.finalNode) + neighbour.weight
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
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,this.finalNode) + neighbour.weight
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
	var xDiff = node1.x - node2.x
	var yDiff = node1.y - node2.y
	var distance = Math.sqrt(Math.pow(xDiff,2)+Math.pow(yDiff,2))
	return distance
}


module.exports = Search
},{}]},{},[1]);
