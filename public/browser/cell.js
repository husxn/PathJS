function Cell(xPos,yPos){
  this.x = xPos
  this.y = yPos
  this.status = 'unexplored' 
  this.id = this.x.toString()+','+this.y.toString()
  this.parent = null
  this.currentDirection = 'UP'
  this.distance = Infinity
} 

Cell.prototype.getCellStatus = function(){
  return this.status
}

module.exports = Cell