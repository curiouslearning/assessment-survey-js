import { UIController } from '../../src/components/uiController'; // Update the path if needed

describe('UIController', () => {
  let uiController: UIController;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="game-container"></div>
      <button id="start-button"></button>
      <button id="reset-button"></button>
    `;

    uiController = new UIController();
  });

  describe('Initialization', () => {
    it('should initialize the UIController', () => {
      expect(uiController).toBeDefined();
    });

    it('should find the required UI elements in the DOM', () => {
      expect(uiController['gameContainer']).toBeDefined();
      expect(uiController['startButton']).toBeDefined();
      expect(uiController['resetButton']).toBeDefined();
    });
  });

  describe('Button click events', () => {
    it('should call the startGame function when the start button is clicked', () => {
      const startGameSpy = jest.fn();
      uiController['startGame'] = startGameSpy;

      const startButton = document.getElementById('start-button');
      startButton?.click();

      expect(startGameSpy).toHaveBeenCalled();
    });

    it('should call the resetGame function when the reset button is clicked', () => {
      const resetGameSpy = jest.fn();
      uiController['resetGame'] = resetGameSpy;

      const resetButton = document.getElementById('reset-button');
      resetButton?.click();

      expect(resetGameSpy).toHaveBeenCalled();
    });
  });

  describe('Game UI Updates', () => {
    it('should update the game container content', () => {
      const content = '<p>Test content</p>';
      uiController.updateGameContainer(content);

      const gameContainer = document.getElementById('game-container');
      expect(gameContainer?.innerHTML).toBe(content);
    });

    it('should clear the game container content', () => {
      uiController.updateGameContainer('<p>Some content</p>');
      uiController.updateGameContainer('');

      const gameContainer = document.getElementById('game-container');
      expect(gameContainer?.innerHTML).toBe('');
    });
  });

  describe('Edge cases', () => {
    it('should not throw an error if buttons are clicked but no handler is defined', () => {
      const startButton = document.getElementById('start-button');
      const resetButton = document.getElementById('reset-button');

      expect(() => startButton?.click()).not.toThrow();
      expect(() => resetButton?.click()).not.toThrow();
    });
  });
});
