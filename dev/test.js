const Blockchain = require('./blockchain');

const bitcoin = new Blockchain()

// // test createblock 
// bitcoin.createNewBlock(2313,'111SF323HG4H', '222JH2J3H4G23');
// bitcoin.createNewBlock(5345,'3333C23423C', '44444DFC67GV567G5');
// bitcoin.createNewBlock(45454,'FJSHDKFH7', 'SDHFSDHFSDKF');

// // test createblock and createNewTransaction
// bitcoin.createNewBlock(2313,'111SF323HG4H', '222JH2J3H4G23');
// bitcoin.createNewTransaction(100, 'VAIBHAVFGHGFH87FG9H', 'GAIKWADDFGDF98G89DFGD8F9')

// bitcoin.createNewBlock(5345,'3333C23423C', '44444DFC67GV567G5');

// bitcoin.createNewTransaction(200, 'VAIBHAVFGHGFH87FG9H', 'GAIKWADDFGDF98G89DFGD8F9')
// bitcoin.createNewTransaction(3300, 'VAIBHAVFGHGFH87FG9H', 'GAIKWADDFGDF98G89DFGD8F9')
// bitcoin.createNewTransaction(1100, 'VAIBHAVFGHGFH87FG9H', 'GAIKWADDFGDF98G89DFGD8F9')

// bitcoin.createNewBlock(45454,'FJSHDKFH7', 'SDHFSDHFSDKF');


// // test hashblock
const previousBlockHash = 'BBH7897BHJJNKDFNG888088098098';
const currentBlockData = [
    {
        amount: 30,
        sender: 'SDHFSDHJGSDGF87878SDHFSD',
        recipient: 'SFSDHGFHJSD3246273BDSF34'
    },
    {
        amount: 600,
        sender: 'SDFJHSDJFSDJFG54237654672',
        recipient: 'MCVNBNCVMBN003048'
    },
    {
        amount: 2500,
        sender: 'HFGHKLDFKGJDLFGJDJFLGJ4534534',
        recipient: 'YRTNBYRNTBYNRBTNBY34345'
    }
]

// const nonce = 100;


// console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));
// console.log( bitcoin.hashBlock(previousBlockHash, currentBlockData, 7742) );

console.log(bitcoin);
