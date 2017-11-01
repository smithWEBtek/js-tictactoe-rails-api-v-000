let turn = 0

function player(){
  if (turn %2 === 0){
    return 'X'
  } else 
  if(turn %2 !== 0){
    return 'O'
  } 
}
/////////////// begin attachedListeners ////////////////////////////// 
function attachListeners(){
  $("td").click(function(event) {
    doTurn(event.target)
  })

  $("button#save").click(function(e){
    saveGame(e.target)
   })
  
  $("button#previous").click(function(e) {
    $.get('/games', function(response){
      let games = response.data
      $('div#games').html('')
      for(let i = 0; i < games.length;i++){          
        $('div#games').append(`<button class='saved-game' data-id=${games[i].id}>Game no: ${games[i].id}</button><br>`)
      }
      $('div#message').html("Previous games loaded.") 
    })
  })
  
  $('body').on('click', 'button.saved-game', function(e){
    e.preventDefault()
    $.get(`/games/${this.dataset.id}`, function(response){
      loadGame(response)
    })
  })
   
  $("button#clear").click(function(event) {
    $('td').html('')
    turn = 0
    $('div#message').html('Game cleared.') 
  })
}
///////// end attachListeners  /////////////////////////////////

function saveGame(){
  let state = cerealizer($('td'))
  
  if(newGame(state) === false ){
    setMessgae("Sorry, this game is already saved.")
    return
  } else {
    $.ajax({
      type: "POST",
      url: "/games",
      data: {state: state},
      success: (function (data){
        setMessage(`Game ${data.data.id} saved.`)
      })
    })
  }
}

function newGame(state){
  let checkState = state
  $.get('/games', function(data){
    let arr = data.data
    for(let i=0; i<arr.length; i++){
      let a = checkState 
      let b = arr[i].attributes.state
      match(a,b)
    }
  })
}

function match(a,b){
  return a === b
}

function cerealizer(obj){
  let arr = []
  for(i=0;i<obj.length;i++){
    arr.push(obj[i].innerHTML)
  }
  return arr
}

function loadGame(game){
  for(let i = 0; i < 9; i++){
    $('td')[i].innerHTML = game.data.attributes.state[i]
  }
  setMessage(`Game ${game.data.id} loaded.`)
}

function getBoardState(){
  let board = $('td')
  let state = []
  for(let i = 0; i < board.length; i++){
    state.push(board[i].innerText)
  }
  return state
}

function updateState(e){
  let token = player()
  if(e.innerHTML === ""){
    e.innerHTML = token
  }else{
    return
  }
}

function setMessage(msg){
  $('div#message').html(msg)  
}

function checkWinner(){  
  // returns true when a player wins horizontally:
  // returns true when a player wins diagonally:
  // returns true when a player wins vertically:
  // returns false if no winning combination is present on the board:
  // setMessage("Player X Won!") ... when player X wins  
  // setMessage("Player O Won!") ... when player O wins
}

function doTurn(e){
  updateState(e)
  turn++
  checkWinner()
  // setMessage() with the argument "Tie game." when the game is tied:    
  // doTurn() resets the board and the "turn" counter when a game is won:
}


// 21) attachListeners() is defined:  
// 22) attachListeners() attaches event listeners that invoke doTurn() when a square is clicked on:
// 23) attachListeners() passes the clicked-on <td> element to doTurn():

// 24) Gameplay Users can play multiple games:
// 25) Clicking the button#previous element sends a GET request to the "/games" route: 
// 26) Clicking the button#previous element when no previously-saved games exist in the database does not add any children to the div#games element in the DOM:
// 27) Clicking the button#previous element when previously-saved games exist in the database adds those previous games as buttons in the DOM's div#games element:
// 28) Clicking the button#previous element when previously-saved games exist in the database does not re-add saved games already present in the div#games element when the "previous" button is clicked a second time:
// 29) Clicking the button#save element when the current game has not yet been saved sends a POST request to the "/games" route:
// 30) Clicking the button#save element when the current game already exists in the database sends a PATCH request to the "/games/:id" route:
// 31) Clicking the button#clear element when an unsaved game is in progress clears the game board:
// 32) Clicking the button#clear element when the in-progress game has already been saved fully resets the game board so that the next press of the "save" button results in a new game being saved:
// 33) Completing a game auto-saves tie games:
// 34) Completing a game auto-saves won games:
// 35) Clicking a saved game button (in the div#games element) sends a GET request to the "/games/:id" route:
// 36) Clicking a saved game button (in the div#games element) loads the saved game's state into the board:
// 37) Clicking a saved game button (in the div#games element) marks the newly-loaded game state such that clicking the "save" button after loading a game sends a PATCH
$(function(){
  attachListeners()
})