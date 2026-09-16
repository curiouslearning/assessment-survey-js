import { FirestoreIntegration } from '../../src/analytics/firestore-integration';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({ name: 'mock-app' })),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({ name: 'mock-firestore' })),
  collection: jest.fn(() => ({ path: 'assessmentCompletions' })),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 'mock-server-timestamp'),
}));

describe('FirestoreIntegration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (FirestoreIntegration as any).instance = null;
  });

  const record = {
    clUserId: 'user-1',
    assessmentType: 'spelling',
    lang: 'hausa',
    score: 80,
    maxScore: 100,
    basalBucket: 1,
    ceilingBucket: 3,
  };

  it('given initializeFirestore has not been called, when getInstance is invoked, then it throws synchronously', () => {
    expect(() => FirestoreIntegration.getInstance()).toThrow(
      'FirestoreIntegration.initializeFirestore() must be called before accessing the instance'
    );
  });

  it('given initializeFirestore is called, when getInstance is invoked, then it returns a singleton backed by a dedicated, named Firebase App', () => {
    FirestoreIntegration.initializeFirestore();

    expect(initializeApp).toHaveBeenCalledTimes(1);
    expect(initializeApp).toHaveBeenCalledWith(expect.any(Object), 'assessment-survey-firestore');
    expect(getFirestore).toHaveBeenCalledTimes(1);
    expect(FirestoreIntegration.getInstance()).toBeInstanceOf(FirestoreIntegration);
  });

  it('given initializeFirestore is called more than once, when getInstance is invoked, then only one Firebase App/Firestore client is created', () => {
    FirestoreIntegration.initializeFirestore();
    FirestoreIntegration.initializeFirestore();

    expect(initializeApp).toHaveBeenCalledTimes(1);
    expect(getFirestore).toHaveBeenCalledTimes(1);
  });

  it('given a completion record, when writeCompletionRecord is called, then it writes exactly one document to the assessmentCompletions collection with a server-generated completedAt', () => {
    (addDoc as jest.Mock).mockResolvedValue({ id: 'doc-1' });
    FirestoreIntegration.initializeFirestore();
    const instance = FirestoreIntegration.getInstance();

    instance.writeCompletionRecord(record);

    expect(collection).toHaveBeenCalledWith({ name: 'mock-firestore' }, 'assessmentCompletions');
    expect(addDoc).toHaveBeenCalledWith(
      { path: 'assessmentCompletions' },
      { ...record, completedAt: 'mock-server-timestamp' }
    );
  });

  it('given the underlying Firestore write fails, when writeCompletionRecord is called, then it does not throw and only logs the failure', async () => {
    const failure = new Error('network error');
    (addDoc as jest.Mock).mockRejectedValue(failure);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    FirestoreIntegration.initializeFirestore();
    const instance = FirestoreIntegration.getInstance();

    expect(() => instance.writeCompletionRecord(record)).not.toThrow();

    // Flush the rejected promise's microtask queue before asserting the catch ran.
    await Promise.resolve().then().then();

    expect(errorSpy).toHaveBeenCalledWith('Failed to write Firestore completion record:', failure);
  });
});
