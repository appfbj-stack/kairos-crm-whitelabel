import axios from 'axios';

const { apiHost = '' } = window.kairos_crmConfig || {};
const kairosAPI = axios.create({ baseURL: `${apiHost}/` });

export default kairosAPI;
