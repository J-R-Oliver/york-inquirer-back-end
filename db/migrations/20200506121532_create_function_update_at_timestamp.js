const createFunctionUpdateAtTimestamp = `
CREATE OR REPLACE FUNCTION update_at_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
$$ language 'plpgsql';
`;

const dropFunctionUpdateAtTimestamp = `
DROP FUNCTION update_at_timestamp;
`;

exports.up = knex => knex.raw(createFunctionUpdateAtTimestamp);

exports.down = knex => knex.raw(dropFunctionUpdateAtTimestamp);
