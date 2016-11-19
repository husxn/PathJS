function Maze(board,startNode,finalNode,mazeToDo,animate){
  this.board = board
	this.boardArr = board.boardArr
  this.startNode = startNode
	this.finalNode = finalNode
	this.listToAnimate = []
	this.mazeToDo = mazeToDo
	this.toAnimate = true
} 

Maze.prototype.startMaze = function(){
	this.board.shouldDisable = true
	this.board.clearWalls()
	this.maxX = this.boardArr[0].length 
	this.maxY = this.boardArr.length
	if(this.mazeToDo === 'basicMaze'){
		this.basicMaze()
		this.toAnimate === true ? this.animate() : this.instant()
	}
	else if(this.mazeToDo === 'bossMaze1'){
		this.mazeGenerator()
		this.toAnimate === true ? this.animate() : this.instant()
	}
	else if(this.mazeToDo === 'bossMaze2'){
		this.mazeGenerator()
		this.toAnimate === true ? this.animate() : this.instant()
	}
	else if(this.mazeToDo === 'bossMaze3'){
		this.mazeGenerator()
		this.toAnimate === true ? this.animate() : this.instant()
	}

}  

Maze.prototype.basicMaze = function(){
	for(let i=0;i<this.boardArr.length;i++){
		for(let j=0;j<this.boardArr[0].length;j++){
			let elem = document.getElementById(j.toString()+','+i.toString())
			if(Math.random() > 0.75 && elem.className !== 'startingCell' && elem.className !== 'finalCell'){
				// elem.className = 'wall'
				let cell = this.board.getCell(j,i)
				cell.status = 'wall'
				this.listToAnimate.push(cell)
			}
			if(Math.random() > 0.85 && elem.className !== 'startingCell' && elem.className !== 'finalCell'){
					if(Math.random() > 0.5){
						// elem.className = 'unexplored mud'
						// this.board.getCell(j,i).weight = 2
					}
					else{
						// elem.className = 'unexplored water'
						// this.board.getCell(j,i).weight = 5
					}
			}

		}
	}
}

Maze.prototype.mazeGenerator = function(){
	for(let i=0;i<this.maxY;i++){
		for(let j=0;j<this.maxX;j++){
			if(i === 0 || i === this.maxY-1 || j === 0 || j === this.maxX - 1){
				let cell = this.board.getCell(j,i)
				if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
					cell.status = 'wall'
					this.listToAnimate.push(cell)
				}
				// document.getElementById(cell.id).className = 'wall'
			}
		}
	}
	this.bossMaze(2,this.boardArr[0].length-3,2,this.boardArr.length-3,'horizontal')
} 

