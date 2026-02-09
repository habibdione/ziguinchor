# 📱 Guide d'Installation PWA - GeoZiguinchor

## 🎯 À propos de cette PWA (Progressive Web Application)

GeoZiguinchor est maintenant une **Progressive Web Application (PWA)** entièrement fonctionnelle. Cela signifie que vous pouvez:

✅ **Installer** l'application directement sur votre appareil (smartphone, tablette, ordinateur)
✅ **Utiliser hors ligne** - La carte et les données sont mises en cache localement
✅ **Faire fonctionner** sans App Store ou PlayStore
✅ **Accéder** rapidement depuis votre écran d'accueil
✅ **Obtenir les mises à jour** automatiquement
✅ **Utiliser la géolocalisation** pour voir votre position en temps réel

---

## 🚀 Installation sur Android

### Via Chrome/Navigateur (Recommandé)

1. **Ouvrez GeoZiguinchor** dans Chrome ou votre navigateur
2. **Attendez le message** d'installation (une barre apparaîtra en bas)
3. **Tapez** sur "Installer" ou "Ajouter à l'écran d'accueil"
4. **Confirmez** l'installation

### Installation Manuelle

1. **Ouvrez le navigateur**
2. **Allez à** `http://votre-url/`
3. **Appuyez** sur le menu (⋮)
4. **Sélectionnez** "Ajouter à l'écran d'accueil"
5. **Choisissez** le nom de l'application
6. **Validez** l'installation

**Résultat:** L'app s'installe comme une application native sans passer par PlayStore.

---

## 🍎 Installation sur iOS (Safari)

1. **Ouvrez** GeoZiguinchor dans **Safari** (pas Chrome!)
2. **Appuyez** sur le bouton de partage (⬆️)
3. **Sélectionnez** "Ajouter à l'écran d'accueil"
4. **Choisissez** le nom et l'icône
5. **Validez** avec "Ajouter"

**Résultat:** L'app s'ajoute à votre écran d'accueil avec une icône personnalisée.

---

## 💻 Installation sur Ordinateur (Desktop)

### Windows - Chrome/Edge

1. **Ouvrez** le site
2. **Cliquez** sur l'icône d'installation 🔧 (adresse bar)
3. **Confirmez** l'installation

### macOS - Safari

1. **Ouvrez** le site dans Safari
2. **Menu:** Fichier → Partager → Ajouter au Dock
3. L'app s'ouvre dans une fenêtre détachée

### Linux

1. **Ouvrez** dans Chrome/Chromium
2. **Cliquez** sur l'icône d'installation
3. L'app s'installe comme application système

---

## 🗺️ Fonctionnalités Principales

### 📍 Géolocalisation
- **Mon bouton**: Cliquez pour voir votre position sur la carte
- **Suivi continu**: Reste appuyé pour suivre vos déplacements
- **Précision**: Affiche la précision de votre localisation
- **Historique**: Sauvegarde automatique de vos positions

### 🗺️ Cartes Multiples
- Google Satellite
- OpenStreetMap
- Dark Matter (CartoDB)
- Et plus...

### 📊 Données Cartographiques
- Régions
- Arrondissements
- Écoles
- Localités
- Routes
- Départements

### 🔍 Recherche et Identification
- Recherchez des lieux
- Cliquez sur les éléments pour plus d'informations
- Mesurez les distances
- Exportez les données

### 📱 Hors Ligne
- La carte de base est mise en cache
- Les données cartographiques sont disponibles hors ligne
- Continuez à naviguer sans internet!

---

## 🔄 Mises à Jour

### Vérification Automatique
L'application vérifie automatiquement les mises à jour toutes les **60 secondes**.

### Installation des Mises à Jour
- Quand une nouvelle version est disponible, vous recevrez une notification
- **Rafraîchissez** la page (F5 ou pull-to-refresh)
- La nouvelle version se chargera

### Mise à Jour Forcée
```javascript
// Dans la console du navigateur:
navigator.serviceWorker.getRegistration().then(reg => {
    reg.unregister();
});
// Puis rechargez la page
```

---

## 💾 Stockage Local et Données

### Données Sauvegardées
- 🗺️ Historique des positions
- 🎨 Préférences de l'interface
- 📍 Dernière vue cartographique
- 🔐 Paramètres utilisateur

### Gestion du Stockage
```javascript
// Voir l'espace utilisé:
navigator.storage.estimate().then(estimate => {
    console.log(`Utilisé: ${estimate.usage} bytes`);
    console.log(`Quota: ${estimate.quota} bytes`);
});

// Demander la persistance (conseillé):
navigator.storage.persist().then(persistent => {
    console.log('Stockage persistant:', persistent);
});
```

---

## 🛠️ Génération des Icônes

Si vous redéployez l'application, vous devez régénérer les icônes:

