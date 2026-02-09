# ✅ Checklist PWA - Vérification et Tests

## 🚀 Avant de Commencer

**Prérequis:**
- [ ] Node.js et npm installés (optionnel)
- [ ] Un navigateur moderne (Chrome, Firefox, Edge, Safari)
- [ ] Accès à un serveur web (local ou production)
- [ ] Un appareil mobile (Android ou iOS) pour tester

---

## 1️⃣ Configuration Locale

### 1.1 Vérifier les Fichiers

- [ ] `index.html` - Point d'entrée PWA
- [ ] `manifest.json` - Configuration PWA  
- [ ] `sw.js` - Service Worker
- [ ] `js/app.js` - Géolocalisation intégrée
- [ ] `generate-icons.html` - Générateur d'icônes web
- [ ] `scripts/generate-icons.js` - Générateur Node.js
- [ ] `images/icon-base.svg` - Icône source
- [ ] `images/icon-maskable.svg` - Icône maskable
- [ ] `PWA_INSTALLATION.md` - Documentation

### 1.2 Démarrer un Serveur Local

**Option A: Python 3**
```bash
python -m http.server 8000
# Accédez à: http://localhost:8000
```

**Option B: Node.js http-server**
```bash
npx http-server . -p 8000
# Accédez à: http://localhost:8000
```

**Option C: Node.js (package.json)**
```bash
npm install
npm start
# Accédez à: http://localhost:8080
```

---

## 2️⃣ Générer les Icônes

### 2.1 Générer via Navigateur (Recommandé)

- [ ] Accédez à `http://localhost:PORT/generate-icons.html`
- [ ] Cliquez "Générer les fichiers"
- [ ] Les PNG sont téléchargés automatiquement
- [ ] Placez-les dans le dossier `images/`

### 2.2 Alternative: Générer via Node.js

**Option 1: npm script (si disponible)**
```bash
npm run generate-icons
```

**Option 2: directement avec Node.js**
```bash
npm install sharp
node scripts/generate-icons.js
```

- [ ] Icônes générées avec succès
- [ ] Fichiers dans `images/` avec bons noms
- [ ] Fichiers PNG de bonne taille

---

## 3️⃣ Vérifier les Fichiers PWA

### 3.1 Dans DevTools (F12)

**Onglet: Application > Manifest**
- [ ] Manifest chargé correctement
- [ ] `name`: "GeoZiguinchor - Application Cartographique Interactive"
- [ ] `short_name`: "GeoZiguinchor"
- [ ] `start_url`: "./index.html"
- [ ] `display`: "standalone"
- [ ] Icônes affichées correctement
- [ ] Status: ✅ Valid

**Onglet: Application > Service Workers**
- [ ] Service Worker enregistré
- [ ] Status: "running"
- [ ] Registration: "activated and running"
- [ ] Scope: "http://localhost:PORT/"

**Onglet: Application > Cache Storage**
- [ ] Nouveau cache créé: `geoziguinchor-v2.0.0`
- [ ] Les fichiers CSS, JS, images sont listés
- [ ] Au moins 20+ fichiers en cache

### 3.2 Dans la Console (F12)

Exécutez ces commandes:

```javascript
// Vérifier le Service Worker
navigator.serviceWorker.getRegistrations().then(regs => {
    console.log('✓ SW Registrations:', regs.length);
    regs.forEach(r => console.log(' -', r));
});

// Vérifier le manifest
fetch('./manifest.json').then(r => r.json()).then(m => {
    console.log('✓ Manifest:', m.name);
    console.log(' - Icons:', m.icons.length);
});

// Vérifier le cache
caches.keys().then(keys => {
    console.log('✓ Caches:', keys);
    keys.forEach(k => {
        caches.open(k).then(c => {
            c.keys().then(items => console.log(` - ${k}: ${items.length} items`));
        });
    });
});

// Vérifier la géolocalisation
console.log('✓ Geolocation:', 'geolocation' in navigator);

// Vérifier les notifications
console.log('✓ Notifications:', 'Notification' in window);
```

**Résultats attendus:**
- [ ] ✓ SW Registrations: 1 (ou plus)
- [ ] ✓ Manifest: GeoZiguinchor
- [ ] ✓ Icons: 10+ 
- [ ] ✓ Caches: 1+ caches
- [ ] ✓ Geolocation: true
- [ ] ✓ Notifications: true

### 3.3 Vérifier les Meta Tags

Inspectez le HTML:
```bash
curl http://localhost:PORT/ | grep -i "manifest\|apple\|theme\|icon"
```

Ou dans DevTools > Elements, vérifiez:
- [ ] `<link rel="manifest" href="./manifest.json">`
- [ ] `<meta name="apple-mobile-web-app-capable">`
- [ ] `<meta name="theme-color">`
- [ ] `<link rel="apple-touch-icon">`
- [ ] `<link rel="icon" ... 192x192>`

---

## 4️⃣ Tester les Fonctionnalités

### 4.1 Tester la Carte

