var Cell = require('./cell')
var Search = require('./search')
var Maze = require('./maze')
//Back to here
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
  this.algoToRun = null
  this.canPress = true
  this.canAddObject = true
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
  var xFinalNode = Math.floor(3*this.boardArr[0].length/4)
  this.finalNode = this.boardArr[y][xFinalNode]
  this.boardArr[y][xFinalNode].status = 'finalNode'
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

  // window.addEventListener('keydown',function(e){
  //   if(e.keyCode === 79){
  //     var height = board.boardArr.length 
  //     var width =  board.boardArr[0].length 
  //     var cell = board.getCell(Math.floor(height/2),Math.floor(width/2))
  //     cell.status = 'middleObj'
  //     document.getElementById(cell.id).className = 'middleObj'
  //     console.log(cell)
  //   }
  // })

  //Add listeners for table elements  
  for(var i=0;i<this.height;i++){  
    for(var j=0;j<this.width;j++){
      var id = j.toString()+','+i.toString()
      var elem = document.getElementById(id)
      elem.addEventListener('mousedown',function(e){
         e.preventDefault()
          if(this.className !== 'startingCell' && this.className !== 'finalCell' && this.className !== 'objectCell'){
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
          else if(board.mouseDown && board.currentCellStatus !== null && this.className !== 'startingCell' && this.className !== 'finalCell' && this.className !== 'objectCell'){  
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
            else if(this.className === 'objectCell'){
              if(cell.status === 'wall'){board.lastWall = true}
                cell.status = 'objectNode'
                board.objectNode = cell
                if(board.algoDone){
                  board.clearPath()
                var search = new Search(board.boardArr,board.startNode,board.finalNode,board.currentAlgo,board)
                search.startSearch()
                }
            }
          }
          else if(board.mouseDown && board.currentCellStatus !== null && (this.className === 'startingCell' || this.className === 'finalCell' || this.className === 'objectCell')){
            if(this.className === 'startingCell'){
              board.shouldBe = 'startingCell'
            }
            else if(this.className === 'finalCell'){
              board.shouldBe = 'finalCell'
            }
            else if(this.className === 'objectCell'){
              board.shouldBe = 'objectCell'
            }
          }
      })
      elem.addEventListener('mouseout',function(e){
         e.preventDefault()  
        if(this.className === 'startingCell' || this.className === 'finalCell' || this.className === 'objectCell'){
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
      if(board.canPress){
        document.getElementById('visualise').innerHTML = 'Visualise BFS'
        board.algoToRun = 'BFS'
        // search.startSearch()
      }
  })  
  //DFS
  document.getElementById('startButtonDFS').addEventListener('click',function(){ 
      if(board.canPress){
        document.getElementById('visualise').innerHTML = 'Visualise DFS'
        board.algoToRun = 'DFS'
        // search.startSearch()
      }
  })
  //Dijkstra 
  document.getElementById('startButtonDijkstra').addEventListener('click',function(){ 
    if(board.canPress){
      document.getElementById('visualise').innerHTML = 'Visualise Dijkstra'
      board.algoToRun = 'Dijkstra'
      // search.startSearch()
    }
  })
  //Fake AStar 1
  document.getElementById('startButtonAStar').addEventListener('click',function(){ 
    if(board.canPress){
      document.getElementById('visualise').innerHTML = 'Visualise Test A*'
      board.algoToRun = 'AStar'
      // search.startSearch()
    }
  })
  //Fake AStar 2
  document.getElementById('startButtonAStar2').addEventListener('click',function(){  
    if(board.canPress){
      document.getElementById('visualise').innerHTML = 'Visualise Test 2 A*'
      board.algoToRun = 'AStar2'
      // search.startSearch()
    }
  })
  //Greedy
  document.getElementById('startButtonGreedy').addEventListener('click',function(){ 
     if(board.canPress){ 
      document.getElementById('visualise').innerHTML = 'Visualise Best First Search'
      board.algoToRun = 'Greedy'
      // search.startSearch()
     }
  })

  document.getElementById('startButtonRealAStar').addEventListener('click',function(){
    if(board.canPress){
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
    if(board.canPress){
      var maze = new Maze(board,board.startNode,board.finalNode,'basicMaze')
      maze.startMaze()
    }
  })
  //Recursive Division 1
  document.getElementById('startButtonBossMaze1').addEventListener('click',function(){
    if(board.canPress){
      var maze = new Maze(board,board.startNode,board.finalNode,'bossMaze1',true)
      maze.startMaze()
    }
  })
  //Recursive Division 2
  document.getElementById('startButtonBossMaze2').addEventListener('click',function(){
    if(board.canPress){
      var maze = new Maze(board,board.startNode,board.finalNode,'bossMaze2',true)
      maze.startMaze()
    }
  })
  //Recursive Division 3
  document.getElementById('startButtonBossMaze3').addEventListener('click',function(){
    if(board.canPress){
      var maze = new Maze(board,board.startNode,board.finalNode,'bossMaze3',true)
      maze.startMaze()
    }
  })
  //Pokemon Theme
  document.getElementById('startButtonPokemonTheme').addEventListener('click',function(){

  })
  //Add an object
  document.getElementById('startButtonAddObject').addEventListener('click',function(){  
     if(board.canPress){ 
      if(board.canAddObject){
        var height = board.height
        var width = board.width
        board.objectNode = board.boardArr[Math.floor(height/2)][Math.floor(width/2)]
        board.objectNode.status = 'objectNode'
        document.getElementById(board.objectNode.id).className = 'objectCell'
        console.log(document.getElementById(board.objectNode.id))
        console.log(board.objectNode)
        board.canAddObject = false
        document.getElementById('addObjectHREF').innerHTML = 'Remove Object'

      }
      else{
        board.canAddObject = true 
        document.getElementById('addObjectHREF').innerHTML = 'Add an Object'
        var elem = document.getElementById(board.objectNode.id)
        var splitId = elem.id.split(',')
        var x = parseInt(splitId[0])
        var y = parseInt(splitId[1])
        var cell = board.getCell(x,y)
        cell.status = 'unexplored'
        elem.className = 'unexplored'
      }
     }
  }) 
  //Visualise Algorithm
  document.getElementById('startButtonVisualise').addEventListener('click',function(){
    board.algoDone = false
    if(board.canPress){
      board.clearPath()
      var algoName = board.algoToRun
      board.canPress = false
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
     if(board.canPress){ 
      board.algoDone = false
      board.clearPath()
     }
  }) 
  //Clear Walls
   document.getElementById('startButtonClearWalls').addEventListener('click',function(){
    if(board.canPress){
      board.clearWalls()
    }
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
  if(cell.status === 'unexplored' && this.keyDown || cell.status === 'explored' && this.keyDown){
      // cell.status = 'unexplored water'
      if(this.keyDown === 16){  
        cell.weight = 2
        return cell.status +' mud'
      }
      else{
        cell.weight = 15
        return cell.status + ' water'
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

Board.prototype.clearBoard = function(){
}

Board.prototype.clearPath = function(){   
  console.log('clear Path called')
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
var bar = document.getElementById('navbarDiv').clientHeight + document.getElementById('mainText').clientHeight
var height = Math.floor(document.documentElement.clientHeight) - bar
var width = Math.floor(document.documentElement.clientWidth)
var finalHeight = height/22
var finalWidth = width/20
var board = new Board(finalHeight,finalWidth-1)
// var board = new Board(10,10)
board.initialise() 


