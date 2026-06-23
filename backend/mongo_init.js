db = db.getSiblingDB('ma_db');
db.createUser({
  user: 'breezy_app',
  pwd: 'breezypass',
  roles: [{ role: 'readWrite', db: 'ma_db' }]
});