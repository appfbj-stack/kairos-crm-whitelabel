import { parseBoolean } from '@chatwoot/utils';
import { resolveMaximumFileUploadSize } from 'shared/helpers/FileHelper';

const {
  API_CHANNEL_NAME: apiChannelName,
  API_CHANNEL_THUMBNAIL: apiChannelThumbnail,
  APP_VERSION: appVersion,
  AZURE_APP_ID: azureAppId,
  BRAND_NAME: brandName,
  KAIROS_CRM_INBOX_TOKEN: kairos_crmInboxToken,
  CREATE_NEW_ACCOUNT_FROM_DASHBOARD: createNewAccountFromDashboard,
  DIRECT_UPLOADS_ENABLED: directUploadsEnabled,
  DISPLAY_MANIFEST: displayManifest,
  GIT_SHA: gitSha,
  MAXIMUM_FILE_UPLOAD_SIZE: maximumFileUploadSize,
  HCAPTCHA_SITE_KEY: hCaptchaSiteKey,
  INSTALLATION_NAME: installationName,
  LOGO_THUMBNAIL: logoThumbnail,
  LOGO: logo,
  LOGO_DARK: logoDark,
  PRIVACY_URL: privacyURL,
  IS_ENTERPRISE: isEnterprise,
  TERMS_URL: termsURL,
  WIDGET_BRAND_URL: widgetBrandURL,
  DISABLE_USER_PROFILE_UPDATE: disableUserProfileUpdate,
  DISABLE_META_INBOX_CREATION: disableMetaInboxCreation,
  DISABLE_META_MESSAGE_SENDING: disableMetaMessageSending,
  DEPLOYMENT_ENV: deploymentEnv,
  ACTIVE_PLATFORM_BANNERS: activePlatformBanners,
} = window.globalConfig || {};

const state = {
  apiChannelName,
  apiChannelThumbnail,
  appVersion,
  azureAppId,
  brandName,
  kairos_crmInboxToken,
  deploymentEnv,
  createNewAccountFromDashboard,
  directUploadsEnabled: parseBoolean(directUploadsEnabled),
  disableUserProfileUpdate: parseBoolean(disableUserProfileUpdate),
  disableMetaInboxCreation: parseBoolean(disableMetaInboxCreation),
  disableMetaMessageSending: parseBoolean(disableMetaMessageSending),
  displayManifest,
  gitSha,
  maximumFileUploadSize: resolveMaximumFileUploadSize(maximumFileUploadSize),
  hCaptchaSiteKey,
  installationName,
  logo,
  logoDark,
  logoThumbnail,
  privacyURL,
  termsURL,
  widgetBrandURL,
  isEnterprise: parseBoolean(isEnterprise),
  activePlatformBanners: activePlatformBanners || [],
};

export const getters = {
  get: $state => $state,
  isOnKairosCrmCloud: $state => $state.deploymentEnv === 'cloud',
  isMetaInboxCreationDisabled: $state =>
    $state.deploymentEnv === 'cloud' && $state.disableMetaInboxCreation,
  isMetaMessageSendingDisabled: $state =>
    $state.deploymentEnv === 'cloud' && $state.disableMetaMessageSending,
  isACustomBrandedInstance: $state => $state.installationName !== 'Kairos CRM',
  isAKairosCrmInstance: $state => $state.installationName === 'Kairos CRM',
};

export const actions = {};

export const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
