/**
 * A class defining the Game object
 */
class Game {
  // Game constructer
  constructor(gameContainerElement) {
    this.availableCells = [];
    this.unavailableCells = [];
    this.gameContainerElement = gameContainerElement;
    this.gameGridElement = this.gameContainerElement.querySelector('.grid');
  }

  /**
   * This method when called initializes the game by generating the relevant
   * cells or grid etc.
   */
  start() {
    const GRID_SIZE = 12;
    const PLAYERS = [
      {
        name: 'Zeus',
        className: 'player-1',
        rowMin: 0,
        rowMax: Math.floor(GRID_SIZE / 3),
        colMin: 0,
        colMax: GRID_SIZE - 1,
        health: 100,
        attack: 10,
        shield: 10,
        speed: 2,
      },
      {
        name: 'Poseidon',
        className: 'player-2',
        rowMin: Math.floor(GRID_SIZE / 2),
        rowMax: GRID_SIZE - 1,
        colMin: 0,
        colMax: GRID_SIZE - 1,
        health: 100,
        attack: 10,
        shield: 10,
        speed: 2,
      },
    ];
    const DISABLED_CELLS = 15;
    const WEAPONS_COUNT = 5;
    const WEAPONS = [
      {
        type: 'defense',
        className: 'weapon-defense',
        effect: 10,
      },
      {
        type: 'attack',
        className: 'weapon-attack',
        effect: 20,
      },
      {
        type: 'health',
        className: 'weapon-health',
        effect: 10,
      },
      {
        type: 'attack',
        className: 'weapon-attack-super',
        effect: 40,
      },
      {
        type: 'speed',
        className: 'weapon-speed',
        effect: 3,
      },
    ];

    // create a new instance of the Grid class or object
    new Grid(this.gameGridElement, GRID_SIZE, this);

    // Dimmed Cells
    const dimmedCells = new DimmedCell(GRID_SIZE, this);
    for (let i = 0; i < DISABLED_CELLS; i++) {
      dimmedCells.dimCell();
    }

    // create the Players by instantiating the Player class
    // and passing them their parameters
    new Player(GRID_SIZE, PLAYERS[0], this);
    new Player(GRID_SIZE, PLAYERS[1], this);

    // WEAPONS
    for (let i = 0; i < WEAPONS_COUNT; i++) {
      new Weapon(GRID_SIZE, WEAPONS[0], this);
      new Weapon(GRID_SIZE, WEAPONS[1], this);
      new Weapon(GRID_SIZE, WEAPONS[2], this);
      new Weapon(GRID_SIZE, WEAPONS[3], this);
      new Weapon(GRID_SIZE, WEAPONS[4], this);
    }

    // GameUtility
    new GameUtility(PLAYERS, WEAPONS, this);
  }
}

/**
 * Represents the Grid or game map Object
 */
class Grid {
  // Grid constructer
  constructor(gridContainer, gridSize, game) {
    this.gridContainer = gridContainer;
    this.gridSize = gridSize;
    this.game = game;
    this.draw();
  }

  /**
   * Places cells on to the grid or map via a loop
   */
  draw() {
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        this.gridContainer.appendChild(this.createGridItem(row, col));
        this.game.availableCells.push([row, col]);
      }
    }

    this.resizeGrid();
  }

  /**
   * Creates html element [item] of div type and adds a class and data-set attributes
   * using its position (x-y) on the grid
   * @param {*} row
   * @param {*} col
   */
  createGridItem(row, col) {
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    gridItem.classList.add(`cell_${row}_${col}`);
    gridItem.setAttribute('data-row', row);
    gridItem.setAttribute('data-col', col);
    return gridItem;
  }

  /**
   * Resizes the grid container by placing its columns equal to the size of
   * the gride
   */
  resizeGrid() {
    this.gridContainer.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
  }
}

/**
 * The Item class represent the various object which are placed on the
 * various squares or boxes on the grid
 */
