# /src/assets/ — Lyrix Digital Image Pipeline

Drop images here for automatic optimization via Astro's `astro:assets`.

## How to use

```astro
---
// In any .astro component:
import heroImg from '../assets/hero-desktop.jpg';
import OptimizedImage from '../components/OptimizedImage.astro';
import Picture from '../components/Picture.astro';
---

<!-- Simple optimized image (lazy by default) -->
<OptimizedImage src={heroImg} alt="Project showcase" />

<!-- LCP image (above the fold) -->
<OptimizedImage src={heroImg} alt="Hero background" priority />

<!-- Art-directed (different crops for mobile/desktop) -->
<Picture
  mobile={{ src: heroMobile, width: 640, height: 960 }}
  desktop={{ src: heroDesktop, width: 1920, height: 1080 }}
  alt="Hero background"
  priority
/>
```

## Supported formats

Astro will auto-convert to WebP/AVIF. Source files can be:
- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.avif`
- `.gif`
- `.svg` (passed through, not optimized)

## Naming convention

```
hero-desktop.jpg     → 1920×1080, desktop hero
hero-mobile.jpg      → 640×960,   mobile hero (art-directed crop)
portfolio-*.jpg      → Project screenshots
og-image.png         → 1200×630 (lives in /public/ for static URL)
```
