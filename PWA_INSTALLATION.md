# Guide Complet PWA - Installation sur Mobile et Desktop

## 🎯 Qu'est-ce qu'une PWA?

Une **Progressive Web App (PWA)** combine le meilleur du web et des applications mobiles:
- ✅ Installation native sans PlayStore/AppStore
- ✅ Icone sur l'écran d'accueil
- ✅ Fonctionnement offline
- ✅ Notifications push
- ✅ Accès aux capteurs (GPS, caméra)
- ✅ Mise à jour automatique

## 📱 Installation sur Android

### Méthode 1: Chrome (Recommandée)

1. **Ouvrir l'app**
   - Connectez-vous au Wi-Fi
   - Ouvrez Chrome sur le téléphone
   - Entrez: `http://[IP_SERVEUR]/geoziguinchor/`

2. **Installer l'application**
   - Attendez quelques secondes
   - Appuyez sur le menu (⋮) en haut à droite
   - Sélectionnez "Installer l'application"
   - Confirmez

3. **Utiliser l'app**
   - L'app s'ajoute automatiquement à l'écran d'accueil
   - Appuyez sur l'icone pour lancer l'app
   - L'app fonctionne comme une normale

**Avantages:**
- Facile et rapide
- Mises à jour automatiques
- Partage facile

### Méthode 2: Firefox

1. **Ouvrir l'app**
   - Ouvrez Firefox sur le téléphone
   - Entrez: `http://[IP_SERVEUR]/geoziguinchor/`

2. **Installer l'application**
   - Appuyez sur le menu (☰)
   - Allez à "Paramètres"
   - Trouvez l'option "Installer l'application"
   - Confirmez

### Méthode 3: Edge

1. Ouvrez l'app dans Microsoft Edge
2. Appuyez sur le menu (⋯)
3. Sélectionnez "Installer cette application"
4. Confirmez

### Méthode 4: Installation Manuelle (Sans Navigateur)

Pour ceux qui veulent installer directement:

1. **Créer un fichier APK personnalisé**
   - Utilisez Bubblewrap: https://github.com/GoogleChromeLabs/bubblewrap
   - Ou utilisez PWA Builder: https://www.pwabuilder.com/

2. **Installation**
   - Téléchargez le fichier APK
   - Autorisez "Sources inconnues" dans Paramètres
   - Tapotez le fichier APK
   - Suivez l'installation

## 🍎 Installation sur iOS/macOS

### Sur iPhone/iPad (Safari)

1. **Ouvrir l'app**
   - Connectez-vous au Wi-Fi
   - Ouvrez Safari
   - Entrez: `http://[IP_SERVEUR]/geoziguinchor/`

2. **Ajouter à l'écran d'accueil**
   - Appuyez sur le bouton "Partager" (↗)
   - Allez vers le bas, sélectionnez "Sur l'écran d'accueil"
   - Choisissez un nom (optionnel)
   - Appuyez sur "Ajouter"

3. **Utiliser l'app**
   - L'app apparaît comme une icone sur l'écran
   - Fonctionne en mode full-screen

**Note:** iOS traite les PWA différemment des Android, mais l'expérience est similaire.

### Sur macOS (Safari)

1. Ouvrez l'app dans Safari
2. Allez à Fichier → "Ajouter à l'écran d'accueil" (sur Monterey+)
3. Vous pouvez aussi utiliser: Fichier → "Ajouter aux Favoris de Bureau"

## 🖥️ Installation sur Desktop

### Windows

1. **Chrome**
   - Ouvrez Chrome et allez à: `http://localhost/geoziguinchor/`
   - Appuyez sur l'icone d'installation en haut à droite
   - Confirmez

2. **Edge**
   - Ouvrez Edge et allez à l'URL
   - Appuyez sur le menu (⋯)
   - Sélectionnez "Installer cette application"

3. **Firefox** (partir v91+)
   - Ouvrez Firefox et allez à l'URL
   - Cliquez sur l'icone "+" en haut à gauche
   - Confirmez

### macOS

1. Chrome
   - Ouvrez Chrome → l'URL
   - Menu → "Installer GeoZiguinchor"
   - L'app s'ajoute au Launchpad

2. Safari
   - Fichier → "Ajouter aux Favoris de Bureau"

### Linux

1. **Chrome/Chromium**
   - Ouvrez le navigateur → l'URL
   - Menu → "Installer l'application"
   - L'app apparaît dans le menu Applications

2. **Firefox** (partir v91+)
   - Même processus que Windows

## ⚙️ Configuration du Serveur pour PWA

### Pour l'installation correcte, le serveur doit:

1. **Servir en HTTPS** (production)
   ```
   ⚠️ Le HTTP local fonctionne pour le développement
   ✅ Le HTTPS est requis pour la production
   ```

2. **Avoir les bonnes entêtes**
   ```
   Content-Type: application/manifest+json (pour manifest.json)
   Service-Worker-Allowed: / (pour sw.js)
   Cache-Control: max-age=0 (pour sw.js)
   ```

