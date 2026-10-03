import { deliveryMethods, freeDeliveryFromGr } from '../data/site';
import type { DeliveryId, DeliveryMethod } from '../data/site';
import { formatPln } from './money';

export interface FreeDeliveryStatus {
  reached: boolean;
  remainingGr: number;
  progress: number;
}

export const getDeliveryMethod = (id: string | null): DeliveryMethod | undefined =>
  deliveryMethods.find(method => method.id === id);

export const freeDeliveryStatus = (
  goodsAfterDiscountGr: number,
  thresholdGr: number = freeDeliveryFromGr,
): FreeDeliveryStatus => {
  const reached = goodsAfterDiscountGr >= thresholdGr;
  const remainingGr = reached ? 0 : thresholdGr - goodsAfterDiscountGr;
  const progress = Math.min(1, Math.max(0, goodsAfterDiscountGr / thresholdGr));
  return { reached, remainingGr, progress };
};

export const deliveryCostGr = (
  methodId: DeliveryId | null,
  goodsAfterDiscountGr: number,
  thresholdGr: number = freeDeliveryFromGr,
): number => {
  const method = getDeliveryMethod(methodId);
  if (!method) return 0;
  if (goodsAfterDiscountGr >= thresholdGr) return 0;
  return method.priceGr;
};

export const freeDeliveryMessage = (status: FreeDeliveryStatus, itemCount: number): string => {
  if (itemCount === 0) {
    return `Dostawa gratis od ${formatPln(freeDeliveryFromGr, true)}.`;
  }
  if (status.reached) {
    return 'Masz darmową dostawę: paczkomat i kurier za 0 zł.';
  }
  return `Do darmowej dostawy brakuje ${formatPln(status.remainingGr)}.`;
};
