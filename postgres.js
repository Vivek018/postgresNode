var {Pool} = require('pg');
var client = new Pool({
    connectionString: "postgres://vvssnvpf:tzYj0uLkLnPiQNPX9ENhfm5PxUkg2OXE@tai.db.elephantsql.com/vvssnvpf"
    });

client.connect(function(err) {
    if(err) {
        return console.error('could not connect to postgres', err);
    }
    client.query('SELECT NOW() AS "theTime"', function(err, result) {
        if(err) {
            return console.error('error running query', err);
        }
        console.log(result.rows[0].theTime);
        // >> output: 2018-08-23T14:02:57.117Z
    });

});

module.exports = client;