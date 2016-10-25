var Cell = require('./cell')
var Search = require('./search')

function Board(height,width){
  this.height = height 
  this.width = width 
  this.boardArr = []
  this.mouseDown = false
  this.startNode;
  this.finalNode;
  this.currentCellStatus = null
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
  this.startNode = this.boardArr[Math.floor(this.boardArr.length/2)][Math.floor(this.boardArr.length/4)]
  document.getElementById(this.startNode.id).className = 'startingCell'
  //Set Initial end Node 
  this.finalNode = this.boardArr[Math.floor(this.boardArr.length/2)][Math.floor(3*this.boardArr.length/4)]
  document.getElementById(this.finalNode.id).className = 'finalCell'
} 
Board.prototype.addEventListeners = function(){
  var board = this
  //Add listeners for table elements
  for(var i=0;i<this.height;i++){
    for(var j=0;j<this.width;j++){
      var id = j.toString()+','+i.toString()
      var elem = document.getElementById(id)
      if(elem.className !== 'startingCell' && elem.className !== 'finalCell'){
        elem.addEventListener('mousedown',function(){
            board.changeCellClick(this.id)
            board.mouseDown = true
        })
        elem.addEventListener('mouseup',function(){
          board.mouseDown = false
          board.currentCellStatus = null
        })
        elem.addEventListener('mouseenter',function(){
          if(board.mouseDown && board.currentCellStatus === null){
            board.changeCellDrag(this.id)
          }
        })
      }
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
      var search = new Search(board.boardArr,board.startNode,board.finalNode,'BFS')
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
 
/*
  Set all elements with all listeners 
  If click 
    if status is start or end set current cell status to that 
  If mouseenter 
    if current cell status is active 
      set cell status to that 
    else 
      do whatever i was doing before 
  If mouseout 
    if current cell status is active 
      set this element to blank 
    

 */