- [ ] La carte se charge correctement
- [ ] Les couches cartographiques apparaissent
- [ ] Vous pouvez zoomer/dézoomer
- [ ] Les contrôles fonctionnent

### 4.2 Tester la Géolocalisation

- [ ] Button "📍 Ma position" visible et fonctionnel
- [ ] Cliquez sur le bouton
- [ ] Popup de permission apparaît
- [ ] Acceptez la géolocalisation
- [ ] Votre position s'affiche sur la carte (point bleu)
- [ ] Cercle de précision visible
- [ ] Popup avec coordonnées s'affiche
- [ ] Les coordonnées sont correctes (±quelques mètres)

**Test du suivi continu:**
- [ ] Le bouton change: "📍 Arrêter le suivi"
- [ ] Déplacez-vous légèrement
- [ ] La position se met à jour
- [ ] La position est sauvegardée en localStorage

### 4.3 Tester le Stockage Local

Console:
```javascript
// Vérifiez l'historique
JSON.parse(localStorage.getItem('geoziguinchor_location_history'))
// Devrait afficher les positions sauvegardées

// Vérifiez la dernière position
JSON.parse(localStorage.getItem('geoziguinchor_last_location'))
```

- [ ] L'historique est sauvegardé
- [ ] Au moins une position enregistrée
- [ ] Les coordonnées sont valides

### 4.4 Tester Hors Ligne

1. **Ouvrez DevTools** (F12)
2. **Allez à: Network**
3. **Cochez: "Offline"**
4. **Rafraîchissez la page**

- [ ] La page se charge correctement
- [ ] La carte affiche le fond de cache
- [ ] Les messages d'erreur sont gracieux
- [ ] L'interface reste fonctionnelle

---

## 5️⃣ Installation PWA sur Appareil Mobile

### 5.1 sur Android (Chrome)

**Conditions:**
- [ ] WiFi ou mobile data
- [ ] Chrome version récente
- [ ] Le site accessible depuis le téléphone

**Étapes:**
1. [ ] Ouvrez le site dans Chrome
2. [ ] Attendez 5-10 secondes
3. [ ] Une barre d'installation devrait apparaître (bas ou haut)
4. [ ] Tapez "Installer" ou le bouton d'installation
5. [ ] Confirmez la boîte de dialogue