### Option 1: Via Web (Recommandé)
1. Ouvrez `generate-icons.html` dans votre navigateur
2. Cliquez sur "Générer les fichiers"
3. Les icônes seront téléchargées

### Option 2: Via Node.js
```bash
npm install sharp
node scripts/generate-icons.js
```

### Tailles Générées
- 16×16 (favicon)
- 32×32 (favicon)
- 72×72 (Android)
- 96×96 (Android)
- 128×128 (Android)
- 144×144 (Android)
- 152×152 (iOS)
- 180×180 (iOS)
- 192×192 (Android)
- 384×384 (Android)
- 512×512 (Android, iOS)

---

## 🔒 Permissions Requises

Lors de la première utilisation, l'app demande:

### Géolocalisation
- **Pourquoi**: Pour afficher votre position sur la carte
- **Stockage**: Oui, si vous acceptez le suivi continu
- **Contrôle**: Vous pouvez arrêter le suivi à tout moment

### Notifications
- **Pourquoi**: Pour les mises à jour et alertes
- **Contrôle**: Vous pouvez désactiver dans les paramètres de l'appareil

---

## 🐛 Dépannage

### L'app ne s'installe pas
- ✅ Vérifiez que vous avez HTTPS (ou localhost)
- ✅ Assurez-vous que `manifest.json` est accessible
- ✅ Vérifiez que `sw.js` est à la racine
- ✅ Videz le cache du navigateur

### La géolocalisation ne fonctionne pas
- ✅ Vérifiez les permissions du navigateur
- ✅ Assurez-vous qu'une connexion de localisation est disponible
- ✅ Essayez en mode haute précision
- ✅ Redémarrez l'application

### Les données ne se chargent pas hors ligne
- ✅ Les données doivent avoir été visitées une fois en ligne
- ✅ Le service worker doit être enregistré (consultez la console)
- ✅ Vérifiez que le cache n'est pas plein

### L'app est lente
- ✅ Videz le cache de l'application
- ✅ Vérifiez votre connexion réseau
- ✅ Essayez en mode incognito
- ✅ Redémarrez l'application

---

## 🌐 Déploiement

### Sur un Serveur Web

```bash
# 1. Avoir Node.js et npm
npm install

# 2. Générer les icônes
npm run generate-icons

# 3. Déployer les fichiers
# - index.html
# - manifest.json
# - sw.js
# - dossier /images/
# - dossier /css/
# - dossier /js/
# - dossier /data/

# 4. Assurez-vous d'être en HTTPS en production
```

### Configuration Apache (.htaccess)
```apache
# Forcer HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Service Worker caching
<FilesMatch "\.(sw|js|css|jpg|jpeg|png|gif|wav|svg)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# HTML refresh
<FilesMatch "\.html$">
  Header set Cache-Control "max-age=3600, must-revalidate"
</FilesMatch>
```

### Configuration Nginx
```nginx
# Forcer HTTPS
server {
    listen 80;
    server_name votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com;
    
    # Certificats SSL
    ssl_certificate /chemin/vers/cert.pem;
    ssl_certificate_key /chemin/vers/key.pem;
    
    # Caching
    location ~* \.(sw|js|css|jpg|jpeg|png|gif|svg)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }
}
```

---

## 📊 Vérifier le Statut PWA

### Critères de Validation
```
✅ HTTPS ou localhost
✅ manifest.json valide
✅ Service Worker enregistré
✅ Icônes 192×192 et 512×512
✅ Responsive design
✅ No console errors
```

### Console du Navigateur
```javascript
// Vérifier le service worker
navigator.serviceWorker.getRegistrations().then(regs => {
    console.log('Service Workers:', regs);
});

// Vérifier le service worker actif
navigator.serviceWorker.controller && console.log('SW active');

// Vérifier le manifest
fetch('./manifest.json').then(r => r.json()).then(m => console.log(m));

// Vérifier la géolocalisation
console.log('Geolocation:', 'geolocation' in navigator);

// Vérifier le cache
caches.keys().then(keys => console.log('Caches:', keys));
```

---

## 📚 Ressources Supplémentaires

- [MDN - Progressive Web Apps](https://developer.mozilla.org/fr/docs/Web/Progressive_web_apps)
- [Google - PWA Checklist](https://web.dev/pwa-checklist/)
- [Leaflet.js Documentation](https://leafletjs.com/)
- [Web App Manifest](https://developer.mozilla.org/fr/docs/Web/Manifest)

---

## 📞 Support

Besoin d'aide?
1. Consultez la section "Dépannage"
2. Vérifiez la console du navigateur (F12)
3. Essayez de vider le cache
4. Réinstallez l'application

---

**Profitez de GeoZiguinchor! 🗺️📱**

*Dernière mise à jour: 2025-02-09*

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
