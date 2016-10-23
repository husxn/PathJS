function Cell(xPos,yPos){
  this.x = xPos
  this.y = yPos
  this.status = 'unexplored' 
}

Cell.prototype.getCellStatus = function(){
  return this.status
}

module.exports = Cell