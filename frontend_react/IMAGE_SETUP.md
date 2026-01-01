# Adding Images to Landing Page

## Where to Save Your Image

Save your image file in the `public` folder:

```
frontend_react/
  └── public/
      └── hero-image.jpg  (or .png, .webp, etc.)
```

## Image Path Reference

In your React code, reference images in the `public` folder using a path starting with `/`:

- Image saved as: `public/hero-image.jpg`
- Reference in code: `/hero-image.jpg`

**Example:**
```jsx
<img src="/hero-image.jpg" alt="Description" />
```

## Current Image Location

The image is used in:
- **File**: `src/pages/LandingPage.jsx`
- **Line**: ~128 (in the "Right Visual Section")

The current code expects an image named `hero-image.jpg` in the `public` folder.

## Image Recommendations

- **Recommended size**: 800x1000px (or similar 4:5 aspect ratio)
- **File format**: JPG, PNG, or WebP
- **File size**: Optimize for web (under 500KB recommended)
- **Name**: You can change `hero-image.jpg` to any name you want, just update the `src` attribute in the code

## Alternative: Using src/assets

If you prefer to import the image (for better optimization), you can:

1. Save the image in `src/assets/`
2. Import it at the top of the component:
   ```jsx
   import heroImage from '../assets/hero-image.jpg';
   ```
3. Use it in the img tag:
   ```jsx
   <img src={heroImage} alt="Description" />
   ```

However, using the `public` folder is simpler for static images like this.

