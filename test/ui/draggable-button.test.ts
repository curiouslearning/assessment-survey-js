import { DraggableButton, type iDraggableHTMLElement } from '@ui/dom-events/draggable-button';

const createPointerLikeEvent = (type: string, init: MouseEventInit = {}): PointerEvent =>
  new MouseEvent(type, init) as PointerEvent;

describe('DraggableButton', () => {
  let button: iDraggableHTMLElement;

  beforeEach(() => {
    button = document.createElement('div') as iDraggableHTMLElement;
  });

  it('registers drag callbacks on the element', () => {
    new DraggableButton(button);

    expect(typeof button.onStart).toBe('function');
    expect(typeof button.onMove).toBe('function');
    expect(typeof button.onEnd).toBe('function');
  });

  it('updates the element transform while dragging', () => {
    new DraggableButton(button);

    button.onStart?.(createPointerLikeEvent('pointerdown', { clientX: 10, clientY: 20 }));
    button.onMove?.(createPointerLikeEvent('pointermove', { clientX: 40, clientY: 70 }));

    expect(button.style.transform).toBe('translate(30px, 50px)');
    expect(button.style.zIndex).toBe('1000');
  });

  it('resets the element transform when dragging ends', () => {
    new DraggableButton(button);

    button.onStart?.(createPointerLikeEvent('pointerdown', { clientX: 5, clientY: 5 }));
    button.onMove?.(createPointerLikeEvent('pointermove', { clientX: 25, clientY: 35 }));
    button.onEnd?.();

    expect(button.style.transform).toBe('translate(0px, 0px)');
    expect(button.style.zIndex).toBe('0');
  });
});
