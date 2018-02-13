/* jshint esversion: 6 */

const util = require('util');
const EventStore = artifacts.require("EventStore");

const GIGABYTE = 2**30;
const EVENT_PAYLOAD_SIZE = 128;
const BATCH_SIZE = 128;

const NBATCHES = GIGABYTE/EVENT_PAYLOAD_SIZE/BATCH_SIZE;

const json = (url) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  xhr.onload = () => {
	var status = xhr.status;
	if (status >= 200 && status < 300) {
	  resolve(JSON.parse(xhr.responseText));
	} else {
      console.error(`xhr error: ${util.inspect(xhr)}`);
	  reject(status);
	}
  };
  xhr.send();
});


const range = n =>
 Array.from(Array(n).keys());

const sum = array =>
  array.reduce((acc, x) => acc + x, 0);

const effects = f =>
  x => { f(x); return x; };

const publish = (instance, i) =>
  instance.publish(i).then(tx => tx.receipt.cumulativeGasUsed);

const batch = (instance, batchIndex, batchSize) =>
  Promise.all(range(batchSize).map(i => publish(instance, i + ((batchIndex + 1) * batchSize))));

const estimate = (ethgas, ethusd) => (batchIndex, totalBatches, gas) => {
  const totalgas = gas / (batchIndex + 1) * totalBatches,
        usd = Math.trunc(web3.fromWei(ethgas.average, 'gwei') * ethusd.last * totalgas),
        usdFast = Math.trunc(web3.fromWei(ethgas.fast, 'gwei') * ethusd.last * totalgas);
  return {totalgas, usd, usdFast};
};

const reduceBatch = estimate => (promise, batchIndex) =>
  promise.then(([instance, gas]) => batch(instance, batchIndex, BATCH_SIZE).then(sum).then(effects(moreGas => {
    const est = estimate(batchIndex, NBATCHES, gas + moreGas);
    console.log(`batch ${batchIndex}: spent ${moreGas}, estimates: ${util.inspect(est)}`);
  })).then(moreGas => [instance, gas + moreGas]));

const tickers =
  Promise.all([
    json("https://ethgasstation.info/json/ethgasAPI.json"),
    json("https://www.bitstamp.net/api/v2/ticker/ethusd/")
  ]).then(effects(([ethgasstation, bitstamp]) => console.log({ethgasstation, bitstamp})));

const go = ([ethgas, ethusd]) =>
  range(NBATCHES).reduce(
    reduceBatch(estimate(ethgas, ethusd)),
    EventStore.deployed().then(instance => [instance, 0])
  );

contract('EventStore', (accounts) => {
  it("uploads one gigabytes worth of data", () => {
    console.log(`collecting current gas prices and ETH/USD rates`);
    console.log(`will run ${NBATCHES} batches of ${BATCH_SIZE} transactions each`);
    return tickers.then(go).then(([_, gas]) => console.log(`ok, total gas: ${gas}`));
  });
});
