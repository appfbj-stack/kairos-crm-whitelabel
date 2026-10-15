<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAlert } from 'dashboard/composables';
import { stripInlineBase64Images } from 'dashboard/helper/editorHelper';
import KairosMessageEditor from 'dashboard/components/widgets/KairosWriter/Editor.vue';
import NextButton from 'dashboard/components-next/button/Button.vue';

const props = defineProps({
  messageSignature: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['updateSignature']);

const { t } = useI18n();
const signature = ref(props.messageSignature ?? '');
watch(
  () => props.messageSignature ?? '',
  newValue => {
    signature.value = newValue;
  }
);

const updateSignature = () => {
  const { sanitizedContent, hasInlineImages } = stripInlineBase64Images(
    signature.value || ''
  );
  signature.value = sanitizedContent.trim();
  if (hasInlineImages) {
    useAlert(
      t('PROFILE_SETTINGS.FORM.MESSAGE_SIGNATURE_SECTION.INLINE_IMAGE_WARNING')
    );
  }
  emit('updateSignature', signature.value);
};
</script>

<template>
  <form class="flex flex-col gap-6" @submit.prevent="updateSignature()">
    <KairosMessageEditor
      id="message-signature-input"
      v-model="signature"
      class="message-editor h-[10rem] !px-3"
      is-format-mode
      :placeholder="$t('PROFILE_SETTINGS.FORM.MESSAGE_SIGNATURE.PLACEHOLDER')"
      channel-type="Context::MessageSignature"
      :enable-suggestions="false"
    />
    <div>
      <NextButton
        type="submit"
        :label="$t('PROFILE_SETTINGS.FORM.MESSAGE_SIGNATURE_SECTION.BTN_TEXT')"
      />
    </div>
  </form>
</template>
