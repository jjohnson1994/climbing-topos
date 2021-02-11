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
  return new Promise(async res => {
    await db.createTable('crag_tags', {
      id: primaryKey(),
      title: {
        type: 'text',
        notNull: true,
        unique: true
      }
    });

    await db.createTable('area_tags', {
      id: primaryKey(),
      title: {
        type: 'text',
        notNull: true,
        unique: true
      }
    });

    await db.createTable('route_tags', {
      id: primaryKey(),
      title: {
        type: 'text',
        notNull: true,
        unique: true
      }
    });

    await db.createTable('orientations', {
      id: primaryKey(),
      title: {
        type: 'text',
        notNull: true,
        unique: true
      }
    });

    await db.createTable('grading_systems', {
      id: primaryKey(),
      title: {
        type: 'text',
        notNull: true,
        unique: true
      },
      grades: {
        type: 'jsonb',
        notNull: true
      }
    });

    await db.createTable('route_types', {
      id: primaryKey(),
      title: {
        type: 'text',
        notNull: true,
        unique: true
      }
    });

    await db.createTable('rock_types', {
      id: primaryKey(),
      title: {
        type: 'text',
        notNull: true,
        unique: true
      }
    });

    await db.createTable('access_types', {
      id: primaryKey(),
      title: {
        type: 'text',
        notNull: true
      }
    });

    await db.createTable('crags', {
      id: primaryKey(),
      slug: {
        type: 'text',
        notNull: true,
        unique: true
      },
      title: {
        type: 'text',
        notNull: true
      },
      approach_details: {
        type: 'text',
        notNull: true
      },
      access_details: {
        type: 'text',
        notNull: true
      },
      description: {
        type: 'text',
        notNull: true
      },
      latitude: {
        type: 'text',
        notNull: true
      },
      longitude: {
        type: 'text',
        notNull: true
      },
      osm_data: {
        type: 'jsonb',
        notNull: true
      },
      access_type_id: foreignKey('crags', 'access_types', 'id', 'restrict'),
      rock_type_id: foreignKey('crags', 'rock_types', 'id', 'restrict'),
    });

    await db.createTable('car_parks', {
      id: primaryKey(),
      title: {
        type: 'text',
        notNull: true
      },
      description: {
        type: 'text',
        notNull: true
      },
      latitude: {
        type: 'text',
        notNull: true
      },
      longitude: {
        type: 'text',
        notNull: true
      },
      crag_id: foreignKey('car_parks', 'crags', 'id'),
    });

    await db.createTable('crag_crag_tags', {
      id: primaryKey(),
      crag_id: foreignKey('crag_crag_tags', 'crags', 'id'),
      tag_id: foreignKey('crag_crags_tag', 'crag_tags', 'id')
    });

    await db.createTable('areas', {
      id: primaryKey(),
      title: {
        type: 'text',
        notNull: 'true'
      },
      approach_details: {
        type: 'text',
      },
      description: {
        type: 'text'
      },
      latitude: {
        type: 'text',
        notNull: true
      },
      longitude: {
        type: 'text',
        notNull: true
      },
      slug: {
        type: 'text',
        notNull: true,
        unique: true
      },
      crag_id: foreignKey('areas', 'crags', 'id')
    });

    await db.createTable('area_area_tags', {
      id: primaryKey(),
      area_id: foreignKey('area_area_tags', 'areas', 'id'),
      tag_id: foreignKey('area_area_tags', 'area_tags', 'id')
    });

    await db.createTable('topos', {
      id: primaryKey(),
      image: {
        type: 'text',
        notNull: true,
        unique: true,
      },
      slug: {
        type: 'text',
        notNull: true,
        unique: true,
      },
      orientation_id: foreignKey('topos', 'orientations', 'id'),
      area_id: foreignKey('topos', 'areas', 'id')
    });

    await db.createTable('routes', {
      id: primaryKey(),
      slug: {
        type: 'text',
        notNull: true,
        unique: true
      },
      drawing: {
        type: 'jsonb',
        notNull: true,
      },
      grade_index: {
        type: 'int',
        notNull: true,
      },
      title: {
        type: 'text',
        notNull: true,
      },
      description: {
        type: 'text',
        notNull: true,
      },
      slug: {
        type: 'text',
        notNull: true,
        unique: true
      },
      rating: {
        type: 'int',
        notNull: true,
      },
      grading_system_id: foreignKey('routes', 'grading_systems', 'id'),
      topo_id: foreignKey('routes', 'topos', 'id'),
      route_type_id: foreignKey('routes', 'route_types', 'id')
    });

    await db.createTable('route_route_tags', {
      id: primaryKey(),
      route_id: foreignKey('route_route_tags', 'routes', 'id'),
      tag_id: foreignKey('route_route_tags', 'route_tags', 'id')
    });

    await db.createTable('users', {
      id: primaryKey(),
      auth_id: {
        type: 'text',
        notNull: true,
        unique: true
      }
    });

    await db.createTable('logs', {
      id: primaryKey(),
      date_logged: {
        type: 'datetime',
        notNull: true,
      },
      comment: {
        type: 'text',
        notNull: true,
      },
      attempts: {
        type: 'int',
        notNull: true
      },
      grade_suggested: {
        type: 'int',
        notNull: true
      },
      grade_taken: {
        type: 'int',
        notNull: true
      },
      stars: {
        type: 'int',
        notNull: true
      },
      user_id: foreignKey('logs', 'users', 'id'),
      route_id: foreignKey('logs', 'routes', 'id')
    });

    await db.createTable('log_tags', {
      id: primaryKey(),
      route_id: foreignKey('log_tags', 'routes', 'id'),
      tag_id: foreignKey('log_tags', 'route_tags', 'id'),
    });

    await db.createTable('lists', {
      id: primaryKey(),
      title: {
        type: 'text',
        notNull: true
      },
      user_id: foreignKey('lists', 'users', 'id')
    });

    await db.createTable('list_routes', {
      id: primaryKey(),
      route_id: foreignKey('list_routes', 'routes', 'id'),
      list_id: foreignKey('list_routes', 'lists', 'id'),
    });

    await db.runSql(`
      CREATE OR REPLACE FUNCTION randomString(length INT)
      RETURNS TEXT as $$
        SELECT string_agg(
          substr(
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            ceil(random() * 36)::integer,
            1
          ),
          ''
        ) as random
        FROM
          generate_series(1, length);
      $$ LANGUAGE SQL STRICT IMMUTABLE;
    `);

    await db.runSql(`
      CREATE OR REPLACE FUNCTION slugify(title TEXT)
      RETURNS TEXT AS $$
        -- lowercases the string
        WITH lowercase AS (
          SELECT lower(title) AS title
        ),
        -- remove single and double quotes
        removed_quotes AS (
          SELECT regexp_replace(lowercase.title, '[''"]+', '', 'gi') AS title
          FROM lowercase
        ),
        -- replaces anything that's not a letter, number, hyphen('-'), or underscore('_') with a hyphen('-')
        hyphenated AS (
          SELECT regexp_replace(removed_quotes.title, '[^a-z0-9\\-_]+', '-', 'gi') AS title
          FROM removed_quotes
        ),
        -- trims hyphens('-') if they exist on the head or tail of the string
        trimmed AS (
          SELECT regexp_replace(regexp_replace(hyphenated.title, '\-+$', ''), '^\-', '') AS title
          FROM hyphenated
        )
        
        SELECT
          trimmed.title || '-' || randomString
        FROM
          trimmed,
          randomString(8)
        ;
      $$ LANGUAGE SQL STRICT IMMUTABLE;
    `);

    res();
  });
};

exports.down = function(db) {
  return new Promise(async res => {
    await db.runSql('DROP FUNCTION slugify(text)');
    await db.dropTable('list_routes');
    await db.dropTable('lists');
    await db.dropTable('log_tags');
    await db.dropTable('logs');
    await db.dropTable('users');
    await db.dropTable('route_route_tags');
    await db.dropTable('routes');
    await db.dropTable('topos');
    await db.dropTable('area_area_tags');
    await db.dropTable('areas');
    await db.dropTable('crag_crag_tags');
    await db.dropTable('car_parks');
    await db.dropTable('crags');
    await db.dropTable('access_types');
    await db.dropTable('rock_types');
    await db.dropTable('route_types');
    await db.dropTable('grading_systems');
    await db.dropTable('orientations');
    await db.dropTable('route_tags');
    await db.dropTable('area_tags');
    await db.dropTable('crag_tags');

    res();
  });
};

exports._meta = {
  "version": 1
};
