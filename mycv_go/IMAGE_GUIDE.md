# Image Guide for MyCVgo

## Where to Add Images

### 1. **Public Folder** (Recommended for static images)
Place images in the `public/` folder at the root of your project:
```
mycv_go/
  └── public/
      ├── images/
      │   ├── hero-rocket.png          # Main hero illustration
      │   ├── ai-section-rocket.png    # AI section rocket
      │   ├── feature-ai.png           # AI feature icon
      │   ├── feature-fast.png          # Lightning fast icon
      │   ├── feature-affordable.png    # Affordable icon
      │   └── logo.png                  # Logo image
      └── ...
```

**Usage in code:**
```jsx
<img src="/images/hero-rocket.png" alt="Rocket" />
```

### 2. **Src Assets Folder** (For imported images)
Place images in `src/assets/` if you want to import them:
```
mycv_go/
  └── src/
      └── assets/
          └── images/
              ├── hero-rocket.png
              └── ...
```

**Usage in code:**
```jsx
import heroRocket from '../assets/images/hero-rocket.png';
<img src={heroRocket} alt="Rocket" />
```

## Recommended Image Sizes

- **Hero Illustration**: 800x600px or larger (will be scaled down)
- **Feature Icons**: 200x200px (square)
- **Logo**: 200x50px (or appropriate aspect ratio)
- **Section Illustrations**: 600x400px or larger

## Image Formats

- Use **PNG** for images with transparency
- Use **JPG/JPEG** for photos (smaller file size)
- Use **SVG** for simple icons/logos (scalable, small file size)
- Use **WebP** for modern browsers (best compression)

## Next Steps

1. Create a `public/images/` folder
2. Add your images there
3. Update the LandingPage.jsx to reference these images
4. The images will be automatically available at `/images/your-image.png`

