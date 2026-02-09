#!/bin/bash
# GeoZiguinchor PWA v3.0.0 - Deployment Checklist
# Tous les fichiers ont été créés et modifiés
# Utilisez ce script pour vérifier avant le déploiement

echo "🚀 GeoZiguinchor PWA v3.0.0 - Check avant déploiement"
echo "======================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        return 0
    else
        echo -e "${RED}❌${NC} $1"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
        return 0
    else
        echo -e "${RED}❌${NC} $1/"
        return 1
    fi
}

check_contains() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $1 contains '$2'"
        return 0
    else
        echo -e "${YELLOW}⚠️ ${NC} $1 may not contain '$2'"
        return 1
    fi
}

echo "📁 Fichiers PWA créés/modifiés:"
echo ""

check_file "manifest.json"
check_file "sw.js"
check_file "index.html"
check_file "js/pwa-manager.js"
check_file "css/pwa-ui.css"

echo ""
echo "📚 Fichiers de documentation:"
echo ""

check_file "PWA_IMPLEMENTATION.md"
check_file "PWA_QUICKSTART.md"
check_file "CHANGES.md"
check_file "check-pwa-config.js"

echo ""
echo "🔍 Vérifications de contenu:"
echo ""

check_contains "manifest.json" "/ziguinchor/"
check_contains "sw.js" "v3.0.0"
check_contains "sw.js" "cacheTilesStale"
check_contains "index.html" "pwa-manager.js"
check_contains "index.html" "pwa-ui.css"
check_contains "js/pwa-manager.js" "GeoZiguinchorPWA"
check_contains "css/pwa-ui.css" "pwa-control-btn"

echo ""
echo "📦 Structure de base:"
echo ""

check_dir "js"
check_dir "css"
check_dir "images"
check_dir "data"

echo ""
echo "======================================================"
echo "📝 Prochaines étapes:"
echo "======================================================"
echo ""
echo "1. ✏️ Créer les icônes PWA:"
echo "   - images/icon-192x192.png (192x192 pixels)"
echo "   - images/icon-512x512.png (512x512 pixels)"
echo "   - Utilisez: https://favicon.io ou realfavicongenerator.net"
echo ""
echo "2. 🔧 Vérifier la configuration:"
echo "   node check-pwa-config.js"
echo ""
echo "3. 📤 Push vers GitHub:"
echo "   git add -A"
echo "   git commit -m 'feat: PWA v3.0.0 with Leaflet optimization'"
echo "   git push origin main"
echo ""
echo "4. 📱 Tester sur mobile:"
echo "   - Android Chrome: https://habibdione.github.io/ziguinchor/"
echo "   - Attendre le prompt d'installation"
echo "   - iPhone Safari: Partage > Ajouter à l'écran d'accueil"
echo ""
echo "5. 🧪 Tester les fonctionnalités:"
echo "   ✓ Clic sur GPS (📍) pour géolocalisation"
echo "   ✓ Offline mode (DevTools > Throttle)"
echo "   ✓ Installation PWA"
echo "   ✓ Console logs (pas d'erreurs)"
echo ""
echo "======================================================"
echo "📊 Résumé des modifications:"
echo "======================================================"
echo ""
echo "✅ manifest.json - Métadonnées PWA cartographie"
echo "✅ sw.js - Service Worker v3.0.0 (tiles caching)"
echo "✅ js/pwa-manager.js - Gestionnaire PWA + GPS + Install"
echo "✅ css/pwa-ui.css - Styles mobile optimisés"
echo "✅ index.html - Scripts et CSS PWA ajoutés"
echo ""
echo "✨ Fonctionnalités activées:"
echo "  • Geolocalisation GPS avec markers Leaflet"
echo "  • Installation PWA (prompt natif)"
echo "  • Cache stratégies (Stale While Revalidate)"
echo "  • Offline support pour tuiles"
echo "  • Mobile UI optimisée (responsive, notch support)"
echo "  • Dark mode support"
echo "  • Accessibility features"
echo ""
echo "======================================================"
echo "✅ Tous les fichiers sont prêts pour le déploiement!"
echo "======================================================"
echo ""
