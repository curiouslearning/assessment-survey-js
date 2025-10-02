/**
 * Common properties included in all analytics events.
 */
interface CommonEventProperties {
    /** Unique identifier for the user. */
    clUserId: string;

    /** The language the app is running in (e.g., "en", "hindi"). */
    language: string;

    /** The name of the app generating the event. */
    app: string;

    /** The latitude and longitude of the user, formatted as a string. */
    lat_lang: string;

    /** The source from which the user originated (e.g., campaign, referral). */
    user_source: string;

    /** The version of the application. */
    appVersion: string;

    /** The version of the content (e.g., dataset or curriculum version). */
    contentVersion: string;
}

/**
 * Event triggered when the app is opened.
 */
export interface Opened extends CommonEventProperties { }

/**
 * Event containing the user's location data.
 */
export interface UserLocation extends CommonEventProperties { }

/**
 * Event triggered when a session starts.
 */
export interface SessionStart extends CommonEventProperties {
    /** The type of session (e.g., "assessment", "practice"). */
    type: string;
}

/**
 * Event triggered when a puzzle is completed.
 */
export interface PuzzleCompleted extends CommonEventProperties {
    /** Type of event (e.g., "puzzle"). */
    type: string;

    /** Duration taken to solve the puzzle, in milliseconds. */
    dt: number;

    /** The number of the current question in the sequence. */
    question_number: number;

    /** The target or goal of the puzzle. */
    target: string;

    /** The text or content of the question. */
    question: string;

    /** The answer selected by the user. */
    selected_answer: string;

    /** Whether the selected answer is correct. */
    iscorrect: boolean;

    /** The available options presented for the puzzle. */
    options: string;

    /** The bucket/category this puzzle belongs to. */
    bucket: string;
}

/**
 * Event triggered when a level is completed.
 */
export interface LevelCompleted extends CommonEventProperties {
    /** Type of event (e.g., "level"). */
    type: string;

    /** The number of the completed bucket. */
    bucketNumber: number;

    /** Number of items attempted in this bucket. */
    numberTriedInBucket: number;

    /** Number of correct answers in this bucket. */
    numberCorrectInBucket: number;

    /** Whether the bucket was passed successfully. */
    passedBucket: boolean;
}

/**
 * Event triggered when a session ends.
 */
export interface SessionEnd extends CommonEventProperties {
    /** Type of session end (e.g., "completed", "terminated"). */
    type: string;

    /** The final score achieved in the session. */
    score: number;

    /** The maximum possible score in the session. */
    maxScore: number;

    /** The lowest bucket reached in the session. */
    basalBucket: number;

    /** The highest bucket reached in the session. */
    ceilingBucket: number;

    /** The identifier of the next assessment, if applicable. */
    nextAssessment?: string;

    /** The required score for passing, if applicable. */
    requiredScore?: number;
}
