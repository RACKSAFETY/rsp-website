'use client';
// ─────────────────────────────────────────────────────────────────────────────
// useNav — drop-in replacement for the old App.jsx onNav(target, payload).
// Returns a function with the identical (target, payload) signature so every
// existing call site keeps working; under the hood it pushes a real route.
//
// Special case: some sources hand off a large structured payload to the contact
// form — the flue calculator ('flue-calc:' + encoded JSON) and the product-page
// custom spec builder ('custom-req:' + encoded JSON). That blob is stashed in
// sessionStorage and read back by ContactScreen, keeping it out of the URL.
// Everything else maps via targetToHref.
// ─────────────────────────────────────────────────────────────────────────────
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { NavTarget } from '@/src/types';
import { targetToHref, isHandoffPayload } from '@/src/lib/navMap';

// One-shot sessionStorage slot for a structured contact-form handoff.
export const HANDOFF_KEY = 'rsp:contact-handoff';

export function useNav() {
  const router = useRouter();
  return useCallback(
    (target: NavTarget, payload?: string | null) => {
      if (target === 'contact' && isHandoffPayload(payload)) {
        try {
          sessionStorage.setItem(HANDOFF_KEY, payload as string);
        } catch {
          // sessionStorage unavailable — fall through to a plain /contact
        }
      }
      router.push(targetToHref(target, payload));
    },
    [router],
  );
}
