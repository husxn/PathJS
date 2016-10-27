function Maze(board,startNode,finalNode){
  this.board = board
	this.boardArr = board.boardArr
  this.startNode = startNode
	this.finalNode = finalNode
}

Maze.prototype.startMaze = function(){
	for(var i=0;i<this.boardArr.length;i++){
		for(var j=0;j<this.boardArr[0].length;j++){
			var elem = document.getElementById(j.toString()+','+i.toString())
			if(Math.random() > 0.65 && elem.className !== 'startingCell' && elem.className !== 'finalCell'){
				elem.className = 'wall'
				this.board.getCell(j,i).status = 'wall'
			}
		}
	}

} 


module.exports = Maze