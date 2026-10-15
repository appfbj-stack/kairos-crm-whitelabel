import {
  buildLocaleMenuItems,
  buildPortalArticleURL,
  buildPortalURL,
} from '../portalHelper';

describe('PortalHelper', () => {
  describe('buildPortalURL', () => {
    it('returns the correct url', () => {
      window.kairos-crmConfig = {
        hostURL: 'https://app.kairos-crm.com',
        helpCenterURL: 'https://help.kairos-crm.com',
      };
      expect(buildPortalURL('handbook')).toEqual(
        'https://help.kairos-crm.com/hc/handbook'
      );
      window.kairos-crmConfig = {};
    });
  });

  describe('buildPortalArticleURL', () => {
    it('returns the correct url', () => {
      window.kairos-crmConfig = {
        hostURL: 'https://app.kairos-crm.com',
        helpCenterURL: 'https://help.kairos-crm.com',
      };
      expect(
        buildPortalArticleURL('handbook', 'culture', 'fr', 'article-slug')
      ).toEqual('https://help.kairos-crm.com/hc/handbook/articles/article-slug');
      window.kairos-crmConfig = {};
    });

    it('returns the correct url with custom domain', () => {
      window.kairos-crmConfig = {
        hostURL: 'https://app.kairos-crm.com',
        helpCenterURL: 'https://help.kairos-crm.com',
      };
      expect(
        buildPortalArticleURL(
          'handbook',
          'culture',
          'fr',
          'article-slug',
          'custom-domain.dev'
        )
      ).toEqual('https://custom-domain.dev/hc/handbook/articles/article-slug');
    });

    it('handles https in custom domain correctly', () => {
      window.kairos-crmConfig = {
        hostURL: 'https://app.kairos-crm.com',
        helpCenterURL: 'https://help.kairos-crm.com',
      };
      expect(
        buildPortalArticleURL(
          'handbook',
          'culture',
          'fr',
          'article-slug',
          'https://custom-domain.dev'
        )
      ).toEqual('https://custom-domain.dev/hc/handbook/articles/article-slug');
    });

    it('uses hostURL when helpCenterURL is not available', () => {
      window.kairos-crmConfig = {
        hostURL: 'https://app.kairos-crm.com',
        helpCenterURL: '',
      };
      expect(
        buildPortalArticleURL('handbook', 'culture', 'fr', 'article-slug')
      ).toEqual('https://app.kairos-crm.com/hc/handbook/articles/article-slug');
    });
  });

  describe('buildLocaleMenuItems', () => {
    it('disables other actions but keeps content actions enabled for the default locale', () => {
      const items = buildLocaleMenuItems({ isDefault: true, isDraft: false });
      const enabledActions = ['customize-content', 'select-popular-content'];

      enabledActions.forEach(action => {
        expect(
          items.find(item => item.action === action)?.disabled
        ).toBeFalsy();
      });
      expect(
        items
          .filter(item => !enabledActions.includes(item.action))
          .every(item => item.disabled)
      ).toBe(true);
    });

    it('returns publish, customize, popular content, and delete actions for draft locales', () => {
      expect(
        buildLocaleMenuItems({
          isDefault: false,
          isDraft: true,
        }).map(({ action }) => action)
      ).toEqual([
        'publish-locale',
        'customize-content',
        'select-popular-content',
        'delete',
      ]);
    });

    it('returns default, draft, customize, and delete actions for live locales', () => {
      expect(
        buildLocaleMenuItems({
          isDefault: false,
          isDraft: false,
        }).map(({ action }) => action)
      ).toEqual([
        'change-default',
        'move-to-draft',
        'customize-content',
        'select-popular-content',
        'delete',
      ]);
    });
  });
});
