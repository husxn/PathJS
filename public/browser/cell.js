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
  this.previousStatus = 'unexplored'
} 

Cell.prototype.getCellStatus = function(){
  return this.status
}

module.exports = Cell
// watchify /Users/Hussein/Desktop/testProjects/mazeProject/public/browser/board.js -o /Users/Hussein/Desktop/testProjects/mazeProject/public/browser/bundle.js 