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
  this.currentPlace = null
  this.shouldBe = null
  this.algoDone = false
  this.currentAlgo = null
  this.lastWall = false
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
      elem.addEventListener('mousedown',function(e){
         e.preventDefault()
          if(this.className !== 'startingCell' && this.className !== 'finalCell'){
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
           e.preventDefault()
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
              if(cell.status === 'wall'){board.lastWall = true}
                cell.status = 'startNode'
                board.startNode = cell
                if(board.algoDone){
                  board.clearPath()
                var search = new Search(board.boardArr,board.startNode,board.finalNode,board.currentAlgo,board)
                search.startSearch()
                }

            }
            else if(this.className === 'finalCell'){
              if(cell.status === 'wall'){board.lastWall = true}
                cell.status = 'finalNode'
                board.finalNode = cell
                if(board.algoDone){
                  board.clearPath()
                var search = new Search(board.boardArr,board.startNode,board.finalNode,board.currentAlgo,board)
                search.startSearch()
                }
            }
          }
          else if(board.mouseDown && board.currentCellStatus !== null && (this.className === 'startingCell' || this.className === 'finalCell')){
            if(this.className === 'startingCell'){
              board.shouldBe = 'startingCell'
            }
            else if(this.className === 'finalCell'){
              board.shouldBe = 'finalCell'
            }
          }
      })
      elem.addEventListener('mouseout',function(e){
         e.preventDefault()  
        if(this.className === 'startingCell' || this.className === 'finalCell'){
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
      var search = new Search(board.boardArr,board.startNode,board.finalNode,'BFS',board)
      search.startSearch()
  })  
  //DFS
  document.getElementById('startButtonDFS').addEventListener('click',function(){
      var search = new Search(board.boardArr,board.startNode,board.finalNode,'DFS',board)
      search.startSearch()
  })
  //Dijkstra 
  document.getElementById('startButtonDijkstra').addEventListener('click',function(){
    var search = new Search(board.boardArr,board.startNode,board.finalNode,'Dijkstra',board)
    search.startSearch()
  })
  //AStar 
  document.getElementById('startButtonAStar').addEventListener('click',function(){
    var search = new Search(board.boardArr,board.startNode,board.finalNode,'AStar',board)
    search.startSearch()
  })
  //Greedy
  document.getElementById('startButtonGreedy').addEventListener('click',function(){
    var search = new Search(board.boardArr,board.startNode,board.finalNode,'Greedy',board)
    search.startSearch()
  })
  //Random Maze Generation
  document.getElementById('startButtonMazeRecursiveBacktracking').addEventListener('click',function(){
    var maze = new Maze(board,board.startNode,board.finalNode)
    maze.startMaze()
  })
  //Clear Path
  document.getElementById('startButtonClearPath').addEventListener('click',function(){
    board.algoDone = false
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
      // console.log(j,i,cell)
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
var board = new Board(51,51)
board.initialise()
