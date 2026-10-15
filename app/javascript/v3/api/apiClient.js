import axios from 'axios';

const { apiHost = '' } = window.kairos-crmConfig || {};
const kairosAPI = axios.create({ baseURL: `${apiHost}/` });

export default kairosAPI;
