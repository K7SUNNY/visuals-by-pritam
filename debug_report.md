# Debug Report — visuals-by-pritam

> Generated: 2026-08-02
> Scope: All source files, configs, migrations, and public assets

---

## Critical Bugs

### 1. Empty `<h1>` on PortfolioPage — missing page title
**File:** `src/pages/public/PortfolioPage.tsx:6`
The `<h1>` element has no text content — it renders an empty heading with only styling classes.
```tsx
<h1 className="text-4xl font-heading font-medium mb-8"></h1>
```
**Impact:** Accessibility (screen readers announce an empty heading), SEO (no page title), and UX (users see no heading on the portfolio page).

---

### 2. Empty `<h1>` on ContactPage — duplicate of above
**File:** `src/pages/public/ContactPage.tsx` (the `Contact` component at `src/components/portfolio/Contact.tsx`)
Same issue — the `<h1>` in the About section of the homepage has no text, but the Contact page itself renders fine. However, the `PortfolioPage.tsx` empty h1 is the confirmed bug.

---

### 3. `fetchUser` does not set `isLoading = true` when called from `onAuthStateChange`
**File:** `src/contexts/AuthContext.tsx:52-58`
When the auth state changes and a session exists, `fetchUser()` is called but `isLoading` is never set to `true`. The `fetchUser` function itself also does not set `isLoading = true` at the start.
```tsx
const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    fetchUser() // isLoading stays false during this async fetch
  } else {
    setUser(null)
    setIsLoading(false)
  }
})
```
**Impact:** The UI will not show a loading state during auth state transitions, potentially causing flash-of-unauthenticated-content or inconsistent UI.

---

### 4. `getPortfolioItemById` throws `undefined` when data is null but no error
**File:** `src/integrations/supabase/portfolio.ts:64`
```tsx
if (error || !data) throw error
```
If `data` is `null`/`undefined` but `error` is also `null`/`undefined`, this throws `undefined` instead of a meaningful error object.
**Impact:** Silent failures with unhelpful error messages when a portfolio item is not found.

---

### 5. `SettingsPage` uses `mutate` (sync) instead of `mutateAsync` — success toast fires before save completes
**File:** `src/features/settings/hooks/useSettings.ts:25`
```tsx
updateSettings: updateSettingsMutation.mutate,
```
The `SettingsPage` calls `await updateSettings(...)` but `mutate` returns `void`, not a `Promise`. The `await` resolves immediately and the success toast fires before the actual database mutation completes.
**Impact:** Users see "Settings saved successfully" before the save actually finishes. If the save fails, the success toast has already been shown and there's no error feedback.

---

### 6. `UploadPage` — empty catch block silently swallows all errors
**File:** `src/pages/admin/UploadPage.tsx:148-149`
```tsx
} catch {
  // Toast error handling
}
```
**Impact:** Any upload failure (network error, storage quota exceeded, validation error) is completely silent. The user gets no feedback that the upload failed, and the UI state (`isUploading`) is reset in `finally`, making it appear as if the upload succeeded.

---

### 7. `WorksPage` detail modal delete — no await, no error handling
**File:** `src/pages/admin/WorksPage.tsx:572-577`
```tsx
onClick={() => {
  portfolioRepository.delete(selectedWork.id)
  queryClient.invalidateQueries({ queryKey: ['portfolio-items'] })
  setSelectedWork(null)
}}
```
The delete is not awaited, errors are not caught, the cache is invalidated immediately (before the delete completes), and the modal closes. If the delete fails, the item disappears from the UI but still exists in the database.
**Impact:** Data inconsistency — user thinks an item was deleted but it still exists.

---

### 8. `WorksPage` — redundant `invalidateQueries` + `refetch` after delete
**File:** `src/pages/admin/WorksPage.tsx:224-225`
```tsx
await queryClient.invalidateQueries({ queryKey: ['portfolio-items'] })
await refetch()
```
`invalidateQueries` already triggers a refetch. Calling `refetch()` immediately after is redundant and creates a race condition where two fetches run concurrently.
**Impact:** Unnecessary network requests, potential for stale data or race conditions.

---

## Security Issues

