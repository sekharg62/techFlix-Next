import type { PaymentMethod, PaymentMethodType } from "@/types/catalog";
import { siteConfig } from "@/constants/siteConfig";

export const MFS_STYLE: Record<
  PaymentMethodType,
  { name: string; imageSrc: string; borderColor: string; bgLight: string }
> = {
  BKASH: {
    name: "bKash",
    imageSrc: "/images/bkash.png",
    borderColor: "border-[#E2136E]",
    bgLight: "bg-pink-50 dark:bg-pink-950/40 text-[#E2136E]",
  },
  NAGAD: {
    name: "Nagad",
    imageSrc: "/images/nagad.png",
    borderColor: "border-[#F7931E]",
    bgLight: "bg-orange-50 dark:bg-orange-950/40 text-[#F7931E]",
  },
  ROCKET: {
    name: "Rocket",
    imageSrc: "/images/rocket.png",
    borderColor: "border-[#8C3494]",
    bgLight: "bg-purple-50 dark:bg-purple-950/40 text-[#8C3494]",
  },
};

const ORDER: PaymentMethodType[] = ["BKASH", "NAGAD", "ROCKET"];

/** Admin-configured methods, or the numbers in siteConfig if none are set up yet. */
export const resolvePaymentMethods = (fromApi: PaymentMethod[]): PaymentMethod[] => {
  const list: PaymentMethod[] = fromApi.length
    ? fromApi
    : [
        { method: "BKASH", accountNumber: siteConfig.bkashNumber, accountType: "Personal", instructions: null },
        { method: "NAGAD", accountNumber: siteConfig.nagadNumber, accountType: "Personal", instructions: null },
        { method: "ROCKET", accountNumber: siteConfig.rocketNumber, accountType: "Personal", instructions: null },
      ];
  return [...list].sort((a, b) => ORDER.indexOf(a.method) - ORDER.indexOf(b.method));
};
