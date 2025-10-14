# 📁 Asset Organization Guide for EChanneling

## Directory Structure Created

```
public/
├── images/
│   ├── logo/           # Logo variations (light, dark, favicon)
│   ├── icons/          # UI icons, status icons
│   ├── avatars/        # Default avatar images
│   ├── hospitals/      # Hospital images/photos
│   ├── doctors/        # Doctor profile images
│   └── banners/        # Hero banners, promotional images
└── [existing files...]

src/
├── assets/
│   ├── images/         # Component-specific images
│   └── icons/          # SVG icons for components
└── [existing structure...]
```

## 🎯 Usage Guidelines

### **Public Directory (`/public/images/`)**
Use for assets that need direct URL access or SEO optimization:

#### **Logo (`/public/images/logo/`)**
```typescript
// Usage in components
<img src="/images/logo/echanneling-logo.png" alt="EChanneling Logo" />
<link rel="icon" href="/images/logo/favicon.ico" />
```

#### **Avatars (`/public/images/avatars/`)**
```typescript
// Default user avatars
<img src="/images/avatars/default-user.png" alt="User Avatar" />
<img src="/images/avatars/default-doctor.png" alt="Doctor Avatar" />
<img src="/images/avatars/default-hospital.png" alt="Hospital Avatar" />
```

#### **Hospital Images (`/public/images/hospitals/`)**
```typescript
// Hospital photos
<img src="/images/hospitals/apollo-hospital.jpg" alt="Apollo Hospital" />
<img src="/images/hospitals/asiri-hospital.jpg" alt="Asiri Hospital" />
```

#### **Doctor Images (`/public/images/doctors/`)**
```typescript
// Doctor profile photos
<img src="/images/doctors/dr-silva.jpg" alt="Dr. Silva" />
// Or dynamically
<img src={`/images/doctors/${doctor.profileImage}`} alt={doctor.name} />
```

#### **Banners (`/public/images/banners/`)**
```typescript
// Hero banners, promotional images
<img src="/images/banners/hero-banner.jpg" alt="EChanneling Hero" />
<img src="/images/banners/covid-safety.png" alt="COVID Safety" />
```

### **Source Directory (`/src/assets/`)**
Use for assets imported in components (bundled/optimized):

#### **Component Images (`/src/assets/images/`)**
```typescript
import heroImage from '@/assets/images/hero-background.jpg';
import loginBg from '@/assets/images/login-background.png';

// Usage
<div style={{ backgroundImage: `url(${heroImage})` }}>
  <Image src={loginBg} alt="Login Background" />
</div>
```

#### **SVG Icons (`/src/assets/icons/`)**
```typescript
import { ReactComponent as HeartIcon } from '@/assets/icons/heart.svg';
import stethoscopeIcon from '@/assets/icons/stethoscope.svg';

// Usage
<HeartIcon className="w-6 h-6" />
<img src={stethoscopeIcon} alt="Stethoscope" />
```

## 🏥 Healthcare-Specific Asset Categories

### **Medical Icons**
Place in `/public/images/icons/medical/`:
- stethoscope.svg
- heart.svg
- pill.svg
- syringe.svg
- hospital-cross.svg
- ambulance.svg

### **Status Icons**
Place in `/public/images/icons/status/`:
- active.svg (green check)
- inactive.svg (gray circle)
- pending.svg (yellow clock)
- suspended.svg (red cross)

### **Role Icons**
Place in `/public/images/icons/roles/`:
- admin.svg
- doctor.svg
- hospital.svg
- user.svg

### **Specialization Icons**
Place in `/public/images/icons/specializations/`:
- cardiology.svg
- neurology.svg
- pediatrics.svg
- orthopedics.svg

## 📱 Image Optimization Best Practices

### **Recommended Formats:**
- **Logos**: SVG (scalable) or PNG (transparency)
- **Photos**: WebP (modern) or JPEG (fallback)
- **Icons**: SVG (preferred) or PNG
- **Banners**: WebP or JPEG

### **Size Guidelines:**
```typescript
// Logo sizes
favicon.ico: 16x16, 32x32, 48x48
logo-small.png: 120x40
logo-large.png: 300x100

// Avatar sizes
avatar-small: 40x40
avatar-medium: 80x80
avatar-large: 200x200

// Hospital/Doctor photos
profile-thumb: 150x150
profile-medium: 300x300
profile-large: 600x600

// Banners
hero-banner: 1920x600
card-banner: 400x200
```

## 🔧 Next.js Image Component Usage

```typescript
import Image from 'next/image';

// Optimized images (recommended)
<Image
  src="/images/doctors/dr-silva.jpg"
  alt="Dr. Silva"
  width={300}
  height={300}
  priority={true} // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..." // Optional
/>

// For dynamic images
<Image
  src={doctor.profileImage || '/images/avatars/default-doctor.png'}
  alt={doctor.name}
  width={150}
  height={150}
  className="rounded-full"
/>
```

## 🎨 Asset Naming Convention

### **File Naming:**
```
// Use kebab-case
echanneling-logo.png          ✅
eChanneling_Logo.PNG          ❌

// Be descriptive
hero-banner-homepage.jpg      ✅
banner1.jpg                   ❌

// Include size when relevant
logo-small.svg                ✅
logo-large.svg                ✅
logo.svg                      ❌ (ambiguous)
```

### **Dynamic Asset Paths:**
```typescript
// Store in database as filename only
user.profileImage = "dr-silva.jpg"

// Construct full path in component
const imagePath = `/images/doctors/${user.profileImage}`;
const fallbackPath = '/images/avatars/default-doctor.png';

<Image
  src={user.profileImage ? imagePath : fallbackPath}
  alt={user.name}
  width={150}
  height={150}
/>
```

## 🔒 Security Considerations

### **User Uploaded Images:**
```typescript
// Store user uploads outside public directory
const uploadDir = './uploads/'; // Not in public/
const publicPath = '/api/images/'; // Serve via API route

// API route for serving uploads
// pages/api/images/[...path].ts
export default function handler(req, res) {
  // Validate file type, user permissions
  // Serve file with proper headers
}
```

### **Image Validation:**
```typescript
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxSize = 5 * 1024 * 1024; // 5MB

function validateImage(file: File) {
  return allowedTypes.includes(file.type) && file.size <= maxSize;
}
```

## 📦 Asset Management Tips

1. **Use absolute imports**:
   ```typescript
   import logo from '@/assets/images/logo.png';
   ```

2. **Create asset constants**:
   ```typescript
   // src/config/assets.ts
   export const ASSETS = {
     LOGO: '/images/logo/echanneling-logo.svg',
     DEFAULT_AVATAR: '/images/avatars/default-user.png',
     FALLBACK_IMAGE: '/images/placeholder.jpg',
   };
   ```

3. **Environment-specific assets**:
   ```typescript
   const logoPath = process.env.NODE_ENV === 'production' 
     ? '/images/logo/logo-prod.svg'
     : '/images/logo/logo-dev.svg';
   ```

This structure provides a scalable and organized approach to managing assets in your EChanneling healthcare application! 🏥📁
