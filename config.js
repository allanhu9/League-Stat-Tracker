const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    port: process.env.PORT,
    apiKey: process.env.API_KEY,
    apiBasicInfoByName: process.env.API_URL_BYNAME,
    apiRankedInfoById: process.env.API_URL_RANKED_BYID,
    apiMatchesByPuuid: process.env.API_URL_MATCHES_BYPUUID,
    apiMatchDataByMatchId: process.env.API_URL_MATCHDATA_BYMATCHID
};
