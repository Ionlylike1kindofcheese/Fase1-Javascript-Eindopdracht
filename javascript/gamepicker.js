// Setup begin
const totalDiv = document.getElementById('totaaloverzicht');
totalDiv.appendChild(Object.assign(document.createElement('h2'), {innerText: 'Overzicht'}));
totalDiv.appendChild(Object.assign(document.createElement('div'), {id: 'dropdown-divs-field'}));
const typeArray = ['genre', 'price', 'rating'];
typeArray.forEach(element => {
  document.getElementById('dropdown-divs-field').appendChild(Object.assign(document.createElement('div'), {id: `${element}-dropdown-field`}));
  selectBoxGenerator(document.getElementById(`${element}-dropdown-field`), element);
});
totalDiv.appendChild(Object.assign(document.createElement('div'), {id: 'games-div-field'}));
document.getElementById('games-div-field').appendChild(Object.assign(document.createElement('div'), {id: 'game-checkbox-field'}))
showGamesList(document.getElementById('game-checkbox-field'));
document.getElementById('games-div-field').appendChild(Object.assign(document.createElement('div'), {id: 'game-button-field'}))
const submitButton = Object.assign(document.createElement('button'), {id: 'submit-button', innerText: 'Bereken'})
submitButton.addEventListener('click', submitForm);
document.getElementById('game-button-field').appendChild(submitButton);
// Setup end


function selectBoxGenerator(assignmentField, selectType) {
  const genreDropdown = Object.assign(document.createElement('select'), {id: `${selectType}-select`});
  genreDropdown.appendChild(Object.assign(document.createElement('option'), {innerText: '-'}));
  assignmentField.appendChild(genreDropdown);
  // still needs eventlistener for filtering
}


function showGamesList(gameDiv) {
  fetch('../json-files/games.json')
    .then(res => res.json())
    .then(data => {
      data.forEach(object => {
        const objectData = [object.title, object.price, object.genre, object.rating];
        gameDiv.appendChild(Object.assign(document.createElement('div'), {id: `${idCondition(objectData[0])}-FIELD`, className: `game-fields ${objectData[2]} ${objectData[3]}`}));
        let objectButton = Object.assign(document.createElement('button'), {innerText: 'O', id: `${idCondition(objectData[0])}-BUTTON`, className: 'checkbox-buttons', style: 'background-color: red; color: red;'});
        objectButton.addEventListener('click', function(button) {
          if (button.style.backgroundColor == 'red') {
            button.style.backgroundColor = 'green';
            button.style.color = 'green';
          } else if (button.style.backgroundColor == 'green') {
            button.style.backgroundColor = 'red';
            button.style.color = 'red';
          }
        }.bind(undefined, objectButton));
        document.getElementById(`${idCondition(objectData[0])}-FIELD`).appendChild(objectButton);
        document.getElementById(`${idCondition(objectData[0])}-FIELD`).appendChild(Object.assign(document.createElement('div'), {id: `${idCondition(objectData[0])}-TAG`, className: 'price-tags'}));
        document.getElementById(`${idCondition(objectData[0])}-TAG`).appendChild(Object.assign(document.createElement('p'), {innerText: `${objectData[0]}`, className: 'game-name'}));
        document.getElementById(`${idCondition(objectData[0])}-TAG`).appendChild(Object.assign(document.createElement('p'), {innerText: `${assignPriceTag(objectData[1])}`, className: 'game-price'}));
      });
    });
}


function submitForm() {
  const gameFields = document.querySelectorAll('.game-fields');
  for (let index = 0; index < gameFields.length; index++) {
    if (gameFields[index].style.display == 'block') {
      // create array with selected games and continue to shopping cart
    }
  }
}


function idCondition(incomingID) {
  return incomingID.replace(/\s+/g, '-');
}


function assignPriceTag(incomingPrice) {
  if (incomingPrice == 0) {return 'FREE'} else {return incomingPrice};
}