const http = require('http');
const url = require('url');
const bjs = require('@bananocoin/bananojs');

const receiveSeed = process.env.SEED;

const serverCheck = async (account, block) => {
    bjs.setBananodeApiUrl('https://kaliumapi.appditto.com/api'); // set your own banano node for production use
    const rec = await bjs.receiveBananoDepositsForSeed(receiveSeed, 0, account, block);
    return rec;    
}



const server = http.createServer();
server.on('request', async (request, response) => {    
    request.on('error', (err) => {
        response.statusCode = 400;
        response.end();
    });
    response.on('error', (err) => {
        console.error(err);
    });
    if (request.method === 'GET' && url.parse(request.url,true).pathname === '/') {
        const queryObject = url.parse(request.url,true).query;
        let responseObject = await serverCheck(queryObject.account, queryObject.block);
        response.setHeader("Access-Control-Allow-Origin", "https://bananopos.live");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        response.setHeader('Access-Control-Allow-Methods', 'GET');
        console.log(responseObject);
        if (responseObject.receiveCount === 0){
            response.write('none');
        } else {
            response.write('ok');
            // response.write(responseObject.receiveBlocks[0]); // would be nice to check on client that block is in account
        }
        response.end();        
    } else {
        response.statusCode = 404;
        response.end();
    }
})
server.listen();
