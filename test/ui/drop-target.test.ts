import { DropAreaTarget, type iDropAreaHTMLElement } from '@ui/dom-events/drop-target';

const createPointerLikeEvent = (type: string, init: MouseEventInit = {}): PointerEvent =>
  new MouseEvent(type, init) as PointerEvent;

describe('DropAreaTarget', () => {
  let dropArea: iDropAreaHTMLElement;

  beforeEach(() => {
    dropArea = document.createElement('div') as iDropAreaHTMLElement;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers onHover on the drop target element', () => {
    new DropAreaTarget(dropArea);

    expect(typeof dropArea.onHover).toBe('function');
  });

  it('runs the hover callback when onHover is invoked', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    new DropAreaTarget(dropArea);
    dropArea.onHover?.(createPointerLikeEvent('pointermove'));

    expect(logSpy).toHaveBeenCalledWith('DropTargetCallbacks hovering on the chest');
  });

  it('keeps the hover callback bound to the class instance', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    new DropAreaTarget(dropArea);
    const hoverHandler = dropArea.onHover;
    hoverHandler?.(createPointerLikeEvent('pointermove'));

    expect(logSpy).toHaveBeenCalledTimes(1);
  });
});
