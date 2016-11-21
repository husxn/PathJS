function Search(board,startNode,finalNode,currentAlgorithm,boardA){ 
  this.currentAlgorithm = currentAlgorithm
  this.board = board
  this.startNode = startNode
	this.finalNode = finalNode
	this.boardA = boardA
} 

Search.prototype.startSearch = function(){ 
	this.boardA.shouldDisable = true
	document.getElementById(this.finalNode.id).className = 'finalCell'
	this.finalNode.className = 'finalCell'
	if(this.currentAlgorithm === 'BFS'){
		let exploredList = this.searchBFS()
    this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}
	else if(this.currentAlgorithm === 'DFS'){
		let exploredList = this.searchDFS()
    this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}
	else if(this.currentAlgorithm === 'Dijkstra'){
		let exploredList = this.searchDijkstra()
		this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}
	else if(this.currentAlgorithm === 'AStar'){
		let exploredList = this.searchAStar()
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	} 
	else if(this.currentAlgorithm === 'AStar2'){
		let exploredList = this.searchAStar('2')
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	} 
	else if(this.currentAlgorithm === 'Greedy'){
		let exploredList = this.searchGreedy()
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}   
	else if(this.currentAlgorithm === 'RealAStar'){
		let exploredList = this.searchRealAStaar()
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}     
	else if(this.currentAlgorithm === 'Bidirectional'){
		let exploredList = this.searchBidirectional()
		this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}    
}  

