import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { SelectedProduct } from '../types';

export async function generatePDF(items: SelectedProduct[]) {
  const valid = items.filter(i => i.isSelected && i.quantity > 0);
  
  const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 24px;
            color: #333;
          }
          h1 {
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            padding: 8px 12px;
            border: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
          }
          tr:nth-child(even) {
            background-color: #fafafa;
          }
        </style>
      </head>
      <body>
        <h1>Selected Items to be Ordered</h1>
        <table>
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Quantity</th>
          </tr>
          ${valid.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
            </tr>
          `).join('')}
        </table>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);
}