class Item {
  // Item constructor
  constructor(row, col, itemClassName, game) {
    this.game = game;
    this.row = row;
    this.col = col;
    this.itemClassName = itemClassName;
    this.avoidItems = [
      'weapon-attack',
      'weapon-attack-super',
      'weapon-defense',
      'weapon-health',
      'weapon-speed',
      'player-1',
      'player-2',
    ];
  }

  /**
   * Checks if there are obstacles to a given cell and returns a boolean of
   * true if there are no nearby obstacles else returns false
   * @param {*} row
   * @param {*} col
   */
  checkNearby(row, col) {
    let topCell = this.game.gameContainerElement.querySelector(
      `.cell_${row - 1}_${col}`
    );
    let bottomCell = this.game.gameContainerElement.querySelector(
      `.cell_${row + 1}_${col}`
    );
    let rightCell = this.game.gameContainerElement.querySelector(
      `.cell_${row}_${col + 1}`
    );
    let leftCell = this.game.gameContainerElement.querySelector(
      `.cell_${row}_${col - 1}`
    );

    if (
      this.isCloseTo(
        topCell,
        bottomCell,
        rightCell,
        leftCell,
        this.avoidItems[0]
      )
    ) {
      if (
        this.isCloseTo(
          topCell,
          bottomCell,
          rightCell,
          leftCell,
          this.avoidItems[1]
        )
      ) {
        if (
          this.isCloseTo(
            topCell,
            bottomCell,
            rightCell,
            leftCell,
            this.avoidItems[2]
          )
        ) {
          if (
            this.isCloseTo(
              topCell,
              bottomCell,
              rightCell,
              leftCell,
              this.avoidItems[3]
            )
          ) {
            if (
              this.isCloseTo(
                topCell,
                bottomCell,
                rightCell,
                leftCell,
                this.avoidItems[4]
              )
            ) {
              if (
                this.isCloseTo(
                  topCell,
                  bottomCell,
                  rightCell,
                  leftCell,
                  this.avoidItems[5]
                )
              ) {
                if (
                  this.isCloseTo(
                    topCell,
                    bottomCell,
                    rightCell,
                    leftCell,
                    this.avoidItems[6]
                  )
                ) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * Returns a boolean of true or false to check if a given cell is close or not a given item.
   * True => represent a close item is found otherwise false
   * @param {*} topCell
   * @param {*} bottomCell
   * @param {*} rightCell
   * @param {*} leftCell
   * @param {*} item
   */
  isCloseTo(topCell, bottomCell, rightCell, leftCell, item) {
    if (
      !(
        topCell.classList.contains(item) ||
        bottomCell.classList.contains(item) ||
        rightCell.classList.contains(item) ||
        leftCell.classList.contains(item)
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if a cell is available or not and returns true if is available
   * @param {*} row
   * @param {*} col
   */
  isAvailableCell(row, col) {
    let result = !this.game.unavailableCells.includes(`cell_${row}_${col}`);
    return result;
  }

  /**
   * Places an item on the grid based on its row and column position using the class name specified
   * @param {*} row
   * @param {*} col
   * @param {*} itemClassName
   */
  placeItem(row, col, itemClassName) {
    let selectedCell = this.game.gameContainerElement.querySelector(
      `.cell_${row}_${col}`
    );
    selectedCell.classList.add(itemClassName);

    // Make that cell unavailable for later use
    this.game.unavailableCells.push(`cell_${row}_${col}`);
  }
}

/**
 * This represents the dimmed cells on the grid object and inherits from the Item class
 */
class DimmedCell extends Item {
  // DimmedCell constructor > extending Item
  constructor(GRID_SIZE) {
    super(null, null, null, game);
    this.GRID_SIZE = GRID_SIZE;
  }

  /**
   * Randomnly picks a cell and verifies if it is avilable. When it is true, dimmed cells are placed
   * and then added to the list of unavailable-cells
   */
  dimCell() {
    let randCellRow = getRandomInt(0, this.GRID_SIZE - 1);
    let randCellCol = getRandomInt(0, this.GRID_SIZE - 1);

    if (this.isAvailableCell(randCellRow, randCellCol)) {
      this.placeItem(randCellRow, randCellCol, 'disabled');
    } else {
      return this.dimCell();
    }
  }
}

/**
 * Represents the Player object and extends or inherits from the Item class
 */
class Player extends Item {
  // Player constructor > extending Item
  constructor(GRID_SIZE, player, game) {
    super(null, null, null, game);
    this.GRID_SIZE = GRID_SIZE;
    this.rowMin = player.rowMin;
    this.rowMax = player.rowMax;
    this.colMin = player.colMin;
    this.colMax = player.colMax;
    this.speed = 2;
    this.className = player.className;
    this.addPlayer();
  }

  /**
   * Adds a player randomly onto the grid or map
   */
  addPlayer() {
    let randCellRow = getRandomInt(0, this.GRID_SIZE - 1);
    let randCellCol = getRandomInt(0, this.GRID_SIZE - 1);

    // ensures the player begin at different sides of the map.
    if (
      randCellRow >= this.rowMin &&
      randCellRow <= this.rowMax &&
      randCellCol > this.colMin &&
      randCellCol < this.colMax
    ) {
      if (this.isAvailableCell(randCellRow, randCellCol)) {
        this.placeItem(randCellRow, randCellCol, this.className);
      } else {
        return this.addPlayer();
      }
    } else {
      return this.addPlayer();
    }
  }
}

/**
 * This is the class representing the Weapon object and extends or inherits the Item class
 */
class Weapon extends Item {
  // Constructor
  constructor(GRID_SIZE, weapon, game) {
    super(null, null, null, game);
    this.GRID_SIZE = GRID_SIZE;
    this.className = weapon.className;
    this.addWeapon();
  }

  /**
   * Adds weapon onto the grid or map randomly
   */
  addWeapon() {
    let randCellRow = getRandomInt(1, this.GRID_SIZE - 2);
    let randCellCol = getRandomInt(1, this.GRID_SIZE - 2);

    if (this.isAvailableCell(randCellRow, randCellCol)) {
      // check if there are any nearby weapons
      if (this.checkNearby(randCellRow, randCellCol)) {
        this.placeItem(randCellRow, randCellCol, this.className);
      } else {
        return this.addWeapon();
      }
    } else {
      return this.addWeapon();
    }
  }
}

/**
 * Game Utitlity class handles all generic methods and action calls in the game
 */
class GameUtility {
  // GameUtility constructor
  constructor(players, weapons, game) {
    this.game = game;
    this.players = players;
    this.weapons = weapons;
    this.playerTurn = 0;
    this.MAX_HIGHLIGHTED_CELLS = 2;
    this.updatePlayerPoints();
    this.handleGameEvents();
    this.highlightPlayerAvaialableCells();
  }

  /**
   * Adds a click event to each cell and if it is clicked, calls the checkPlayerTurn method to check
   * the current player's turn and utilizes the returned value to retrieve the player's html element.
   * Then removes the associated class from its old location or position and adds a new class to the new position
   * It also changes the player turn to then player and highlighs available cell
   */
  handleGameEvents() {
    const gridItems = this.game.gameContainerElement.querySelectorAll(
      '.grid-item'
    );

    for (let item of gridItems) {
      item.addEventListener('click', () => {
        let player = this.checkPlayerTurn();
        let playerElement = this.game.gameContainerElement.querySelector(
          `.${player}`
        );
        playerElement.classList.remove(player);
        item.classList.add(player);

        let playerRow = item.getAttribute('data-row');
        let playerCol = item.getAttribute('data-col');

        // Hit a weapon?
        this.takeWeapon(this.playerTurn, item);

        // Attack Mode?
        if (this.isPlayerInAttackState(this.playerTurn, playerRow, playerCol)) {
          this.startAttackState();
        }

        // Switch player turn
        this.playerTurn = this.playerTurn == 0 ? 1 : 0;

        // Highlight Available Cells
        this.highlightPlayerAvaialableCells();
      });
    }
  }

  /**
   * Gets the details of the player's dashboard
   * @param {*} playerIndex
   * @param {*} attack
   */
  getPlayerDashboard(playerIndex, attack = false) {
    return this.game.gameContainerElement.querySelector(
      `#${attack ? 'combat_' : ''}player_${playerIndex + 1}_dashboard`
    );
  }

  /**
   * Checks if the `landedCell` has a weapon or not, if yes remove that weapon.
   * Also, it Increases/Decreases games statistics based on the weapon and animate it
   * It then calls the `updatePlayerPoints` method to update stats change.
   * @param {*} currentPlayer
   * @param {*} landedCell
   */
  takeWeapon(currentPlayer, landedCell) {
    if (landedCell.classList.contains('weapon-attack')) {
      landedCell.classList.remove('weapon-attack');
      this.players[currentPlayer].attack = this.weapons[1].effect;

      this.getPlayerDashboard(currentPlayer)
        .querySelector('#attack')
        .classList.add('updatePlayerPoints');
      setTimeout(() => {
        this.getPlayerDashboard(currentPlayer)
          .querySelector('#attack')
          .classList.remove('updatePlayerPoints');
      }, 1000);
      this.updatePlayerPoints();
    } else if (landedCell.classList.contains('weapon-defense')) {
      landedCell.classList.remove('weapon-defense');
      this.players[currentPlayer].shield += this.weapons[0].effect;

      this.getPlayerDashboard(currentPlayer)
        .querySelector('#shield')
        .classList.add('updatePlayerPoints');
      setTimeout(() => {
        this.getPlayerDashboard(currentPlayer)
          .querySelector('#shield')
          .classList.remove('updatePlayerPoints');
      }, 1000);
      this.updatePlayerPoints();
    } else if (landedCell.classList.contains('weapon-health')) {
      landedCell.classList.remove('weapon-health');
      this.players[currentPlayer].health += this.weapons[2].effect;
      this.getPlayerDashboard(currentPlayer)
        .querySelector('#health')
        .classList.add('updatePlayerPoints');
      setTimeout(() => {
        this.getPlayerDashboard(currentPlayer)
          .querySelector('#health')
          .classList.remove('updatePlayerPoints');
      }, 1000);
      this.updatePlayerPoints();
    } else if (landedCell.classList.contains('weapon-attack-super')) {
      landedCell.classList.remove('weapon-attack-super');
      this.players[currentPlayer].attack = this.weapons[3].effect;

      this.getPlayerDashboard(currentPlayer)
        .querySelector('#attack')
        .classList.add('updatePlayerPoints');
      setTimeout(() => {
        this.getPlayerDashboard(currentPlayer)
          .querySelector('#attack')
          .classList.remove('updatePlayerPoints');
      }, 1000);
      this.updatePlayerPoints();
    } else if (landedCell.classList.contains('weapon-speed')) {
      landedCell.classList.remove('weapon-speed');
      this.players[currentPlayer].speed = this.weapons[4].effect;
    }
  }

  /**
   * Updates the players point statistics
   */
  updatePlayerPoints() {
    const playerOneDashboard = this.getPlayerDashboard(0);
    const playerTwoDashboard = this.getPlayerDashboard(1);
    playerOneDashboard.querySelector(
      '#health'
    ).innerHTML = this.players[0].health;
    playerOneDashboard.querySelector(
      '#attack'
    ).innerHTML = this.players[0].attack;
    playerOneDashboard.querySelector(
      '#shield'
    ).innerHTML = this.players[0].shield;

    playerTwoDashboard.querySelector(
      '#health'
    ).innerHTML = this.players[1].health;
    playerTwoDashboard.querySelector(
      '#attack'
    ).innerHTML = this.players[1].attack;
    playerTwoDashboard.querySelector(
      '#shield'
    ).innerHTML = this.players[1].shield;
  }

  /**
   * Updates the game points for the players during a battle or attack
   */
  updateAttackPoints() {
    const combatPlayerOneDashboard = this.getPlayerDashboard(0, true);
    const combatPlayerTwoDashboard = this.getPlayerDashboard(1, true);

    combatPlayerOneDashboard.querySelector(
      '#health'
    ).innerHTML = this.players[0].health;
    combatPlayerOneDashboard.querySelector(
      '#attack'
    ).innerHTML = this.players[0].attack;
    combatPlayerOneDashboard.querySelector(
      '#shield'
    ).innerHTML = this.players[0].shield;

    combatPlayerTwoDashboard.querySelector(
      '#health'
    ).innerHTML = this.players[1].health;
    combatPlayerTwoDashboard.querySelector(
      '#attack'
    ).innerHTML = this.players[1].attack;
    combatPlayerTwoDashboard.querySelector(
      '#shield'
    ).innerHTML = this.players[1].shield;
  }

  /**
   * Resets the active player turn and adds `active-class` to the most current player and
   * returns the current player which is used in the `handleGameEvents()` method
   */
  checkPlayerTurn() {
    const currentPlayer = this.playerTurn;
    this.resetPlayerTurn();
    this.getPlayerDashboard(currentPlayer).classList.add('active-turn');
    this.getPlayerDashboard(currentPlayer, true).classList.add('active-turn');
    return `player-${this.playerTurn + 1}`;
  }

  /**
   * Removes the `active-turn` class from the active-player
   */
  resetPlayerTurn() {
    let activeTurn = this.game.gameContainerElement.querySelectorAll(
      '.active-turn'
    );

    for (let i = 0; i < activeTurn.length; i++) {
      activeTurn[i].classList.remove('active-turn');
    }
  }

  /**
   * Indicates all the locations available to an `active-player` and by default player-1 `Spongebob`
   * has the active state.
   */
  highlightPlayerAvaialableCells() {
    this.resetHighlightedCells();

    let player = this.checkPlayerTurn();
    let playerElement = this.game.gameContainerElement.querySelector(
      `.${player}`
    );

    let row = parseInt(playerElement.getAttribute('data-row'));
    let col = parseInt(playerElement.getAttribute('data-col'));

    // Top
    for (let i = 1; i <= this.players[this.playerTurn].speed; i++) {
      let topCell = this.game.gameContainerElement.querySelector(
        `.cell_${row - i}_${col}`
      );

      // Check if cell is unavailable
      if (row - i < 0) {
        break;
      } else if (topCell.classList.contains('disabled')) {
        break;
      } else {
        topCell.classList.add('highlighted');
      }
    }

    // Right
    for (let i = 1; i <= this.players[this.playerTurn].speed; i++) {
      let rightCell = this.game.gameContainerElement.querySelector(
        `.cell_${row}_${col + i}`
      );

      // Check if cell is unavailable
      if (col + i > 11) {
        break;
      } else if (rightCell.classList.contains('disabled')) {
        break;
      } else {
        rightCell.classList.add('highlighted');
      }
    }

    // Bottom
    for (let i = 1; i <= this.players[this.playerTurn].speed; i++) {
      let bottomCell = this.game.gameContainerElement.querySelector(
        `.cell_${row + i}_${col}`
      );

      // Check if cell is unavailable
      if (row + i > 11) {
        break;
      } else if (bottomCell.classList.contains('disabled')) {
        break;
      } else {
        bottomCell.classList.add('highlighted');
      }
    }

    // Left
    for (let i = 1; i <= this.players[this.playerTurn].speed; i++) {
      let leftCell = this.game.gameContainerElement.querySelector(
        `.cell_${row}_${col - i}`
      );

      // Check if cell is unavailable
      if (col - i < 0) {
        break;
      } else if (leftCell.classList.contains('disabled')) {
        break;
      } else {
        leftCell.classList.add('highlighted');
      }
    }
  }

  /**
   * Resets all the highlighted cells so when a player's turn is switched, it removes the previous
   * active player's cell
   */
  resetHighlightedCells() {
    let highlightedCells = this.game.gameContainerElement.querySelectorAll(
      '.highlighted'
    );
    for (let cell of highlightedCells) {
      cell.classList.remove('highlighted');
    }
  }

  /**
   * Checks if `currentPlayer` is closer or touching the opponent and returns
   * true if touching else false
   * @param {*} currentPlayer
   * @param {*} row
   * @param {*} col
   */
  isPlayerInAttackState(currentPlayer, row, col) {
    row = parseInt(row);
    col = parseInt(col);

    let opponentPlayer = currentPlayer == 0 ? 'player-2' : 'player-1';

    let topCell = this.game.gameContainerElement.querySelector(
      `.cell_${row - 1}_${col}`
    );
    let bottomCell = this.game.gameContainerElement.querySelector(
      `.cell_${row + 1}_${col}`
    );
    let rightCell = this.game.gameContainerElement.querySelector(
      `.cell_${row}_${col + 1}`
    );
    let leftCell = this.game.gameContainerElement.querySelector(
      `.cell_${row}_${col - 1}`
    );

    if (!(row == 0)) {
      if (topCell.classList.contains(opponentPlayer)) {
        return true;
      }
    }
    if (!(row == 11)) {
      if (bottomCell.classList.contains(opponentPlayer)) {
        return true;
      }
    }
    if (!(col == 0)) {
      if (leftCell.classList.contains(opponentPlayer)) {
        return true;
      }
    }
    if (!(col == 11)) {
      if (rightCell.classList.contains(opponentPlayer)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Initiates or starts the attacking state by setting the Player who iniated the attack
   * gets hit first and then other player also. This happens in turn until one of the players
   * is deafeated. These cycles happens twin 2 seconds
   */
  startAttackState() {
    let combatModeModal = this.game.gameContainerElement.querySelector(
      '.attack-state'
    );
    combatModeModal.classList.add('visible');

    this.updateAttackPoints();

    var myTimer = setInterval(() => {
      let currentPlayer = this.playerTurn;
      let nextPlayer = currentPlayer == 1 ? 0 : 1;

      this.fight(currentPlayer, nextPlayer, myTimer);

      this.playerTurn = this.playerTurn == 0 ? 1 : 0;
    }, 2000);
  }

  /**
   * Activates a fight between the players and during this, damages and points are computed and
   * updated as well
   * @param {*} currentPlayer
   * @param {*} nextPlayer
   * @param {*} timer
   */
  fight(currentPlayer, nextPlayer, timer) {
    let damage =
      this.players[nextPlayer].attack -
      (this.players[currentPlayer].shield / 100) *
        this.players[nextPlayer].attack;
    this.players[currentPlayer].health -= damage;

    // Animate stats
    this.getPlayerDashboard(currentPlayer)
      .querySelector('#health')
      .classList.add('updatePlayerPoints');
    setTimeout(() => {
      this.getPlayerDashboard(currentPlayer)
        .querySelector('#health')
        .classList.remove('updatePlayerPoints');
    }, 500);

    this.updateAttackPoints();

    if (this.players[currentPlayer].health <= 0) {
      this.getPlayerDashboard(currentPlayer).querySelector(
        '#health'
      ).innerHTML = 0;

      clearInterval(timer);
      this.announceTheWinner(this.players[nextPlayer].name);
    } else {
      this.checkPlayerTurn();
    }
  }

  /**
   * Indicates the winner in a game
   * @param {*} winner
   */
  announceTheWinner(winner) {
    // Show Victory Popup
    let victoryPopup = this.game.gameContainerElement.querySelector(
      '.attack-state.victory'
    );
    victoryPopup.classList.add('visible');

    // Add winner text
    let winnerElem = this.game.gameContainerElement.querySelector(
      '.attack-state.victory .inner h2'
    );
    winnerElem.innerHTML = `<span>${winner}</span> wins!`;

    // Restart the game
    let restartBtn = this.game.gameContainerElement.querySelector(
      '.attack-state.victory .inner .btn'
    );
    restartBtn.addEventListener('click', () => {
      this.restart();
    });
  }

  // refreshes or reloads the page
  restart() {
    location.reload();
  }
}

/**
 * Generates and returns a random integer value given the `Minimum`and `Maximum` values
 * @param {*} min
 * @param {*} max
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Creates a new instance of the Game object and calls the `start()` method
 */
let game = new Game(document.querySelector('#game'));
game.start();