Search.prototype.getNeighbours = function(arr,node,algo,exploredList){   
  let neighbourList = []
	//Get Neighbour Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall'){
		let neighbour = arr[node.y-1][node.x]
		
		if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode' && exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Right 
	if(node.x<arr[0].length-1 && arr[node.y][node.x+1].status !== 'wall'){
		let neighbour = arr[node.y][node.x+1]
		// console.log(neighbour.id,arr.finalNode)
			if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode'&& exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Down 
	if((node.y<arr.length-1) && arr[node.y+1][node.x].status !== 'wall'){
		let neighbour = arr[node.y+1][node.x]
	if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode'&& exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Left
	if(node.x>0 && arr[node.y][node.x-1].status !== 'wall'){
		let neighbour = arr[node.y][node.x-1]
	if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode'&& exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	return neighbourList
}       

Search.prototype.searchDFS = function(){  
 let exploredList = [] 
	let listToExplore = [this.startNode]
	let isPresent = function(node){
		let returnVal = false
		for(let i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !==0){
		let currentNode = listToExplore[0]
		if(currentNode === this.finalNode){
			currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
      listToExplore = listToExplore.slice(1)
    }
    else if(!isPresent(currentNode)){
			let neighbours = this.getNeighbours(this.board,currentNode,'DFS',exploredList)
			listToExplore = listToExplore.slice(1)
			listToExplore = neighbours.concat(listToExplore)
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}
	}
	this.boardA.currentAlgo = 'DFS'
	return exploredList 
} 

Search.prototype.searchBFS = function(){      
  let exploredList = []
	let numOnes = 0
	let listToExplore = [this.startNode]
	let isPresent = function(node){
		let returnVal = false
		for(let i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !==0){ 
		let currentNode = listToExplore[0]
		let inWhileLoop = new Date()
		if(currentNode === this.finalNode){
			// currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
      listToExplore = listToExplore.slice(1)
    }
    else if(!isPresent(currentNode)){
			let neighbours = this.getNeighbours(this.board,currentNode)
			listToExplore = listToExplore.slice(1)
			listToExplore = listToExplore.concat(neighbours)
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}
	}
	this.boardA.currentAlgo = 'BFS'
	return exploredList 
}  

Search.prototype.searchBidirectional = function(){    
	this.startNode.distance = 0
	this.finalNode.distance = 0
	let exploredList = []
	let listToExploreStart = [this.startNode]
	let listToExploreFinal = [this.finalNode]
	let numOnes = 0
	let count = 2
	let currentNode;
	let status;
	let pleaseWork = function(node,status){ 
		let returnVal = false
		for(let i in exploredList){
			if(i < exploredList.length - 1 && exploredList[i].id === node.id && exploredList[i].exploredBy !== status){
					// console.log(exploredList[i].id,node.id,status,exploredList[i].exploredBy)
					returnVal = 'break'
					break
			}
			else if(i < exploredList.length - 1 && exploredList[i].id === node.id && exploredList[i].exploredBy === status){
					// console.log(exploredList[i].id,node.id,status,exploredList[i].exploredBy)
					returnVal = true
			}
		} 
		return returnVal

	}
	whileLoop:
	while(listToExploreStart.length !== 0 && listToExploreFinal.length !== 0){ 
		//Check which list to use currentNode from 
		// console.log(listToExploreStart.length+listToExploreFinal.length)
		listToExploreStart = listToExploreStart.sort(function(nodeA,nodeB){return nodeA.distance - nodeB.distance})
		listToExploreFinal = listToExploreFinal.sort(function(nodeA,nodeB){return nodeA.distance - nodeB.distance})
		currentNode = count % 2 === 0 ? listToExploreStart[0] : listToExploreFinal[0]
		// console.log(currentNode)
		count % 2 === 0 ? status = 'start' : status = 'final'
		let value = pleaseWork(currentNode,status)
		// console.log(value)
		if(value === 'break'){
			console.log("breaking whileLoop")
			break whileLoop
		}
		//Wall 
		if(currentNode.status === 'wall'){
				count % 2 === 0 ? listToExploreStart = listToExploreStart.slice(1) : listToExploreFinal = listToExploreFinal.slice(1)
		}
		else if(value === false){ 
			//Get neighbours 
			let neighbours;
			count % 2 === 0 ? neighbours = this.getNeighboursAStar(this.board,currentNode,exploredList,'algo',this.finalNode) : neighbours = this.getNeighboursAStar(this.board,currentNode,exploredList,'algo',this.startNode) 
			// let neighbours = this.getNeighbours(this.board,currentNode)
			//Remove node from listToExplore 
			if(count % 2 === 0){
					listToExploreStart = listToExploreStart.slice(1)
			}
			else{
				listToExploreFinal = listToExploreFinal.slice(1)
			}

			if(count % 2 === 0){
				let newNeighboursList = []
				for(let i in neighbours){
					neighbours[i].exploredBy = 'start'
					// console.log(neighbours[i])
					newNeighboursList.push(neighbours[i])
				}
				listToExploreStart = listToExploreStart.concat(newNeighboursList) 
			}
			else{
				let newNeighboursList = []
				for(let i in neighbours){
					neighbours[i].exploredBy = 'final'
					// console.log(neighbours[i])
					newNeighboursList.push(neighbours[i])
				}
					listToExploreFinal = listToExploreFinal.concat(newNeighboursList)
			}
			++count
			if(count < 5){console.log(exploredList)}
			exploredList.push(currentNode)
		}
		else{
			count % 2 === 0 ? listToExploreStart = listToExploreStart.slice(1) : listToExploreFinal = listToExploreFinal.slice(1)
		}
		// ++count
	}
	return exploredList
}

Search.prototype.searchBidirectional2 = function(){

}

Search.prototype.searchAStar = function(algo){  	
	this.startNode.distance = 0
	let listToExplore = [this.startNode]
	let exploredList = []
	let isPresent = function(node){
		let returnVal = false
		for(let i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		} 
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !== 0){
		//Sort listToExplore by distance 
		listToExplore = listToExplore.sort(function(nodeA,nodeB){return nodeA.distance - nodeB.distance})
		//Get currentNode 
		let currentNode = listToExplore[0];

		if(currentNode === this.finalNode){
			currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
			listToExplore = listToExplore.slice(1)
		}
		else if(!isPresent(currentNode)){
			//If currentNode is finalNode break 
			if(currentNode === this.finalNode){break whileLoop}
			//Get currentNode's neighbours 
			let neighbours = this.getNeighboursAStar(this.board,currentNode,exploredList,algo,this.finalNode)
			//Add neighbours to listToExplore
			listToExplore = listToExplore.concat(neighbours)
			//Remove currentNode from listToExplore
			listToExplore = listToExplore.slice(1)
			//Add currentNode to exploredList 
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}
	}
	algo === '2' ? this.boardA.currentAlgo = 'AStar2': this.boardA.currentAlgo = 'AStar'
	return exploredList
}

Search.prototype.searchGreedy = function(){
	this.startNode.distance = 0
	let listToExplore = [this.startNode]
	let exploredList = []
	let isPresent = function(node){
		let returnVal = false
		for(let i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !== 0){
		//Sort listToExplore by distance 
		listToExplore = listToExplore.sort(function(nodeA,nodeB){return nodeA.distance - nodeB.distance})
		//Get currentNode 
		let currentNode = listToExplore[0];

		if(currentNode === this.finalNode){
			currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
			listToExplore = listToExplore.slice(1)
		}
		else if(!isPresent(currentNode)){
			//If currentNode is finalNode break 
			if(currentNode === this.finalNode){break whileLoop}
			//Get currentNode's neighbours 
			let neighbours = this.getNeighboursGreedy(this.board,currentNode,exploredList)
			//Add neighbours to listToExplore
			listToExplore = listToExplore.concat(neighbours)
			//Remove currentNode from listToExplore
			listToExplore = listToExplore.slice(1)
			//Add currentNode to exploredList 
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}
	}
	this.boardA.currentAlgo = 'Greedy'
	return exploredList
}

Search.prototype.showAnimation = function(exploredList){   
	// for(var i in exploredList){console.log(exploredList[i].status,exploredList[i].weight)}
	let count = 0
	let self = this
	let startNode = exploredList[0]
  exploredList = exploredList.slice(1)
	let endNode = exploredList[exploredList.length-1]
  function timeout(index,exploredList,timeLength) {   
		setTimeout(function () {
        if(index === exploredList.length){
					if(count === 0) showPath(endNode,self)
					else{ 
						self.boardA.shouldDisable = false
						self.algoDone()

					}
					return
        }
        change(exploredList[index],index,exploredList.length)
        timeout(index+1,exploredList,timeLength);
    }, timeLength);
  }  
  function change(node,index,length){  
		let elem = document.getElementById(node.id)
		if(node.status === 'unexplored weight'){
			node.status = 'explored weight'
			elem.className = 'explored weight'
		}
		else if(node.status === 'unexplored'){
			node.status = 'explored'
			elem.className = 'explored'
		}
		else if(node.status === 'shortestPath explored weight'){
			elem.className = 'shortestPath explored weight'
			if(node.parent.status === 'shortestPath') document.getElementById(node.parent.id).className = 'shortestPath'
			if(index === length -1 ) self.changeFinalClassName()
		}
		else if(node.status === 'shortestPath'){
			if(node.parent.status !== 'startNode'){
				if(node.parent.status === 'shortestPath') document.getElementById(node.parent.id).className = 'shortestPath'
				if(index !== length - 1){
					let newClassName = 'shortestPath' + node.direction
					document.getElementById(node.id).className = newClassName
				}
				else {
					document.getElementById(node.id).className = 'shortestPath'
					self.changeFinalClassName()
				}
			}
			else{
				node.status = 'shortestPath'
				if(self.finalNode.parent === node){
					document.getElementById(node.id).className = 'shortestPath' + node.direction
					self.changeFinalClassName(node)
				}
			}
		}
  } 
	function showPath(node,search){ 
		// console.log(startNode,node)
		count++
		let listPath = []
		let endNode = Object.assign({},node)
		while(node !== startNode){
			if(node.status !== endNode.status){
				listPath.push(node)
			}
			node = node.parent
		}
		if(endNode.status === self.finalNode.status){
			listPath.forEach(function(e){
				e.status === 'explored weight' ? e.status = 'shortestPath explored weight' : 	e.status ='shortestPath' 
			})
			timeout(0,listPath.reverse(),35)
		}
		else{
			self.boardA.shouldDisable = false
		}
	}
  timeout(0,exploredList,0.001)
}

Search.prototype.algoDone = function(){
	this.boardA.algoDone = true
}

Search.prototype.changeFinalClassName = function(node){
	if(node) document.getElementById(node.id).className = 'shortestPath'
	let finalCell;
	finalCell = document.getElementsByClassName('finalCell')[1]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellUP')[0]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellRIGHT')[0]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellDOWN')[0]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellLEFT')[0]
	finalCell.className = 'finalCell' + this.finalNode.direction
}

Search.prototype.showAnimationDrag = function(exploredList){ 
	for(let i in exploredList){
		let cell = exploredList[i]
		if(cell.status === 'unexplored'){
			cell.status = 'explored'
			document.getElementById(cell.id).className = 'explored'
		}
		else if(cell.status === 'unexplored weight'){
			cell.status = 'explored weight'
			document.getElementById(cell.id).className = 'explored weight'
		}
	} 
	let endNode = exploredList[exploredList.length-1]
	let newEndNode = Object.assign({},endNode)
	let shortestPathList = []
	while(endNode !== this.startNode){
		shortestPathList.push(endNode)
		endNode = endNode.parent
	}
	shortestPathList = shortestPathList.reverse()
	if(newEndNode.status === 'finalNode'){
		this.changeFinalClassName()
		for(let i in shortestPathList){
			let cell = shortestPathList[i]
			if(cell.status === 'explored weight'){
				cell.status = 'shortestPath explored weight'
				document.getElementById(cell.id).className = 'shortestPath explored weight'
			}
			else if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'explored'
				document.getElementById(cell.id).className = 'shortestPath'
			}
		}
	}
	this.boardA.shouldDisable = false
	this.boardA.algoDone = true
	 
}  

Search.prototype.getNeighboursDijkstra = function(arr,node,exploredList){   
	let neigbourList = []
	//Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
		//Get Up neighbour 
		let neighbour = arr[node.y-1][node.x] 
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'UP'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Right 
	if(node.x<arr[0].length-1 && arr[node.y][node.x+1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x+1],exploredList) === false){ 
		//Get Up neighbour 
		let neighbour = arr[node.y][node.x+1]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'RIGHT'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Down 
	if((node.y<arr.length-1) && arr[node.y+1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y+1][node.x],exploredList) === false){
		//Get Up neighbour 
		let neighbour = arr[node.y+1][node.x]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'DOWN'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Left
	if(node.x>0 && arr[node.y][node.x-1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x-1],exploredList) === false){
		//Get Up neighbour 
		let neighbour = arr[node.y][node.x-1]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'LEFT'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		}  
	}
	return neigbourList
}  

Search.prototype.getNeighboursAStar = function(arr,node,exploredList,algo,finalNode){     
	let neigbourList = [] 
	//Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
		//Get Up neighbour 
		let neighbour = arr[node.y-1][node.x]
		// console.log('neighbour',neighbour.distance)
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		let newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
		algo === '2' ? newNeighbourDistance = newNeighbourDistance2 : newNeighbourDistance;
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			// console.log("here")
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'UP'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Right 
	if(node.x<arr[0].length-1 && arr[node.y][node.x+1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x+1],exploredList) === false){ 
		//Get Up neighbour 
		let neighbour = arr[node.y][node.x+1]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		let newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
		algo === '2' ? newNeighbourDistance = newNeighbourDistance2 : newNeighbourDistance;
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'RIGHT'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Down 
	if((node.y<arr.length-1) && arr[node.y+1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y+1][node.x],exploredList) === false){
		//Get Up neighbour 
		let neighbour = arr[node.y+1][node.x]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		let newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
		algo === '2' ? newNeighbourDistance = newNeighbourDistance2 : newNeighbourDistance;
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'DOWN'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Left
	if(node.x>0 && arr[node.y][node.x-1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x-1],exploredList) === false){
		//Get Up neighbour 
		let neighbour = arr[node.y][node.x-1]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
		//Calculate new neighbour distance	
		let newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		let newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
		algo === '2' ? newNeighbourDistance = newNeighbourDistance2 : newNeighbourDistance;
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'LEFT'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		}  
	}
	return neigbourList
} 

