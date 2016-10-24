(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Cell = require('./cell')
var Search = require('./search')

function Board(height,width){
  this.height = height 
  this.width = width 
  this.boardArr = []
  this.mouseDown = false
  this.startNode;
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
  //Set start Node 
  this.startNode = this.boardArr[Math.floor(this.boardArr.length/2)][Math.floor(this.boardArr.length/2)]
}
Board.prototype.addEventListeners = function(){
  var board = this
  //Add listeners for table elements
  for(var i=0;i<this.height;i++){
    for(var j=0;j<this.width;j++){
      var id = j.toString()+','+i.toString()
      var elem = document.getElementById(id)
      // elem.addEventListener('click',function(){
      //   board.changeCellClick(this.id)
      // })
      elem.addEventListener('mousedown',function(){
        board.changeCellClick(this.id)
        board.mouseDown = true
      })
      elem.addEventListener('mouseup',function(){
        board.mouseDown = false
      })
      elem.addEventListener('mouseenter',function(){
        if(board.mouseDown){
          board.changeCellDrag(this.id)
        }
      })
    }
  }
  //Add listeners for Nav Bar
  document.getElementById('Algorithm').addEventListener('click',function(){
    console.log('Algorithm clicked')
  })
  document.getElementById('AlgorithmSettings').addEventListener('click',function(){
    console.log('AlgorithmSettings clicked')
  })
  //Add Listeners for Button Panel
  //BFS
  document.getElementById('startButtonBFS').addEventListener('click',function(){
      var search = new Search(board.boardArr,board.startNode,'BFS')
      search.startSearch()
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
    else{
      //LOGIC FOR DRAG START AND END
    }
  }
  
}

Board.prototype.toggle = function(cell){
  if(cell.status === 'unexplored' || cell.status === 'explored'){
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

Board.prototype.generateRandom = function(){
   console.log("Generating random Maze")
}

var board = new Board(30,30)
board.initialise()
 
},{"./cell":2,"./search":3}],2:[function(require,module,exports){
function Cell(xPos,yPos){
  this.x = xPos
  this.y = yPos
  this.status = 'unexplored' 
  this.id = this.x.toString()+','+this.y.toString()
} 

Cell.prototype.getCellStatus = function(){
  return this.status
}

module.exports = Cell
},{}],3:[function(require,module,exports){
function Search(board,startNode,currentAlgorithm){
  this.currentAlgorithm = currentAlgorithm
  this.board = board
  this.startNode = startNode
}

Search.prototype.startSearch = function(){
  // console.log('inside startSearch')
  var startNode = this.startNode 
  switch(this.currentAlgorithm){
    case 'Dijkstra':
    case 'AStar':
    case 'BFS':
      var exploredList = this.searchBFS()
      this.showAnimation(exploredList)
    case 'DFS':
      console.log("case dfs")
      // var exploredList = this.searchDFS()
      // this.showAnimation(exploredList)
  }
} 

Search.prototype.getNeighbours = function(arr,node){
  	var neighbourList = []
	//Get Neighbour Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall'){
		neighbourList.push(arr[node.y-1][node.x])
	}
	//Get Neighbour Right 
	if(node.x<arr[0].length-1 && arr[node.y][node.x+1].status !== 'wall'){
		neighbourList.push(arr[node.y][node.x+1])
	}
	//Get Neighbour Down 
	if((node.y<arr.length-1) && arr[node.y+1][node.x].status !== 'wall'){
		neighbourList.push(arr[node.y+1][node.x])
	}
	//Get Neighbour Left
	if(node.x>0 && arr[node.y][node.x-1].status !== 'wall'){
		neighbourList.push(arr[node.y][node.x-1])
	}
	return neighbourList
}  

Search.prototype.searchDFS = function(){
  console.log("DFS CALLED")
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
	while(listToExplore.length !==0){
		var currentNode = listToExplore[0]
		if(!isPresent(currentNode)){
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
  
  console.log(this.board)
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
	while(listToExplore.length !==0){
		var currentNode = listToExplore[0]
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

Search.prototype.searchDijkstra = function(){
  //
}

Search.prototype.searchAStar = function(){
  //
}

Search.prototype.showAnimation = function(exploredList){
  var startNode = exploredList[0]
  exploredList = exploredList.slice(1)
  startNode.status = 'startNode'
  document.getElementById(startNode.id).className = 'startingCell'
  function timeout(index) {
    setTimeout(function () {
        if(index === exploredList.length){
          return
        }
        change(exploredList[index])
        timeout(index+1);
    }, 100);
  }
  function change(node){
    var elem = document.getElementById(node.id)
    node.status = 'explored'
    elem.className = 'explored'
  }
  timeout(0)
}


module.exports = Search
},{}]},{},[1]);
