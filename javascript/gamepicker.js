// Setup begin
const totalDiv = document.getElementById('totaaloverzicht');
totalDiv.appendChild(Object.assign(document.createElement('h2'), {innerText: 'Overzicht'}));
totalDiv.appendChild(Object.assign(document.createElement('div'), {id: 'dropdown-divs-field'}));
const typeArray = ['genre', 'price', 'rating'];
typeArray.forEach(element => {
  document.getElementById('dropdown-divs-field').appendChild(Object.assign(document.createElement('div'), {id: `${element}-dropdown-field`, className: 'filter-dropdowns'}));
  selectBoxGenerator(document.getElementById(`${element}-dropdown-field`), element);
});
selectBoxFiller({"FREE" : 0, "€5" : 5, "€10" : 10, "€25" : 25, "€45" : 45, "€60" : 60}, document.getElementById('price-select'));
selectBoxFiller({"1*" : 1, "2*" : 2, "3*" : 3, "4*" : 4, "5*" : 5}, document.getElementById('rating-select'));
totalDiv.appendChild(Object.assign(document.createElement('div'), {id: 'games-div-field'}));
document.getElementById('games-div-field').appendChild(Object.assign(document.createElement('div'), {id: 'game-checkbox-field'}))
showGamesList(document.getElementById('game-checkbox-field'));
document.getElementById('games-div-field').appendChild(Object.assign(document.createElement('div'), {id: 'game-button-field'}))
const submitButton = Object.assign(document.createElement('button'), {id: 'submit-button', innerText: 'Bereken'})
submitButton.addEventListener('click', submitForm);
document.getElementById('game-button-field').appendChild(submitButton);

const shoppingCartDiv = document.getElementById('winkelmandje');
shoppingCartDiv.appendChild(Object.assign(document.createElement('h2'), {innerText: 'Winkelmandje'}));
shoppingCartDiv.appendChild(Object.assign(document.createElement('div'), {id: 'cart-div-field'}));
document.getElementById('cart-div-field').appendChild(Object.assign(document.createElement('div'), {id: 'cart-games-field'}));
document.getElementById('cart-div-field').appendChild(Object.assign(document.createElement('div'), {id: 'cart-price-field'}));
document.getElementById('cart-price-field').appendChild(Object.assign(document.createElement('p'), {id: 'cart-price', innerText: 'STATIC'}));
// Setup end


function selectBoxGenerator(assignmentField, selectType) {
  assignmentField.appendChild(Object.assign(document.createElement('label'), {for: `${selectType}-select`, innerText: `Filter ${selectType}: `}))
  const genDropdown = Object.assign(document.createElement('select'), {id: `${selectType}-select`});
  genDropdown.appendChild(Object.assign(document.createElement('option'), {innerText: '-', value: 'no-filter'}));
  assignmentField.appendChild(genDropdown);
  genDropdown.addEventListener('change', gameFiltering);
}


function selectBoxFiller(incomingArray, selectBox) {
  const elementID = selectBox.id;
  if (elementID == 'genre-select') {
    incomingArray.sort();
    incomingArray.forEach(index => {
      selectBox.appendChild(Object.assign(document.createElement('option'), {innerText: index, value: index}));
    });
  } else {
    for (let curKey in incomingArray) {
      let curValue = incomingArray[curKey];
      selectBox.appendChild(Object.assign(document.createElement('option'), {innerText: curKey, value: curValue}));
    }    
  }
}


function gameFiltering() {
  const selectedFilters = getSelectedDropdowns();
  let gameField = document.getElementById('game-checkbox-field');
  let gameCollection = gameField.children;
  for (let index = 0; index < gameCollection.length; index++) {
    let conditionResults = filterCompiling(gameCollection[index], selectedFilters);
    if (conditionResults.includes('none')) {
      gameCollection[index].style.display = 'none';
    } else {
      gameCollection[index].style.display = 'block';
    }
  }
}


function showGamesList(gameDiv) {
  let genreArray = [];
  fetch('../json-files/games.json')
    .then(res => res.json())
    .then(data => {
      data.forEach(object => {
        const objectData = [object.title, object.price, object.genre, object.rating];
        gameDiv.appendChild(Object.assign(document.createElement('div'), {id: `${idCondition(objectData[0])}-FIELD`, className: 'game-fields'}));
        document.getElementById(`${idCondition(objectData[0])}-FIELD`).setAttribute('data-name', `${objectData[0]}`);
        document.getElementById(`${idCondition(objectData[0])}-FIELD`).setAttribute('data-genre', `${objectData[2]}`);
        document.getElementById(`${idCondition(objectData[0])}-FIELD`).setAttribute('data-price', `${objectData[1]}`);
        document.getElementById(`${idCondition(objectData[0])}-FIELD`).setAttribute('data-rating', `${objectData[3]}`);
        let objectButton = Object.assign(document.createElement('button'), {innerText: 'O', id: `${idCondition(objectData[0])}-BUTTON`, className: 'checkbox-buttons', style: 'background-color: red; color: red;'});
        objectButton.addEventListener('click', buttonColourSwap.bind(undefined, [objectButton, 0]));
        document.getElementById(`${idCondition(objectData[0])}-FIELD`).appendChild(objectButton);
        document.getElementById(`${idCondition(objectData[0])}-FIELD`).appendChild(Object.assign(document.createElement('div'), {id: `${idCondition(objectData[0])}-TAG`, className: 'price-tags'}));
        document.getElementById(`${idCondition(objectData[0])}-TAG`).appendChild(Object.assign(document.createElement('p'), {innerText: `${objectData[0]}`, className: 'game-name'}));
        document.getElementById(`${idCondition(objectData[0])}-TAG`).appendChild(Object.assign(document.createElement('p'), {innerText: `${freeTagCondition(objectData[1])}`, className: 'game-price'}));
        if (!(genreArray.includes(objectData[2]))) {
          genreArray.push(objectData[2]);
        }
      });
      return genreArray;
    }).then((genreArray) => {
      selectBoxFiller(genreArray, document.getElementById('genre-select'));
    });
}