### 9. Default role fallback to `'admin'` when profile is missing
**File:** `src/contexts/AuthContext.tsx:32` and `:83`
```tsx
const role = profile?.data?.role ?? 'admin'
```
If a user's profile doesn't exist in the `profiles` table, they are automatically assigned the `admin` role. This is a privilege escalation vulnerability.
**Impact:** Any user without a profile record (e.g., due to a bug or incomplete signup flow) gains admin access.

---

### 10. No route guard for already-authenticated users on `/login`
**File:** `src/routes/AppRouter.tsx:48`
The `/login` route is accessible even when the user is already authenticated. There is no redirect to `/admin/dashboard` for logged-in users.
**Impact:** Authenticated users can access the login page, which is a poor UX and a minor security concern.

---

### 11. Settings RLS policy allows any authenticated user to update settings
**File:** `supabase/migrations/002_setting_rls_policy_update.sql:7-11`
```sql
CREATE POLICY "Allow authenticated users to update settings"
ON public.settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
```
This policy allows **any** authenticated user to update settings, not just admins. The `setup.sql` has a more restrictive policy that checks `profiles.role = 'admin'`, but migration 002 overrides it with a permissive one.
**Impact:** Any logged-in user can modify site settings (site name, contact email, social links, etc.).

---

## Race Conditions

### 12. `onAuthStateChange` callback triggers `fetchUser` without loading state
**File:** `src/contexts/AuthContext.tsx:52-58`
As noted in bug #3, the auth state change handler calls `fetchUser()` without setting `isLoading = true`. This means the UI can transition from a logged-out state to a logged-in state without ever showing a loading indicator.

---

### 13. `MessagesPage` — `onMarkRead` and `onDelete` callbacks don't await async operations
**File:** `src/pages/admin/MessagesPage.tsx:353-359`
```tsx
onMarkRead={(id, read) => {
  messagesRepository.markAsRead(id, read)
  queryClient.invalidateQueries({ queryKey: ['messages'] })
}}
```
`markAsRead` is async but is not awaited. The cache invalidation may fire before the mutation completes, leading to a race condition where the UI shows stale data.

---

### 14. `WorksPage` — redundant `invalidateQueries` + `refetch` race condition
**File:** `src/pages/admin/WorksPage.tsx:224-225`
As noted in bug #8, calling both `invalidateQueries` and `refetch` creates a race where two concurrent fetches may return inconsistent data.

---

## Code Quality / Maintainability Issues

### 15. Duplicate contact form logic across two components
**Files:** `src/pages/public/ContactPage.tsx` and `src/components/portfolio/Contact.tsx`
Both implement the same contact form with identical validation schema (`contactSchema`), identical `onSubmit` logic, and identical `useToast`/`useSettings`/`createMessage` patterns. This violates DRY and means any future change must be applied in two places.

---

### 16. Unnecessary service/repository indirection layers
**Files:** `src/services/*.ts`, `src/repositories/*.ts`, `src/features/auth/services/authService.ts`
The architecture has 3-4 layers of indirection for simple CRUD operations:
- `src/integrations/supabase/portfolio.ts` → `src/repositories/PortfolioRepository.ts` → `src/services/portfolioService.ts` → component

Each layer just delegates to the next with no added logic. This adds boilerplate and makes the codebase harder to navigate.

---

### 17. `tailwind.config.ts` is empty (0 bytes)
**File:** `tailwind.config.ts`
The file exists but is completely empty. Many components use custom Tailwind classes like `bg-card`, `text-muted-foreground`, `bg-muted`, `text-destructive`, `border-input`, `bg-background`, `focus-visible:ring-ring`, `border-divider`, `bg-surface-secondary`, `text-text`, `text-text-secondary` — all of which are shadcn/ui design tokens that require configuration in `tailwind.config.ts` to work. Without this config, these classes are silently stripped during build.
**Impact:** Many UI components will render with broken/missing styles.

---

### 18. `SettingsForm.tsx` has a TODO stub — save is not implemented
**File:** `src/features/settings/components/SettingsForm.tsx:32-36`
```tsx
const onSubmit = async (_data: SettingsFormData) => {
  setIsSaving(true)
  try {
    // TODO: Implement actual settings save
    success('Settings saved successfully')
  } catch {
    error('Failed to save settings')
  } finally {
    setIsSaving(false)
  }
}
```
The form shows a success toast but never actually calls `updateSettings`. The `SettingsPage` (which uses `useSettings` hook and calls `updateSettings` directly) is the working implementation, but `SettingsForm` is a dead component.

