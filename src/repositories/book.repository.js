const mongoose = require('mongoose');
const UserInfoModelSchema = require('./book.repository.model');

class BookFlightsRepository {
    constructor(options) {
        let { cosmosdb_name, cosmosdb_key } = options;
        const connectionString = `mongodb://${cosmosdb_name}:${encodeURIComponent(cosmosdb_key)}@${cosmosdb_name}.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@${cosmosdb_name}mongodb://${cosmosdb_name}:${encodeURIComponent(cosmosdb_key)}@${cosmosdb_name}.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@${cosmosdb_name}@`;
        mongoose.connect(connectionString, { useNewUrlParser: true });
        mongoose.Promise = global.Promise;
    }
    async getUserInfo(username) {
        const UserInfoModel = await mongoose.model('UserInfoModel', UserInfoModelSchema);
        const result = await UserInfoModel.findOne({ user: username }).lean().exec();
        return result || { user: username, booked: null, purchased: [] };
    }

    async createOrUpdateUserInfo(userInfo) {
        const UserInfoModel = await mongoose.model('UserInfoModel', UserInfoModelSchema);
        await UserInfoModel.findOneAndUpdate({ user: userInfo.user }, userInfo, { upsert: true });
    }
}

module.exports = BookFlightsRepository;