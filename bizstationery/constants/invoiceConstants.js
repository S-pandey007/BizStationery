// constants/invoiceConstants.js

// Function to convert numbers to words (e.g., 500 -> "Five Hundred")
const convertToWords = (number) => {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
  
    const numberStr = Math.floor(number).toString();
    let words = "";
  
    if (numberStr.length <= 3) {
      words = convertHundreds(numberStr);
    } else if (numberStr.length <= 6) {
      const thousands = numberStr.slice(0, -3);
      const hundreds = numberStr.slice(-3);
      words = `${convertHundreds(thousands)} Thousand ${convertHundreds(hundreds)}`.trim();
    } else {
      words = `${Math.floor(number / 1000000)} Million ${convertToWords(number % 1000000)}`.trim();
    }
  
    return words || "Zero";
  };
  
  const convertHundreds = (numStr) => {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
  
    let words = "";
    const num = parseInt(numStr, 10);
  
    if (num > 99) {
      words += `${units[Math.floor(num / 100)]} Hundred `;
      const remainder = num % 100;
      if (remainder > 0) words += convertTens(remainder);
    } else {
      words += convertTens(num);
    }
  
    return words.trim();
  };
  
  const convertTens = (num) => {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
  
    let words = "";
    if (num >= 10 && num < 20) {
      words += teens[num - 10];
    } else if (num >= 20) {
      words += `${tens[Math.floor(num / 10)]} ${units[num % 10] ? units[num % 10] : ""}`;
    } else {
      words += units[num];
    }
    return words;
  };
  
  // Static parts of the invoice HTML
  const INVOICE_TEMPLATE = {
    HEADER: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice - MH Traders</title>
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; width: 100%; max-width: 800px; margin: 0 auto; border: 1px solid #000;">
          <!-- Top Section -->
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding-bottom: 10px;">
              <div>
                  <p style="margin: 0; font-size: 14px;"><strong>Invoice No:</strong> U/24052</p>
              </div>
              <div>
                  <p style="margin: 0; font-size: 14px;"><strong>Date:</strong> 07-Mar-2025</p>
              </div>
          </div>
  
          <!-- Wholesaler Information -->
          <div style="text-align: center; padding: 10px 0; border-bottom: 1px solid #000;">
              <h1 style="margin: 0; font-size: 24px;">MH TRADERS</h1>
              <p style="margin: 0; font-size: 16px;">EXPORT & SUPPLIERS</p>
              <p style="margin: 5px 0; font-size: 14px;">4481, Gali Jatam Paharibhiraj, Sadar Bazar, Delhi-6</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Email:</strong> mhTraders@gmail.com</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>GSTIN/UID:</strong> 24545T5GRG52 | <strong>State:</strong> Delhi</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Mobile:</strong> +91 1236547896</p>
          </div>
    `,
    FOOTER: `
          <!-- Company Details 
          <div style="padding: 10px 0; border-top: 1px solid #000;">
              <p style="margin: 0; font-size: 14px;"><strong>Company's PAN:</strong> ADWPB6076F</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Company's Bank Details</strong></p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Bank Name:</strong> Default</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>A/c No.:</strong> [Account Number]</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Branch & IFSC Code:</strong> [Branch & IFSC Code]</p>
          </div> -->
  
          <!-- Declaration -->
          <div style="padding: 10px 0; border-top: 1px solid #000;">
              <p style="margin: 0; font-size: 14px;"><strong>Declaration:</strong> We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
          </div>
  
          <!-- Signature Section -->
          <div style="text-align: right; padding: 10px 0; border-top: 1px solid #000;">
              <p style="margin: 0; font-size: 14px;"> MH TRADERS</p>
              <p style="margin: 20px 0 0 0; font-size: 14px;">Authorised Signatory</p>
          </div>
  
          <!-- Footer -->
          <div style="text-align: center; padding: 10px 0; border-top: 1px solid #000;">
              <p style="margin: 0; font-size: 12px;">This is a Computer Generated Invoice</p>
          </div>
      </body>
      </html>
    `,
  };
  
  export { convertToWords, INVOICE_TEMPLATE };