Search.prototype.getNeighboursGreedy = function(arr,node,exploredList){   
	let neigbourList = []
	//Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
		//Get Up neighbour 
		let neighbour = arr[node.y-1][node.x] 
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
		//Calculate new neighbour distance	
		let newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'UP'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Right 
	if(node.x<arr[0].length-1 && arr[node.y][node.x+1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x+1],exploredList) === false){ 
		//Get Up neighbour 
		let neighbour = arr[node.y][node.x+1]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
		//Calculate new neighbour distance	
		let newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'RIGHT'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Down 
	if((node.y<arr.length-1) && arr[node.y+1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y+1][node.x],exploredList) === false){
		//Get Up neighbour 
		let neighbour = arr[node.y+1][node.x]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
		//Calculate new neighbour distance	
		let newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'DOWN'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		} 
	} 
	//Left
	if(node.x>0 && arr[node.y][node.x-1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x-1],exploredList) === false){
		//Get Up neighbour 
		let neighbour = arr[node.y][node.x-1]
		//Get current distance 
		let currentDistance = node.distance 
		//Get My Direction 
		let myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		let numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
		//Calculate new neighbour distance	
		let newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
		//If this is lower than the currentDistance on the neighbour change
		if(newNeighbourDistance < neighbour.distance){
			neighbour.distance = newNeighbourDistance
			neighbour.direction = 'LEFT'
			//Add neighbour to neigbourList
			neigbourList.push(neighbour)
			neighbour.parent = node
		}  
	}
	return neigbourList
} 

