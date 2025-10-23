# ANXRPG - Deployment Guide

This guide covers how to deploy ANXRPG to various static hosting platforms.

## 📦 Building for Production

```bash
npm install         # Install dependencies
npm run build       # Create production build
```

This creates an optimized build in the `dist/` directory:
- **Total Size**: ~305 KB (223 KB JS + 81 KB CSS)
- **Gzipped Size**: ~69 KB (56.8 KB JS + 12.5 KB CSS)
- **All assets bundled and optimized**

## 🚀 Deployment Options

### Option 1: GitHub Pages

1. **Setup GitHub Pages**:
   - Go to your repository settings
   - Navigate to Pages section
   - Select "Deploy from a branch"
   - Choose `main` branch and `/docs` folder (or use GitHub Actions)

2. **Deploy using GitHub Actions** (Recommended):
   
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       
       steps:
       - uses: actions/checkout@v3
       
       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
           
       - name: Install dependencies
         run: npm install
         
       - name: Build
         run: npm run build
         
       - name: Deploy
         uses: peaceiris/actions-gh-pages@v3
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./dist
   ```

3. **Manual deployment**:
   ```bash
   npm run build
   # Copy contents of dist/ to gh-pages branch
   ```

### Option 2: Netlify

1. **Via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   npm run build
   netlify deploy --prod --dir=dist
   ```

2. **Via Netlify UI**:
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Deploy!

### Option 3: Vercel

1. **Via Vercel CLI**:
   ```bash
   npm install -g vercel
   npm run build
   vercel --prod
   ```

2. **Via Vercel UI**:
   - Import your GitHub repository
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Deploy!

### Option 4: Static Web Servers

Deploy the `dist/` folder to any static web server:

```bash
# Example: Using Python's HTTP server
cd dist
python -m http.server 8000

# Example: Using Node's http-server
npx http-server dist -p 8000
```

## 🔧 Configuration

### Base URL Configuration

If deploying to a subdirectory (e.g., `https://example.com/anxrpg/`), update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/anxrpg/', // Your subdirectory path
  // ... rest of config
})
```

Then rebuild:
```bash
npm run build
```

### Custom Domain

For custom domains:
1. **GitHub Pages**: Add a `CNAME` file in the `public/` directory
2. **Netlify/Vercel**: Configure custom domain in their dashboards

## ✅ Pre-Deployment Checklist

- [ ] Run `npm run type-check` - Ensure no TypeScript errors
- [ ] Run `npm run build` - Verify build succeeds
- [ ] Test the production build locally: `npm run preview`
- [ ] Check browser console for errors
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices (responsive design)
- [ ] Verify save/load functionality works
- [ ] Test game progression through multiple stages

## 🧪 Testing Production Build Locally

```bash
npm run preview
# Opens production build at http://localhost:4173
```

## 📊 Build Output

Expected production build size:
- **JavaScript**: ~224 KB (57 KB gzipped)
- **CSS**: ~81 KB (12 KB gzipped)
- **HTML**: <1 KB
- **Total**: ~305 KB (~69 KB gzipped)

## 🐛 Troubleshooting

### Build fails with TypeScript errors
```bash
npm run type-check
# Fix any type errors shown
```

### Assets not loading after deployment
- Ensure `base` in `vite.config.ts` matches your deployment path
- Check browser console for 404 errors
- Verify all assets are in the `dist/` folder

### LocalStorage not working
- Check if the hosting platform allows localStorage
- Ensure HTTPS is enabled (some browsers restrict localStorage on HTTP)

## 🎯 Optimization Tips

The game is already optimized with:
- ✅ Code splitting and tree shaking
- ✅ Minified JavaScript and CSS
- ✅ Gzip compression
- ✅ No external dependencies (pure vanilla TS)
- ✅ Efficient LocalStorage usage

## 📱 Mobile Considerations

The game is fully responsive and works on:
- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Tablets

No additional configuration needed!

---

*For more information, see [README.md](README.md) and [GAME_DESIGN.md](GAME_DESIGN.md)*
