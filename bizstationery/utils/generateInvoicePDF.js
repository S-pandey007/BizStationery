// utils/generateInvoicePDF.js
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import { convertToWords, INVOICE_TEMPLATE } from "../constants/invoiceConstants";

const generateInvoicePDF = async (billingData, address, calculations) => {
  console.log("generateInvoicePDF called");
  const {
    total_weight,
    total_Transport_expenses_WithoutGST,
    Transport_tax,
    final_Transport_expenses,
    total_Product_Base_Price,
    total_GST_Amount,
    total_Product_Prize_includingGST,
    Transport_tax_Rate,
    total_Product_Price_includingGST_and_transport_expenses,
  } = calculations;

  console.log("calculations", calculations);

  const productRows = billingData
    .map(
      (item, index) => `
      <tr>
        <td style="border: 1px solid #000; padding: 5px;">${index + 1}</td>
        <td style="border: 1px solid #000; padding: 5px;">${item.name}</td>
        <td style="border: 1px solid #000; padding: 5px;">${item.hsn_code}</td>
        <td style="border: 1px solid #000; padding: 5px;">${item.quantity} pcs</td>
        <td style="border: 1px solid #000; padding: 5px;">${(
          item.price * (1 + item.gst_rate / 100)
        ).toFixed(2)}</td>
        <td style="border: 1px solid #000; padding: 5px;">${item.price.toFixed(2)}</td>
        <td style="border: 1px solid #000; padding: 5px;">${item.totalWithoutGST.toFixed(2)}</td> <!-- Fixed typo -->
      </tr>
    `
    )
    .join("");

  const invoiceHtml = `
    ${INVOICE_TEMPLATE.HEADER}
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
                    <th style="border: 1px solid #000; padding: 5px;">Description of Goods</th>
                    <th style="border: 1px solid #000; padding: 5px;">HSN/SAC</th>
                    <th style="border: 1px solid #000; padding: 5px;">Quantity</th>
                    <th style="border: 1px solid #000; padding: 5px;">Rate (Incl. Tax)</th>
                    <th style="border: 1px solid #000; padding: 5px;">Rate (Excl. Tax)</th>
                    <th style="border: 1px solid #000; padding: 5px;">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${productRows}
                <tr>
                    <td style="border: 1px solid #000; padding: 5px;" colspan="6"><strong>Output IGST</strong></td>
                    <td style="border: 1px solid #000; padding: 5px;">${total_GST_Amount.toFixed(2)}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px;" colspan="6"><strong>Round Off</strong></td>
                    <td style="border: 1px solid #000; padding: 5px;">0.00</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px;" colspan="6"><strong>Discount Paid</strong></td>
                    <td style="border: 1px solid #000; padding: 5px;">0.00</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px;" colspan="4"><strong>Order Total</strong></td>
                    <td style="border: 1px solid #000; padding: 5px;" colspan="2">${billingData.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )} pcs</td>
                    <td style="border: 1px solid #000; padding: 5px;"><strong>${total_Product_Prize_includingGST.toFixed(2)}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- Amount in Words -->
    <div style="padding: 10px 0;">
        <p style="margin: 0; font-size: 14px;"><strong>Amount Chargeable (in words):</strong> ${convertToWords(total_Product_Prize_includingGST)} INR Only</p>
    </div>
    <!-- Transport Expense Section -->
    <div style="padding: 10px 0; border-top: 1px solid #000;">
        <p style="margin: 0; font-size: 14px;"><strong>Total Order Weight:</strong> ${total_weight} Kg</p>
        <p style="margin: 0; font-size: 14px;"><strong>Transport Charges (120/kg):</strong> ${total_Transport_expenses_WithoutGST.toFixed(2)}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Transport Tax ${Transport_tax_Rate}%:</strong> ${Transport_tax.toFixed(2)}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Total Transport Expenses:</strong> ${final_Transport_expenses.toFixed(2)}</p>
    </div>
    <!-- Amount Chargeable With adding all taxes and expenses Section -->
    <div style="padding: 10px 0; border-top: 1px solid #000;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: center;">
            <thead>
                <tr style="background-color: #f2f2f2; border: 1px solid #000;">
                    <th style="border: 1px solid #000; padding: 5px;">Total Order Amount</th>
                    <th style="border: 1px solid #000; padding: 5px;">Total Transport Expenses</th>
                    <th style="border: 1px solid #000; padding: 5px;">Total Chargeable Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px;">${total_Product_Prize_includingGST.toFixed(2)}</td>
                    <td style="border: 1px solid #000; padding: 5px;">${final_Transport_expenses.toFixed(2)}</td>
                    <td style="border: 1px solid #000; padding: 5px;">${total_Product_Price_includingGST_and_transport_expenses.toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- Tax Amount in Words -->
    <div style="padding: 10px 0;">
        <p style="margin: 0; font-size: 14px;"><strong>Tax Amount (in words):</strong> ${convertToWords(total_Product_Price_includingGST_and_transport_expenses)} INR Only</p>
    </div>
    ${INVOICE_TEMPLATE.FOOTER}
  `;

  try {
    console.log("Generating PDF file...");
    const { uri } = await Print.printToFileAsync({
      html: invoiceHtml,
      base64: false,
    });
    console.log("PDF file generated at:", uri);

    const fileUri = `${FileSystem.documentDirectory}invoice.pdf`;
    console.log("Moving file to:", fileUri);
    await FileSystem.moveAsync({
      from: uri,
      to: fileUri,
    });
    console.log("File moved successfully");

    console.log("Checking sharing availability...");
    if (await Sharing.isAvailableAsync()) {
      console.log("Sharing PDF...");
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/pdf",
        dialogTitle: "Download Invoice",
        UTI: "com.adobe.pdf",
      });
      console.log("PDF shared successfully");
    } else {
      console.log("Sharing not available");
      Alert.alert("Error", "Sharing is not available on this device");
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    Alert.alert("Error", "Failed to generate or download the PDF");
  }
};

export default generateInvoicePDF;