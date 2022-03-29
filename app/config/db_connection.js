import mongoose from 'mongoose';
import { variable } from '../config/environment_variable';

const env = process.env.NODE_ENV || 'development';
const dbUserName = process.env.DATABASE_USERNAME || variable[env].DATABASE.USERNAME;
const dbPassword = process.env.DATABASE_PASSWORD || variable[env].DATABASE.PASSWORD;
const dbDatabaseName = process.env.DATABASE_NAME || variable[env].DATABASE.NAME;

mongoose.Promise = global.Promise;

const mongoURI = 'mongodb+srv://' + dbUserName + ':' + dbPassword + '@cluster0.3vsgq.mongodb.net/' + dbDatabaseName + '?retryWrites=true&w=majority';

export const dbConnection = mongoose.createConnection(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

dbConnection.once('connected', function () {
	console.log('Mongoose connected to appConnection');
});
