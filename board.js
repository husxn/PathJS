function Cell(xPos,yPos){
  this.x = xPos
  this.y = yPos
  this.status = 'unexplored' 
}

Cell.prototype.getCellStatus = function(){
  return this.status
}



function Board(height,width){
  this.height = height 
  this.width = width 
  this.boardArr = []
  this.mouseDown = false
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
}
Board.prototype.addEventListeners = function(){
  //Add listeners for table elements
  for(var i=0;i<this.height;i++){
    for(var j=0;j<this.width;j++){
      var id = j.toString()+','+i.toString()
      var elem = document.getElementById(id)
      var board = this
      elem.addEventListener('click',function(){
        board.changeCellClick(this.id)
      })
      elem.addEventListener('mousedown',function(){
        board.mouseDown = true
        //  board.changeCellClick(this.id)
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
}

Board.prototype.getCell = function(x,y){
  return this.boardArr[x][y]
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
