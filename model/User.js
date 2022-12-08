const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
}, {
    collection: 'Users'
});

let User = null;

try {
    User = mongoose.model('users');
} catch (error) {
    User = mongoose.model('users', userSchema);
}

const {
    tryCatchHandler
} = require('../helpers/error-handler');

const DbAddUser = tryCatchHandler(async (body) => {
    const user = new User(body);
    return await user.save();
});

const DbFindUser = tryCatchHandler(async (body) => {

    let {
        multiple,
        query,
        project,
        sort,
        limit,
        skip
    } = body;

    multiple = multiple || false;
    query = query || {};
    project = project || {};
    sort = sort || {};
    limit = limit || 0;
    skip = skip || 0;

    let records = [];

    if (multiple) {
        records = (project?.role) ? await User.find(query, project).sort(sort).skip(skip).limit(limit).populate('role', '_id name').lean() : await User.find(query, project).sort(sort).skip(skip).limit(limit).lean();
    } else {
        records = (project?.role) ? await User.findOne(query, project).populate('role', '_id name').lean() : await User.findOne(query, project).lean();
    }

    return records;
});

const DbUpdateUser = tryCatchHandler(async (body) => {

    const {
        query,
        update,
        option,
        multiple
    } = body;


    let res = {};
    if (multiple) {
        res = await User.updateMany(query, update, option);
    } else {
        res = await User.updateOne(query, update, option);
    }

   return res
});

const DbCountUser = tryCatchHandler(async (body) => {

    const {
        query,
    } = body;

    const res = await User.count(query).lean();

    return res;
});



module.exports = {
    DbAddUser,
    DbCountUser,
    DbFindUser,
    DbUpdateUser,
    User
};