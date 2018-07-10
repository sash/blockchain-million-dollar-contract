pragma solidity ^0.4.14;

library StringUtils {

    function utfStringLength(bytes4 str) internal pure returns (uint length) {
        uint i = 0;
        bool padding = false;

        while (i < str.length)
        {
            if (str[i] == 0x0) {
                i += 1;
                padding = true;
                continue;
                // do not increment length
            }
            if (padding && str[i] != 0x0) {
                revert();
            }
            if (str[i] >> 7 == 0) {
                i += 1;
                padding = false;
            }
            else if (str[i] >> 5 == 0x6) {
                i += 2;
                padding = false;
            }
            else if (str[i] >> 4 == 0xE) {
                i += 3;
                padding = false;
            }
            else if (str[i] >> 3 == 0x1E) {
                i += 4;
                padding = false;
            }
            else {
                //For safety
                i += 1;
                padding = false;
            }

            length++;
        }
    }
}