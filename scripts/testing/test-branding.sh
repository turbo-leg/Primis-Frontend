#!/bin/bash

# Primis EduCare - Quick Favicon Testing Script
# Run this after deployment to verify all branding assets are working

echo "🎨 Primis EduCare Favicon & Branding Test"
echo "=========================================="
echo ""

# Get deployment URL
read -p "Enter your deployed URL (e.g., https://your-app.vercel.app): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

echo ""
echo "🔍 Testing branding assets on: $DOMAIN"
echo ""

# Test favicon.ico
echo "1️⃣  Testing favicon.ico..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/favicon.ico")
if [ "$STATUS" -eq 200 ]; then
    echo "   ✅ favicon.ico found (Status: $STATUS)"
else
    echo "   ❌ favicon.ico not found (Status: $STATUS)"
fi

# Test PNG icons
echo ""
echo "2️⃣  Testing PNG icons..."
for size in "16x16" "32x32"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/favicon-$size.png")
    if [ "$STATUS" -eq 200 ]; then
        echo "   ✅ favicon-$size.png found"
    else
        echo "   ❌ favicon-$size.png not found (Status: $STATUS)"
    fi
done

# Test logo files
echo ""
echo "3️⃣  Testing logo files..."
for size in "192" "512"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/logo-$size.png")
    if [ "$STATUS" -eq 200 ]; then
        echo "   ✅ logo-$size.png found"
    else
        echo "   ❌ logo-$size.png not found (Status: $STATUS)"
    fi
done

# Test apple-touch-icon
echo ""
echo "4️⃣  Testing Apple Touch Icon..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/apple-touch-icon.png")
if [ "$STATUS" -eq 200 ]; then
    echo "   ✅ apple-touch-icon.png found"
else
    echo "   ❌ apple-touch-icon.png not found (Status: $STATUS)"
fi

# Test manifest.json
echo ""
echo "5️⃣  Testing Web App Manifest..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/manifest.json")
if [ "$STATUS" -eq 200 ]; then
    echo "   ✅ manifest.json found"
else
    echo "   ❌ manifest.json not found (Status: $STATUS)"
fi

# Test OG image
echo ""
echo "6️⃣  Testing Open Graph image..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/og-image.svg")
if [ "$STATUS" -eq 200 ]; then
    echo "   ✅ og-image.svg found"
else
    echo "   ❌ og-image.svg not found (Status: $STATUS)"
fi

# Test robots.txt
echo ""
echo "7️⃣  Testing robots.txt..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/robots.txt")
if [ "$STATUS" -eq 200 ]; then
    echo "   ✅ robots.txt found"
else
    echo "   ❌ robots.txt not found (Status: $STATUS)"
fi

# Test sitemap.xml
echo ""
echo "8️⃣  Testing sitemap.xml..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/sitemap.xml")
if [ "$STATUS" -eq 200 ]; then
    echo "   ✅ sitemap.xml found"
else
    echo "   ❌ sitemap.xml not found (Status: $STATUS)"
fi

# Summary and next steps
echo ""
echo "=========================================="
echo "✨ Test Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Verify favicons in browser tab"
echo "2. Test 'Add to Home Screen' on mobile"
echo "3. Check social media preview:"
echo "   - Facebook: https://developers.facebook.com/tools/debug/"
echo "   - Twitter: https://cards-dev.twitter.com/validator"
echo "   - LinkedIn: https://www.linkedin.com/post-inspector/"
echo ""
echo "4. Set up Google Search Console:"
echo "   - https://search.google.com/search-console"
echo "   - Add your property: $DOMAIN"
echo "   - Request indexing for faster updates"
echo ""
echo "5. Test online tools:"
echo "   - Favicon checker: https://realfavicongenerator.net/favicon_checker"
echo "   - Rich results: https://search.google.com/test/rich-results"
echo ""
echo "🚀 Your branding is deployed!"
echo "⏱️  Google typically updates search results in 1-3 days"
echo "💡 Use Google Search Console to speed up the process"
echo ""