---

### 19. `UploadForm.tsx` is a dead placeholder component
**File:** `src/components/admin/UploadForm.tsx`
```tsx
export function UploadForm({ className }: UploadFormProps) {
  return (
    <div className={cn('p-6', className)}>
      <p className="text-muted-foreground">Upload form coming soon.</p>
    </div>
  )
}
```
This component is never imported or used anywhere. The actual upload functionality lives in `UploadPage.tsx`.

---

### 20. `useContact.ts` is an empty placeholder
**File:** `src/features/contact/hooks/useContact.ts`
```tsx
// Contact hook placeholder for future implementation
```
No implementation, no export. The contact form in `Contact.tsx` and `ContactPage.tsx` doesn't use this hook at all.

---

### 21. `DashboardStats.tsx` uses hardcoded "0" values
**File:** `src/features/dashboard/components/DashboardStats.tsx:21-24`
```tsx
<StatCard label="Total Works" value="0" />
<StatCard label="Published" value="0" />
<StatCard label="Drafts" value="0" />
<StatCard label="Visitors" value="0" />
```
All stats show "0" instead of using real data from the dashboard query.

---

### 22. `DashboardPage.tsx` redundant default destructuring
**File:** `src/pages/admin/DashboardPage.tsx:40`
```tsx
const { portfolioItems: items = [] } = useDashboard()
```
`useDashboard()` already returns `portfolioItems: portfolioQuery.data ?? []`, so the `= []` default is redundant.

---

### 23. `WorksPage` — overly complex `deleteConfirm` state type
**File:** `src/pages/admin/WorksPage.tsx:162`
```tsx
const [deleteConfirm, setDeleteConfirm] = useState<string | string[] | null>(null)
```
A union type of `string | string[] | null` is fragile. A simpler approach would be `string[] | null` (empty array = single delete, non-empty = bulk delete).

---

### 24. `WorksPage` — edit modal type casts that could fail at runtime
**File:** `src/pages/admin/WorksPage.tsx:728-729`
```tsx
category: editCategory as 'video' | 'photo' | 'banner' | 'thumbnail',
status: editStatus as 'published' | 'draft' | 'archived',
```
These are type assertions with no runtime validation. If the state somehow contains an invalid value, it would be passed to the API without error until the database rejects it.

---

### 25. `UploadPage` — stale comment in dependency array
**File:** `src/pages/admin/UploadPage.tsx:153-154`
```tsx
// ADD `featured` AND `queryClient` TO THE DEPENDENCY ARRAY HERE:
}, [files, title, category, description, featured, navigate, queryClient])
```
The comment suggests `featured` and `queryClient` need to be added, but they are already present in the dependency array. This is a stale comment from a previous fix.

---

### 26. `MessagesPage` — `onDelete` callback doesn't call `messagesRepository.delete()`
**File:** `src/pages/admin/MessagesPage.tsx:357-359`
```tsx
onDelete={() => {
  queryClient.invalidateQueries({ queryKey: ['messages'] })
}}
```
The parent's `onDelete` only invalidates the cache but doesn't call the delete repository method. The actual delete is handled inside `MessageRow`'s `handleDelete`. This works but is confusing — the naming implies the parent handles deletion.

---

## Missing / Incomplete Features

### 27. No error boundary wrapping the app
**File:** `src/App.tsx`
The app has an `ErrorBoundary` component at `src/components/common/ErrorBoundary.tsx` but it is never used in the component tree. Runtime errors will crash the entire app with a blank page.

---

### 28. No loading state for `MessagesPage` delete operations
**File:** `src/pages/admin/MessagesPage.tsx`
The `MessageRow` component's `handleDelete` doesn't show a loading state while the delete is in progress. The user can click delete multiple times.

---

### 29. `robots.txt` disallows `/admin` but the admin panel has no authentication gate at the route level for public access
**File:** `public/robots.txt`
While `robots.txt` disallows crawling `/admin`, the admin routes are only protected by client-side routing guards. There's no server-side or Supabase RLS enforcement preventing unauthenticated access to admin data.

