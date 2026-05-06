import { AudioController } from '@components/audioController';
import { ASSET_PATHS } from '@configs/assetsPaths';
import appEventBus from './app-event-bus';

export class DragDropAudioController {
    private dragStartUnsubscribe: () => void | null = null;
    private dragReturnUnsubscribe: () => void | null = null;
    private dropSuccessfulUnsubscribe: () => void | null = null;

    constructor() {
        this.dragStartUnsubscribe = appEventBus.subscribe(
            appEventBus.EVENTS.ON_DRAG_START,
            () => {
                this.handleAudioOnDragStart();
            }
        );

        this.dragReturnUnsubscribe = appEventBus.subscribe(
            appEventBus.EVENTS.ON_DRAG_RETURN,
            () => {
                this.handleAudioOnDragReturn();
            }
        );

        this.dropSuccessfulUnsubscribe = appEventBus.subscribe(
            appEventBus.EVENTS.ANSWERED_CORRECTLY,
            () => {
                this.handleAudioOnCorrectDrop();
            }
        );
    }

    //Plays the SFX audio when the element is about to be drag.
    private handleAudioOnDragStart(): void {
        AudioController.PlaySoundEffect(
            ASSET_PATHS.AUDIO.DRAG_SOUND_EFFECTS.DRAG_START_POP
        );
    }

    //Plays the SFX audio when the element is returned to the position far from target area drop point.
    private handleAudioOnDragReturn(): void {
        AudioController.PlaySoundEffect(
            ASSET_PATHS.AUDIO.DRAG_SOUND_EFFECTS.RETURN_BOING
        );
    }

    //Plays SFX audio when the correct element is dropped in the target area.
    private handleAudioOnCorrectDrop(): void {
        AudioController.PlaySoundEffect(
            ASSET_PATHS.AUDIO.DRAG_SOUND_EFFECTS.HAPPY_TRUMPET_PLUS_SPARKLE
        );
    }

    public disposeSubscriptions(): void {
        this.dragStartUnsubscribe?.();
        this.dragStartUnsubscribe = null;

        this.dragReturnUnsubscribe?.();
        this.dragReturnUnsubscribe = null;

        this.dropSuccessfulUnsubscribe?.();
        this.dropSuccessfulUnsubscribe = null;
    }

};
