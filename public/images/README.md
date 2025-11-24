# Image Assets Guide

This folder (`public/images`) is where you should place the images for the website.
The code has been updated to look for images in this folder.

## Required Images

Please add the following images to this folder:

1.  **About Section**
    *   Filename: `about-us.jpg`
    *   Description: An image showing the Primis team, building, or a classroom environment.
    *   Recommended Size: 800x600 pixels or larger.

2.  **College Prep Section**
    *   Filename: `college-prep-bg.jpg`
    *   Description: A background image for the College Prep section (e.g., university campus, students studying).
    *   Recommended Size: 1920x1080 pixels (high quality).

3.  **Corporate Training Section**
    *   Filename: `corporate-training.jpg`
    *   Description: An image showing a corporate training session or professional setting.
    *   Recommended Size: 800x600 pixels.

4.  **Team Members**
    *   Filenames: `team-1.jpg`, `team-2.jpg`, `team-3.jpg`, etc.
    *   Description: Headshots of the team members.
    *   Recommended Size: 400x400 pixels (square).
    *   Note: The code loops through the team members, so name them sequentially based on the order in `messages/en.json`.

5.  **About Page - Hero Background**
    *   Filename: `about-hero-bg.jpg`
    *   Description: A high-quality background image for the About page hero section.
    *   Recommended Size: 1920x1080 pixels.

6.  **About Page - Mission**
    *   Filename: `mission.jpg`
    *   Description: An image representing the mission of Primis Educare.
    *   Recommended Size: 800x600 pixels.

7.  **About Page - Achievements Background**
    *   Filename: `achievements-bg.jpg`
    *   Description: A background image for the achievements section.
    *   Recommended Size: 1920x1080 pixels.

## How to Enable Images

Once you have added the images:

1.  Open `src/app/[locale]/page.tsx`.
2.  Search for "Uncomment when image is added".
3.  Uncomment the `<Image ... />` code blocks and remove the placeholder `<div>` blocks.

Example change:

**Before:**
```tsx
<div className="absolute inset-0 bg-gray-200 ...">
  <span>Add image: /public/images/about-us.jpg</span>
</div>
{/* 
<Image src="/images/about-us.jpg" ... />
*/}
```

**After:**
```tsx
{/* 
<div className="absolute inset-0 bg-gray-200 ...">
  <span>Add image: /public/images/about-us.jpg</span>
</div>
*/}
<Image src="/images/about-us.jpg" ... />
```
