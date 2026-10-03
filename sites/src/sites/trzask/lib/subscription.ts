import { subscriptionFrequencies, subscriptionProfiles } from '../data/site';
import type { SubscriptionFrequency, SubscriptionProfile } from '../data/site';
import type { WeightGrams } from '../data/types';
import { unitPricePerKgGr, weightPriceGr } from './pricing';

export interface SubscriptionChoice {
  profileId: SubscriptionProfile['id'];
  weight: WeightGrams;
  frequencyId: SubscriptionFrequency['id'];
}

export interface SubscriptionQuote {
  profile: SubscriptionProfile;
  frequency: SubscriptionFrequency;
  parcelGr: number;
  perKgGr: number;
  monthlyGr: number;
  gramsPerMonth: number;
  cups: number;
}

export const defaultSubscription: SubscriptionChoice = {
  profileId: 'filtr',
  weight: 250,
  frequencyId: '2',
};

const weeksPerMonth = 52 / 12;

export const quoteSubscription = (choice: SubscriptionChoice): SubscriptionQuote => {
  const profile =
    subscriptionProfiles.find(entry => entry.id === choice.profileId) ?? subscriptionProfiles[0];
  const frequency =
    subscriptionFrequencies.find(entry => entry.id === choice.frequencyId) ??
    subscriptionFrequencies[0];
  const parcelGr = weightPriceGr(profile.base250, choice.weight);
  const parcelsPerMonth = weeksPerMonth / frequency.weeks;
  return {
    profile,
    frequency,
    parcelGr,
    perKgGr: unitPricePerKgGr(parcelGr, choice.weight),
    monthlyGr: Math.round((parcelGr * parcelsPerMonth) / 100) * 100,
    gramsPerMonth: Math.round((choice.weight * parcelsPerMonth) / 10) * 10,
    cups: Math.floor(choice.weight / 15),
  };
};
