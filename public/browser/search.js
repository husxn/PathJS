function Search(board,startNode,finalNode,currentAlgorithm,boardA){ 
  this.currentAlgorithm = currentAlgorithm
  this.board = board
  this.startNode = startNode
	this.finalNode = finalNode
	this.boardA = boardA
} 

Search.prototype.startSearch = function(){ 
	this.boardA.shouldDisable = true
	this.boardA.changeToRed()
	document.getElementById(this.finalNode.id).className = 'finalCell'
	this.finalNode.className = 'finalCell'
	if(this.currentAlgorithm === 'BFS'){
		var exploredList = this.searchBFS()
    this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}
	else if(this.currentAlgorithm === 'DFS'){
		var exploredList = this.searchDFS()
    this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}
	else if(this.currentAlgorithm === 'Dijkstra'){
		var exploredList = this.searchDijkstra()
		this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}
	else if(this.currentAlgorithm === 'AStar'){
		var exploredList = this.searchAStar()
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	} 
	else if(this.currentAlgorithm === 'AStar2'){
		var exploredList = this.searchAStar('2')
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	} 
	else if(this.currentAlgorithm === 'Greedy'){
		var exploredList = this.searchGreedy()
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}   
	else if(this.currentAlgorithm === 'RealAStar'){
		var exploredList = this.searchRealAStaar()
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}     
	else if(this.currentAlgorithm === 'Bidirectional'){
		var exploredList = this.searchBidirectional()
		this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
	}    
}  