**Vérification:**
- [ ] L'app est sur l'écran d'accueil
- [ ] L'icône est correcte
- [ ] Le nom est "GeoZiguinchor"
- [ ] L'app s'ouvre en mode standalone (pas de barre d'adresse)

### 5.2 sur iOS (Safari)

**Conditions:**
- [ ] WiFi ou mobile data
- [ ] Safari (pas Chrome)
- [ ] iOS 11.3+

**Étapes:**
1. [ ] Ouvrez le site dans **Safari**
2. [ ] Tapez le bouton de partage (⬆️)
3. [ ] Sélectionnez "Ajouter à l'écran d'accueil"
4. [ ] Changez le nom si désiré
5. [ ] Tapez "Ajouter"

**Vérification:**
- [ ] L'app est sur l'écran d'accueil
- [ ] L'icône est l'icône de la PWA
- [ ] L'app s'ouvre sans Safari UI

### 5.3 Tester Depuis l'App Mobile

- [ ] L'app se lance correctement
- [ ] La carte charge
- [ ] Vous pouvez interagir avec la carte
- [ ] La géolocalisation fonctionne
- [ ] Aucun message d'erreur dans la console (F12)

---

## 6️⃣ Tester le Prompt d'Installation

### Dans Chrome Desktop

- [ ] Ouvrez le site
- [ ] Cherchez l'icône d'installation 🔧 (dans la barre d'adresse)
- [ ] Cliquez l'icône
- [ ] Confirmez "Installer"

**Résultat:**
- [ ] Un shortcut est créé sur le bureau
- [ ] L'app s'ouvre en mode standalone

---

## 7️⃣ Tester la Mise à Jour

### Simuler une Mise à Jour

1. [ ] Ouvrez la DevTools
2. [ ] Network > Service Workers
3. [ ] Modifiez un fichier CSS ou JS
4. [ ] Rechargez la page
5. [ ] Attendez environ 60 secondes

**Vérification:**
- [ ] Une notification de mise à jour peut apparaître
- [ ] Rafraîchissez (Ctrl+F5) pour charger la version correcte
- [ ] Les fichiers en cache se mettent à jour

---

## 8️⃣ Test de Performance

### Lightouse Report (Chrome DevTools)

1. [ ] F12 > Lighthouse
2. [ ] Sélectionner: "PWA"
3. [ ] Cliquez "Analyze page load"

**Résultats attendus:**
- [ ] Score PWA: ≥ 90
- [ ] Tous les checklist items: ✓

**Points clés:**
- [ ] ✓ Web app manifest is installable
- [ ] ✓ Start URL is valid
- [ ] ✓ Icons are sized correctly
- [ ] ✓ Service worker responds to fetch
- [ ] ✓ Install prompts appear

---

## 9️⃣ Vérifications de Sécurité

### Console - Attention à ces Erreurs

- [ ] Aucune erreur 403/404 pour `manifest.json`
- [ ] Aucune erreur 403/404 pour `sw.js`
- [ ] Aucune erreur CORS
- [ ] Aucun avertissement de permission refusée

### Vérifier les URLs

```javascript
// Tous ces fichiers doivent retourner 200
fetch('./manifest.json').then(r => console.log('manifest:', r.status));
fetch('./sw.js').then(r => console.log('sw.js:', r.status));
fetch('./index.html').then(r => console.log('index.html:', r.status));
```

- [ ] Toutes les réponses: 200 OK

---

## 🔟 Déploiement en Production

### Avant de Publier

- [ ] Tous les tests locaux passent ✓
- [ ] Les icônes sont générées ✓
- [ ] Service Worker enregistré ✓
- [ ] Manifest valide ✓
- [ ] HTTPS configuré ✓

### Configuration Serveur

**Apache .htaccess:**
```apache
# Ajouter à .htaccess
RewriteEngine On
RewriteRule ^\.well-known/ - [L]
```

- [ ] Fichier .htaccess créé si nécessaire
- [ ] Service-Worker-Allowed: / header configuré
- [ ] HTTPS globalement activé

**Nginx:**
```nginx
# Ajouter à nginx.conf
add_header 'Service-Worker-Allowed' '/';
```

- [ ] Configuration nginx mise à jour si applicable

### Déployer les Fichiers

Assurez-vous de déployer:
- [ ] `index.html`
- [ ] `manifest.json`
- [ ] `sw.js`
- [ ] `js/` (dossier complet)
- [ ] `css/` (dossier complet)
- [ ] `data/` (dossier complet)
- [ ] `images/` (avec les icônes générées)
- [ ] `scripts/` (optionnel)
- [ ] `generate-icons.html` (optionnel)

### Vérifier en Production

1. [ ] Allez à: https://your-domain.com
2. [ ] Vérifiez DevTools (même procédure que local)
3. [ ] Testez l'installation depuis un mobile
4. [ ] Testez la géolocalisation
5. [ ] Testez hors ligne

---

## 🆘 Dépannage Rapide

### Le Service Worker ne s'enregistre pas
```javascript
// Console
navigator.serviceWorker.getRegistrations()
// S'il est vide, vérifiez:
// 1. Le fichier sw.js existe
// 2. HTTPS ou localhost
// 3. Pas d'erreur 404
```

**Solution:**
- [ ] Vérifiez que sw.js est à la racine
- [ ] Vérifiez que l'URL est en HTTPS (ou localhost)
- [ ] Videz le cache du navigateur (Ctrl+Shift+Del)
- [ ] Rechargez (Ctrl+F5)

### L'app ne s'installe pas
```javascript
// Console
fetch('./manifest.json').then(r => r.json()).then(m => console.log(m))
// Vérifiez que le JSON est valide
```

**Solution:**
- [ ] Vérifiez que manifest.json est valide (JSON Lint)
- [ ] Vérifiez que les icônes 192x192 et 512x512 existent
- [ ] Vérifiez que display: "standalone" est présent
- [ ] Attendez 30 secondes avant de réessayer

### La géolocalisation demande une permission permanente
```javascript
// Visitez en HTTPS pour permission persistante
// localhost OK également
```

**Solution:**
- [ ] Activez HTTPS en production
- [ ] Testez sur localhost pour développement
- [ ] Acceptez la permission et rafraîchissez

---

## 📊 Checklist de Déploiement Final

```
FICHIERS
  [ ] index.html mis à jour avec PWA
  [ ] manifest.json complet
  [ ] sw.js optimisé
  [ ] app.js avec géolocalisation
  [ ] Icônes PNG générées (192x512)
  
CONFIGURATION
  [ ] HTTPS activé
  [ ] Service-Worker-Allowed header
  [ ] Cache headers configurés
  [ ] Pas d'erreurs 404

FONCTIONNALITÉS
  [ ] Installation fonctionne
  [ ] Géolocalisation fonctionne
  [ ] Chargement hors ligne
  [ ] Mise à jour automatique
  [ ] Notifications (optionnel)

VALIDATION
  [ ] Lighthouse PWA ≥ 90
  [ ] Pas d'erreurs console
  [ ] Responsive sur mobile/desktop
  [ ] Testée sur Android
  [ ] Testée sur iOS
```

---

## 🎉 Succès!

Si tous les tests passent:

✅ Votre PWA est **prête pour la production**
✅ Les utilisateurs peuvent **installer** l'app
✅ L'app fonctionne **hors ligne**
✅ La **géolocalisation** est active
✅ Les mises à jour sont **automatiques**

---

**Date de vérification:** ___________  
**Testé par:** ___________  
**Status:** ___________

*Dernière mise à jour: 2025-02-09*