Maze.prototype.bossMaze = function(startX,endX,startY,endY,orientation){   
	if(orientation === 'vertical'){  
		//Get Wall
		if(startX % 2 === 0 && (endY - startY) > -1 && (endX-startX) > -1){
			//Get Valid Walls 
			let validWall = []
			for(let i=startX;i<endX+1;i+=2){
				validWall.push(i)
			}
			let randomX = validWall[Math.floor(Math.random()*validWall.length)]
			//Draw Wall 
			this.drawWall(randomX,randomX,startY,endY,'vertical')
			//Get possible split points  
			let splitArr = []
			for(let i=startY-1;i<endY+2;i+=2){
				splitArr.push(randomX.toString()+','+i.toString())
			}
			//Choose where to split by 
			let randomPlaceToSplitID = splitArr[Math.floor(Math.random() * splitArr.length)]
			//Make hole 
			let elem = document.getElementById(randomPlaceToSplitID)
			let idArr = randomPlaceToSplitID.split(',')
			let cell = this.board.getCell(parseInt(idArr[0]),parseInt(idArr[1]))
			// elem.className = 'unexplored'
			if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'unexplored'
				this.listToAnimate.push(cell)
			}

			let lengthLargerThanHeightLeft = !this.lengthLargerThanHeight(startX,randomX-2,startY,endY);
			let lengthLargerThanHeightRight; 
			if(this.mazeToDo === 'bossMaze 1' || this.mazeToDo === 'bossMaze2'){
 				lengthLargerThanHeightRight = !this.lengthLargerThanHeight(randomX+2,endX,startY,endY);
				 
			}
			else if(this.mazeToDo === 'bossMaze3'){
				lengthLargerThanHeightRight = this.lengthLargerThanHeight(randomX+2,endX,startY,endY);
			}
			//Left One 
				//Left Orientation should be vertical 
				if(lengthLargerThanHeightLeft){
					this.bossMaze(startX,randomX - 2,startY,endY,'horizontal')
				}
				//Left Orientation should be horizontal 
				else{
					this.bossMaze(startX,randomX - 2,startY,endY,'vertical')
				}
			//Right One 
				//Right Orientation should be vertical 
				if(lengthLargerThanHeightRight){
					this.bossMaze(randomX+2,endX,startY,endY,'horizontal')
				}
				//Right Orientation should be horizontal 
				else{	
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
			let validWall = []
			for(let i=startY;i<endY+1;i+=2){
					validWall.push(i)
			}
			let randomY = validWall[Math.floor(Math.random()*validWall.length)]
			//Draw Wall 
			this.drawWall(startX,endX,randomY,randomY,'horizontal')
			//Get possible split points 
			let splitArr = []
			for(let i=startX-1;i<endX+2;i+=2){
				 splitArr.push(i.toString()+','+randomY.toString())
			}
			//Choose where to split by 
			let randomPlaceToSplitID = splitArr[Math.floor(Math.random() * splitArr.length)]
			//Make hole 
			let elem = document.getElementById(randomPlaceToSplitID)
			let idArr = randomPlaceToSplitID.split(',')
			let cell = this.board.getCell(parseInt(idArr[0]),parseInt(idArr[1]))
			// elem.className = 'unexplored'
			if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'unexplored'
				this.listToAnimate.push(cell)
			}

			let lengthLargerThanHeightTop = !this.lengthLargerThanHeight(startX,endX,startY,randomY-2);
			let lengthLargerThanHeightBottom; 
			if(this.mazeToDo === 'bossMaze1' || this.mazeToDo === 'bossMaze3'){
				lengthLargerThanHeightBottom = !this.lengthLargerThanHeight(startX,endX,randomY+2,endY);
			}
			else if(this.mazeToDo === 'bossMaze2'){
				lengthLargerThanHeightBottom = this.lengthLargerThanHeight(startX,endX,randomY+2,endY);
			}
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
				return;
		}
	}
}

Maze.prototype.drawWall = function(startX,endX,startY,endY,orientation){ 
	if(orientation === 'vertical'){
		for(let i=startY-1;i<endY+2;i++){
			let elem = document.getElementById(startX.toString()+','+i.toString())
			// elem.className = 'wall'
			let cell = this.board.getCell(startX,i)
			if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'wall'
				this.listToAnimate.push(cell)
			}
		}
	}
	else if(orientation === 'horizontal'){
		for(let j=startX-1;j<endX+2;j++){
			let elem = document.getElementById(j.toString()+','+startY.toString())
			// elem.className = 'wall'
			let cell = this.board.getCell(j,startY)
			if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'wall'
				this.listToAnimate.push(cell)
			}

		}
	}
}

Maze.prototype.lengthLargerThanHeight = function(startX,endX,startY,endY){
	let returnVal = (endX-startX) - (endY-startY) > 0
	return returnVal
}


Maze.prototype.animate = function(){ 
  let self = this
	let list = this.listToAnimate
	function timeout(index) {
    setTimeout(function () {
        if(index === list.length){
					self.board.shouldDisable = false
					return
        }
        let cell = list[index]
				document.getElementById(cell.id).className = cell.status
        timeout(index+1);
    }, 0.0001);
  }   
  timeout(0)
}

Maze.prototype.instant = function(){
	for(let i in this.listToAnimate){
		let cell = this.list[i]
		document.getElementById(cell.id).className = cell.status
	}
}

module.exports = Maze