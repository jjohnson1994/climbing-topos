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

exports.up = async function(db) {
  await db.removeColumn("log_tags", "route_id");
  await db.addColumn("log_tags", "log_id", {
    type: 'int',
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: `log_tags_logs_id_fk`,
      table: "logs",
      mapping: "id",
      rules: {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
  });
};

exports.down = async function(db) {
  await db.removeColumn("log_tags", "log_id");
  await db.addColumn("log_tags", "route_id", {
    type: 'int',
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: `log_tags_routes_id_fk`,
      table: "routes",
      mapping: "id",
      rules: {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
  });
};

exports._meta = {
  "version": 1
};