function submitForm() {
  const gameFields = document.querySelectorAll('.game-fields');
  let selectedGames = [];
  for (let index = 0; index < gameFields.length; index++) {
    const curButton = document.getElementById(`${idCondition(gameFields[index].dataset.name)}-BUTTON`);
    if (curButton.style.color == 'green') {
      selectedGames[gameFields[index].dataset.name] = gameFields[index].dataset.price;
    }
  }
  document.getElementById('totaaloverzicht').style.display = 'none';
  document.getElementById('winkelmandje').style.display = 'block';
  Object.keys(selectedGames).forEach(curGame => {
    document.getElementById('cart-games-field').appendChild(Object.assign(document.createElement('div'), {id: `${idCondition(curGame)}-CART-FIELD`, className: 'cart-games'}));
    document.getElementById(`${idCondition(curGame)}-CART-FIELD`).setAttribute('data-name', `${curGame}`);
    document.getElementById(`${idCondition(curGame)}-CART-FIELD`).setAttribute('data-price', `${selectedGames[curGame]}`);
    let gameButton = Object.assign(document.createElement('button'), {innerText: 'O', id: `${idCondition(curGame)}-CART-BUTTON`, className: 'checkbox-buttons', style: 'background-color: green; color: green;'});
    gameButton.addEventListener('click', buttonColourSwap.bind(undefined, [gameButton, 1]));
    document.getElementById(`${idCondition(curGame)}-CART-FIELD`).appendChild(gameButton);
    document.getElementById(`${idCondition(curGame)}-CART-FIELD`).appendChild(Object.assign(document.createElement('div'), {id: `${idCondition(curGame)}-CART-TAG`, className: 'price-tags'}));
    document.getElementById(`${idCondition(curGame)}-CART-TAG`).appendChild(Object.assign(document.createElement('p'), {innerText: `${curGame}`, className: 'game-name'}));
    let gamePrice = document.getElementById(`${idCondition(curGame)}-CART-FIELD`).dataset.price;
    document.getElementById(`${idCondition(curGame)}-CART-TAG`).appendChild(Object.assign(document.createElement('p'), {innerText: `${freeTagCondition(gamePrice)}`, className: 'game-price'}));
  });
  livePriceListener(1);
}


function livePriceListener(button) {
  let fullPrice = 0;
  if (button == 1) {
    const cartGames = document.querySelectorAll('.cart-games');
    let priceNumbers = [];
    cartGames.forEach(game => {
      priceNumbers.push(Number(game.dataset.price));
    })
    fullPrice = priceNumbers.reduce((partialSum, a) => partialSum + a, 0);
    document.getElementById('cart-price').setAttribute('data-full', fullPrice);
  } else {
    let fieldID = (button.id).replace('-BUTTON', '-FIELD');
    const priceChange = Number(document.getElementById(fieldID).dataset.price);
    let price = Number(document.getElementById('cart-price').dataset.full);
    if (button.style.backgroundColor == 'red') {
      fullPrice = (price - priceChange);
    } else if (button.style.backgroundColor == 'green') {
      fullPrice = (price + priceChange);
    }
  }
  let roundPrice = Math.ceil(fullPrice);
  if (roundPrice != 0) {
    roundPrice = roundPrice - 0.01;
    document.getElementById('cart-price').innerText = roundPrice;
  } else {
    document.getElementById('cart-price').innerText = 'FREE';
  }
  document.getElementById('cart-price').dataset.full = roundPrice;
}


function idCondition(incomingID) {
  return incomingID.replace(/\s+/g, '-');
}


function freeTagCondition(incomingPrice) {
  if (incomingPrice == 0) {return 'FREE'} else {return incomingPrice};
}


function getSelectedDropdowns() {
  let valueCollection = {};
  typeArray.forEach(element => {
    let curElement = document.getElementById(`${element}-select`);
    const optionValue = curElement.options[curElement.selectedIndex].value;
    valueCollection[element] = optionValue;
  });
  return valueCollection;
}


function filterCompiling(curField, selectedFilters) {
  let conditionCompile = [];
  Object.keys(selectedFilters).forEach(condition => {
    if (selectedFilters[condition] != 'no-filter') {
      if (condition == 'genre') {
        if (curField.dataset.genre == selectedFilters[condition]) {
          conditionCompile.push('block');
        } else {
          conditionCompile.push('none');
        }
      } else if (condition == 'price') {
        if (Number(curField.dataset.price) <= selectedFilters[condition]) {
          conditionCompile.push('block');
        } else {
          conditionCompile.push('none');
        }
      } else if (condition == 'rating') {
        if (Number(curField.dataset.rating) <= selectedFilters[condition]) {
          conditionCompile.push('block');
        } else {
          conditionCompile.push('none');
        }
      }
    } else {
      conditionCompile.push('block');
    }
  }); 
  return conditionCompile;
}


function buttonColourSwap(incomingARGS) {
  if (incomingARGS[0].style.backgroundColor == 'red') {
    incomingARGS[0].style.backgroundColor = 'green';
    incomingARGS[0].style.color = 'green';
  } else if (incomingARGS[0].style.backgroundColor == 'green') {
    incomingARGS[0].style.backgroundColor = 'red';
    incomingARGS[0].style.color = 'red';
  }

  if (incomingARGS[1]) {
    livePriceListener(incomingARGS[0]);
  }
}