# Zk Tutorial for building on Mina Protocol

A simple overview of creating & deploying a zkApp on Mina Protocol.

## Tools

- NodeJS 16+
- [zkapp-cli](https://www.npmjs.com/package/zkapp-cli): package for creating zkApps using [SnarkyJS](https://docs.minaprotocol.com/zkapps/snarkyjs-reference) which is the Typescript Framework for writing zkApps on Mina Protocol
- Berkeley Testnet Alpha: where the app will be deployed to
- [Mina Block Explorer for Berkeley](https://berkeley.minaexplorer.com/)

## Installation

1. First, make sure you have a [NodeJS](https://nodejs.org/en/) version 16 or above.
    You can check the Node version by:
    ```node -v``` or ```node --version```

2. Install the zkApp package manager
    ```npm install -g zkapp-cli```

    You can check that you’ve installed by running:
    ```zk —version```

3. *Optional* Setup a Mina wallet

    *This section is not required for the tutorial however I am adding it here because it's important to have the tools to interact with the blockchain, and that's where we need a crypto wallet.*

    I've set up [Auro](https://www.aurowallet.com/), thats a wallet for Mina Protocol. It comes as a browser extension and mobile app.

    After you add the extension to your browser, you can follow the steps to create an account. It will generate a mnemonic phrase and make sure to store this phrase safely. Once your account is created, you'll see the account information on the UI.

    ![auro-wallet-ss](https://github.com/edakturk14/zk-tutorial/blob/8a900421666274013d6aac194b5a1b66339e9074/IMAGES/mina-wallet.png)

## Create & Deploy a zkApp on Mina Protocol

1. Create a new project folder

    ```
    zk project zk-app
    ```

    ![create-zk-app](https://github.com/edakturk14/zk-tutorial/blob/13dbd5cc5df91324e39461f1745f5b15c593add5/IMAGES/create-zk-app.png)

    Here's what the project folder looks like:

    ```
    .
    ├── build
    ├── keys
    ├── node_modules
    ├── src
    ├── LICENSE
    ├── README.md
    ├── babel.config.cjs
    ├── config.json
    ├── jest-resolver.cjs
    ├── jest.config.js
    ├── package-lock.json
    ├── package.json
    └── tsconfig.json
    ```

    Let's look into the src folder that contains the smart contracts for the zkApp. In the src folder, there are the files: Add.ts and Add.test.ts. They are the zk-smart contract and the test file.

    I have added the code and some comments to explain what's going on:

    ```
    import {
      Field, // Field is used to describe unsigned integers 
      SmartContract, // class for zk app smart contracts
      state,
      State,
      method,
      DeployArgs,
      Permissions,
    } from 'snarkyjs';

    /**
     * The Add contract initializes the state variable 'num' to be a Field(1) when deployed.
     * The Add contract adds Field(2) to 'num' when the update() func is called. 
     **/

    export class Add extends SmartContract {

      @state(Field) num = State<Field>(); // creates an on-chain state called num

      deploy(args: DeployArgs) { // deploy method, describes the settings 
        super.deploy(args);
        this.setPermissions({
          ...Permissions.default(),
          editState: Permissions.proofOrSignature(),
        });
      }

      @method init() { // initialize the num value to Field(1) on deployment
        this.num.set(Field(1));
      }

      @method update() { // function to update the on-chain state of num variable 
        const currentState = this.num.get(); // get the on-chain state 
        this.num.assertEquals(currentState); // check this.num.get() is equal to the actual on-chain state
        const newState = currentState.add(2); // add 2 
        newState.assertEquals(currentState.add(2)); 
        this.num.set(newState); // set the new on-chain state 
      }
    }
    ```
    
2. We need to add the project configurations, run the command below to get the configuration wizard.

    ```
    zk config
    ```
    Add the details below:

    - Name: *berkeley*
    - URL: *https://proxy.berkeley.minaexplorer.com/graphql*
    - Fee: *0.1*

    ![zk-config](https://github.com/edakturk14/zk-tutorial/blob/13dbd5cc5df91324e39461f1745f5b15c593add5/IMAGES/zk-config.png)

3. Get Testnet Tokens(tMINA) by following the link on the pervious terminal. It takes a few min.

    ![testnet-tokens](https://github.com/edakturk14/zk-tutorial/blob/13dbd5cc5df91324e39461f1745f5b15c593add5/IMAGES/testnet-tokens.png)

    *Testnet tokens are required to pay for the transaction to deploy the smart contract to the blockchain.*

4. Deploy the app to the Mina Berkeley Testnet. Make sure you have your tMina in your account.

    ```
    zk deploy berkeley
    ```
    ![deploy-app](https://github.com/edakturk14/zk-tutorial/blob/13dbd5cc5df91324e39461f1745f5b15c593add5/IMAGES/deploy-app.png)

🎉 There you go! You've deployed your smart contracts onto the Mina Blockchain testnet.
