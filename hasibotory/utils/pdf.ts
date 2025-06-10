// utils/pdf.ts
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { SelectedProduct } from '../types';

export async function generatePDF(items: SelectedProduct[]) {
  const valid = items.filter(i => i.isSelected && i.quantity > 0);
  const html = `
    <html>
      <body>
        <h1>Selected Products</h1>
        <ul>
          ${valid.map(i => `<li>${i.name} — Qty: ${i.quantity}</li>`).join('')}
        </ul>
      </body>
    </html>
  `;
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);
}
