# GeoWatch Agents - automatisation V1

Cette V1 ajoute une chaine d'agents automatises cote GitHub Actions. Le site reste statique/PWA, mais les agents generent des fichiers dans `data/generated/` que le site peut lire ensuite.

## Agents inclus

- Agent Sources : choisit le profil RSS (`broad`, `all`, `verified`, `core`).
- Agent Collecte RSS : collecte les flux directement depuis GitHub Actions.
- Agent Preuves : dedoublonne, cote les sources, detecte BF/AES, tags et ruptures.
- Agent Brief BF/AES : produit `brief-latest.json` et `brief-latest.html`.
- Agent Email : envoie le brief si un fournisseur email est configure.
- Agent Orchestrateur : journalise toute l'execution dans `agent-run-log.json`.

## Fichiers generes

- `data/generated/latest-news.json`
- `data/generated/brief-latest.json`
- `data/generated/brief-latest.html`
- `data/generated/agent-run-log.json`

## Secrets GitHub utiles

Dans GitHub, aller dans `Settings > Secrets and variables > Actions`.

Obligatoires pour envoyer des emails :

- `EMAIL_TO` : destinataires separes par virgule.
- `EMAIL_FROM` : expediteur valide, par exemple `GeoWatch <veille@votredomaine.org>`.

Choisir au moins un fournisseur :

- `RESEND_API_KEY`
- `BREVO_API_KEY`
- `SENDGRID_API_KEY`

Sans ces secrets, les agents generent les fichiers mais n'envoient pas d'email.

## Planning

Le workflow `.github/workflows/geowatch-agents.yml` tourne :

- toutes les 3 heures pour mettre a jour la veille ;
- chaque jour a 07:00 UTC/Ouagadougou pour envoyer le brief si les secrets email sont presents ;
- manuellement via `workflow_dispatch`.

## Test local

```powershell
node scripts/geowatch-agents.mjs --profile verified --limit 8
```

Pour tester sans ecrire les fichiers :

```powershell
node scripts/geowatch-agents.mjs --profile verified --limit 8 --no-write
```

Pour forcer l'envoi mail local, definir les variables d'environnement puis ajouter `--send-email`.

## Garde-fous

- Aucun fait invente.
- Tout item conserve son lien source.
- Les sources D/E non corroborees sont visibles mais degradees.
- Les alertes critiques exigent un meilleur niveau de preuve.
- Les emails indiquent la source, la cote et le statut de preuve.
