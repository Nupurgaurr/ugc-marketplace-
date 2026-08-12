import type { ClientAccount } from '../types';

/** PROTOTYPE DATA — mirrors the `clients` table described in HANDOVER_GUIDE.md. */
export const clients: ClientAccount[] = [
  {
    id: 'cl_01',
    brand: 'Suvana Skincare',
    website: 'suvanaskincare.com',
    contactName: 'Rhea Kapoor',
    email: 'rhea@suvanaskincare.com',
    phone: '+91 98200 12300',
    industries: ['Beauty & Skincare'],
    sellsWhere: ['D2C site', 'Marketplace'],
    targetLanguages: ['Hindi', 'English'],
    contentStylesNeeded: ['GRWM', 'Unboxing'],
    monthlyBudgetBand: '₹50k – ₹1.5L',
    typicalVolume: '4-6 videos / month',
    usageRights: 'Paid ads',
    status: 'approved',
    submittedAt: '2026-05-02',
  },
  {
    id: 'cl_02',
    brand: 'Northgrid Foods',
    website: 'northgridfoods.in',
    contactName: 'Aman Verma',
    email: 'aman@northgridfoods.in',
    phone: '+91 90210 45600',
    industries: ['Food & Beverage'],
    sellsWhere: ['D2C site', 'Retail'],
    targetLanguages: ['Tamil', 'English'],
    contentStylesNeeded: ['Recipe', 'Testimonial'],
    monthlyBudgetBand: '₹20k – ₹50k',
    typicalVolume: '2-3 videos / month',
    usageRights: 'Organic only',
    status: 'approved',
    submittedAt: '2026-06-14',
  },
  {
    id: 'cl_03',
    brand: 'Loopwear',
    website: 'loopwear.co',
    contactName: 'Simran Kaur',
    email: 'simran@loopwear.co',
    phone: '+91 98330 78901',
    industries: ['Fashion & Apparel'],
    sellsWhere: ['D2C site', 'App'],
    targetLanguages: ['English', 'Malayalam'],
    contentStylesNeeded: ['Try-on haul', 'GRWM'],
    monthlyBudgetBand: '₹1.5L +',
    typicalVolume: '8+ videos / month',
    usageRights: 'Whitelisting',
    status: 'pending',
    submittedAt: '2026-08-08',
  },
  {
    id: 'cl_04',
    brand: 'Fitrik',
    website: 'fitrik.app',
    contactName: 'Karan Oberoi',
    email: 'karan@fitrik.app',
    phone: '+91 90120 65432',
    industries: ['Fitness & Wellness'],
    sellsWhere: ['App'],
    targetLanguages: ['Hindi', 'Gujarati'],
    contentStylesNeeded: ['Testimonial', 'Day-in-the-life'],
    monthlyBudgetBand: '₹20k – ₹50k',
    typicalVolume: '2-3 videos / month',
    usageRights: 'Paid ads',
    status: 'pending',
    submittedAt: '2026-08-10',
  },
];

export function getApprovedClients(): ClientAccount[] {
  return clients.filter((c) => c.status === 'approved');
}

export function getPendingClients(): ClientAccount[] {
  return clients.filter((c) => c.status === 'pending');
}

export function getClientById(id: string): ClientAccount | undefined {
  return clients.find((c) => c.id === id);
}

export function setClientStatus(id: string, status: ClientAccount['status']): void {
  const client = clients.find((c) => c.id === id);
  if (client) client.status = status;
}

export const BUDGET_BANDS = ['Under ₹20k', '₹20k – ₹50k', '₹50k – ₹1.5L', '₹1.5L +'];
export const VOLUME_BANDS = ['1 video / month', '2-3 videos / month', '4-6 videos / month', '8+ videos / month'];
export const SELLS_WHERE = ['D2C site', 'Marketplace', 'Retail', 'App'];
export const USAGE_RIGHTS = ['Organic only', 'Paid ads', 'Whitelisting'];
