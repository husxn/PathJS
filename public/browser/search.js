function Search(board,startNode,finalNode,currentAlgorithm,boardA,middleNodePresent){
  this.currentAlgorithm = currentAlgorithm
  this.board = board
  this.startNode = startNode
	this.finalNode = finalNode
	this.boardA = boardA
	this.middleNodePresent = middleNodePresent
} 

Search.prototype.startSearch = function(){ 
  var startNode = this.startNode
	if(this.currentAlgorithm === 'BFS'){
		var date = new Date()
		var exploredList = this.searchBFS()
    this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
		this.boardA.algoDone = true
		console.log('TIME TAKEN BFS: ',new Date() - date+' ms')
	}
	else if(this.currentAlgorithm === 'DFS'){
		var exploredList = this.searchDFS()
    this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
		this.boardA.algoDone = true
	}
	else if(this.currentAlgorithm === 'Dijkstra'){
		var exploredList = this.searchDijkstra()
		this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
		this.boardA.algoDone = true
	}
	else if(this.currentAlgorithm === 'AStar'){
		var exploredList = this.searchAStar()
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
		this.boardA.algoDone = true
	} 
	else if(this.currentAlgorithm === 'Greedy'){
		var exploredList = this.searchGreedy()
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
		this.boardA.algoDone = true
	}    
	else if(this.currentAlgorithm === 'Bidirectional'){
		var date = new Date()
		var exploredList = this.searchBidirectional()
   	this.boardA.algoDone === true ? this.showAnimationDrag(exploredList) : this.showAnimation(exploredList) 
		this.boardA.algoDone = true
		console.log('TIME TAKEN BDS: ',new Date() - date+' ms')
	}    
}  

Search.prototype.getNeighbours = function(arr,node){
  var neighbourList = []
	//Get Neighbour Up 
	if(node.y>0 && arr[node.y-1][node.x].status !== 'wall'){
		var neighbour = arr[node.y-1][node.x]
		
		if(neighbour.parent === null){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Right 
	if(node.x<arr[0].length-1 && arr[node.y][node.x+1].status !== 'wall'){
		var neighbour = arr[node.y][node.x+1]
		// console.log(neighbour.id,arr.finalNode)
			if(neighbour.parent === null){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Down 
	if((node.y<arr.length-1) && arr[node.y+1][node.x].status !== 'wall'){
		var neighbour = arr[node.y+1][node.x]
	if(neighbour.parent === null){
			neighbour.parent = node
		}
		neighbourList.push(neighbour)
	}
	//Get Neighbour Left
	if(node.x>0 && arr[node.y][node.x-1].status !== 'wall'){
		var neighbour = arr[node.y][node.x-1]
	if(neighbour.parent === null){
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
			var neighbours = this.getNeighbours(this.board,currentNode)
			listToExplore = listToExplore.slice(1)
			listToExplore = neighbours.concat(listToExplore)
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}
	}
	return exploredList 
} 

Search.prototype.searchBFS = function(){   
  var exploredList = []
	var count = 0
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
	var date = new Date()
	whileLoop:
	while(listToExplore.length !==0){ 
		var currentNode = listToExplore[0]
		var inWhileLoop = new Date()
		if(currentNode === this.finalNode){
			currentNode.status = 'finalNode'
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
	
	
		count++
		var endWhileLoop = new Date()
		if(endWhileLoop - inWhileLoop){numOnes++}
		// console.log('iteration bds ',endWhileLoop - inWhileLoop)	
	}
	this.boardA.currentAlgo = 'BFS'
	console.log('while loop bfs ',new Date()- date,count,numOnes)
	return exploredList 
}  

Search.prototype.searchBidirectional = function(){ 
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
	var date = new Date()
	whileLoop:
	while(listToExploreStart.length !== 0 && listToExploreFinal.length !== 0){ 
		var inWhileLoop = new Date()
		//Check which list to use currentNode from 
		// console.log(listToExploreStart.length+listToExploreFinal.length)
		currentNode = count % 2 === 0 ? listToExploreStart[0] : listToExploreFinal[0]
		count % 2 === 0 ? status = 'start' : status = 'final'
		var value = pleaseWork(currentNode,status)
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
			var neighbours = this.getNeighbours(this.board,currentNode)
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
			exploredList.push(currentNode)
		}
		else{
			count % 2 === 0 ? listToExploreStart = listToExploreStart.slice(1) : listToExploreFinal = listToExploreFinal.slice(1)
		}
		++count
		var endWhileLoop = new Date()
		if(endWhileLoop - inWhileLoop){numOnes++}
	}
	console.log('while loop bds', new Date() - date,count-2,numOnes)
	return exploredList
}

Search.prototype.searchAStar = function(){ 
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
			var neighbours = this.getNeighboursAStar(this.board,currentNode,exploredList)
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
	this.boardA.currentAlgo = 'AStar'
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

	var self = this
	var startNode = exploredList[0]
  exploredList = exploredList.slice(1)
  this.middleNodePresent === true ? startNode.status = 'middleObj' : startNode.status = 'startNode'
	var endNode = exploredList[exploredList.length-1]
  function timeout(index) {
    setTimeout(function () {
        if(index === exploredList.length){
          showPath(endNode,self)
					return
        }
        change(exploredList[index])
        timeout(index+1);
    }, 0.0001);
  }  
  function change(node){
    var elem = document.getElementById(node.id)
		// console.log(node.status)
		if(node.status === 'unexplored'){
			node.status = 'explored'
			elem.className = 'explored'
		}
		else if(node.status === 'finalCell'){
			// console.log("FINAL CELL DISPLAY")
		}
  } 
	function showPath(node,search){
		var listPath = []
		var endNode = Object.assign({},node)
		while(node !== search.startNode){
			// console.log(node)
			if(node.status !== 'finalNode'){
				// node.status = 'shortestPath'
				// document.getElementById(node.id).className = 'shortestPath'
				listPath.push(node)
			}
			node = node.parent
		}
		if(endNode.status === 'finalNode'){
			listPath.forEach(function(e){
				e.status ='shortestPath'
				document.getElementById(e.id).className = 'shortestPath'
			})
		}
	}
  timeout(0)
	// showPath(endNode,this)
}

Search.prototype.showAnimationDrag = function(exploredList){
	for(var i in exploredList){
		var cell = exploredList[i]
		if(cell.status === 'unexplored'){
			cell.status = 'explored'
			document.getElementById(cell.id).className = 'explored'
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
		for(var i in shortestPathList){
			var cell = shortestPathList[i]
			if(cell.status !== 'startNode' && cell.status !== 'finalNode'){
				cell.status = 'explored'
				document.getElementById(cell.id).className = 'shortestPath'
			}
		}
	}
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

Search.prototype.getNeighboursAStar = function(arr,node,exploredList){   
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
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,this.finalNode) + neighbour.weight
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
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,this.finalNode) + neighbour.weight
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
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,this.finalNode) + neighbour.weight
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
		var newNeighbourDistance = currentDistance + numberOfMoves + 1 + this.manhattanDistance(neighbour,this.finalNode) + neighbour.weight
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
	var count = 0
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
		count++
	}
	this.boardA.currentAlgo = 'Dijkstra'
	console.log(count)
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
	var xDiff = node1.x - node2.x
	var yDiff = node1.y - node2.y
	var distance = Math.sqrt(Math.pow(xDiff,2)+Math.pow(yDiff,2))
	return distance
}


module.exports = Search