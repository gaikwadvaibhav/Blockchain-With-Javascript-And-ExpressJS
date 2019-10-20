const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const rp = require('request-promise');

const nodeAddress = uuid().split('-').join();

const bitcoin = new Blockchain();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = process.argv[2];




app.get('/blockchain', (req, res) => {
    res.send(bitcoin)
});

app.post('/transaction', (req, res) => {
    // const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    // res.json({
    //     note: `Transaction will be added in block ${blockIndex}.`
    // });
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransaction(newTransaction);
     res.json({
        note: `Transaction will be added in block ${blockIndex}.`
    });
});

app.get('/mine', (req, res) => {

    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    }

    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData)
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    // bitcoin.createNewTransaction(12.5, '00', nodeAddress);

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    
    const regNodesPromises = [];

    bitcoin.networkNodes.forEach((networkNodeUrl) => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: { newBlock: newBlock }, 
            json: true
        }

        regNodesPromises.push(rp(requestOptions));
    });

    Promise.all(regNodesPromises)
    .then((data) => {
        const requestOptions = {
            uri = bitcoin.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: {
                amount: 12.5,
                sender: '00',
                recipient: nodeAddress
            },
            json: true
        }
        return rp(requestOptions);
    })
    .then((data) => {
        res.json({
            note: `New block mine and broadcast successfully!`,
            block: newBlock
        });
    })    
});

app.post('/receive-new-block', (req, res) => {
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

    if(correctHash && correctIndex) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({
            note : 'New Block recieve and accepted.',
            newBlock: newBlock
        });
    } else {
        res.json({
            note : 'New block rejected.',
            newBlock: newBlock
        });
    }

});

// Create decenteralized network blockchain

app.post('/register-and-broadcast-node', (req, res) => {

    const newNodeUrl = req.body.newNodeUrl;
    if( bitcoin.networkNodes.indexOf(newNodeUrl) === -1 )bitcoin.networkNodes.push(newNodeUrl);

    let regNodesPromises = [];

    bitcoin.networkNodes.forEach((networkNodeUrl) => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl }, 
            json: true
        }

        regNodesPromises.push(rp(requestOptions));
    });

    Promise.all(regNodesPromises)
    .then((data) => {
        console.log('data', data);
        const bulkRegisterOption =  {
            host: 'http://localhost',
            uri: newNodeUrl + 'register-node-bulks',
            method: 'POST',
            body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] }, 
            json: true
        }
        
        return rp(bulkRegisterOption);
    })
    .then((data) => {
        res.json({
            note: 'New node registered with network succssfully!'
        });
    })
    .catch((err) => {
        console.log('errr',err);
        
    })
});

app.post('/register-node', (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) === -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;

    if(nodeNotAlreadyPresent && notCurrentNode ) bitcoin.networkNodes.push(newNodeUrl);
    res.json({
        note: 'New node registered successfully!'
    });
});

app.post('/register-node-bulks', (req, res) => {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) === -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode ) bitcoin.networkNodes.push(networkNodeUrl)
    });

    res.json({
        note: "Bulk registration successfully!"
    })
});

app.post('/transaction/broadcast', (req, res) => {
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req,body.recipient);
    bitcoin.addTransactionToPendingTransaction(newTransaction);

    const requestPromises = []
    bitcoin.networkNodes.forEach((networkNodeUrl) => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        }

        requestPromises.push(rp(requestOptions));
    })

    Promise.all(requestPromises)
    .then((data) => {
        res.json({
            note: 'Transaction created and broadcast successfully!'
        })
    })

})

app.listen(port, () => console.log(`Blockchain app listening on port ${port}!`))