pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./strings.sol";
import "./StringUtils.sol";


contract MFC {

    using SafeMath for uint16;
    using SafeMath for uint256;
    using strings for *;

    address owner;

    uint BOX_PRICE = 1 ether;
    uint16 constant BOARD_LENGTH = 100;
    uint16 constant BOARD_SIZE = BOARD_LENGTH * BOARD_LENGTH;

    event BoxBought(uint16 x, uint16 y, address buyer);
    event BoxPublished(uint16 x, uint16 y, address owner, bytes4 char, bytes3 colour, string attachment);
    event debug(string char);
    event debug(uint256 char);
    event debug(bytes char);
    event debug(strings.slice char);

    struct Char {
        bytes4 char;
        uint attachmentIndex;
        bytes3 colour;
    }

    Char[BOARD_SIZE] public chars;
    address[BOARD_SIZE] public buyers;
    string[] attachments;
    mapping(string => uint) attachmentsIndex;

    constructor(uint _BOX_PRICE) public{
        owner = msg.sender;
        BOX_PRICE = _BOX_PRICE;
        attachments.push("");
        // The zero index is not used and must be reserved so the indexes used will start from index 1
    }

    modifier priceIsValid(uint256 numberOfBoxes){
        // TODO: Use safe math
        require(msg.value >= BOX_PRICE.mul(numberOfBoxes));
        // Payment is valid
        _;
    }

    modifier locationIsValid(uint16 x, uint16 y){
        require(y < BOARD_LENGTH && x < BOARD_LENGTH);
        // X and Y are within range
        _;
    }

    modifier charIsValid(bytes4 char){
        require(StringUtils.utfStringLength(char) == 1);
        // Char is only one char
        _;
    }

    function storeAttachment(string attachment) private returns (uint attachmentIndex){
        if (attachmentsIndex[attachment] != 0) {
            attachmentIndex = attachmentsIndex[attachment];
        } else {
            attachmentIndex = attachments.length;
            attachments.push(attachment);
            attachmentsIndex[attachment] = attachmentIndex;
        }
    }

    function publish(uint16 x, uint16 y, bytes4 char, string attachment, bytes3 colour)
    locationIsValid(x, y)
    charIsValid(char)
    public {
        uint index = y.mul(BOARD_LENGTH).add(x);
        require(buyers[index] == msg.sender);

        uint attachmentIndex = storeAttachment(attachment);

        chars[index] = Char(char, attachmentIndex, colour);

        emit BoxPublished(x, y, msg.sender, char, colour, attachment);
    }

    /**
     * Publish characters. Use newline to publish a block of boxes at the resired position in the grid
     */
    function publishBlock(uint16 start_x, uint16 start_y, string _chars, string attachment, bytes3 colour)
    locationIsValid(start_x, start_y)
    public {
        strings.slice memory _charsSlice = _chars.toSlice();
        uint cnt = _charsSlice.count("\n".toSlice()) + 1;
        for (uint y = 0; y < cnt; y++) {
            publishLine( start_x,  start_y, _charsSlice.split("\n".toSlice()), y,  attachment,  colour);
        }
    }

    function publishLine(uint16 start_x, uint16 start_y, strings.slice memory line, uint y, string attachment, bytes3 colour) private{
        //strings.slice memory line = _charsSlice.split("\n".toSlice());

        uint cnt = line.count(" ".toSlice()) + 1;

        for (uint x = 0; x < cnt; x ++) {
            uint index = checkValidToPublish(x.add(start_x), y.add(start_y));

//            emit debug(line.split(" ".toSlice()).toString());
            strings.slice memory onechar = line.split(" ".toSlice());

            bytes4 char = bytes4(stringToBytes32(onechar.toString()));

            require(StringUtils.utfStringLength(char) <= 1);
            chars[index] = Char(char, storeAttachment(attachment), colour);
            emit BoxPublished(uint16(x.add(start_x)), uint16(y.add(start_y)), msg.sender, chars[index].char, colour, attachment);
        }
    }

    function checkValidToPublish(uint x, uint y) view private returns (uint index){
        require(y < BOARD_LENGTH && x < BOARD_LENGTH);
        index = y.mul(BOARD_LENGTH).add(x);
        require(buyers[index] == msg.sender);
        // box is owned
    }

    function stringToBytes32(string memory source) pure private returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(tempEmptyStringTest, 32))
        }
    }

//    function convertBytesToBytes4(bytes inBytes) returns (bytes4 outBytes4) {
//        if (inBytes.length == 0) {
//            return 0x0;
//        }
//
//        assembly {
//            outBytes4 := mload(add(inBytes, 32))
//        }
//    }

//    function convertBytesToBytes4(bytes inBytes) returns (bytes4 outBytes4) {
//        uint256 maxByteAvailable = inBytes.length < 4 ? inBytes.length : 4;
//        for (uint256 i = 0; i < maxByteAvailable; i++) {
//            bytes4 tempBytes4 = inBytes[i];
//            tempBytes4 = tempBytes4 >> (4 * i);
//            outBytes4 = outBytes4 | tempBytes4;
//        }
//    }


    function buy(uint16 start_x, uint16 start_y, uint16 length, uint16 height)
    locationIsValid(start_x, start_y)
    priceIsValid(length.mul(height))
    public payable {
        for (uint16 y = start_y; y < start_y + height; y++) {
            for (uint16 x = start_x; x < start_x + length; x++) {
                require(y < BOARD_LENGTH && x < BOARD_LENGTH);
                uint index = y.mul(BOARD_LENGTH).add(x);
                require(buyers[index] == 0x0);

                buyers[index] = msg.sender;
            }
        }
        owner.transfer(msg.value);
        for (uint16 yy = start_y; yy < start_y + height; yy++) {
            for (uint16 xx = start_x; xx < start_x + length; xx++) {
                emit BoxBought(xx, yy, msg.sender);
            }
        }
    }

    function read(uint16 x, uint16 y)
    locationIsValid(x, y)
    public view returns (bytes4 char, string attachment, bytes3 colour, address buyer)

    {
        uint index = y.mul(BOARD_LENGTH).add(x);

        buyer = buyers[index];
        if (buyer == 0x0) {
            return;
        }
        char = chars[index].char;
        if (chars[index].attachmentIndex > 0) {
            attachment = attachments[chars[index].attachmentIndex];
        }
        colour = chars[index].colour;

    }

    modifier onlyOwner(){
        require(owner == msg.sender);
        _;
    }

    function kill() public onlyOwner {
        selfdestruct(owner);
    }

}
