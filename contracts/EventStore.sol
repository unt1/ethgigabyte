pragma solidity ^0.4.0;

contract EventStore {
    // - address is the same size as bytes20
    // - msg.gas needs uint256 but we truncate it to uint96
    // thus,
    // one event takes 128 bytes of "useful" payload
    event SomethingHappened(address sender, uint96 gas, uint256 gasprice, uint256 value, uint256 userdata);

    function EventStore() public {}

    function publish(uint256 userdata) public payable {
        SomethingHappened(msg.sender, uint96(msg.gas), tx.gasprice, msg.value, userdata);
    }
}
