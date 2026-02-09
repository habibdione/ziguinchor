# Guide d'Installation Complet - GeoZiguinchor PWA

## 📋 Checklist de Configuration

### 1. ✅ Fichiers Essentiels Créés
- [x] `index.html` - Page principale optimisée
- [x] `manifest.json` - Manifeste PWA
- [x] `sw.js` - Service Worker
- [x] `css/app.css` - Styles modernes
- [x] `js/app.js` - Application JavaScript
- [x] `README.md` - Documentation
- [x] `images/icon.svg` - Icone vectorielle

### 2. ⚠️ À Faire: Générer les Icones PNG

Les fichiers images doivent être créés:
```
images/
├── icon-192x192.png (REQUIS)
├── icon-512x512.png (REQUIS)
├── icon-maskable-192x192.png (optionnel mais recommandé)
├── icon-maskable-512x512.png (optionnel mais recommandé)
├── screenshot-1.png (optionnel)
└── screenshot-2.png (optionnel)
```

#### Méthode A: Service en Ligne Gratuit (Plus Simple)

1. Aller sur: https://www.favicon-generator.org/
2. Uploader `images/icon.svg`
3. Configurer:
   - Size: 192x192
   - Format: PNG
4. Télécharger et sauvegarder comme `images/icon-192x192.png`
5. Répéter pour 512x512 pixels

#### Méthode B: Utiliser Convertio (Alternative)

1. Aller sur: https://convertio.co/svgg-png/
2. Uploader `images/icon.svg`
3. Configurer la taille (192x192)
4. Télécharger
5. Répéter pour 512x512

#### Méthode C: Inkscape (Recommandé pour Windows)

1. Télécharger Inkscape: https://inkscape.org/
2. Ouvrir `images/icon.svg`
3. Aller à Fichier → Exporter As
4. Configurer:
   - Nom: `icon-192x192.png`
   - Type: PNG
   - Canvas vers dessin: Oui
   - Dpi: 96
5. Répéter pour 512x512

#### Méthode D: ImageMagick (Terminal/Ligne de Commande)

```bash
# Windows avec ImageMagick installé
magick convert -background none images/icon.svg -resize 192x192 images/icon-192x192.png
magick convert -background none images/icon.svg -resize 512x512 images/icon-512x512.png

# Linux/Mac avec ImageMagick
convert -background none images/icon.svg -resize 192x192 images/icon-192x192.png
convert -background none images/icon.svg -resize 512x512 images/icon-512x512.png

# Utiliser GraphicsMagick (plus rapide)
gm convert -background none images/icon.svg -resize 192x192 images/icon-192x192.png
```

### 3. ✅ Vérification des Données

Assurez-vous que ces fichiers de données existent:
```
data/
├── Rgion_3.js
├── Departement_4.js
├── Arrondissement_5.js
├── Routes_6.js
├── Localits_7.js
└── Ecoles_8.js
```

### 4. ✅ Vérification des Ressources Leaflet

Assurez-vous que ces fichiers existent:
```
js/
├── leaflet.js
├── leaflet.markercluster.js
├── leaflet-measure.js
└── [autres fichiers]

css/
├── leaflet.css
├── MarkerCluster.css
└── [autres fichiers]
```

### 5. 🌐 Configuration pour Production HTTPS

Pour un déploiement en production avec HTTPS:

#### Avec Apache
```apache
<VirtualHost *:443>
    ServerName geoziguinchor.example.com
    SSLEngine on
    SSLCertificateFile /chemin/cert.pem
    SSLCertificateKeyFile /chemin/key.pem
    
    DocumentRoot /var/www/geoziguinchor
    
    <Directory /var/www/geoziguinchor>
        AllowOverride All
        Require all granted
    </Directory>
    
    # Service Worker headers
    <FilesMatch "sw\.js$">
        Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
        Header set Service-Worker-Allowed "/"
    </FilesMatch>
    
    # Manifest headers
    <FilesMatch "manifest\.json$">
        Header set Content-Type "application/manifest+json"
    </FilesMatch>
</VirtualHost>
```

#### Avec Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name geoziguinchor.example.com;
    
    root /var/www/geoziguinchor;
    index index.html;
    
    ssl_certificate /chemin/cert.pem;
    ssl_certificate_key /chemin/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # Service Worker
    location /sw.js {
        add_header Cache-Control "max-age=0, no-cache, no-store, must-revalidate";
        add_header Service-Worker-Allowed "/";
    }
    
    # Manifest
    location /manifest.json {
        add_header Content-Type "application/manifest+json";
    }
    
    # Fichiers statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Réécriture pour SPA
    try_files $uri $uri/ /index.html;
}
```

### 6. 📝 Fichier .htaccess pour Apache (Si Nécessaire)

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Service Worker
    <FilesMatch "^sw\.js$">
        Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
        Header set Service-Worker-Allowed "/"
    </FilesMatch>
    
    # Manifest
    <FilesMatch "^manifest\.json$">
        Header set Content-Type "application/manifest+json"
    </FilesMatch>
    
    # Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
    </IfModule>
    
    # Cache
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresDefault "access plus 30 days"
        ExpiresByType text/html "access plus 0 days"
        ExpiresByType application/json "access plus 0 days"
        ExpiresByType text/css "access plus 1 year"
        ExpiresByType text/javascript "access plus 1 year"
        ExpiresByType application/javascript "access plus 1 year"
        ExpiresByType image/jpeg "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType image/svg+xml "access plus 1 year"
    </IfModule>
</IfModule>
```

