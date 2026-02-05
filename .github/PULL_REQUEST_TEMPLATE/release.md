## 🚀 Mise en prod (dev → prod)
**Version cible :** `vX.Y.Z`  
**Type :** major / minor / patch

## ✅ Checklist release
- [ ] CI verte sur cette PR
- [ ] `dev` est à jour et contient tout ce qui doit sortir
- [ ] Changements à risque identifiés (migrations, breaking, perf)
- [ ] Plan de rollback noté (tag Docker précédent)
- [ ] Variables d’env / secrets OK (si changement)
- [ ] Migration DB prête + stratégie (auto / manuel)

## 📦 Publication
- [ ] Bump version sur `prod` (`npm version ...`) puis `git push --follow-tags`
- [ ] Image Docker publiée avec tag `vX.Y.Z` (+ `latest` si souhaité)

## 🧪 Smoke tests post-déploiement
- [ ] Démarrage OK
- [ ] Endpoint santé (`/health` ou équivalent) OK
- [ ] Auth / action critique OK
- [ ] Logs sans erreurs anormales