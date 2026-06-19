---
name: sidebar-configuration
description: Used when adding, changing or ordering items in a role panel's sidebar. Always builds the sidebar as a nested (module-in-module) tree, and every item must carry an icon.
---

# Sidebar configuration (nested + icon-safe)

## When to use
- Adding a new link/section to a role panel's sidebar (`owner/`, or a cloned panel like `admin/`).
- Reordering, renaming, grouping, or nesting existing sidebar items.
- Whenever a new feature page needs to be reachable from the sidebar.

## Where it lives
- Config (data only): `client/src/<role>/navigation/sidebar.config.js`
- Renderer (do NOT edit per-feature): `client/src/shared/components/layout/AppSidebar.jsx`
- Role -> config wiring: `ROLE_SIDEBAR` map in `AppSidebar.jsx`

> You normally edit ONLY `sidebar.config.js`. The renderer already supports unlimited nesting and per-item icons.

## Two hard rules (always)

### 1. Always build it as a nested tree (module-in-module)
The sidebar is a recursive tree, not a flat list. A node is one of two kinds:

- **Branch** — has an `items: [...]` array. Rendered as a collapsible section that can contain more branches or leaves (any depth).
- **Leaf** — has a `url` (no `items`). Rendered as a `<Link>`.

When asked to add something, place it as a module inside the relevant module, not as a new top-level entry, unless it is genuinely a new top-level domain.

### 2. Every node MUST have an `icon`
`icon` is a `lucide-react` component (passed by reference, not rendered: `icon: Users`, never `<Users />`).

This is mandatory because when the sidebar collapses to **icon mode** (`collapsible="icon"`), the label text is hidden and only the icon remains. A node without an icon becomes an empty, broken-looking slot. So:

- Top-level branch -> icon (the only thing visible in icon mode).
- Nested branch -> icon (shown left of its title when expanded).
- Leaf -> icon (shown left of its title when expanded).

Pick an icon that matches the section's meaning (e.g. `Users` for foydalanuvchilar, `Settings` for sozlamalar, `FileText` for hujjatlar, `ShieldCheck` for ruxsatlar).

## Node shape

```js
{
  title: "Foydalanuvchilar",   // UI text -> Uzbek
  icon: Users,                 // REQUIRED, lucide-react component reference
  isActive: true,              // optional: open this branch by default
  permission: "users.read",    // optional: hidden unless user has it (owner always sees)
  url: "/owner/users",         // leaf only (omit when `items` is present)
  items: [ /* child nodes */ ] // branch only (omit on a leaf)
}
```

Rules:
- `title` — Uzbek. `url`, `permission`, code values — English.
- A node has **either** `url` (leaf) **or** `items` (branch), never both.
- `permission` works at any depth. A branch is auto-hidden if every descendant is permission-filtered out (the renderer prunes empty branches).

## Full nested example

```js
// client/src/owner/navigation/sidebar.config.js
import { LayoutDashboard, Users, ShieldCheck, Settings, FileText } from "lucide-react";

const ownerSidebar = [
  {
    title: "Boshqaruv paneli",
    icon: LayoutDashboard,
    isActive: true,
    items: [{ title: "Bosh sahifa", icon: LayoutDashboard, url: "/owner/dashboard" }],
  },
  {
    title: "Foydalanuvchilar",
    icon: Users,
    items: [
      { title: "Ro'yxat", icon: Users, url: "/owner/users", permission: "users.read" },
      {
        title: "Ruxsatlar",          // nested branch (module inside module)
        icon: ShieldCheck,
        items: [
          { title: "Rollar", icon: ShieldCheck, url: "/owner/roles" },
          { title: "Permissionlar", icon: FileText, url: "/owner/permissions" },
        ],
      },
    ],
  },
  {
    title: "Sozlamalar",
    icon: Settings,
    items: [{ title: "Umumiy", icon: Settings, url: "/owner/settings" }],
  },
];

export default ownerSidebar;
```

## Steps to add an item

1. Open `client/src/<role>/navigation/sidebar.config.js`.
2. Import the chosen `lucide-react` icon(s).
3. Add the node in the right place in the tree:
   - new sub-page of an existing section -> push a leaf into that branch's `items`;
   - new sub-group -> push a branch (with its own `icon` + `items`) into the parent's `items`;
   - new top-level domain -> add a top-level branch.
4. Give the node an `icon` and Uzbek `title`. Set `permission` if access-gated.
5. Make sure the `url` matches a real route in `client/src/<role>/routes/index.jsx`.

## New role panel
When cloning `owner/` to a new panel, also register it in `AppSidebar.jsx`:

```js
const ROLE_SIDEBAR = {
  [ROLES.OWNER]: ownerSidebar,
  [ROLES.ADMIN]: adminSidebar, // <- import from "@/admin"
};
```

## Checklist
- [ ] Every node (top, nested, leaf) has an `icon`.
- [ ] Nesting reflects real module structure (module-in-module), not a flat dump.
- [ ] `title` in Uzbek; `url` / `permission` in English.
- [ ] Each leaf `url` points to an existing route.
- [ ] Did NOT touch `AppSidebar.jsx` unless registering a new role.