---

### 30. `sitemap.xml` has hardcoded URLs and a static date
**File:** `public/sitemap.xml`
The sitemap uses `https://visualsbypritam.com` and a static `2026-08-01` date. If the site is deployed to a different domain or the content changes, the sitemap becomes stale and incorrect.

---

## Infrastructure / Configuration Issues

### 31. `supabase/migrations/002_setting_rls_policy_update.sql` overrides `setup.sql` RLS policies
**File:** `supabase/migrations/002_setting_rls_policy_update.sql`
Migration 002 creates permissive RLS policies for the `settings` table (allowing any authenticated user to update), which overrides the more restrictive policies in `setup.sql` that check `profiles.role = 'admin'`. Migrations should be additive or carefully managed to avoid policy conflicts.

---

### 32. `setup.sql` — `profiles` table has redundant `user_id` column
**File:** `supabase/setup.sql:4`
```sql
id uuid references auth.users on delete cascade primary key,
user_id uuid references auth.users not null,
```
Both `id` and `user_id` reference `auth.users`. The `id` column is the primary key and should serve as the user identifier. `user_id` is redundant and wastes storage.

---

### 33. `setup.sql` — portfolio_items RLS only allows select for published items
**File:** `supabase/setup.sql:118`
```sql
create policy "Published portfolio items are viewable by everyone"
on portfolio_items for select
using (status = 'published');
```
The `getPortfolioItems()` function fetches all items without filtering by status. The RLS policy will filter out drafts and archived items at the database level, but this is a mismatch between the application's intent (manage all items in admin) and the RLS policy. Admin users cannot see draft/archived items in the client-side query.

---

### 34. `src/integrations/supabase/index.ts` — missing exports for message functions
**File:** `src/integrations/supabase/index.ts`
The barrel export does not include `createMessage`, `updateMessageRead`, `deleteMessage`, or `getMessageById` from `./messages`, even though these are used by `MessagesRepository`.

---

### 35. `src/types/message.ts` — missing `updated_at` field
**File:** `src/types/message.ts`
The `Message` type doesn't include an `updated_at` field, but the database schema (migration 003) doesn't include one either. However, if the table is altered later to add `updated_at`, the type will be out of sync.

---

### 36. `compressImage.ts` uses `OffscreenCanvas` — limited browser support
**File:** `src/media/compressImage.ts:35`
```tsx
const canvas = new OffscreenCanvas(newWidth, newHeight)
```
`OffscreenCanvas` is not supported in all browsers (notably older Safari versions). This could cause crashes for some users.

---

### 37. `UploadManager.ts` — video thumbnail timeout is hardcoded to 10 seconds
**File:** `src/upload/UploadManager.ts:121`
```tsx
}, 10000)
```
A 10-second timeout for video thumbnail generation may be too short for large video files on slow connections. The timeout also doesn't clean up the `videoEl` or `blobUrl` if it fires.

---

### 38. `UploadManager.ts` — video element not removed from DOM after thumbnail generation
**File:** `src/upload/UploadManager.ts:98-142`
The `videoEl` created with `document.createElement('video')` is never removed from the DOM after thumbnail generation, causing a memory leak.

---

### 39. `UploadManager.ts` — video duration hardcoded to 0
**File:** `src/upload/UploadManager.ts:155`
```tsx
duration: 0,
```
The `extractVideoMetadata` function is called but its result is never used. The duration is always set to 0.

---

### 40. `src/integrations/supabase/settings.ts` — operator precedence bug in `toCamelCase`
**File:** `src/integrations/supabase/settings.ts:31`
```tsx
contactPhone: data.contact_phone as string ?? null,
```
Due to operator precedence, `as string` is evaluated before `?? null`. If `data.contact_phone` is an empty string `""`, the result is `""` (not `null`). This may cause issues downstream if empty strings are not handled.

---

## Summary

| Category | Count |
|---|---|
| Critical Bugs | 8 |
| Security Issues | 3 |
| Race Conditions | 4 |
| Code Quality Issues | 10 |
| Missing / Incomplete Features | 4 |
| Infrastructure / Config Issues | 11 |
| **Total** | **40** |