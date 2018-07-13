pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./strings.sol";
import "./StringUtils.sol";


contract MFC {

    // #### Constants ####

    // The number of boxes in X and Y of the board
    uint16 constant BOARD_LENGTH = 100;
    // The total number of boxes in the board
    uint16 constant BOARD_SIZE = BOARD_LENGTH * BOARD_LENGTH;

    // #### Libraries ####
    using SafeMath for uint16;
    using SafeMath for uint256;
    using strings for *;

    // #### Properties ####
    address owner;
    // The price of a box. Set at construct time
    uint public BOX_PRICE = 1 ether;

    struct Box {
        // UTF8 char representation
        bytes4 char;
        // Index in the attahments array of the attachment. Optimization since a lot of boxes are expected to share the attachment
        uint attachmentIndex;
        // Bytes represenation of an RGB colour. 0xff0000 - red.
        bytes3 colour;
    }

    // The board with all published chars
    Box[BOARD_SIZE] public board;
    // An array of all bought boxes
    address[BOARD_SIZE] buyers;
    // List of attachments
    string[] attachments;
    // Index of the attachment in the list (reverse lookup)
    mapping(string => uint) attachmentsIndex;


    // #### Events ####
    event BoxBought(uint16 x, uint16 y, address buyer);
    event BoxPublished(uint16 x, uint16 y, address owner, bytes4 char, bytes3 colour, string attachment);


    constructor(uint _BOX_PRICE) public{
        owner = msg.sender;
        BOX_PRICE = _BOX_PRICE;
        attachments.push("");
        // The zero index is not used and must be reserved so the indexes used will start from index 1
    }

    // #### Modifiers ####
    modifier priceIsValid(uint256 numberOfBoxes){
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

    modifier onlyOwner(){
        require(owner == msg.sender);
        _;
    }

    function read(uint16 x, uint16 y)
    locationIsValid(x, y)
    public view returns (bytes4 char, string attachment, bytes3 colour, address buyer) {
        uint index = y.mul(BOARD_LENGTH).add(x);

        buyer = buyers[index];
        if (buyer == 0x0) {
            return;
        }
        char = board[index].char;
        if (board[index].attachmentIndex > 0) {
            attachment = attachments[board[index].attachmentIndex];
        }
        colour = board[index].colour;

    }


    /*
     * The price of the block you want to buy is length * height * BOX_PRICE
     */
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

    /**
     * Publish to a box you own. Because there are no string manipulation
     * this method is cheaper to run if you want to buy one box then the publishBatch
     */
    function publish(uint16 x, uint16 y, bytes4 char, string attachment, bytes3 colour)
    locationIsValid(x, y)
    charIsValid(char)
    public {
        uint index = y.mul(BOARD_LENGTH).add(x);
        require(buyers[index] == msg.sender);

        uint attachmentIndex = storeAttachment(attachment);

        board[index] = Box(char, attachmentIndex, colour);

        emit BoxPublished(x, y, msg.sender, char, colour, attachment);
    }

    /**
     * Publish to multiple boxes you own characters.
     * Separate with newline to move down (along the Y axis).
     * Separate with space to move right (aling the X axis).
     * Only one character per box is allowed!
     */
    function publishBatch(uint16 start_x, uint16 start_y, string _chars, string attachment, bytes3 colour)
    locationIsValid(start_x, start_y)
    public {
        strings.slice memory _charsSlice = _chars.toSlice();
        uint cnt = _charsSlice.count("\n".toSlice()) + 1;
        for (uint y = 0; y < cnt; y++) {
            publishLine( start_x,  start_y, _charsSlice.split("\n".toSlice()), y,  attachment,  colour);
        }
    }

    // Terminate the contract and send any lingering value it might have back to the owner
    function kill() public onlyOwner {
        selfdestruct(owner);
    }

    // ### Private functions ###


    // Store the attachment and return the attachment index. If the attachment is alreay stored, reuse the index
    function storeAttachment(string attachment) private returns (uint attachmentIndex){
        if (attachmentsIndex[attachment] != 0) {
            attachmentIndex = attachmentsIndex[attachment];
        } else {
            attachmentIndex = attachments.length;
            attachments.push(attachment);
            attachmentsIndex[attachment] = attachmentIndex;
        }
    }
    event debug(string str);
    // Use by the publish block to handle one line of the input string
    function publishLine(uint16 start_x, uint16 start_y, strings.slice memory line, uint y, string attachment, bytes3 colour) private {

        uint cnt = line.count("\t".toSlice()) + 1;

        for (uint x = 0; x < cnt; x ++) {
            uint index = getIndexAndCheckIfAllowedToPublish(x.add(start_x), y.add(start_y));
            emit debug(line.toString());

            strings.slice memory onechar = line.split("\t".toSlice());
            emit debug(onechar.toString());
            bytes4 char = bytes4(stringToBytes32(onechar.toString()));

            require(StringUtils.utfStringLength(char) <= 1);
            board[index] = Box(char, storeAttachment(attachment), colour);
            emit BoxPublished(uint16(x.add(start_x)), uint16(y.add(start_y)), msg.sender, board[index].char, colour, attachment);
        }
    }

    function getIndexAndCheckIfAllowedToPublish(uint x, uint y) view private returns (uint index){
        require(y < BOARD_LENGTH && x < BOARD_LENGTH);
        index = y.mul(BOARD_LENGTH).add(x);
        require(buyers[index] == msg.sender);
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
}