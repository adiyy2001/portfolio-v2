export const commissionRate = 0.02;
export const vatRate = 0.23;
export const minimumNetCommission = 6000;

export interface Commission {
  net: number;
  vat: number;
  gross: number;
}

export const commissionFor = (price: number): Commission => {
  const net = Math.round(Math.max(price * commissionRate, price > 0 ? minimumNetCommission : 0));
  const vat = Math.round(net * vatRate);
  return { net, vat, gross: net + vat };
};
