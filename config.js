const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    port: process.env.PORT,
    apiKey: process.env.API_KEY,
    apiBasicInfoByName: process.env.API_URL_BYNAME,
    apiRankedInfoById: process.env.API_URL_RANKED_BYID
};
