const ethers = require( "ethers");

function stripZeros(value) {

    if (value.length === 0) {
        return value;
    }

    // Find the first non-zero entry
    var end = value.length-1;
    while (value[end] === 0) {
        end--
    }
    // If we started with zeros, strip them
    if (end < value.length - 1) {
        value = value.slice(0, end + 1);
    }

    return value;
}

module.exports = {
    toString: function(hex) {
        let str = stripZeros(ethers.utils.stripZeros(hex));

        return ethers.utils.toUtf8String(str);
    },
    toHex: function(string) {
        return "0x" + Buffer.from(ethers.utils.toUtf8Bytes(string)).toString('hex').padEnd(8, '0');
    }
};