Search.prototype.searchDijkstra = function(){ 
	this.startNode.distance = 0
	let listToExplore = [this.startNode]
	let exploredList = []
	let isPresent = function(node){
		let returnVal = false
		for(let i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !== 0){
		//Sort listToExplore by distance 
		listToExplore = listToExplore.sort(function(nodeA,nodeB){return nodeA.distance - nodeB.distance})
		//Get currentNode 
		let currentNode = listToExplore[0];

		if(currentNode === this.finalNode){
			currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
			listToExplore = listToExplore.slice(1)
		}
		else if(!isPresent(currentNode)){
			//If currentNode is finalNode break 
			if(currentNode === this.finalNode){break whileLoop}
			//Get currentNode's neighbours 
			let neighbours = this.getNeighboursDijkstra(this.board,currentNode,exploredList)
			//Add neighbours to listToExplore
			listToExplore = listToExplore.concat(neighbours)
			//Remove currentNode from listToExplore
			listToExplore = listToExplore.slice(1)
			//Add currentNode to exploredList 
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}

	}
	this.boardA.currentAlgo = 'Dijkstra'

	return exploredList
}   

Search.prototype.hasBeenExplored = function(node,exploredList){
	let returnVal = false
	for(let i in exploredList.length){
		if(exploredList[i].id === node.id){
			returnVal = true
		}
	}
	return returnVal
} 

Search.prototype.checkNumberOfMoves = function(currentDirection,direction){
	if(currentDirection === direction){
		return 0
	}
	else if((currentDirection === 'UP' || currentDirection === 'DOWN') && (direction === 'LEFT' || direction === 'RIGHT')){
		return 1
	}
	else if((currentDirection === 'LEFT' || currentDirection === 'RIGHT') && (direction === 'UP' || direction === 'DOWN')){
		return 1
	}
	else if((currentDirection === 'LEFT' || currentDirection === 'RIGHT') && (direction === 'LEFT' || direction === 'RIGHT')){
		return 2
	}
	else if((currentDirection === 'UP' || currentDirection === 'DOWN') && (direction === 'UP' || direction === 'DOWN')){
		return 2
	}
}

Search.prototype.manhattanDistance = function(node1,node2){ 
	let xDiff = Math.abs(node1.x - node2.x)
	let yDiff = Math.abs(node1.y - node2.y)
	let distance = Math.sqrt(Math.pow(xDiff,2)+Math.pow(yDiff,2))
	let sum = xDiff + yDiff
	return sum
}

Search.prototype.realAStar = function(){ 
	this.startNode.distance = 0
	this.startNode.heuristicDistance = this.manhattanDistance(this.startNode,this.finalNode)
	this.startNode.totalDistance = this.startNode.distance + this.startNode.heuristicDistance
	let listToExplore = [this.startNode]
	let exploredList = []
	let isPresent = function(node){
		let returnVal = false
		for(let i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !== 0){
		//Sort listToExplore by distance 
		listToExplore = listToExplore.sort(function(nodeA,nodeB){return (nodeA.totalDistance + nodeA.heuristicDistance) - (nodeB.totalDistance + nodeB.heuristicDistance)})
		//Get currentNode 
		let currentNode = listToExplore[0];

		if(currentNode === this.finalNode){
			currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
			listToExplore = listToExplore.slice(1)
		}
		else if(!isPresent(currentNode)){
			//If currentNode is finalNode break 
			if(currentNode === this.finalNode){break whileLoop}
			//Get currentNode's neighbours 
			let neighbours = this.getNeighboursRealAStar(this.board,currentNode,exploredList)
			//Add neighbours to listToExplore
			listToExplore = listToExplore.concat(neighbours)
			//Remove currentNode from listToExplore
			listToExplore = listToExplore.slice(1)
			//Add currentNode to exploredList 
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}
	}
	this.boardA.currentAlgo = 'RealAStar'
	return exploredList
}

Search.prototype.getNeighboursRealAStar = function(arr,node,exploredList){
	let self = this 
	let list = this.getNeighboursDijkstra(arr,node,exploredList)
	list.forEach((neighbour) =>{
		neighbour.heuristicDistance = self.manhattanDistance(neighbour,self.finalNode) 
		neighbour.totalDistance = neighbour.distance + neighbour.heuristicDistance
		console.log(neighbour)
	})
	return list;
}

Search.prototype.searchRealAStaar = function(){   
	this.startNode.distance = 0
	this.startNode.heuristicDistance = this.manhattanDistance(this.startNode,this.finalNode)
	this.startNode.totalDistance = this.startNode.distance + this.startNode.heuristicDistance
	let listToExplore = [this.startNode]
	let exploredList = []
	let isPresent = function(node){ 
		let returnVal = false
		for(let i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !== 0){
		//Sort listToExplore by distance 
		listToExplore = listToExplore.sort(function(nodeA,nodeB){
			if(nodeA.totalDistance === nodeB.totalDistance){
				return nodeA.heuristicDistance - nodeB.heuristicDistance
			}
			return (nodeA.totalDistance) - (nodeB.totalDistance)
		})
		//Get currentNode 
		let currentNode = listToExplore[0];

		if(currentNode === this.finalNode){ 
			currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
			listToExplore = listToExplore.slice(1)
		}
		else if(!isPresent(currentNode)){ 
			//If currentNode is finalNode break 
			if(currentNode === this.finalNode){break whileLoop}
			//Get currentNode's neighbours 
			let neighbours = this.getNeighboursRealAStaar(this.board,currentNode,exploredList)
			//Add neighbours to listToExplore
			listToExplore = listToExplore.concat(neighbours)
			//Remove currentNode from listToExplore
			listToExplore = listToExplore.slice(1)
			//Add currentNode to exploredList 
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}

	}
	this.boardA.currentAlgo = 'RealAStar'

	return exploredList
}

Search.prototype.getNeighboursRealAStaar = function(arr,node,exploredList){ 
		let neigbourList = []
		//Up 
		if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
			//Get Up neighbour 
			let neighbour = arr[node.y-1][node.x] 
			//Get current distance 
			let currentDistance = node.distance 
			//Get My Direction 
			let myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			let numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
			//Calculate new neighbour distance	
			let newNeighbourDistance = node.distance  + 1 + numberOfMoves + neighbour.weight 
			neighbour.heuristicDistance = this.manhattanDistance(neighbour,this.finalNode)
			//If this is lower than the currentDistance on the neighbour change
			if(newNeighbourDistance < neighbour.distance){
				neighbour.distance = newNeighbourDistance
				neighbour.direction = 'UP'
				neighbour.totalDistance = neighbour.heuristicDistance + neighbour.distance 
				//Add neighbour to neigbourList
				neigbourList.push(neighbour)
				neighbour.parent = node
			} 
		} 
		//Right 
		if(node.x<arr[0].length-1 && arr[node.y][node.x+1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x+1],exploredList) === false){ 
			//Get Up neighbour 
			let neighbour = arr[node.y][node.x+1]
			//Get current distance 
			let currentDistance = node.distance 
			//Get My Direction 
			let myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			let numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
			//Calculate new neighbour distance	
			let newNeighbourDistance = node.distance  + 1 + numberOfMoves + neighbour.weight
			neighbour.heuristicDistance = this.manhattanDistance(neighbour,this.finalNode)
			//If this is lower than the currentDistance on the neighbour change
			if(newNeighbourDistance < neighbour.distance){
				neighbour.distance = newNeighbourDistance
				neighbour.direction = 'RIGHT'
				neighbour.totalDistance = neighbour.heuristicDistance + neighbour.distance 
				//Add neighbour to neigbourList
				neigbourList.push(neighbour)
				neighbour.parent = node
			} 
		} 
		//Down 
		if((node.y<arr.length-1) && arr[node.y+1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y+1][node.x],exploredList) === false){
			//Get Up neighbour 
			let neighbour = arr[node.y+1][node.x]
			//Get current distance 
			let currentDistance = node.distance 
			//Get My Direction 
			let myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			let numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
			//Calculate new neighbour distance	
			let newNeighbourDistance = node.distance  + 1 + numberOfMoves + neighbour.weight
			neighbour.heuristicDistance = this.manhattanDistance(neighbour,this.finalNode)
			//If this is lower than the currentDistance on the neighbour change
			if(newNeighbourDistance < neighbour.distance){
				neighbour.distance = newNeighbourDistance
				neighbour.direction = 'DOWN'
				neighbour.totalDistance = neighbour.heuristicDistance + neighbour.distance 
				//Add neighbour to neigbourList
				neigbourList.push(neighbour)
				neighbour.parent = node
			} 
		} 
		//Left
		if(node.x>0 && arr[node.y][node.x-1].status !== 'wall' && this.hasBeenExplored(arr[node.y][node.x-1],exploredList) === false){
			//Get Up neighbour 
			let neighbour = arr[node.y][node.x-1]
			//Get current distance 
			let currentDistance = node.distance 
			//Get My Direction 
			let myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			let numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
			//Calculate new neighbour distance	
			let newNeighbourDistance = node.distance  + 1 + numberOfMoves + neighbour.weight
			neighbour.heuristicDistance = this.manhattanDistance(neighbour,this.finalNode)
			//If this is lower than the currentDistance on the neighbour change
			if(newNeighbourDistance < neighbour.distance){
				neighbour.distance = newNeighbourDistance
				neighbour.direction = 'LEFT'
				neighbour.totalDistance = neighbour.heuristicDistance + neighbour.distance 
				//Add neighbour to neigbourList
				neigbourList.push(neighbour)
				neighbour.parent = node
			} 
		}
		return neigbourList
}




module.exports = Search
 