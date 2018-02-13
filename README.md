# Storing 1 gigabyte worth of events in Ethereum smart contracts

[A fun experiment](test/gigabyte.js).

[EventStore](contracts/EventStore.sol) is a contract that has a single method, `publish()` that emits an event with 5 arguments totaling in 128 bytes of payload.

We batch 65k batches of 128 transactions of 128 bytes each to store 1 gigabyte of "useful" data on a Blockchain and compute
the fees necessary to make those transactions go through. The transactions are ran on a private truffle to collect accurate enough information on how much gas is required to store one event.

To reproduce:

```console
ethstore% npm install -g truffle
ethstore% truffle test test/gigabyte.js 
Using network 'test'.


  Contract: EventStore
collecting current gas prices and ETH/USD rates
will run 65536 batches of 128 transactions each
{ ethgasstation: 
   { fastestWait: 0.4,
     safeLowWait: 3.3,
     fastWait: 0.4,
     safeLow: 20,
     average_txpool: 20,
     average_calc: 20,
     fastest: 120,
     avgWait: 3.3,
     safelow_txpool: 20,
     safelow_calc: 20,
     block_time: 12.870967741935484,
     blockNum: 5084618,
     average: 20,
     fast: 40,
     speed: 0.4881307206416355 },
  bitstamp: 
   { high: '877.95',
     last: '841.14',
     timestamp: '1518551192',
     bid: '841.14',
     vwap: '842.28',
     volume: '25595.78805680',
     low: '819.31',
     ask: '843.42',
     open: '866.86' } }
batch 0: spent 3047552, estimates: { totalgas: 199724367872, usd: 3359923, usdFast: 6719846 }
batch 1: spent 3055680, estimates: { totalgas: 199990706176, usd: 3364403, usdFast: 6728807 }
batch 2: spent 3055744, estimates: { totalgas: 200080883712, usd: 3365920, usdFast: 6731841 }
batch 3: spent 3055680, estimates: { totalgas: 200124923904, usd: 3366661, usdFast: 6733323 }
batch 4: spent 3055744, estimates: { totalgas: 200152186880, usd: 3367120, usdFast: 6734240 }
batch 5: spent 3055680, estimates: { totalgas: 200169663146.66666, usd: 3367414, usdFast: 6734828 }
batch 6: spent 3055744, estimates: { totalgas: 200182745380.57144, usd: 3367634, usdFast: 6735268 }
batch 7: spent 3055680, estimates: { totalgas: 200192032768, usd: 3367790, usdFast: 6735581 }
batch 8: spent 3055744, estimates: { totalgas: 200199722325.33334, usd: 3367919, usdFast: 6735839 }
^C
```
