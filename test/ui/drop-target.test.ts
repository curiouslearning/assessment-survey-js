jest.mock('@services/app-event-bus', () => ({
  __esModule: true,
  default: {
    publish: jest.fn(),
    EVENTS: {
      DROP_ELEMENT_INTERACTION: 'DROP_ELEMENT_INTERACTION',
    },
  },
}));

import { DropAreaTarget, type iDropAreaHTMLElement } from '@ui/drag-drop/dom-events/drop-target';

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
    new DropAreaTarget(dropArea);
    expect(() => dropArea.onHover?.()).not.toThrow();
  });

  it('keeps the hover callback bound to the class instance', () => {
    new DropAreaTarget(dropArea);
    const hoverHandler = dropArea.onHover;
    expect(() => hoverHandler?.()).not.toThrow();
  });
});
