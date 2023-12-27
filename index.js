(async () => {
    const request = require('request'); // "Request" library
    
    const client_id = process.env['client_id']; // Your client id
    const client_secret = process.env['client_secret']; // Your secret

    let interval; //Future stuff
    let token;
    let refresh;
     
    function auth(){
        return new Promise((resolve, reject) => {
            // your application requests authorization
            let authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                },
                form: {
                    grant_type: 'client_credentials'
                },
                json: true
            };

            request.post(authOptions, function(error, response, body) {
                //console.log("hi")
                if (!error && response.statusCode === 200) {
            
                // use the access token to access the Spotify Web API
                token = body.access_token;
                refresh = body.refresh_token;
                console.log(token, refresh)
            
                var options = {
                    url: 'https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb', // Radiohead
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + token
                    },
                    json: true
                };
                request.get(options, function(error, response, body) {
                    if (!error & response.statusCode === 200) {
                        console.log("Test Successful.")
                        resolve(token, refresh);
                        //console.log(body)
                    }
                });
                }   
                else{
                    reject("Error code " + response.statusCode)
                }
            });

            /*interval = setInterval(function(){
                // refresh access token
                let refreshOptions = {
                    url: 'https://accounts.spotify.com/api/token',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                    },
                    form: {
                        grant_type: 'refresh_token',
                        refresh_token: refresh,
                        client_id: client_id
                    },
                    json: true
                };
                request.post(refreshOptions, function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        // use the access token to access the Spotify Web API
                        token = body.access_token
                        refresh = body.refresh_token

                        var options = {
                            url: 'https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb', // Radiohead
                            headers: {
                            'Authorization': 'Bearer ' + token
                            },
                            json: true
                        };
                        request.get(options, function(error, response, body) {
                            if (!error && response.statusCode === 200) {
                                console.log("Test Successful.")
                            }
                            //console.log(body)
                        });
                        }   
                        else{
                            console.log("Error code " + response.statusCode)
                        }
                });
            }, 20 * 60 * 1000); // 20 Minutes*/
        });
    }
    await auth();
    setInterval(auth, 20 * 60 * 1000)
    console.log(token)

    const express = require('express');
    const cors = require('cors');

    const app = express();
    app.use(cors());

    app.get('/v1/playlists/:pid/tracks', (req, res) => {
        console.log(req.params);
        console.log(req.query);
        let queryOptions = {
            url: 'https://api.spotify.com/v1/playlists/' + req.params.pid + '/tracks',
            qs: req.query,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        request(queryOptions, function (error, response, body) {
            //console.log(body)
            res.json(JSON.parse(body));
        });
    })

    app.use(express.static('public'))

    app.listen(process.env.port || 3000, () => {
      console.log(`Spotify app listening on port ${process.env.port || 3000}`)
    })

})();