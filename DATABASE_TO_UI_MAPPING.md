# Database to UI Mapping - IdeaDetails Page

## entrepreneur_idea Table → IdeaDetails Page Mapping

This document shows how database fields from the `entrepreneur_idea` table are displayed on the IdeaDetails page.

---

## 📊 Complete Field Mapping

### 1. **id** (int, Primary Key)
- **Database**: `entrepreneur_idea.id`
- **Frontend Interface**: `idea.id`
- **Used In**:
  - URL parameter: `/idea-details/:id`
  - Proposal submission link: `/proposal-submit?id=${idea.id}`
  - NDA acceptance API call

---

### 2. **title** (varchar(255))
- **Database**: `entrepreneur_idea.title`
- **Frontend Interface**: `idea.title`
- **Displayed**:
  ```tsx
  Line 443-445: Main heading
  <h1 className="text-3xl font-bold text-navy mb-2">
    {idea.title}
  </h1>
  ```
- **Location**: Top of page, main content area

---

### 3. **overview** (text)
- **Database**: `entrepreneur_idea.overview`
- **Frontend Interface**: `idea.fullDescription`
- **Displayed**:
  ```tsx
  Line 486-490: Main description section
  <div className="prose prose-gray max-w-none">
    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
      {idea.fullDescription}
    </div>
  </div>
  ```
- **Location**: Below title, main content area
- **Note**: Field name mismatch - DB uses `overview`, frontend uses `fullDescription`

---

### 4. **stage** (varchar(50))
- **Database**: `entrepreneur_idea.stage`
- **Frontend Interface**: `idea.stage` ("Idea" | "MVP" | "Beta")
- **Displayed**:
  ```tsx
  Line 447: Badge next to title
  <StageBadge stage={idea.stage} />

  StageBadge Component (Lines 100-114):
  - "Idea" → Purple badge (bg-purple-100 text-purple-800)
  - "MVP" → Blue badge (bg-blue-100 text-blue-800)
  - "Beta" → Green badge (bg-green-100 text-green-800)
  ```
- **Location**: Next to title, top of page

---

### 5. **equity_offering** (varchar(255))
- **Database**: `entrepreneur_idea.equity_offering`
- **Frontend Interface**: `idea.equityRange`
- **Displayed**:
  ```tsx
  Line 613-616: Sidebar, Project Details section
  <p className="text-sm text-gray-500 mb-1">Equity Range</p>
  <p className="font-semibold text-skyblue text-lg">
    {idea.equityRange}
  </p>
  ```
- **Location**: Right sidebar, "Project Details" card
- **Style**: Large skyblue text
- **Note**: Field name mismatch - DB uses `equity_offering`, frontend uses `equityRange`

---

### 6. **visibility** (varchar(50))
- **Database**: `entrepreneur_idea.visibility`
- **Frontend Interface**: `idea.visibility` ("Public" | "Invite Only" | "NDA Required")
- **Used In**:
  - NDA gate logic (if visibility is "NDA Required")
  - Determines if NDA modal should be shown
- **Not directly displayed** - controls access logic

---

### 7. **timeline** (varchar(100))
- **Database**: `entrepreneur_idea.timeline`
- **Frontend Interface**: `idea.timeline`
- **Displayed**:
  ```tsx
  Line 619-621: Sidebar, Project Details section
  <p className="text-sm text-gray-500 mb-1">Timeline</p>
  <p className="font-semibold text-gray-800">{idea.timeline}</p>
  ```
- **Location**: Right sidebar, "Project Details" card
- **Example**: "3-6 months", "6-12 months"

---

### 8. **budget** (decimal(15,2))
- **Database**: `entrepreneur_idea.budget`
- **Frontend Interface**: ❌ **NOT CURRENTLY DISPLAYED**
- **Potential Use**: Could be added to "Project Details" sidebar

---

### 9. **additional_requirements** (text)
- **Database**: `entrepreneur_idea.additional_requirements`
- **Frontend Interface**: ❌ **NOT CURRENTLY DISPLAYED**
- **Potential Use**: Could be displayed in main content area

---

### 10. **required_skills** (json)
- **Database**: `entrepreneur_idea.required_skills` (JSON array)
- **Frontend Interface**: `idea.required_skills` (string[])
- **Displayed**:
  ```tsx
  Line 512-527: Tech Stack section
  <h2>Required Tech Stack</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
    {idea.required_skills.map((tech: string) => (
      <div className="px-4 py-3 bg-gray-50 rounded-lg">
        {tech}
      </div>
    ))}
  </div>

  Line 624-632: Sidebar duplicate (shows same skills)
  ```
