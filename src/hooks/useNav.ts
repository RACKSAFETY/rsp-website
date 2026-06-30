'use client';
// ─────────────────────────────────────────────────────────────────────────────
// useNav — drop-in replacement for the old App.jsx onNav(target, payload).
// Returns a function with the identical (target, payload) signature so every
// existing call site keeps working; under the hood it pushes a real route.
//
// Special case: the flue calculator emits 'flue-calc:' + encoded JSON. That
// structured blob is stashed in sessionStorage and read back by ContactScreen,
// keeping it out of the URL. Everything else maps via targetToHref.
// ─────────────────────────────────────────────────────────────────────────────
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { NavTarget } from '@/src/types';
import { targetToHref } from '@/src/lib/navMap';

export const FLUE_CALC_KEY = 'rsp:flue-calc';

export function useNav() {
  const router = useRouter();
  return useCallback(
    (target: NavTarget, payload?: string | null) => {
      if (target === 'contact' && payload && payload.startsWith('flue-calc:')) {
        try {
          sessionStorage.setItem(FLUE_CALC_KEY, payload);
        } catch {
          // sessionStorage unavailable — fall through to a plain /contact
        }
      }
      router.push(targetToHref(target, payload));
    },
    [router],
  );
}
