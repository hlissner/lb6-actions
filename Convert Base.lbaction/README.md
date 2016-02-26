# Base Convert

Converts a number in any base N to base M (where N and M are greater than 2 and less than
36).

![Base Convert Screenshot](img/01.gif)

## Installation

[Download the action](https://v0.io/dl/launchbar/Base%20Convert.lbaction.zip), unzip it,
and double the resulting lbaction file to install it.

## Usage

The command accepts the following syntax:

`<number>[[_<source-radix>] <dest-radix>]`

+ If `source-radix` is omitted, it will try to guess between base 2, 16 and 36 (defaults
  to 10 otherwise).
+ If `dest-radix` is omitted, the number is converted to several common bases (binary,
  octal, decimal and hexidecimal).

### Examples

+ `0x81F9.4 10` returns `33273.25`
+ `81F9_16 2` returns `1000000111111001`
+ `7501_8 2` returns `111101000001`
