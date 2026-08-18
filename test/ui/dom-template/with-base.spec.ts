// Feature: the configured base path drives generated asset paths via withBase.
import { withBase } from '@ui/dom-template';

describe('Feature: base path drives generated asset paths (withBase)', () => {
  describe('Scenario: app served from a sub-path (test)', () => {
    it('Given base /assessment-survey-js/assets, When an asset path is generated, Then it is prefixed', () => {
      expect(withBase('/assessment-survey-js/assets', 'img/loadingImg.gif')).toBe(
        '/assessment-survey-js/assets/img/loadingImg.gif'
      );
    });

    it('Given a leading slash on the asset path, When generated, Then it joins with a single separator', () => {
      expect(withBase('/assessment-survey-js/assets', '/img/x.png')).toBe('/assessment-survey-js/assets/img/x.png');
    });

    it('Given a base with a trailing slash, When generated, Then the trailing slash is normalized away', () => {
      expect(withBase('/assessment-survey-js/assets/', 'img/x.png')).toBe('/assessment-survey-js/assets/img/x.png');
    });
  });

  describe('Scenario: empty base path (dev/prod) keeps current behavior', () => {
    it('Given an empty base and root-relative paths, When generated, Then the path is root-relative', () => {
      expect(withBase('', 'assets/img/x.png', true)).toBe('/assets/img/x.png');
    });

    it('Given an empty base and document-relative paths, When generated, Then the path has no leading slash', () => {
      expect(withBase('', 'assets/img/x.png', false)).toBe('assets/img/x.png');
    });
  });
});
