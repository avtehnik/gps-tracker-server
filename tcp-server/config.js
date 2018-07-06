var config = {};

config.http = {};
config.sql = {};
config.tcp = {};

config.http.host = 'localhost';
config.http.port = 3000;
config.http.envport = process.env.PORT || 3000;
config.sql.db = 'tracker_db';
config.sql.user = 'track-user';
config.sql.pass = 'password';
config.sql.host = 'localhost';
config.sql.dialect = 'mysql';
config.sql.table = 'track_data';
config.tcp.host = 'localhost';
config.tcp.port = 1337;

module.exports = config;
