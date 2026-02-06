# Settings - Modular Structure

This folder contains the refactored Settings component with a clean, modular structure supporting both Developer and Entrepreneur profiles.

## Folder Structure

```
settings/
├── Settings.tsx                           # Main entry point
├── types.ts                               # TypeScript interfaces
└── components/
    ├── LoadingScreen.tsx                  # Loading state component
    ├── EntrepreneurProfile.tsx            # Entrepreneur profile container
    ├── DeveloperProfile.tsx               # Developer profile container
    │
    ├── # Entrepreneur Components
    ├── ProfileHeader.tsx                  # Name, headline, location
    ├── CompanyInfo.tsx                    # Company details
    ├── VisionPitch.tsx                    # Vision/pitch textarea
    ├── ContactInfo.tsx                    # Contact information
    ├── SaveButton.tsx                     # Save profile button
    │
    └── # Developer Components
        ├── DeveloperHeader.tsx            # Profile pic, name, location, save
        ├── DeveloperContactInfo.tsx       # Contact information
        ├── SkillsSection.tsx              # Skills management
        ├── ProjectsSection.tsx            # Projects management
        └── SocialLinksSection.tsx         # Social links management
```

## Component Responsibilities

### Settings.tsx
- Main entry point
- Manages global state (user data, saving state, upload state)
- Handles API calls (fetch user, save profile, upload profile picture)
- Routes to appropriate profile type (Entrepreneur/Developer)

### types.ts
- Defines TypeScript interfaces:
  - `UserData` - User profile data
  - `SocialLink` - Social media links
  - `Project` - Developer projects

### LoadingScreen.tsx
- Animated loading screen shown while fetching user data
- Displays logo and skeleton loaders

### Entrepreneur Components

#### EntrepreneurProfile.tsx
- Container for all entrepreneur-specific sections
- Orchestrates: ProfileHeader, CompanyInfo, VisionPitch, ContactInfo, SaveButton

#### ProfileHeader.tsx
- Name display
- Headline input (e.g., "Founder & CEO")
- Location input with globe icon

#### CompanyInfo.tsx
- Company/startup name
- Industry field
- Company website URL

#### VisionPitch.tsx
- Multi-line textarea for startup vision
- Problem/solution description

#### ContactInfo.tsx
- Email input with mail icon

#### SaveButton.tsx
- Reusable save button
- Shows "Saving..." state with disabled styling

### Developer Components

#### DeveloperProfile.tsx
- Container for all developer-specific sections
- Orchestrates: DeveloperHeader, ContactInfo, Skills, Projects, SocialLinks

#### DeveloperHeader.tsx
- Cover photo
- Profile picture with upload functionality
- Loading states for image upload
- Name and location inputs
- Bio textarea
- Inline save button

#### DeveloperContactInfo.tsx
- Email input with mail icon

#### SkillsSection.tsx
- Add/remove skills
- Editable skill chips
- Skills array management

#### ProjectsSection.tsx
- Add/remove projects
- Project name, URL, description inputs
- Projects array management

#### SocialLinksSection.tsx
- Add/remove social links
- Platform and URL inputs
- Social links array management

## Key Features

### Saving State Fix
The main issue was that `alert("Saving")` was blocking React's re-render. The solution:

```tsx
// ❌ Bad - alert blocks re-render
alert("Saving");
setIsSaving(true);

// ✅ Good - setTimeout allows React to update UI first
setIsSaving(true);
setTimeout(async () => {
  // ... save logic
  alert("Profile updated successfully!");
  setIsSaving(false);
}, 100);
```

This ensures:
1. User clicks "Save Profile"
2. UI immediately shows "Saving..." (button disabled)
3. API call happens
4. Success/error alert shows
5. Button returns to normal state

### Profile Picture Upload (Developer Only)
- Optimistic UI update with temporary blob URL
- Loading spinner overlay during upload
- Image loading state handling
- Fallback to initials if no picture

### Form State Management
- All inputs controlled by React state
- Instant updates on user input
- Proper TypeScript typing throughout

## Usage

Import the main component:

```tsx
import Settings from './settings/Settings';

// In your router or app
<Route path="/settings" element={<Settings />} />
```

## User Type Detection

The component automatically detects user type from localStorage:

```tsx
const userData = JSON.parse(localStorage.getItem("userData"));
const userType = userData.userType; // "developer" or "entrepreneur"
```

Then renders the appropriate profile:
- `userType === "entrepreneur"` → EntrepreneurProfile
- `userType === "developer"` → DeveloperProfile

## Benefits

1. **Separation of Concerns**: Each component handles one specific section
2. **Reusability**: Components like SaveButton can be reused
3. **Type Safety**: Full TypeScript support throughout
4. **Maintainability**: Easy to find and fix bugs in specific features
5. **Scalability**: Easy to add new profile fields or sections
6. **Clean Code**: No massive 500+ line components
7. **Better UX**: Proper loading states and feedback

## API Endpoints

- **Fetch User**: `GET /developer/{id}` or `GET /entrepreneur/{id}`
- **Update User**: `PUT /developer/{id}` or `PUT /entrepreneur/{id}`
- **Upload Profile Pic**: `POST /developer/{id}/upload` (Developer only)

## State Management

All state is managed in the main `Settings.tsx` component:
- `user` - User profile data
- `isSaving` - Save button loading state
- `isUploading` - Profile picture upload state
- `isImageLoading` - Image loading state
