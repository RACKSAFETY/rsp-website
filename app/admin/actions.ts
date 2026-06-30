'use server';

import { revalidatePath } from 'next/cache';
import { updateQuoteStatus, deleteQuote } from '@/src/lib/quotes';

// Server actions invoked from the admin row controls. They run server-side
// (behind the /admin Basic Auth middleware) and refresh the page data.

export async function setQuoteStatusAction(id: string, status: string): Promise<void> {
  await updateQuoteStatus(id, status);
  revalidatePath('/admin');
}

export async function deleteQuoteAction(id: string): Promise<void> {
  await deleteQuote(id);
  revalidatePath('/admin');
}