Search.prototype.getNeighbours = function(arr,node,algo,exploredList){   
  var neighbourList = []
	//Get Neighbour Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall'){
		var neighbour = arr[node.y-1][node.x]
		
		if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode' && exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Right 
	if(node.x<arr[0].length-1 && arr[node.y][node.x+1].status !== 'wall'){
		var neighbour = arr[node.y][node.x+1]
		// console.log(neighbour.id,arr.finalNode)
			if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode'&& exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Down 
	if((node.y<arr.length-1) && arr[node.y+1][node.x].status !== 'wall'){
		var neighbour = arr[node.y+1][node.x]
	if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode'&& exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Left
	if(node.x>0 && arr[node.y][node.x-1].status !== 'wall'){
		var neighbour = arr[node.y][node.x-1]
	if(neighbour.parent === null || (algo === 'DFS' && neighbour.status !== 'startNode'&& exploredList.indexOf(neighbour) === -1)){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	return neighbourList
}       

Search.prototype.searchDFS = function(){  
 var exploredList = [] 
	var listToExplore = [this.startNode]
	var isPresent = function(node){
		var returnVal = false
		for(var i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !==0){
		var currentNode = listToExplore[0]
		if(currentNode === this.finalNode){
			currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
      listToExplore = listToExplore.slice(1)
    }
    else if(!isPresent(currentNode)){
			var neighbours = this.getNeighbours(this.board,currentNode,'DFS',exploredList)
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
  var exploredList = []
	var numOnes = 0
	var listToExplore = [this.startNode]
	var isPresent = function(node){
		var returnVal = false
		for(var i=0;i<exploredList.length;i++){
			if(exploredList[i].id === node.id){
				returnVal = true
			}
		}
		return returnVal
	} 
	whileLoop:
	while(listToExplore.length !==0){ 
		var currentNode = listToExplore[0]
		var inWhileLoop = new Date()
		if(currentNode === this.finalNode){
			// currentNode.status = 'finalNode'
			exploredList.push(currentNode)
			break whileLoop
		}
		if(currentNode.status === 'wall'){
      listToExplore = listToExplore.slice(1)
    }
    else if(!isPresent(currentNode)){
			var neighbours = this.getNeighbours(this.board,currentNode)
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
	var exploredList = []
	var listToExploreStart = [this.startNode]
	var listToExploreFinal = [this.finalNode]
	var numOnes = 0
	var count = 2
	var currentNode;
	var status;
	var pleaseWork = function(node,status){ 
		var returnVal = false
		for(var i in exploredList){
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
		var value = pleaseWork(currentNode,status)
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
			var neighbours;
			count % 2 === 0 ? neighbours = this.getNeighboursAStar(this.board,currentNode,exploredList,'algo',this.finalNode) : neighbours = this.getNeighboursAStar(this.board,currentNode,exploredList,'algo',this.startNode) 
			// var neighbours = this.getNeighbours(this.board,currentNode)
			//Remove node from listToExplore 
			if(count % 2 === 0){
					listToExploreStart = listToExploreStart.slice(1)
			}
			else{
				listToExploreFinal = listToExploreFinal.slice(1)
			}

			if(count % 2 === 0){
				var newNeighboursList = []
				for(var i in neighbours){
					neighbours[i].exploredBy = 'start'
					// console.log(neighbours[i])
					newNeighboursList.push(neighbours[i])
				}
				listToExploreStart = listToExploreStart.concat(newNeighboursList) 
			}
			else{
				var newNeighboursList = []
				for(var i in neighbours){
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
	var listToExplore = [this.startNode]
	var exploredList = []
	var isPresent = function(node){
		var returnVal = false
		for(var i=0;i<exploredList.length;i++){
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
		var currentNode = listToExplore[0];

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
			var neighbours = this.getNeighboursAStar(this.board,currentNode,exploredList,algo,this.finalNode)
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
	var listToExplore = [this.startNode]
	var exploredList = []
	var isPresent = function(node){
		var returnVal = false
		for(var i=0;i<exploredList.length;i++){
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
		var currentNode = listToExplore[0];

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
			var neighbours = this.getNeighboursGreedy(this.board,currentNode,exploredList)
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
	var count = 0
	var self = this
	var startNode = exploredList[0]
  exploredList = exploredList.slice(1)
	var endNode = exploredList[exploredList.length-1]
  function timeout(index,exploredList,timeLength) {   
		setTimeout(function () {
        if(index === exploredList.length){
					if(count === 0) showPath(endNode,self)
					else{ 
						self.boardA.shouldDisable = false
						self.boardA.changeFromRed()
						self.algoDone()

					}
					return
        }
        change(exploredList[index],index,exploredList.length)
        timeout(index+1,exploredList,timeLength);
    }, timeLength);
  }  
  function change(node,index,length){  
		var elem = document.getElementById(node.id)
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
					var newClassName = 'shortestPath'
					if(self.currentAlgorithm !== 'BFS' && self.currentAlgorithm !== 'DFS'){
						 newClassName += node.direction
						}
					else{
						newClassName += 'NODIRECTION'
					}
					console.log(newClassName)
					document.getElementById(node.id).className = newClassName
				}
				else {
					document.getElementById(node.id).className = 'shortestPath'
					self.changeFinalClassName()
				}
			}
			else{
				document.getElementById(node.parent.id).className = 'startingCell shortestPath'
				node.status = 'shortestPath'
				if(self.finalNode.parent === node){
					document.getElementById(node.id).className = 'shortestPath' + node.direction
					self.changeFinalClassName(node)
				}
			}
		}
  } 
	function showPath(node,search){ 
		count++
		var listPath = []
		var endNode = Object.assign({},node)
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
	var finalCell;
	finalCell = document.getElementsByClassName('finalCell')[1]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellUP')[0]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellRIGHT')[0]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellDOWN')[0]
	if(!finalCell) finalCell = document.getElementsByClassName('finalCellLEFT')[0]
	if(this.currentAlgorithm !== 'BFS' && this.currentAlgorithm !== 'DFS'){
		finalCell.className = 'finalCell' + this.finalNode.direction
	}
	else{
		finalCell.className = 'finalCell' + 'NODIRECTION'
	}
}

Search.prototype.changeFirstClassName = function(){
	document.getElementById(this.startNode.id).className = 'startingCell shortestPath'
}

Search.prototype.showAnimationDrag = function(exploredList){ 
	for(var i in exploredList){
		var cell = exploredList[i]
		if(cell.status === 'unexplored'){
			cell.status = 'explored'
			document.getElementById(cell.id).className = 'explored'
		}
		else if(cell.status === 'unexplored weight'){
			cell.status = 'explored weight'
			document.getElementById(cell.id).className = 'explored weight'
		}
	} 
	var endNode = exploredList[exploredList.length-1]
	var newEndNode = Object.assign({},endNode)
	var shortestPathList = []
	while(endNode !== this.startNode){
		shortestPathList.push(endNode)
		endNode = endNode.parent
	}
	shortestPathList = shortestPathList.reverse()
	if(newEndNode.status === 'finalNode'){
		this.changeFirstClassName()
		this.changeFinalClassName()
		for(var i in shortestPathList){
			var cell = shortestPathList[i]
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
	this.boardA.changeFromRed()
	this.boardA.algoDone = true
	 
}  

Search.prototype.getNeighboursDijkstra = function(arr,node,exploredList){   
	var neigbourList = []
	//Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
		//Get Up neighbour 
		var neighbour = arr[node.y-1][node.x] 
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
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
		var neighbour = arr[node.y][node.x+1]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
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
		var neighbour = arr[node.y+1][node.x]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
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
		var neighbour = arr[node.y][node.x-1]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + neighbour.weight
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
	var neigbourList = [] 
	//Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
		//Get Up neighbour 
		var neighbour = arr[node.y-1][node.x]
		// console.log('neighbour',neighbour.distance)
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		var newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
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
		var neighbour = arr[node.y][node.x+1]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		var newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
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
		var neighbour = arr[node.y+1][node.x]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		var newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
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
		var neighbour = arr[node.y][node.x-1]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
		//Calculate new neighbour distance	
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,finalNode) + neighbour.weight
		var newNeighbourDistance2 = currentDistance + numberOfMoves + 1 + Math.pow(this.manhattanDistance(neighbour,finalNode),6) + neighbour.weight
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
	var neigbourList = []
	//Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
		//Get Up neighbour 
		var neighbour = arr[node.y-1][node.x] 
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
		//Calculate new neighbour distance	
		var newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
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
		var neighbour = arr[node.y][node.x+1]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
		//Calculate new neighbour distance	
		var newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
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
		var neighbour = arr[node.y+1][node.x]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
		//Calculate new neighbour distance	
		var newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
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
		var neighbour = arr[node.y][node.x-1]
		//Get current distance 
		var currentDistance = node.distance 
		//Get My Direction 
		var myDirection = node.direction
		//Calculate number of moves to get to Get to Up Direction 
		var numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
		//Calculate new neighbour distance	
		var newNeighbourDistance = this.manhattanDistance(neighbour,this.finalNode)
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
	var listToExplore = [this.startNode]
	var exploredList = []
	var isPresent = function(node){
		var returnVal = false
		for(var i=0;i<exploredList.length;i++){
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
		var currentNode = listToExplore[0];

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
			var neighbours = this.getNeighboursDijkstra(this.board,currentNode,exploredList)
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
	var returnVal = false
	for(var i in exploredList.length){
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
	var xDiff = Math.abs(node1.x - node2.x)
	var yDiff = Math.abs(node1.y - node2.y)
	var distance = Math.sqrt(Math.pow(xDiff,2)+Math.pow(yDiff,2))
	var sum = xDiff + yDiff
	return sum
}

Search.prototype.realAStar = function(){ 
	this.startNode.distance = 0
	this.startNode.heuristicDistance = this.manhattanDistance(this.startNode,this.finalNode)
	this.startNode.totalDistance = this.startNode.distance + this.startNode.heuristicDistance
	var listToExplore = [this.startNode]
	var exploredList = []
	var isPresent = function(node){
		var returnVal = false
		for(var i=0;i<exploredList.length;i++){
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
		var currentNode = listToExplore[0];

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
			var neighbours = this.getNeighboursRealAStar(this.board,currentNode,exploredList)
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
	var self = this 
	var list = this.getNeighboursDijkstra(arr,node,exploredList)
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
	var listToExplore = [this.startNode]
	var exploredList = []
	var isPresent = function(node){ 
		var returnVal = false
		for(var i=0;i<exploredList.length;i++){
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
		var currentNode = listToExplore[0];

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
			var neighbours = this.getNeighboursRealAStaar(this.board,currentNode,exploredList)
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
		var neigbourList = []
		//Up 
		if(node.y>0 && arr[node.y-1][node.x].status !== 'wall' && this.hasBeenExplored(arr[node.y-1][node.x],exploredList) === false){
			//Get Up neighbour 
			var neighbour = arr[node.y-1][node.x] 
			//Get current distance 
			var currentDistance = node.distance 
			//Get My Direction 
			var myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			var numberOfMoves = this.checkNumberOfMoves(myDirection,'UP')
			//Calculate new neighbour distance	
			var newNeighbourDistance = node.distance  + 1 + numberOfMoves + neighbour.weight 
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
			var neighbour = arr[node.y][node.x+1]
			//Get current distance 
			var currentDistance = node.distance 
			//Get My Direction 
			var myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			var numberOfMoves = this.checkNumberOfMoves(myDirection,'RIGHT')
			//Calculate new neighbour distance	
			var newNeighbourDistance = node.distance  + 1 + numberOfMoves + neighbour.weight
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
			var neighbour = arr[node.y+1][node.x]
			//Get current distance 
			var currentDistance = node.distance 
			//Get My Direction 
			var myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			var numberOfMoves = this.checkNumberOfMoves(myDirection,'DOWN')
			//Calculate new neighbour distance	
			var newNeighbourDistance = node.distance  + 1 + numberOfMoves + neighbour.weight
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
			var neighbour = arr[node.y][node.x-1]
			//Get current distance 
			var currentDistance = node.distance 
			//Get My Direction 
			var myDirection = node.direction
			//Calculate number of moves to get to Get to Up Direction 
			var numberOfMoves = this.checkNumberOfMoves(myDirection,'LEFT')
			//Calculate new neighbour distance	
			var newNeighbourDistance = node.distance  + 1 + numberOfMoves + neighbour.weight
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
 