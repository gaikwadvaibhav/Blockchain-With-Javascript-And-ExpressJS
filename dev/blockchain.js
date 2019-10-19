const sha256 = require('sha256');


function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];

    this.createNewBlock(100, '0', '0');
}

Blockchain.prototype.createNewBlock = function(nonce,   previousBloackHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBloackHash: previousBloackHash
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
}

Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        timestamp: Date.now()
    }

    this.pendingTransactions.push(newTransaction);

    return this.getLastBlock()['index'] + 1;

}

Blockchain.prototype.hashBlock = function(previousBloackHash, currentBlockData, nonce) {

    const dataAsString = previousBloackHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
}

Blockchain.prototype.proofOfWork = function (previousBloackHash, currentBlockData) {
    let nonce = 0;
    let hash  = this.hashBlock(previousBloackHash, currentBlockData, nonce);
    while(hash.substring(0,4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBloackHash, currentBlockData, nonce);
        console.log(hash);
        
    }

    return nonce;
}

module.exports = Blockchain;