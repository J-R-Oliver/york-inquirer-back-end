CREATE TRIGGER articles_update_at
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE PROCEDURE update_at_timestamp();