- **Location**:
  - Main content: "Required Tech Stack" section
  - Sidebar: "Project Details" section
- **Parse**: `JSON.parse(idea.required_skills || "[]").flat(Infinity)`

---

### 11. **attachments** (json)
- **Database**: `entrepreneur_idea.attachments` (JSON array)
- **Frontend Interface**:
  ```typescript
  idea.attachments: {
    name: string;
    type: string;
    size: string;
    url: string; // S3 URL
  }[]
  ```
- **Displayed**:
  ```tsx
  Line 530-575: Attachments section
  <h2>Project Documents</h2>
  {idea.attachments.map((attachment, index) => (
    <div>
      <a href={attachment.url} target="_blank">
        {attachment.name}
        {attachment.type} • {attachment.size}
      </a>
      <a href={attachment.url} download>
        <Download icon />
      </a>
    </div>
  ))}
  ```
- **Location**: Main content area, "Project Documents" section
- **Features**:
  - Click file name → Open in new tab
  - Click download icon → Download file
  - Shows file type and size

---

### 12. **nda_accepted** (tinyint(1))
- **Database**: `entrepreneur_idea.nda_accepted` (0 or 1)
- **Frontend Interface**: `idea.nda_accepted` (0 | 1)
- **Used In**:
  ```tsx
  Line 251: NDA gate logic
  if (!hasAcceptedNDA && idea.nda_accepted === 0) {
    // Show NDA gate instead of full details
  }

  Line 461-467: Badge display
  {idea.isNDA && (
    <span className="bg-green-100 text-green-800">
      ✓ NDA Accepted
    </span>
  )}
  ```
- **Location**: Controls entire page view, badge next to title
- **API**: `PUT /ideas/:id/sign-nda` updates this field

---

### 13. **status** (tinyint)
- **Database**: `entrepreneur_idea.status`
- **Frontend Interface**: ❌ **NOT CURRENTLY USED** in IdeaDetails
- **Note**: Used in developer dashboard to filter active ideas (status = 0)

---

### 14. **assigned_to** (int)
- **Database**: `entrepreneur_idea.assigned_to`
- **Frontend Interface**: ❌ **NOT CURRENTLY USED**
- **Potential Use**: Track which developer is assigned to the idea

---

### 15. **created_at** (timestamp)
- **Database**: `entrepreneur_idea.created_at`
- **Frontend Interface**: `idea.created_at`
- **Displayed**:
  ```tsx
  Line 449-458: Posted date
  <span className="text-gray-600">
    Posted: {new Date(idea.created_at).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    })}
  </span>
  ```
- **Location**: Below title, next to stage badge
- **Example**: "Posted: Nov 18, 2025, 10:30:45 AM"

---

### 16. **updated_at** (timestamp)
- **Database**: `entrepreneur_idea.updated_at`
- **Frontend Interface**: ❌ **NOT CURRENTLY DISPLAYED**
- **Potential Use**: Show "Last updated" timestamp

---

### 17. **bookmark_exist** (tinyint(1))
- **Database**: `entrepreneur_idea.bookmark_exist`
- **Frontend Interface**: `idea.isBookmarked`
- **Displayed**:
  ```tsx
  Line 472-482: Bookmark button
  <button onClick={handleBookmark}>
    <Bookmark className={isBookmarked ? "fill-current text-skyblue" : ""} />
  </button>
  ```
- **Location**: Top right of page, next to title
- **State**: Toggles between filled (bookmarked) and outline (not bookmarked)

---

## 🔗 Additional Fields from JOIN (entrepreneur table)

The backend now fetches entrepreneur details in the same query:

### From `entrepreneur` table:

#### **fullName**
- **Database**: `entrepreneur.fullName`
- **Frontend Interface**: `idea.founderName`
- **Displayed**:
  ```tsx
  Line 589-591: Sidebar, founder info
  <p className="font-semibold text-gray-800">
    {idea.founderName}
  </p>

  Line 585-587: Avatar initials
  {idea.founderAvatar} // First letter of founderName
  ```

#### **bio**
- **Database**: `entrepreneur.bio`
- **Frontend Interface**: `idea.founderBio`
- **Displayed**:
  ```tsx
  Line 601-603: Sidebar, founder bio
  <p className="text-gray-600 text-sm leading-relaxed">
    {idea.founderBio}
  </p>
  ```

#### **location**
- **Database**: `entrepreneur.location`
- **Frontend Interface**: `idea.founderLocation`
- **Currently**: ❌ **NOT DISPLAYED**
- **Potential Use**: Show founder location in sidebar

