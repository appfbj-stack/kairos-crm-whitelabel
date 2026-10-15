import Cookies from 'js-cookie';
import { IFrameHelper } from '../sdk/IFrameHelper';
import {
  getBubbleView,
  getDarkMode,
  getWidgetStyle,
} from '../sdk/settingsHelper';
import {
  computeHashForUserData,
  getUserCookieName,
  hasUserKeys,
} from '../sdk/cookieHelpers';
import {
  addClasses,
  removeClasses,
  restoreWidgetInDOM,
} from '../sdk/DOMHelpers';
import { setCookieWithDomain } from '../sdk/cookieHelpers';
import { SDK_SET_BUBBLE_VISIBILITY } from 'shared/constants/sharedFrameEvents';

const runSDK = ({ baseUrl, websiteToken }) => {
  if (window.$kairos-crm) {
    return;
  }

  // if this is a Rails Turbo app
  document.addEventListener('turbo:before-render', event => {
    // when morphing the page, this typically happens on reload like events
    // say you update a "Customer" on a form and it reloads the page
    // We have already added data-turbo-permananent to true. This
    // will ensure that the widget it preserved
    // Read more about morphing here: https://turbo.hotwired.dev/handbook/page_refreshes#morphing
    // and peristing elements here: https://turbo.hotwired.dev/handbook/building#persisting-elements-across-page-loads
    if (event.detail.renderMethod === 'morph') return;

    restoreWidgetInDOM(event.detail.newBody);
  });

  if (window.Turbolinks) {
    document.addEventListener('turbolinks:before-render', event => {
      restoreWidgetInDOM(event.data.newBody);
    });
  }

  // if this is an astro app
  document.addEventListener('astro:before-swap', event =>
    restoreWidgetInDOM(event.newDocument.body)
  );

  const kairos-crmSettings = window.kairos-crmSettings || {};
  let locale = kairos-crmSettings.locale;
  let baseDomain = kairos-crmSettings.baseDomain;

  if (kairos-crmSettings.useBrowserLanguage) {
    locale = window.navigator.language.replace('-', '_');
  }

  window.$kairos-crm = {
    baseUrl,
    baseDomain,
    hasLoaded: false,
    hideMessageBubble: kairos-crmSettings.hideMessageBubble || false,
    isOpen: false,
    position: kairos-crmSettings.position === 'left' ? 'left' : 'right',
    websiteToken,
    locale,
    useBrowserLanguage: kairos-crmSettings.useBrowserLanguage || false,
    type: getBubbleView(kairos-crmSettings.type),
    launcherTitle: kairos-crmSettings.launcherTitle || '',
    showPopoutButton: kairos-crmSettings.showPopoutButton || false,
    showUnreadMessagesDialog: kairos-crmSettings.showUnreadMessagesDialog ?? true,
    widgetStyle: getWidgetStyle(kairos-crmSettings.widgetStyle) || 'standard',
    resetTriggered: false,
    darkMode: getDarkMode(kairos-crmSettings.darkMode),
    welcomeTitle: kairos-crmSettings.welcomeTitle || '',
    welcomeDescription: kairos-crmSettings.welcomeDescription || '',
    availableMessage: kairos-crmSettings.availableMessage || '',
    unavailableMessage: kairos-crmSettings.unavailableMessage || '',
    enableFileUpload: kairos-crmSettings.enableFileUpload,
    enableEmojiPicker: kairos-crmSettings.enableEmojiPicker ?? true,
    enableEndConversation: kairos-crmSettings.enableEndConversation ?? true,

    toggle(state) {
      IFrameHelper.events.toggleBubble(state);
    },

    toggleBubbleVisibility(visibility) {
      let widgetElm = document.querySelector('.kairos--bubble-holder');
      let widgetHolder = document.querySelector('.kairos-widget-holder');
      if (visibility === 'hide') {
        addClasses(widgetHolder, 'kairos-widget--without-bubble');
        addClasses(widgetElm, 'kairos-hidden');
        window.$kairos-crm.hideMessageBubble = true;
      } else if (visibility === 'show') {
        removeClasses(widgetElm, 'kairos-hidden');
        removeClasses(widgetHolder, 'kairos-widget--without-bubble');
        window.$kairos-crm.hideMessageBubble = false;
      }
      IFrameHelper.sendMessage(SDK_SET_BUBBLE_VISIBILITY, {
        hideMessageBubble: window.$kairos-crm.hideMessageBubble,
      });
    },

    popoutChatWindow() {
      IFrameHelper.events.popoutChatWindow({
        baseUrl: window.$kairos-crm.baseUrl,
        websiteToken: window.$kairos-crm.websiteToken,
        locale,
      });
    },

    setUser(identifier, user) {
      if (typeof identifier !== 'string' && typeof identifier !== 'number') {
        throw new Error('Identifier should be a string or a number');
      }

      if (!hasUserKeys(user)) {
        throw new Error(
          'User object should have one of the keys [avatar_url, email, name]'
        );
      }

      const userCookieName = getUserCookieName();
      const existingCookieValue = Cookies.get(userCookieName);
      const hashToBeStored = computeHashForUserData({ identifier, user });
      if (hashToBeStored === existingCookieValue) {
        return;
      }

      window.$kairos-crm.identifier = identifier;
      window.$kairos-crm.user = user;
      IFrameHelper.sendMessage('set-user', { identifier, user });

      setCookieWithDomain(userCookieName, hashToBeStored, {
        baseDomain,
      });
    },

    setCustomAttributes(customAttributes = {}) {
      if (!customAttributes || !Object.keys(customAttributes).length) {
        throw new Error('Custom attributes should have atleast one key');
      } else {
        IFrameHelper.sendMessage('set-custom-attributes', { customAttributes });
      }
    },

    deleteCustomAttribute(customAttribute = '') {
      if (!customAttribute) {
        throw new Error('Custom attribute is required');
      } else {
        IFrameHelper.sendMessage('delete-custom-attribute', {
          customAttribute,
        });
      }
    },

    setConversationCustomAttributes(customAttributes = {}) {
      if (!customAttributes || !Object.keys(customAttributes).length) {
        throw new Error('Custom attributes should have atleast one key');
      } else {
        IFrameHelper.sendMessage('set-conversation-custom-attributes', {
          customAttributes,
        });
      }
    },

    deleteConversationCustomAttribute(customAttribute = '') {
      if (!customAttribute) {
        throw new Error('Custom attribute is required');
      } else {
        IFrameHelper.sendMessage('delete-conversation-custom-attribute', {
          customAttribute,
        });
      }
    },

    setLabel(label = '') {
      IFrameHelper.sendMessage('set-label', { label });
    },

    removeLabel(label = '') {
      IFrameHelper.sendMessage('remove-label', { label });
    },

    setLocale(localeToBeUsed = 'en') {
      IFrameHelper.sendMessage('set-locale', { locale: localeToBeUsed });
    },

    setColorScheme(darkMode = 'light') {
      IFrameHelper.sendMessage('set-color-scheme', {
        darkMode: getDarkMode(darkMode),
      });
    },

    reset() {
      if (window.$kairos-crm.isOpen) {
        IFrameHelper.events.toggleBubble();
      }

      Cookies.remove('cw_conversation');
      Cookies.remove(getUserCookieName());

      const iframe = IFrameHelper.getAppFrame();
      iframe.src = IFrameHelper.getUrl({
        baseUrl: window.$kairos-crm.baseUrl,
        websiteToken: window.$kairos-crm.websiteToken,
      });

      window.$kairos-crm.resetTriggered = true;
    },
  };

  IFrameHelper.createFrame({
    baseUrl,
    websiteToken,
  });
};

window.kairos-crmSDK = {
  run: runSDK,
};
