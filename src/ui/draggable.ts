// @ts-nocheck

export function attachDraggable(element, { onEnd = () => { } } = {}) {
    let dragging = false;
    let offset = { x: 0, y: 0 };

    element.style.cursor = 'grab';
    element.style.touchAction = 'none';
    element.style.userSelect = 'none';
    element.style.position = 'absolute';

    const start = (e) => {
        dragging = true;
        element.style.cursor = 'grabbing';
        element.style.zIndex = '1000';

        const rect = element.getBoundingClientRect();
        offset.x = e.clientX - rect.left;
        offset.y = e.clientY - rect.top;
    };

    const move = (e) => {
        if (!dragging) return;

        const x = e.clientX - offset.x;
        const y = e.clientY - offset.y;
        element.style.transform = `translate(${x}px, ${y}px)`;
    };

    const end = () => {
        if (!dragging) return;

        dragging = false;
        element.style.cursor = 'grab';
        element.style.zIndex = '';
        onEnd();
    };

    const reset = () => {
        element.style.transform = '';
    };

    element.addEventListener('pointerdown', start);
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', end);

    return { reset };
}
