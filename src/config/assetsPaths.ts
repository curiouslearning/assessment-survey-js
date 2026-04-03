export const ASSET_PATHS = {
    CHEST_PROGRESSION: {
        1: 'img/chestprogression/TreasureChestOpen01.svg',
        2: 'img/chestprogression/TreasureChestOpen02.svg',
        3: 'img/chestprogression/TreasureChestOpen03.svg',
        4: 'img/chestprogression/TreasureChestOpen04.svg',
    },
    SOUND_BUTTON_ANIMATION: 'animation/SoundButton.gif',
    SOUND_BUTTON_IDLE: 'img/SoundButton_Idle.png',
    STAR_ANIMATION: 'animation/Star.gif',
    STAR_AFTER_ANIMATION: 'img/star_after_animation.gif',
    AUDIO: {
        itemAudio: (dataURL: string, itemName: string) => `audio/${dataURL}/${itemName}`,
        feedbackAudio: (dataURL: string) => `audio/${dataURL}/answer_feedback.mp3`,
    }
} as const;