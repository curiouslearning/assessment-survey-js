import { DraggableButton, type iDraggableHTMLElement } from '@ui/drag-drop/dom-events/draggable-button';

const createPointerLikeEvent = (type: string, init: MouseEventInit = {}): PointerEvent =>
  new MouseEvent(type, init) as PointerEvent;

describe('DraggableButton', () => {
  let button: iDraggableHTMLElement;

  beforeEach(() => {
    button = document.createElement('div') as iDraggableHTMLElement;
    // Transform writes are coalesced through requestAnimationFrame; run the
    // callback synchronously so assertions can read the style right away.
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers drag callbacks on the element', () => {
    new DraggableButton(button);

    expect(typeof button.onStart).toBe('function');
    expect(typeof button.onMove).toBe('function');
    expect(typeof button.onEnd).toBe('function');
    expect(typeof button.getDragCenter).toBe('function');
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

  it('reports the tracked drag center without reading layout', () => {
    new DraggableButton(button);

    // Not dragging yet — no center to report
    expect(button.getDragCenter?.()).toBeNull();

    button.onStart?.(createPointerLikeEvent('pointerdown', { clientX: 10, clientY: 20 }));
    button.onMove?.(createPointerLikeEvent('pointermove', { clientX: 40, clientY: 70 }));

    // jsdom rects are all zeros, so the center equals the applied drag offset
    expect(button.getDragCenter?.()).toEqual({ x: 30, y: 50 });

    button.onEnd?.();
    expect(button.getDragCenter?.()).toBeNull();
  });
});
