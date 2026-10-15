<script setup>
import { computed } from 'vue';
import Icon from 'next/icon/Icon.vue';

const { fileType } = defineProps({
  fileType: {
    type: String,
    required: true,
  },
});

const fileTypeIcon = computed(() => {
  const fileIconMap = {
    '7z': 'i-kairos-file-zip',
    csv: 'i-kairos-file-csv',
    doc: 'i-kairos-file-doc',
    docx: 'i-kairos-file-doc',
    json: 'i-kairos-file-txt',
    odt: 'i-kairos-file-doc',
    pdf: 'i-kairos-file-pdf',
    pfx: 'i-kairos-file-pfx',
    ppt: 'i-kairos-file-ppt',
    pptx: 'i-kairos-file-ppt',
    rar: 'i-kairos-file-zip',
    rtf: 'i-kairos-file-doc',
    tar: 'i-kairos-file-zip',
    txt: 'i-kairos-file-txt',
    xls: 'i-kairos-file-xls',
    xlsx: 'i-kairos-file-xls',
    xml: 'i-kairos-file-txt',
    zip: 'i-kairos-file-zip',
  };

  return fileIconMap[fileType] || 'i-teenyicons-text-document-solid';
});
</script>

<template>
  <Icon :icon="fileTypeIcon" />
</template>
