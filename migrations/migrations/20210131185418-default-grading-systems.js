'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

const primaryKey = () => ({
  type: 'int',
  primaryKey: true,
  autoIncrement: true,
  notNull: true
});

const foreignKey = (
  childTableName,
  parentTableName,
  parentFieldName,
  onDelete = 'CASCADE',
  onUpdate = 'CASCADE',
  notNull = true
) => ({
  type: 'int',
  unsigned: true,
  notNull,
  foreignKey: {
    name: `${childTableName}_${parentTableName}_${parentFieldName}_fk`,
    table: parentTableName,
    mapping: parentFieldName,
    rules: {
      onDelete,
      onUpdate,
    },
  },
});

exports.up = function(db) {
  return db.createTable('route_type_default_grading_system', {
    id: primaryKey(),
    route_type_id: foreignKey('route_type_default_grading_system', 'route_types', 'id'),
    grading_system_id: foreignKey('route_type_default_grading_system', 'grading_systems', 'id')
  });
};

exports.down = function(db) {
  return db.dropTable('route_type_default_grading_system');
};

exports._meta = {
  "version": 1
};
