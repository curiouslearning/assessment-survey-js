import DragEventController from '@ui/drag-drop/dom-events/drag-controller';
import type { iDraggableHTMLElement } from '@ui/drag-drop/dom-events/draggable-button';
import type { iDropAreaHTMLElement } from '@ui/drag-drop/dom-events/drop-target';

const createPointerLikeEvent = (type: string, init: MouseEventInit = {}): PointerEvent =>
  new MouseEvent(type, init) as PointerEvent;

describe('DragEventController', () => {
  let root: HTMLElement;
  let button: iDraggableHTMLElement;
  let dropArea: iDropAreaHTMLElement;

  beforeEach(() => {
    root = document.createElement('div');

    button = document.createElement('div') as iDraggableHTMLElement;
    button.className = 'answerButton';
    button.onStart = jest.fn();
    button.onMove = jest.fn();
    button.onEnd = jest.fn();

    dropArea = document.createElement('div') as iDropAreaHTMLElement;
    dropArea.className = 'chestdiv';
    dropArea.onHover = jest.fn();
    dropArea.onDrop = jest.fn();

    root.appendChild(button);
    root.appendChild(dropArea);
    document.body.appendChild(root);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('calls button onStart on pointerdown', () => {
    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }));

    expect(button.onStart).toHaveBeenCalledTimes(1);
  });

  it('calls button onMove on pointermove', () => {
    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }));
    button.dispatchEvent(createPointerLikeEvent('pointermove', { bubbles: true }));

    expect(button.onMove).toHaveBeenCalledTimes(1);
  });

  it('calls drop target onHover when button overlaps chest during pointermove', () => {
    button.getBoundingClientRect = jest.fn(() => ({
      left: 10,
      right: 60,
      top: 10,
      bottom: 60,
      width: 50,
      height: 50,
      x: 10,
      y: 10,
      toJSON: () => ({}),
    })) as typeof button.getBoundingClientRect;

    dropArea.getBoundingClientRect = jest.fn(() => ({
      left: 20,
      right: 80,
      top: 20,
      bottom: 80,
      width: 60,
      height: 60,
      x: 20,
      y: 20,
      toJSON: () => ({}),
    })) as typeof dropArea.getBoundingClientRect;

    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }));
    button.dispatchEvent(createPointerLikeEvent('pointermove', { bubbles: true }));

    expect(dropArea.onHover).toHaveBeenCalledTimes(1);
  });

  it('calls drop target onDrop and ends the drag on pointerup when overlapping', () => {
    button.getBoundingClientRect = jest.fn(() => ({
      left: 10,
      right: 60,
      top: 10,
      bottom: 60,
      width: 50,
      height: 50,
      x: 10,
      y: 10,
      toJSON: () => ({}),
    })) as typeof button.getBoundingClientRect;

    dropArea.getBoundingClientRect = jest.fn(() => ({
      left: 20,
      right: 80,
      top: 20,
      bottom: 80,
      width: 60,
      height: 60,
      x: 20,
      y: 20,
      toJSON: () => ({}),
    })) as typeof dropArea.getBoundingClientRect;

    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }));
    button.dispatchEvent(createPointerLikeEvent('pointerup', { bubbles: true }));

    expect(dropArea.onDrop).toHaveBeenCalledWith(button);
    expect(button.onEnd).toHaveBeenCalledTimes(1);
  });

  it('ends the drag without dropping on pointercancel', () => {
    button.getBoundingClientRect = jest.fn(() => ({
      left: 10,
      right: 60,
      top: 10,
      bottom: 60,
      width: 50,
      height: 50,
      x: 10,
      y: 10,
      toJSON: () => ({}),
    })) as typeof button.getBoundingClientRect;

    dropArea.getBoundingClientRect = jest.fn(() => ({
      left: 20,
      right: 80,
      top: 20,
      bottom: 80,
      width: 60,
      height: 60,
      x: 20,
      y: 20,
      toJSON: () => ({}),
    })) as typeof dropArea.getBoundingClientRect;

    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }));
    button.dispatchEvent(createPointerLikeEvent('pointercancel', { bubbles: true }));

    expect(dropArea.onDrop).not.toHaveBeenCalled();
    expect(button.onEnd).toHaveBeenCalledTimes(1);
  });
});
