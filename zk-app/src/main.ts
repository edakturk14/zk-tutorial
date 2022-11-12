import { Add } from './Add.js';
import {
  isReady,
  shutdown,
  Mina,
  PrivateKey,
  AccountUpdate,
} from 'snarkyjs';

(async function main() {
  await isReady;
  console.log("Starting");

  // start a local blockchain
  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);
  const deployerAccount = Local.testAccounts[0].privateKey;

  // create a destination to deploy the smart contract
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();

  // create an instance of Add - and deploy it to zkAppAddress
  const zkAppInstance = new Add(zkAppAddress);
  const deploy_txn = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
    zkAppInstance.init();
    zkAppInstance.sign(zkAppPrivateKey);
  });
  await deploy_txn.send().wait();

  // get the initial state of Add after deployment
  const num0 = zkAppInstance.num.get();
  console.log('Num after init:', num0.toString());

  // ----------------------------------------------------

  const txn1 = await Mina.transaction(deployerAccount, () => {
    zkAppInstance.update();
    zkAppInstance.sign(zkAppPrivateKey);
  });
  await txn1.send().wait();

  const num1 = zkAppInstance.num.get();
  console.log('Add 2:', num1.toString());

  // ----------------------------------------------------

  try {
    const txn2 = await Mina.transaction(deployerAccount, () => {
      zkAppInstance.update();
      zkAppInstance.sign(zkAppPrivateKey);
    });
    await txn2.send().wait();
  } catch (ex: any) {
    console.log(ex.message);
  }
  const num2 = zkAppInstance.num.get();
  console.log('Add 2:', num2.toString());

  // ----------------------------------------------------

  const txn3 = await Mina.transaction(deployerAccount, () => {
    zkAppInstance.update();
    zkAppInstance.sign(zkAppPrivateKey);
  });
  await txn3.send().wait();

  const num3 = zkAppInstance.num.get();
  console.log('Add 2:', num3.toString());

  // ----------------------------------------------------

  console.log('Closing the local blockchain');
  await shutdown();

})();