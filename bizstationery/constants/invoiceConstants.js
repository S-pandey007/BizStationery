// constants/invoiceConstants.js

// Simplified function to convert numbers to words (whole numbers only)
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
  const thousands = ["", "Thousand", "Million", "Billion"];

  const num = Math.floor(number); // Ignore decimals (e.g., 550.50 → 550)
  if (num === 0) return "Zero";

  let words = "";
  let numStr = num.toString();
  let chunkCount = 0;

  while (numStr.length > 0) {
    const chunk = parseInt(numStr.slice(-3)) || 0; // Last 3 digits
    if (chunk > 0) {
      let chunkWords = "";
      if (chunk > 99) {
        chunkWords += `${units[Math.floor(chunk / 100)]} Hundred `;
        const remainder = chunk % 100;
        if (remainder > 0) chunkWords += convertTens(remainder);
      } else {
        chunkWords += convertTens(chunk);
      }
      words = `${chunkWords} ${thousands[chunkCount]} ${words}`.trim();
    }
    numStr = numStr.slice(0, -3); // Remove last 3 digits
    chunkCount++;
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

  if (num >= 10 && num < 20) return teens[num - 10];
  if (num >= 20) return `${tens[Math.floor(num / 10)]} ${units[num % 10]}`.trim();
  return units[num];
};

// Format date as DD-MMM-YYYY (e.g., 17-Mar-2025)
const formatDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Invoice template with dynamic orderId and date
const INVOICE_TEMPLATE = {
  HEADER: (orderId) => `
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
          <p style="margin: 0; font-size: 14px;"><strong>Invoice No:</strong> ${orderId || "N/A"}</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 14px;"><strong>Date:</strong> ${formatDate()}</p>
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
      <!-- Declaration -->
      <div style="padding: 10px 0; border-top: 1px solid #000;">
        <p style="margin: 0; font-size: 14px;"><strong>Declaration:</strong> We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
      </div>
      <!-- Signature Section -->
      <div style="text-align: right; padding: 10px 0; border-top: 1px solid #000;">
        <p style="margin: 0; font-size: 14px;">MH TRADERS</p>
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