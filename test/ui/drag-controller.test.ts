import DragEventController from '@ui/drag-drop/dom-events/drag-controller';
import type { iDraggableHTMLElement } from '@ui/drag-drop/dom-events/draggable-button';
import type { iDropAreaHTMLElement } from '@ui/drag-drop/dom-events/drop-target';

const createPointerLikeEvent = (
  type: string,
  init: MouseEventInit = {},
  pointerId = 1,
): PointerEvent => {
  const event = new MouseEvent(type, init) as PointerEvent;
  Object.defineProperty(event, 'pointerId', {
    configurable: true,
    value: pointerId,
  });

  return event;
};

// Controllable requestAnimationFrame/cancelAnimationFrame mock: pointermove handling
// is batched to rAF, so tests explicitly flush a frame instead of relying on real
// frame timing (jsdom's real rAF is timer-based and not worth the added test latency).
let rafQueue: Map<number, FrameRequestCallback>;
let rafId: number;

const flushRaf = (): void => {
  const callbacks = Array.from(rafQueue.values());
  rafQueue.clear();
  callbacks.forEach((cb) => cb(0));
};

describe('DragEventController', () => {
  let root: HTMLElement;
  let button: iDraggableHTMLElement;
  let dropArea: iDropAreaHTMLElement;

  beforeEach(() => {
    rafQueue = new Map();
    rafId = 0;
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafId += 1;
      rafQueue.set(rafId, cb);
      return rafId;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      rafQueue.delete(id);
    });

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

  const setOverlappingRects = (): void => {
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
  };

  it('calls button onStart on pointerdown', () => {
    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }));

    expect(button.onStart).toHaveBeenCalledTimes(1);
  });

  it('registers pointerdown/pointermove/pointerup/pointercancel as passive, but not dragstart', () => {
    const addSpy = jest.spyOn(root, 'addEventListener');

    new DragEventController(root).attach();

    const optionsFor = (type: string) =>
      addSpy.mock.calls.find(([eventType]) => eventType === type)?.[2];

    expect(optionsFor('pointerdown')).toEqual({ passive: true });
    expect(optionsFor('pointermove')).toEqual({ passive: true });
    expect(optionsFor('pointerup')).toEqual({ passive: true });
    expect(optionsFor('pointercancel')).toEqual({ passive: true });
    // dragstart calls preventDefault() internally, so it must not be passive.
    expect(optionsFor('dragstart')).not.toEqual({ passive: true });
  });

  it('defers onMove to the next animation frame instead of calling it synchronously', () => {
    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }));
    button.dispatchEvent(createPointerLikeEvent('pointermove', { bubbles: true }));

    expect(button.onMove).not.toHaveBeenCalled();

    flushRaf();

    expect(button.onMove).toHaveBeenCalledTimes(1);
  });

  it('batches multiple synchronous pointermove events into a single per-frame update', () => {
    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }));
    button.dispatchEvent(createPointerLikeEvent('pointermove', { bubbles: true, clientX: 1 }));
    button.dispatchEvent(createPointerLikeEvent('pointermove', { bubbles: true, clientX: 2 }));
    button.dispatchEvent(createPointerLikeEvent('pointermove', { bubbles: true, clientX: 3 }));

    // Only one frame should have been scheduled for the whole burst.
    expect(rafQueue.size).toBe(1);

    flushRaf();

    expect(button.onMove).toHaveBeenCalledTimes(1);
    expect((button.onMove as jest.Mock).mock.calls[0][0].clientX).toBe(3);
  });

  it('calls drop target onHover when button overlaps chest during pointermove', () => {
    setOverlappingRects();

    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }));
    button.dispatchEvent(createPointerLikeEvent('pointermove', { bubbles: true }));
    flushRaf();

    expect(dropArea.onHover).toHaveBeenCalledTimes(1);
  });

  it('calls drop target onDrop and ends the drag on pointerup when overlapping', () => {
    setOverlappingRects();

    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }));
    button.dispatchEvent(createPointerLikeEvent('pointerup', { bubbles: true }));

    expect(dropArea.onDrop).toHaveBeenCalledWith(button);
    expect(button.onEnd).toHaveBeenCalledTimes(1);
  });

  it('applies a still-scheduled move immediately on pointerup instead of using a stale position', () => {
    setOverlappingRects();

    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }));
    // Schedules a frame but does not flush it — pointerup should commit this move
    // synchronously so the drop-zone check sees the final pointer position.
    button.dispatchEvent(createPointerLikeEvent('pointermove', { bubbles: true }));
    expect(button.onMove).not.toHaveBeenCalled();

    button.dispatchEvent(createPointerLikeEvent('pointerup', { bubbles: true }));

    expect(button.onMove).toHaveBeenCalledTimes(1);
    expect(dropArea.onDrop).toHaveBeenCalledWith(button);
    // The frame that would have re-run the (now stale) pending move must be cleared.
    expect(rafQueue.size).toBe(0);
  });

  it('ends the drag without dropping on pointercancel', () => {
    setOverlappingRects();

    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }));
    button.dispatchEvent(createPointerLikeEvent('pointercancel', { bubbles: true }));

    expect(dropArea.onDrop).not.toHaveBeenCalled();
    expect(button.onEnd).toHaveBeenCalledTimes(1);
  });

  it('cancels a pending scheduled frame on detach', () => {
    const controller = new DragEventController(root);
    controller.attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }));
    button.dispatchEvent(createPointerLikeEvent('pointermove', { bubbles: true }));
    expect(rafQueue.size).toBe(1);

    controller.detach();

    expect(rafQueue.size).toBe(0);
    flushRaf();
    expect(button.onMove).not.toHaveBeenCalled();
  });

  it('ignores a second pointerdown while another drag is active', () => {
    const secondButton = document.createElement('div') as iDraggableHTMLElement;
    secondButton.className = 'answerButton';
    secondButton.onStart = jest.fn();
    secondButton.onMove = jest.fn();
    secondButton.onEnd = jest.fn();
    root.appendChild(secondButton);

    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }, 1));
    secondButton.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }, 2));

    expect(button.onStart).toHaveBeenCalledTimes(1);
    expect(secondButton.onStart).not.toHaveBeenCalled();
  });

  it('ignores pointermove from a different pointer while a drag is active', () => {
    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }, 1));
    button.dispatchEvent(createPointerLikeEvent('pointermove', { bubbles: true }, 2));
    flushRaf();

    expect(button.onMove).not.toHaveBeenCalled();
  });

  it('ignores pointerup from a different pointer while a drag is active', () => {
    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }, 1));
    button.dispatchEvent(createPointerLikeEvent('pointerup', { bubbles: true }, 2));

    expect(button.onEnd).not.toHaveBeenCalled();
    expect(dropArea.onDrop).not.toHaveBeenCalled();

    button.dispatchEvent(createPointerLikeEvent('pointermove', { bubbles: true }, 1));
    flushRaf();
    expect(button.onMove).toHaveBeenCalledTimes(1);
  });

  it('ignores pointercancel from a different pointer while a drag is active', () => {
    new DragEventController(root).attach();

    button.dispatchEvent(createPointerLikeEvent('pointerdown', { bubbles: true }, 1));
    button.dispatchEvent(createPointerLikeEvent('pointercancel', { bubbles: true }, 2));

    expect(button.onEnd).not.toHaveBeenCalled();
    expect(dropArea.onDrop).not.toHaveBeenCalled();

    button.dispatchEvent(createPointerLikeEvent('pointermove', { bubbles: true }, 1));
    flushRaf();
    expect(button.onMove).toHaveBeenCalledTimes(1);
  });
});
