//downloads
//hardhat-toolbox
//dotenv
------npm install dotenv --save
-----require('dotenv').config()
//solidity prettier and prettier plugin
----npm install --save-dev prettier prettier-plugin-solidity
//solhint
----- npm install -g solhint
---solhint --version
---- solhint --init

//hardhat-deploy
----- npm install -D hardhat-deploy
----require('hardhat-deploy');

//harhdt-ethers
---- npm install --save-dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
--- ("@nomiclabs/hardhat-ethers")

//npm-chainlink
----npm install @chainlink/contracts --save

//for multiple accoutns make helper file
//helper-hardhat-config.js
-------------------npm------------------

# npx hardhat compile(contract compile)

# npx hardhat deploy --tags mocks (mocks local deployment)

# npx hardhat deploy (local deployment)

# npx hardhat deploy --network goerli (testnet deployment)

----------------------ethers functions------------------------

# getContract

# getContractAt

# deploy

# deployments

------------------------errors-------------------------

# getcontract is not a function. (error in staging test)

// just removed extra `'` from harahdt ethers in pcakage.json and run `npm install`

# pricefeed is not a function (error in staging test)

//since we have made `pricefeed` private we cant acces it but use the `getter` function for the same.

---------------npm clean------
npm hardhat clean
npm hardhat compile
npm hardhat test

---------java script debug terminal---------------

# click on the `red dot` where you want to get the test to get stopped.

# clicnk on left side `run and debug` and click on `java script debug terminal`

# it will open a `java script terminal` in cmd

# now either in `terminal` or on `leftside` we can see any function transaction.

for example `gasprice` or `gas used`.

------hardhat debugger-------

# solidity.concole
