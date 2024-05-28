import {ConnectDB} from '../services/db'

export default defineNitroPlugin(async (nitroApp) => {
  ConnectDB();
})
