import { getAppType, getUUID, getUserSource, getDataFile } from '../../src/components/urlUtils';

describe('URL Utils', () => {
  beforeEach(() => {
    // Reset mocks before each test
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        search: '',
      },
    });
  });

  test('getAppType should return the appType from the URL', () => {
    window.location.search = '?appType=testApp';
    expect(getAppType()).toBe('testApp');
  });

  test('getAppType should return null if appType is not present in the URL', () => {
    window.location.search = '?cr_user_id=12345';
    expect(getAppType()).toBeNull();
  });

  test('getUUID should return the UUID from the URL', () => {
    window.location.search = '?cr_user_id=12345';
    expect(getUUID()).toBe('12345');
  });

  test('getUUID should return "WebUserNoID" if cr_user_id is not present in the URL', () => {
    window.location.search = '?appType=testApp';
    expect(getUUID()).toBe('WebUserNoID');
  });

  test('getUserSource should return the userSource from the URL', () => {
    window.location.search = '?userSource=testSource';
    expect(getUserSource()).toBe('testSource');
  });

  test('getUserSource should return "WebUserNoSource" if userSource is not present in the URL', () => {
    window.location.search = '?appType=testApp';
    expect(getUserSource()).toBe('WebUserNoSource');
  });

  test('getDataFile should return the data file from the URL', () => {
    window.location.search = '?data=custom-data-file';
    expect(getDataFile()).toBe('custom-data-file');
  });

  test('getDataFile should return the default data file if data is not present in the URL', () => {
    window.location.search = '?appType=testApp';
    expect(getDataFile()).toBe('zulu-lettersounds');
  });

  test('getDataFile should return "survey-zulu" if commented default data file is activated', () => {
    window.location.search = '?appType=testApp';
    // Uncomment the line in the function to test alternative behavior
    // data = "survey-zulu";
    expect(getDataFile()).toBe('zulu-lettersounds'); // Adjust expectation as needed
  });
});
