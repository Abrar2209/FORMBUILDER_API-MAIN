import { Sequelize, DataTypes } from 'sequelize';
import FormModel from './models/formModel.js';
import SubmissionModel from './models/SubmissionModel.js';

const sequelize = new Sequelize(
  'formdb',
  'root',
  '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,

    pool: {
      max: 2,
      min: 1,
      acquire: 30000,
      idle: 10000
    }
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('formdb connected..');
  })
  .catch(err => {
    console.log('Error' + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.forms = FormModel(sequelize, DataTypes);
db.submissions = SubmissionModel(sequelize, DataTypes);

db.sequelize.sync({ force: false })
  .then(() => {
    console.log('yes re-sync done!');
  });

export default db;