3. **Service Worker valide**
   - Fichier sw.js doit être accessible
   - Doit gérer les erreurs réseau

4. **Manifest.json valide**
   - Format JSON correct
   - Icones existent
   - URLs absolues valides

## 🧪 Vérifier l'Installation

### Dans le Navigateur (DevTools)

1. Ouvrir DevTools (F12)
2. Aller à "Application"
3. Vérifier:
   - ✅ Service Worker: "activated and running"
   - ✅ Manifest: affiche les détails
   - ✅ Storage: données en cache

### Commandes de Test

```bash
# Vérifier le manifest
curl -I http://localhost/geoziguinchor/manifest.json

# Vérifier le Service Worker
curl -I http://localhost/geoziguinchor/sw.js

# Valider le manifest.json
curl http://localhost/geoziguinchor/manifest.json | jq .
```

## 🔧 Dépannage Installation PWA

### Problème: L'app ne s'installe pas

**Causes possibles:**
1. ❌ Manifest.json invalide
2. ❌ Icones manquantes ou incorrectes
3. ❌ Service Worker non enregistré
4. ❌ HTTPS non configuré (production)

**Solutions:**
```javascript
// Vérifiez dans la console:
navigator.serviceWorker.getRegistrations()
  .then(registrations => console.log(registrations));

// Vérifiez le manifest:
fetch('/manifest.json')
  .then(r => r.json())
  .then(d => console.log(d));
```

### Problème: Icone blanche/vide

**Cause:** Chemin incorrec ou fichier manquant

**Solution:**
1. Vérifier `images/icon-192x192.png` existe
2. Vérifier `images/icon-512x512.png` existe
3. Vérifier les chemins dans `manifest.json`
4. Format PNG recommandé

### Problème: Service Worker ne se met à jour

**Solution:**
```javascript
// Force la mise à jour
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    registrations.forEach(reg => reg.unregister());
  })
  .then(() => window.location.reload());
```

### Problème: Fonctionnalité Offline ne fonctionne pas

**Solution:**
1. Vérifier que le Service Worker est actif
2. Vérifier les erreurs dans la console
3. Activer/Désactiver le mode offline
4. Effacer le cache: DevTools → Application → Clear Storage

## 📊 Permissions Requises

GeoZiguinchor demande les permissions suivantes:

| Permission | Utilisation | Demande |
|-----------|-----------|---------|
| **Géolocalisation** | Localiser l'utilisateur | Au clic sur le bouton |
| **Accès offline** | Fonctionnement sans internet | Automatique (SW) |
| **Cache** | Stockage des données | Automatique (SW) |
| **Notifications** | Alertes application | À configurer |

## 🌐 Accès à Distance

### Configuration Locale (Même Réseau)

1. Trouver l'IP du serveur:
   ```bash
   ipconfig          # Windows
   ifconfig          # Linux/Mac
   ```

2. Sur le téléphone:
   - Connecter au même Wi-Fi
   - Ouvrir: `http://[IP_SERVER]:80/geoziguinchor/`
   - Exemple: `http://192.168.1.100/geoziguinchor/`

### Configuration Distante (Over Internet)

1. Configurez un domaine (ex: geoziguinchor.example.com)
2. Configurez HTTPS (recommandé)
3. Ouvrez: `https://geoziguinchor.example.com/`

## 📝 Notes Importantes

1. **Sécurité**
   - URL HTTP local fonctionne pour le développement
   - HTTPS fortement recommandé pour production
   - Les données sensibles doivent être protégées

2. **Performance**
   - Le Service Worker met en cache ~50MB
   - La première visite peut être lente
   - Les visites suivantes sont instantanées

3. **Mises à Jour**
   - Les mises à jour se font automatiquement
   - L'user doit relancer l'app
   - Les données locales sont conservées

4. **Géolocalisation**
   - Requiert permission utilisateur
   - Consomme de la batterie
   - Fonctionne en offline (localisation en cache)

5. **Compatibilité**
   - Chrome/Edge: ✅ Full support
   - Firefox: ✅ Full support
   - Safari: ⚠️ Support limité
   - IE 11: ❌ Non supporté

## 🚀 Prochaines Étapes

1. ✅ Générer les icones PNG
2. ✅ Tester sur tous les appareils
3. ✅ Configurer HTTPS pour production
4. ✅ Ajouter des notifications push (optionnel)
5. ✅ Ajouter l'analytics (optionnel)

## 🆘 Support et Ressources

- [PWA Builder](https://www.pwabuilder.com/)
- [MDN PWA Documentation](https://developer.mozilla.org/docs/Web/Progressive_web_apps)
- [Google PWA Guide](https://web.dev/progressive-web-apps/)
- [Manifest Generator](https://www.favicon-generator.org/)

---

**Questions?** Consultez `INSTALLATION.md` pour des détails techniques.
