// Import the utility functions
import { getAppType, getUUID, getUserSource, getDataFile } from '../../src/components/urlUtils';

describe('Utility Function Tests', () => {
  let originalLocation: Location;

  beforeAll(() => {
    // Save the original window.location
    originalLocation = window.location;

    // Mock the location object
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...originalLocation,
        search: '',
      },
    });
  });

  afterAll(() => {
    // Restore the original window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  function mockLocationSearch(queryString: string) {
    window.location.search = queryString;
  }

  describe('getAppType', () => {
    it('should return the appType if present in the URL', () => {
      mockLocationSearch('?appType=exampleApp');
      expect(getAppType()).toBe('exampleApp');
    });

    it('should return undefined if appType is not present in the URL', () => {
      mockLocationSearch('?otherParam=value');
      expect(getAppType()).toBeUndefined();
    });
  });

  describe('getUUID', () => {
    it('should return the cr_user_id if present in the URL', () => {
      mockLocationSearch('?cr_user_id=12345');
      expect(getUUID()).toBe('12345');
    });

    it('should return "WebUserNoID" if cr_user_id is not present in the URL', () => {
      mockLocationSearch('?otherParam=value');
      expect(getUUID()).toBe('WebUserNoID');
    });

    it('should log "no uuid provided" if cr_user_id is missing', () => {
      console.log = jest.fn();
      mockLocationSearch('?otherParam=value');
      getUUID();
      expect(console.log).toHaveBeenCalledWith('no uuid provided');
    });
  });

  describe('getUserSource', () => {
    it('should return the userSource if present in the URL', () => {
      mockLocationSearch('?userSource=external');
      expect(getUserSource()).toBe('external');
    });

    it('should return "WebUserNoSource" if userSource is not present in the URL', () => {
      mockLocationSearch('?otherParam=value');
      expect(getUserSource()).toBe('WebUserNoSource');
    });

    it('should log "no user source provided" if userSource is missing', () => {
      console.log = jest.fn();
      mockLocationSearch('?otherParam=value');
      getUserSource();
      expect(console.log).toHaveBeenCalledWith('no user source provided');
    });
  });

  describe('getDataFile', () => {
    it('should return the data file if "data" is present in the URL', () => {
      mockLocationSearch('?data=custom-data-file');
      expect(getDataFile()).toBe('custom-data-file');
    });

    it('should return "zulu-lettersounds" if "data" is not present in the URL', () => {
      mockLocationSearch('?otherParam=value');
      expect(getDataFile()).toBe('zulu-lettersounds');
    });

    it('should log "default data file" if "data" is missing', () => {
      console.log = jest.fn();
      mockLocationSearch('?otherParam=value');
      getDataFile();
      expect(console.log).toHaveBeenCalledWith('default data file');
    });
  });
});
