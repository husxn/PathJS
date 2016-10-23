function Search(board,startNode){
  this.currentAlgorithm = 'BFS'
  this.board = board
  this.startNode = startNode
}

Search.prototype.startSearch = function(){
  console.log('inside startSearch')
  // var startNode = this.startNode 
  // var endNode = this.endNode 
  // var converted = this.modifiedBoard
  // switch(this.currentAlgorithm){
  //   case 'Dijkstra':
  //   case 'AStar':
  //   case 'BFS':
  //     var exploredList = this.searchBFS()
  //     this.showAnimation(exploredList)
  //   case 'DFS':
  // }
}

Search.prototype.getNeighbours = function(arr,node){
  //NEED TO REFACTOR// 
	var neighbourList = []
	//Get Neighbour Up 
	if(node.y>0){
		neighbourList.push(arr[node.y-1][node.x])
	}
	//Get Neighbour Right 
	if(node.x<arr[0].length-1){
		neighbourList.push(arr[node.y][node.x+1])
	}
	//Get Neighbour Down 
	if(node.y<arr.length-1){
		neighbourList.push(arr[node.y+1][node.x])
	}
	//Get Neighbour Left
	if(node.x>0){
		neighbourList.push(arr[node.y][node.x-1])
	}
	return neighbourList
}

Search.prototype.searchDFS = function(){

  //
}

Search.prototype.searchBFS = function(){
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
	while(listToExplore.length !==0){
		var currentNode = listToExplore[0]
		if(!isPresent(currentNode)){
			var neighbours = getNeighbours(this.board,currentNode)
			listToExplore = listToExplore.slice(1)
			listToExplore = listToExplore.concat(neighbours)
			exploredList.push(currentNode)
		}
		else{
			listToExplore = listToExplore.slice(1)
		}
	}
	return exploredList
	
}
Search.prototype.searchDijkstra = function(){
  //
}
Search.prototype.searchAStar = function(){
  //
}

Search.prototype.showAnimation = function(exploredList){
  console.log(exploredList)
  // for(var i=0;i<exploredList.length;i++){

  // }
}


// function convert(arr)
// function Node(x,y,value)
// function bfs(arr,startNode)
// function getNeighbours(arr,node)