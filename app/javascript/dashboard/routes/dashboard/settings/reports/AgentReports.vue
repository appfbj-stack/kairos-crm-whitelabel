<script setup>
import KairosReports from './components/KairosReports.vue';
</script>

<template>
  <KairosReports
    key="agent-reports"
    type="agent"
    getter-key="agents/getAgents"
    action-key="agents/get"
    :download-button-label="$t('REPORT.DOWNLOAD_AGENT_REPORTS')"
    :report-title="$t('AGENT_REPORTS.HEADER')"
  />
</template>