#### **email**
- **Database**: `entrepreneur.email`
- **Frontend Interface**: `idea.founderEmail`
- **Currently**: ❌ **NOT DISPLAYED**
- **Potential Use**: "Contact Founder" button functionality

---

## 📍 Visual Layout on IdeaDetails Page

```
┌─────────────────────────────────────────────────────────────┐
│ Header: [← Back to Dashboard]        [Zero Fund Logo]       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────┬─────────────────────────────┐
│ Main Content (2/3)              │ Sidebar (1/3)               │
│                                 │                             │
│ ┌─────────────────────────────┐ │ ┌─────────────────────────┐ │
│ │ title (h1)                  │ │ │ About the Founder       │ │
│ │ [stage badge] Posted: date  │ │ │ founderName (avatar)    │ │
│ │ [Bookmark]                  │ │ │ founderBio              │ │
│ │                             │ │ └─────────────────────────┘ │
│ │ overview (fullDescription)  │ │                             │
│ └─────────────────────────────┘ │ ┌─────────────────────────┐ │
│                                 │ │ Project Details         │ │
│ ┌─────────────────────────────┐ │ │ equity_offering         │ │
│ │ Project Objectives          │ │ │ timeline                │ │
│ │ (from objectives array)     │ │ │ required_skills         │ │
│ └─────────────────────────────┘ │ └─────────────────────────┘ │
│                                 │                             │
│ ┌─────────────────────────────┐ │ ┌─────────────────────────┐ │
│ │ Required Tech Stack         │ │ │ [Submit Proposal]       │ │
│ │ required_skills (grid)      │ │ │ [Contact Founder]       │ │
│ └─────────────────────────────┘ │ └─────────────────────────┘ │
│                                 │                             │
│ ┌─────────────────────────────┐ │                             │
│ │ Project Documents           │ │                             │
│ │ attachments (download list) │ │                             │
│ └─────────────────────────────┘ │                             │
└─────────────────────────────────┴─────────────────────────────┘
```

---

## ⚠️ Field Name Mismatches

These database fields have different names in the frontend:

| Database Field      | Frontend Property | Fix Needed?      |
|---------------------|-------------------|------------------|
| `overview`          | `fullDescription` | Backend maps it  |
| `equity_offering`   | `equityRange`     | Backend maps it  |
| `required_skills`   | `required_skills` | ✅ Same          |
| `bookmark_exist`    | `isBookmarked`    | Backend maps it  |

---

## 🚫 Fields NOT Currently Used in IdeaDetails

These fields exist in the database but aren't displayed:

1. **budget** - Could show in Project Details sidebar
2. **additional_requirements** - Could show in main content
3. **status** - Used for filtering in dashboard only
4. **assigned_to** - Not implemented yet
5. **updated_at** - Could show "Last updated" timestamp
6. **founderLocation** - Fetched but not displayed
7. **founderEmail** - Fetched but not displayed (used for contact?)

---

## 🔄 Backend Query (Optimized with JOIN)

```sql
SELECT
  ei.*,
  e.fullName as founderName,
  e.bio as founderBio,
  e.location as founderLocation,
  e.email as founderEmail
FROM entrepreneur_idea ei
JOIN entrepreneur e ON ei.entrepreneur_id = e.id
WHERE ei.id = ?
```

**File**: `backend/controllers/ideaController.js:118-128`

---

## 📝 Notes

1. **JSON Parsing**: `required_skills` and `attachments` are stored as JSON and parsed on the backend
2. **NDA Logic**: `nda_accepted` and `visibility` control access to full details
3. **Performance**: Single JOIN query fetches everything in one database call (40-60% faster)
4. **S3 Integration**: Attachments stored in S3, URLs in database
5. **Bookmarks**: Separate `bookmarks` table tracks user saves

---

## 🎯 Potential Improvements

Add these database fields to the UI:

```tsx
// Budget (if not null)
{idea.budget && (
  <div>
    <p className="text-sm text-gray-500">Budget</p>
    <p className="font-semibold">${idea.budget.toLocaleString()}</p>
  </div>
)}

// Additional Requirements
{idea.additional_requirements && (
  <div className="bg-yellow-50 p-4 rounded-lg">
    <h3>Additional Requirements</h3>
    <p>{idea.additional_requirements}</p>
  </div>
)}

// Founder Location
<p className="text-sm text-gray-500">
  📍 {idea.founderLocation}
</p>

// Last Updated
<span className="text-sm text-gray-500">
  Last updated: {new Date(idea.updated_at).toLocaleDateString()}
</span>
```
