
export const numberToWords = (num: number, system: 'indian' | 'international' | 'none'): string => {
  if (num === 0) return "Zero Only";

  const sys = system === 'none' ? 'international' : system;
  const words = convert(num, sys);
  return words + " Only";
};

const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

const convertLessThanOneThousand = (num: number): string => {
  if (num === 0) return "";
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "");
  return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + convertLessThanOneThousand(num % 100) : "");
};

const convert = (num: number, system: 'indian' | 'international'): string => {
  if (num === 0) return "";

  if (system === 'indian') {
    // Handle Crores specially as they can recurse (e.g. 100 Crore)
    if (num >= 10000000) {
      const crore = Math.floor(num / 10000000);
      const remainder = num % 10000000;
      // Recurse for crore part to handle large numbers
      return convert(crore, 'indian') + " Crore" + (remainder > 0 ? " " + convert(remainder, 'indian') : "");
    }
    if (num >= 100000) {
       const lakh = Math.floor(num / 100000);
       const remainder = num % 100000;
       return convertLessThanOneThousand(lakh) + " Lakh" + (remainder > 0 ? " " + convert(remainder, 'indian') : "");
    }
    if (num >= 1000) {
       const thousand = Math.floor(num / 1000);
       const remainder = num % 1000;
       return convertLessThanOneThousand(thousand) + " Thousand" + (remainder > 0 ? " " + convert(remainder, 'indian') : "");
    }
    return convertLessThanOneThousand(num);
  } 
  
  // International System
  if (num >= 1000000000) {
     const billion = Math.floor(num / 1000000000);
     const remainder = num % 1000000000;
     return convertLessThanOneThousand(billion) + " Billion" + (remainder > 0 ? " " + convert(remainder, 'international') : "");
  }
  if (num >= 1000000) {
     const million = Math.floor(num / 1000000);
     const remainder = num % 1000000;
     return convertLessThanOneThousand(million) + " Million" + (remainder > 0 ? " " + convert(remainder, 'international') : "");
  }
  if (num >= 1000) {
     const thousand = Math.floor(num / 1000);
     const remainder = num % 1000;
     return convertLessThanOneThousand(thousand) + " Thousand" + (remainder > 0 ? " " + convert(remainder, 'international') : "");
  }
  return convertLessThanOneThousand(num);
};
