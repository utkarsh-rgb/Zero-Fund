# Developer Dashboard - Modular Structure

This folder contains the refactored Developer Dashboard with a clean, modular component structure.

## Folder Structure

```
developer-dashboard/
├── DeveloperDashboard.tsx          # Main dashboard component (entry point)
├── types.ts                        # TypeScript interfaces and types
└── components/
    ├── Sidebar.tsx                 # Navigation sidebar with stats
    ├── OverviewTab.tsx             # Overview/Dashboard tab
    ├── IdeaFeedTab.tsx             # Startup ideas feed
    ├── BookmarksTab.tsx            # Bookmarked ideas
    ├── ProposalsTab.tsx            # User proposals
    ├── ContractsTab.tsx            # Pending contracts
    ├── CollaborationsTab.tsx       # Active collaborations
    ├── ContractModal.tsx           # Modal for contract details
    ├── MessagesTab.tsx             # Messages placeholder
    └── Badges.tsx                  # Reusable badge components
```

## Component Responsibilities

### DeveloperDashboard.tsx
- Main entry point that imports and orchestrates all components
- Manages global state (active tab, ideas, proposals, etc.)
- Handles data fetching and API calls
- Renders sidebar and active tab content

### types.ts
- Defines TypeScript interfaces for:
  - Idea
  - Proposal
  - Collaboration

### components/Sidebar.tsx
- Navigation menu
- Quick stats display
- Mobile responsive with hamburger menu

### components/OverviewTab.tsx
- Dashboard overview with analytics cards
- Recent proposals and opportunities
- Statistics visualization

### components/IdeaFeedTab.tsx
- Displays all startup ideas
- Search and sort functionality
- Idea cards with bookmark toggle

### components/BookmarksTab.tsx
- Shows bookmarked ideas
- Filters ideas where isBookmarked is true

### components/ProposalsTab.tsx
- Lists all submitted proposals
- Shows proposal status with badges

### components/ContractsTab.tsx
- Displays pending contracts awaiting signature
- Integration with contract review flow

### components/CollaborationsTab.tsx
- Shows active collaborations
- Only displays fully signed contracts

### components/ContractModal.tsx
- Reusable modal for viewing contract details
- Used by both ContractsTab and CollaborationsTab

### components/MessagesTab.tsx
- Placeholder for messaging functionality

### components/Badges.tsx
- Reusable badge components:
  - StatusBadge (for proposals)
  - StageBadge (for idea stages)

## Usage

Import the main component:

```tsx
import DeveloperDashboard from './developer-dashboard/DeveloperDashboard';

// In your router or app
<Route path="/developer-dashboard" element={<DeveloperDashboard />} />
```

## Benefits of This Structure

1. **Modularity**: Each component has a single, clear responsibility
2. **Reusability**: Components like badges and modals can be reused
3. **Maintainability**: Easier to find and fix bugs in specific features
4. **Scalability**: Easy to add new tabs or features
5. **Testing**: Individual components can be tested in isolation
6. **Code Organization**: Clear separation of concerns
7. **Type Safety**: Centralized type definitions

## Notes

- All components use TypeScript for type safety
- Tailwind CSS is used for styling
- React Router is used for navigation
- Icons from lucide-react
