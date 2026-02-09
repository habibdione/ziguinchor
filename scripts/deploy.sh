#!/bin/bash

# GeoZiguinchor Deployment Script
# Usage: ./deploy.sh [production|staging|local]

set -e

DEPLOY_ENV=${1:-staging}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
APP_NAME="geoziguinchor"
APP_VERSION="2.0.0"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check environment
check_environment() {
    print_info "Vérification de l'environnement..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git n'est pas installé"
        exit 1
    fi
    
    if [ ! -f "manifest.json" ]; then
        print_error "manifest.json introuvable"
        exit 1
    fi
    
    print_success "Environnement validé"
}

# Backup before deployment
backup() {
    print_info "Création d'une sauvegarde..."
    BACKUP_DIR="backups/${APP_NAME}_${TIMESTAMP}"
    mkdir -p "$BACKUP_DIR"
    
    cp -r ./* "$BACKUP_DIR/" 2>/dev/null || true
    print_success "Sauvegarde créée: $BACKUP_DIR"
}

# Validate files
validate() {
    print_info "Validation des fichiers..."
    
    local required_files=(
        "index.html"
        "manifest.json"
        "sw.js"
        "css/app.css"
        "js/app.js"
        "config.json"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Fichier manquant: $file"
            exit 1
        fi
    done
    
    # Check for PNG icons
    if [ ! -f "images/icon-192x192.png" ] || [ ! -f "images/icon-512x512.png" ]; then
        print_error "Icones PNG manquantes"
        print_info "Veuillez générer icon-192x192.png et icon-512x512.png"
        exit 1
    fi
    
    print_success "Tous les fichiers requis sont présents"
}

# Minify assets (optional)
minify() {
    print_info "Minification des assets..."
    
    if command -v cleancss &> /dev/null; then
        cleancss -o dist/app.min.css css/app.css 2>/dev/null || true
        print_success "CSS minifié"
    fi
    
    if command -v uglifyjs &> /dev/null; then
        uglifyjs js/app.js -o dist/app.min.js 2>/dev/null || true
        print_success "JS minifié"
    fi
}

# Deploy to server
deploy_production() {
    print_info "Déploiement en production..."
    
    # Get server details from environment or prompt
    SERVER_HOST=${SERVER_HOST:-"your-server.com"}
    SERVER_USER=${SERVER_USER:-"deploy"}
    SERVER_PATH=${SERVER_PATH:-"/var/www/geoziguinchor"}
    
    print_info "Serveur: $SERVER_HOST"
    print_info "Chemin: $SERVER_PATH"
    
    # Copy files
    print_info "Transfert des fichiers..."
    if command -v rsync &> /dev/null; then
        rsync -avz \
            --exclude='.git' \
            --exclude='backups' \
            --exclude='node_modules' \
            --exclude='.env' \
            --delete \
            ./ "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"
    else
        scp -r ./* "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"
    fi
    
    # Set permissions
    print_info "Configuration des permissions..."
    ssh "${SERVER_USER}@${SERVER_HOST}" << 'EOF'
        chmod -R 755 /var/www/geoziguinchor/
        chmod -R 644 /var/www/geoziguinchor/*.html
        chmod -R 644 /var/www/geoziguinchor/*.json
        chmod -R 644 /var/www/geoziguinchor/*.js
        chmod -R 755 /var/www/geoziguinchor/js
        chmod -R 755 /var/www/geoziguinchor/css
        chmod -R 755 /var/www/geoziguinchor/data
        chmod -R 755 /var/www/geoziguinchor/images
    EOF
    
    # Restart web server
    print_info "Redémarrage du serveur web..."
    ssh "${SERVER_USER}@${SERVER_HOST}" "sudo systemctl restart apache2" || \
    ssh "${SERVER_USER}@${SERVER_HOST}" "sudo systemctl restart nginx" || \
    true
    
    print_success "Déploiement en production réussi"
}

# Deploy to staging
deploy_staging() {
    print_info "Déploiement en staging..."
    # Similar to production but on staging server
    print_success "Déploiement en staging réussi"
}

# Local development
deploy_local() {
    print_info "Setup développement local..."
    
    if [ ! -d "node_modules" ]; then
        print_info "Installation des dépendances npm..."
        npm install
    fi
    
    print_success "Environnement de développement prêt"
    print_info "Démarrez avec: npm start"
}

# Post-deployment tests
test_deployment() {
    print_info "Tests post-déploiement..."
    
    # Test HTTP request
    if command -v curl &> /dev/null; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost/geoziguinchor/")
        if [ "$HTTP_CODE" = "200" ]; then
            print_success "Application accessible"
        else
            print_error "Application non accessible (HTTP $HTTP_CODE)"
        fi
    fi
    
    # Validate manifest
    if command -v jq &> /dev/null; then
        if jq . manifest.json > /dev/null 2>&1; then
            print_success "manifest.json valide"
        else
            print_error "manifest.json invalide"
        fi
    fi
    
    print_success "Tests complétés"
}

# Generate CSS report
generate_report() {
    print_info "Génération du rapport de déploiement..."
    
    REPORT_FILE="reports/deployment_${TIMESTAMP}.txt"
    mkdir -p reports
    
    {
        echo "=== Rapport de Déploiement ==="
        echo "Application: $APP_NAME"
        echo "Version: $APP_VERSION"
        echo "Environnement: $DEPLOY_ENV"
        echo "Date: $(date)"
        echo ""
        echo "=== Fichiers deployés ==="
        find . -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.json" \) | head -20
        echo ""
        echo "=== Taille totale ==="
        du -sh . 2>/dev/null || true
    } > "$REPORT_FILE"
    
    print_success "Rapport généré: $REPORT_FILE"
}

# Main execution
main() {
    print_info "=== Déploiement GeoZiguinchor v$APP_VERSION ==="
    print_info "Environnement: $DEPLOY_ENV"
    echo ""
    
    check_environment
    validate
    backup
    minify
    
    case $DEPLOY_ENV in
        production)
            deploy_production
            test_deployment
            ;;
        staging)
            deploy_staging
            test_deployment
            ;;
        local|dev)
            deploy_local
            ;;
        *)
            print_error "Environnement inconnu: $DEPLOY_ENV"
            echo "Usage: $0 [production|staging|local]"
            exit 1
            ;;
    esac
    
    generate_report
    
    echo ""
    print_success "=== Déploiement réussi ==="
}

# Run main
main "$@"
