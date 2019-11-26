import React, { Component } from 'react'

export class Base64Service extends Component {  
  static btoa = (input: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let str: string  = input;
    let output: string = '';
  
    for (let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || (map = '=', i % 1);
      output += map.charAt(63 & block >> 8 - i % 1 * 8)) {
  
      charCode = str.charCodeAt(i += 3 / 4);
  
      if (charCode > 0xFF) {
        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }
  
      block = block << 8 | charCode;
    }
  
    return output;
  }
    
}