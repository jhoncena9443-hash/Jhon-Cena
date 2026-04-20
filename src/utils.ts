export const numberToWords = (num: number): string => {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convert = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
    return '';
  };

  if (num === 0) return 'Zero';

  const formatLakhs = (n: number): string => {
    let str = '';
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    if (crore > 0) str += convert(crore) + ' Crore ';

    const lakh = Math.floor(n / 100000);
    n %= 100000;
    if (lakh > 0) str += convert(lakh) + ' Lakh ';

    const thousand = Math.floor(n / 1000);
    n %= 1000;
    if (thousand > 0) str += convert(thousand) + ' Thousand ';

    if (n > 0) str += convert(n);

    return str.trim();
  };

  const wholePart = Math.floor(num);
  const decimalPart = Math.round((num - wholePart) * 100);

  let result = formatLakhs(wholePart) + ' Rupees';
  if (decimalPart > 0) {
    result += ' and ' + convert(decimalPart) + ' Paise';
  }
  return result + ' Only';
};

export const calculateTotals = (items: any[], tax: any) => {
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.quantity || '0') * item.rate), 0);
  const cgstAmount = (subtotal * tax.cgstPercent) / 100;
  const sgstAmount = (subtotal * tax.sgstPercent) / 100;
  const igstAmount = (subtotal * tax.igstPercent) / 100;
  const total = subtotal + cgstAmount + sgstAmount + igstAmount;
  const totalTax = cgstAmount + sgstAmount + igstAmount;

  return {
    subtotal,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalTax,
    total,
    totalInWords: numberToWords(total),
    taxInWords: numberToWords(totalTax)
  };
};
