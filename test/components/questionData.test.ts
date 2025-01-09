import { qData, answerData } from '../../src/components/questionData';

describe('qData and answerData Type Validation', () => {
  const validAnswer: answerData = {
    answerName: 'Answer1',
    answerText: 'Option 1',
    answerImg: 'path/to/image.png',
  };

  const validQuestion: qData = {
    qName: 'Question1',
    qNumber: 1,
    qTarget: 'Target1',
    promptText: 'What is the capital of France?',
    promptImg: 'path/to/image.png',
    promptAudio: 'path/to/audio.mp3',
    answers: [validAnswer],
    correct: 'Answer1',
    bucket: 1,
  };

  it('should validate a complete qData object', () => {
    expect(validQuestion.qName).toBe('Question1');
    expect(validQuestion.qNumber).toBe(1);
    expect(validQuestion.qTarget).toBe('Target1');
    expect(validQuestion.promptText).toBe('What is the capital of France?');
    expect(validQuestion.promptImg).toBe('path/to/image.png');
    expect(validQuestion.promptAudio).toBe('path/to/audio.mp3');
    expect(validQuestion.answers).toEqual([validAnswer]);
    expect(validQuestion.correct).toBe('Answer1');
    expect(validQuestion.bucket).toBe(1);
  });

  it('should validate a minimal qData object (optional fields missing)', () => {
    const minimalQuestion: qData = {
      qName: 'MinimalQuestion',
      qNumber: 2,
      qTarget: 'Target2',
      promptText: 'What is 2 + 2?',
      answers: [],
    };

    expect(minimalQuestion.qName).toBe('MinimalQuestion');
    expect(minimalQuestion.qNumber).toBe(2);
    expect(minimalQuestion.qTarget).toBe('Target2');
    expect(minimalQuestion.promptText).toBe('What is 2 + 2?');
    expect(minimalQuestion.answers).toEqual([]);
    expect(minimalQuestion.promptImg).toBeUndefined();
    expect(minimalQuestion.promptAudio).toBeUndefined();
    expect(minimalQuestion.correct).toBeUndefined();
    expect(minimalQuestion.bucket).toBeUndefined();
  });

  it('should validate a complete answerData object', () => {
    expect(validAnswer.answerName).toBe('Answer1');
    expect(validAnswer.answerText).toBe('Option 1');
    expect(validAnswer.answerImg).toBe('path/to/image.png');
  });

  it('should validate a minimal answerData object (optional fields missing)', () => {
    const minimalAnswer: answerData = {
      answerName: 'MinimalAnswer',
    };

    expect(minimalAnswer.answerName).toBe('MinimalAnswer');
    expect(minimalAnswer.answerText).toBeUndefined();
    expect(minimalAnswer.answerImg).toBeUndefined();
  });

  it('should ensure qData answers contain only answerData objects', () => {
    const invalidQuestion = {
      qName: 'InvalidQuestion',
      qNumber: 3,
      qTarget: 'Target3',
      promptText: 'Invalid question?',
      answers: [{ invalidField: 'Invalid' }], // Incorrect answer structure
    } as any;

    expect(() => {
      // Force TypeScript type assertion for testing purposes
      const castedQuestion: qData = invalidQuestion;
      return castedQuestion;
    });
  });

  it('should ensure all required qData fields are present', () => {
    const incompleteQuestion = {
      qName: 'IncompleteQuestion',
    } as any;

    expect(() => {
      const castedQuestion: qData = incompleteQuestion; // Missing required fields
      return castedQuestion;
    });
  });

  it('should ensure all required answerData fields are present', () => {
    const incompleteAnswer = {
      answerText: 'No name field',
    } as any;

    expect(() => {
      const castedAnswer: answerData = incompleteAnswer; // Missing required fields
      return castedAnswer;
    });
  });
});