### 7. 🔧 Tests Avant Déploiement

```bash
# Vérifier que tous les fichiers existent
ls -la geoziguinchor/
ls -la geoziguinchor/css/
ls -la geoziguinchor/js/
ls -la geoziguinchor/data/
ls -la geoziguinchor/images/

# Valider le manifest.json
# Aller sur: https://www.pwabuilder.com/
# Entrer l'URL de l'app

# Tester localement
# Ouvrir http://localhost/geoziguinchor/ dans le navigateur
# Ouvrir DevTools (F12)
# Vérifier Application > Service Workers
# Vérifier Application > Manifest
```

### 8. 🚀 Déploiement sur Serveur

```bash
# 1. Copier les fichiers
scp -r geoziguinchor/ user@server:/var/www/

# 2. Définir les permissions
chmod -R 755 /var/www/geoziguinchor/
chmod -R 644 /var/www/geoziguinchor/*.html
chmod -R 644 /var/www/geoziguinchor/*.json
chmod -R 644 /var/www/geoziguinchor/*.js

# 3. Redémarrer le serveur web
sudo systemctl restart apache2  # Apache
sudo systemctl restart nginx    # Nginx

# 4. Vérifier le déploiement
curl -I https://geoziguinchor.example.com/
```

### 9. 📱 Test sur Mobile

#### Android:
1. Connecter le téléphone au même réseau
2. Ouvrir Chrome: `http://[IP_PC]:80/geoziguinchor/`
3. Appuyer sur le menu → "Installer l'application"
4. Valider

#### iOS:
1. Ouvrir Safari: `http://[IP_PC]:80/geoziguinchor/`
2. Appuyer sur "Actions" → "Sur l'écran d'accueil"
3. Nommer l'app et ajouter

### 10. 🐛 Dépannage

**Problème: L'app ne s'installe pas**
- Solution: Vérifier la console (F12) pour les erreurs
- Solution: Assurez-vous que manifest.json est valide
- Solution: Utiliser HTTPS en production

**Problème: Service Worker erreur 404**
- Solution: Vérifier que sw.js est au bon emplacement
- Solution: Vérifier le cache: DevTools → Application → Clear Storage

**Problème: Les icones ne s'affichent pas**
- Solution: Vérifier les chemins dans manifest.json
- Solution: Vérifier que les fichiers PNG existent

**Problème: Géolocalisation ne fonctionne pas**
- Solution: Autoriser l'accès GPS dans les paramètres
- Solution: Utiliser HTTPS en production
- Solution: Vérifier la console du navigateur

## 📚 Fichiers Modifiés/Créés

```
✅ Créé: index.html - Page principale
✅ Créé: manifest.json - Manifeste PWA
✅ Créé: sw.js - Service Worker
✅ Créé: css/app.css - Styles
✅ Créé: js/app.js - Application
✅ Créé: README.md - Documentation
✅ Créé: INSTALLATION.md - Ce fichier
⚠️  À créer: images/icon-192x192.png
⚠️  À créer: images/icon-512x512.png
✅ Original: data/*.js - Données (conservées)
✅ Original: css/leaflet.css et autres CSS (conservées)
✅ Original: js/leaflet.js et autres JS (conservées)
```

## ✅ Résumé des Étapes

1. [x] Remplacer `index.html` avec la nouvelle version
2. [x] Créer `manifest.json`
3. [x] Créer `sw.js`
4. [x] Créer `css/app.css`
5. [x] Créer `js/app.js`
6. [ ] Générer et ajouter les icones PNG (À FAIRE)
7. [ ] Tester sur desktop
8. [ ] Tester sur mobile (Android/iOS)
9. [ ] Configurer HTTPS pour production
10. [ ] Déployer sur serveur

## 🎉 Après Installation

L'application sera prête à utiliser avec:
- ✅ Interface moderne avec navbar
- ✅ Panneaux latéraux dynamiques
- ✅ Géolocalisation en temps réel
- ✅ Téléchargement de données
- ✅ Fonctionnement offline
- ✅ Installation sur mobile
- ✅ Mode sombre automatique
- ✅ Coordonnées et échelle dynamiques

Bon déploiement! 🚀
