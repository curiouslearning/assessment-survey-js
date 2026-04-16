export default class QuestionInteractionEvents {
    constructor(private root: HTMLElement) { }

    public attach(): void {
        this.root.addEventListener('pointerdown', this.handlePointerDown);
        this.root.addEventListener('pointermove', this.handlePointerMove);
        this.root.addEventListener('pointerup', this.handlePointerUp);
    }

    private handlePointerDown = (event: PointerEvent) => {
        const target = event.target as HTMLElement | null;
        const answerButton = target?.closest('.answerButton');

        if (!answerButton) {
            return;
        }

        console.log('pointerdown on answer button', answerButton.id);
    };

    private handlePointerMove = (event: PointerEvent) => {
        // temporary drag logic here
        console.log(' handlePointerMove ')
    };

    private handlePointerUp = (event: PointerEvent) => {
        // temporary drop/end logic here
        console.log(' handlePointerUp ')
    };
}
