// utils/generateInvoicePDF.js
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import { convertToWords, INVOICE_TEMPLATE } from "../constants/invoiceConstants";

const generateInvoicePDF = async (billingData, address, calculations) => {
  console.log("Starting invoice generation...");

  // Pull out calculations (including orderId now)
  const {
    total_weight,
    total_Transport_expenses_WithoutGST,
    Transport_tax,
    final_Transport_expenses,
    total_Product_Base_Price,
    total_GST_Amount,
    total_Product_Prize_includingGST,
    total_Product_Price_includingGST_and_transport_expenses,
    Transport_tax_Rate = 5, // Default to 5% if missing
    orderId, // New: from payment success

  } = calculations;

  console.log("Calculations:", calculations);

  // Product table rows
  const productRows = billingData
    .map(
      (item, index) => `
      <tr>
        <td style="border: 1px solid #000; padding: 5px;">${index + 1}</td>
        <td style="border: 1px solid #000; padding: 5px;">${item.name}</td>
        <td style="border: 1px solid #000; padding: 5px;">${item.hsn_code}</td>
        <td style="border: 1px solid #000; padding: 5px;">${item.quantity} pcs</td>
        <td style="border: 1px solid #000; padding: 5px;">${(item.price * (1 + item.gst_rate / 100)).toFixed(2)}</td>
        <td style="border: 1px solid #000; padding: 5px;">${item.price.toFixed(2)}</td>
        <td style="border: 1px solid #000; padding: 5px;">${item.totalWithoutGST.toFixed(2)}</td> <!-- Fixed typo -->
      </tr>
    `
    )
    .join("");

  // Build the invoice HTML
  const invoiceHtml = `
    ${INVOICE_TEMPLATE.HEADER(orderId)}
    <!-- Invoice Header with Order ID -->
    <div style="padding: 10px 0; text-align: center; border-bottom: 1px solid #000;">
      <h2 style="margin: 0; font-size: 18px;">Tax Invoice</h2>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Order ID:</strong> ${orderId || "Not Available"}</p>
    </div>
    <!-- Retailer Information -->
    <div style="padding: 10px 0; border-bottom: 1px solid #000;">
      <p style="margin: 0; font-size: 14px;"><strong>Party:</strong> ${address.shopName || "Ram Stationery"}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>State:</strong> ${address.state || "Nagpur"}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Address:</strong> ${[
        address.addressLine1,
        address.addressLine2,
        address.city,
        address.state,
        address.pincode,
        address.country,
      ]
        .filter(Boolean)
        .join(", ") || "No address added"}</p>
    </div>
    <!-- Product Table -->
    <div style="margin-top: 10px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: center;">
        <thead>
          <tr style="background-color: #f2f2f2; border: 1px solid #000;">
            <th style="border: 1px solid #000; padding: 5px;">S.No</th>
            <th style="border: 1px solid #000; padding: 5px;">Description</th>
            <th style="border: 1px solid #000; padding: 5px;">HSN/SAC</th>
            <th style="border: 1px solid #000; padding: 5px;">Quantity</th>
            <th style="border: 1px solid #000; padding: 5px;">Rate (Incl. GST)</th>
            <th style="border: 1px solid #000; padding: 5px;">Rate (Excl. GST)</th>
            <th style="border: 1px solid #000; padding: 5px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
          <tr>
            <td style="border: 1px solid #000; padding: 5px;" colspan="6"><strong>GST Total</strong></td>
            <td style="border: 1px solid #000; padding: 5px;">${total_GST_Amount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 5px;" colspan="6"><strong>Subtotal</strong></td>
            <td style="border: 1px solid #000; padding: 5px;">${total_Product_Prize_includingGST.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Transport Expenses -->
    <div style="padding: 10px 0; border-top: 1px solid #000;">
      <p style="margin: 0; font-size: 14px;"><strong>Total Weight:</strong> ${total_weight} Kg</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Transport Charges (₹120/kg):</strong> ${total_Transport_expenses_WithoutGST.toFixed(2)}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Transport Tax (${Transport_tax_Rate}%):</strong> ${Transport_tax.toFixed(2)}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Total Transport:</strong> ${final_Transport_expenses.toFixed(2)}</p>
    </div>
    <!-- Final Total -->
    <div style="padding: 10px 0; border-top: 1px solid #000;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: center;">
        <thead>
          <tr style="background-color: #f2f2f2; border: 1px solid #000;">
            <th style="border: 1px solid #000; padding: 5px;">Order Amount</th>
            <th style="border: 1px solid #000; padding: 5px;">Transport</th>
            <th style="border: 1px solid #000; padding: 5px;">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 5px;">${total_Product_Prize_includingGST.toFixed(2)}</td>
            <td style="border: 1px solid #000; padding: 5px;">${final_Transport_expenses.toFixed(2)}</td>
            <td style="border: 1px solid #000; padding: 5px;"><strong>${total_Product_Price_includingGST_and_transport_expenses.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Amount in Words -->
    <div style="padding: 10px 0;">
      <p style="margin: 0; font-size: 14px;"><strong>Total Amount (in words):</strong> ${convertToWords(total_Product_Price_includingGST_and_transport_expenses)} INR Only</p>
    </div>
    ${INVOICE_TEMPLATE.FOOTER}
  `;

  try {
    console.log("Creating PDF...");
    const { uri } = await Print.printToFileAsync({
      html: invoiceHtml,
      base64: false,
    });
    console.log("PDF created at:", uri);

    const fileUri = `${FileSystem.documentDirectory}invoice_${orderId || 'temp'}.pdf`; // Name with orderId
    await FileSystem.moveAsync({ from: uri, to: fileUri });
    console.log("PDF moved to:", fileUri);

    if (await Sharing.isAvailableAsync()) {
      console.log("Sharing PDF...");
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/pdf",
        dialogTitle: "Download Invoice",
        UTI: "com.adobe.pdf",
      });
      console.log("PDF shared!");
    } else {
      Alert.alert("Sorry", "Can’t share on this device");
    }
  } catch (error) {
    console.error("PDF error:", error);
    Alert.alert("Oops", "Couldn’t make or download the PDF");
  }
};

export default generateInvoicePDF;