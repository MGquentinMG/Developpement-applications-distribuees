#!/bin/sh
set -e
echo "==> Configuration de Vault (mode dev)..."

vault secrets enable transit 2>/dev/null && echo "Transit activé" || echo "Transit déjà activé"
vault write -f transit/keys/jwt-key type=ecdsa-p256 2>/dev/null && echo "Clé JWT créée" || echo "Clé JWT déjà existante"

echo "==> Vault configuré avec succès"
