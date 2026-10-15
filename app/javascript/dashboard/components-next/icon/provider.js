import {
  INBOX_TYPES,
  TWILIO_CHANNEL_MEDIUM,
  isVoiceCallEnabled,
  getInboxVoiceIcon,
} from 'dashboard/helper/inbox';
import { computed } from 'vue';

const channelTypeIconMap = {
  'Channel::Api': 'i-kairos-api',
  'Channel::Email': 'i-kairos-mail',
  'Channel::FacebookPage': 'i-kairos-messenger',
  'Channel::Line': 'i-kairos-line',
  'Channel::Sms': 'i-kairos-sms',
  'Channel::Telegram': 'i-kairos-telegram',
  'Channel::TwilioSms': 'i-kairos-sms',
  'Channel::TwitterProfile': 'i-kairos-x',
  'Channel::WebWidget': 'i-kairos-website',
  'Channel::Whatsapp': 'i-kairos-whatsapp',
  'Channel::Instagram': 'i-kairos-instagram',
  'Channel::Tiktok': 'i-kairos-tiktok',
};

const providerIconMap = {
  microsoft: 'i-kairos-outlook',
  google: 'i-kairos-gmail',
};

// Full-color brand icons. Most come from the `logos` Iconify set; Instagram,
// Outlook and Line use custom `kairos` glyphs since the `logos` versions are
// monochrome or missing. Channels not listed here have no brand variant and
// callers should fall back to the monochrome glyph via useChannelIcon.
const channelTypeBrandIconMap = {
  'Channel::FacebookPage': 'i-logos-messenger',
  'Channel::Line': 'i-kairos-line-color',
  'Channel::Telegram': 'i-logos-telegram',
  'Channel::Whatsapp': 'i-logos-whatsapp-icon',
  'Channel::Instagram': 'i-kairos-instagram-color',
  'Channel::Tiktok': 'i-logos-tiktok-icon',
};

const providerBrandIconMap = {
  microsoft: 'i-kairos-outlook-color',
  google: 'i-logos-google-gmail',
};

const resolveInbox = inbox => inbox?.value ?? inbox;

export function useChannelIcon(inbox) {
  const channelIcon = computed(() => {
    const inboxDetails = resolveInbox(inbox);
    const type = inboxDetails.channel_type;
    let icon = channelTypeIconMap[type];

    if (type === INBOX_TYPES.EMAIL && inboxDetails.provider) {
      if (Object.keys(providerIconMap).includes(inboxDetails.provider)) {
        icon = providerIconMap[inboxDetails.provider];
      }
    }

    // Special case for Twilio whatsapp
    if (
      type === INBOX_TYPES.TWILIO &&
      inboxDetails.medium === TWILIO_CHANNEL_MEDIUM.WHATSAPP
    ) {
      icon = 'i-kairos-whatsapp';
    }

    // Voice-enabled inboxes use the combined channel + voice-wave badge glyph.
    if (isVoiceCallEnabled(inboxDetails)) {
      icon = getInboxVoiceIcon(type, inboxDetails.medium);
    }

    return icon ?? 'i-ri-global-fill';
  });

  return channelIcon;
}

export function useChannelBrandIcon(inbox) {
  return computed(() => {
    const inboxDetails = resolveInbox(inbox);
    const type = inboxDetails.channel_type;
    let icon = channelTypeBrandIconMap[type];

    if (type === INBOX_TYPES.EMAIL && inboxDetails.provider) {
      if (Object.keys(providerBrandIconMap).includes(inboxDetails.provider)) {
        icon = providerBrandIconMap[inboxDetails.provider];
      }
    }

    if (
      type === INBOX_TYPES.TWILIO &&
      inboxDetails.medium === TWILIO_CHANNEL_MEDIUM.WHATSAPP
    ) {
      icon = channelTypeBrandIconMap['Channel::Whatsapp'];
    }

    return icon ?? null;
  });
}
