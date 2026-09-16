import { initializeApp } from 'firebase/app';
import { addDoc, collection, Firestore, getFirestore, serverTimestamp } from 'firebase/firestore';
import { AnalyticsConfig } from './base-analytics-integration';
import { firebaseConfig } from './analytics-config';

const FIRESTORE_APP_NAME = 'assessment-survey-firestore';
const COMPLETIONS_COLLECTION = 'assessmentCompletions';

export interface SpellingAssessmentCompletionRecord {
    clUserId: string;
    assessmentType: string;
    lang: string;
    score: number;
    maxScore: number;
    basalBucket: number;
    ceilingBucket: number;
}

export class FirestoreIntegration {
    private static instance: FirestoreIntegration | null;

    private constructor(private readonly firestore: Firestore) { }

    public static initializeFirestore(config: AnalyticsConfig = firebaseConfig): void {
        if (!this.instance) {
            const app = initializeApp(config, FIRESTORE_APP_NAME);
            this.instance = new FirestoreIntegration(getFirestore(app));
        }
    }

    public static getInstance(): FirestoreIntegration {
        if (!this.instance) {
            throw new Error('FirestoreIntegration.initializeFirestore() must be called before accessing the instance');
        }

        return this.instance;
    }

    public writeCompletionRecord(record: SpellingAssessmentCompletionRecord): void {
        addDoc(collection(this.firestore, COMPLETIONS_COLLECTION), {
            ...record,
            completedAt: serverTimestamp(),
        }).catch((error) => {
            console.error('Failed to write Firestore completion record:', error);
        });
    }
}
