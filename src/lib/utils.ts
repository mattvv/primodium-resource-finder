import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Hex, trim, pad, size, type Address } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseHex(val: string): Hex {
  if (!val.startsWith("\\x")) throw Error("Not a hex value:" + val);

  return `0x${val.slice(2)}`;
}

export function hexToAddress(address: Hex): Address {
  const trimmed = trim(address);

  return size(trimmed) > 20 ? trimmed : pad(trimmed, { size: 20 });
}

export function shortenAddress(address: Address) {
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}
