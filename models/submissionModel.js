export default (sequelize, DataTypes) => {
    const Submission = sequelize.define("submission", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      formtitle: {
        type: DataTypes.STRING,
      },
      fields: {
        type: DataTypes.JSON,
      },
      customerID: {
        type: DataTypes.STRING,
      },
      customerIpAdd: {
        type: DataTypes.STRING,
      },
      pageUrl: {
        type: DataTypes.STRING,
      },
    });
  
    return Submission;
  };
  