# ========================================

# 📦 INSTALLATION DES DÉPENDANCES

# ========================================

# 1. Installer les dépendances principales

npm install @prisma/client bcryptjs
npm install -D prisma @types/bcryptjs

# 2. Installer Formik et Yup

npm install formik yup

# 3. Installer TanStack Query

npm install @tanstack/react-query

# 4. Installer React Hot Toast

npm install react-hot-toast

# 5. Installer les composants shadcn/ui nécessaires

npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add alert-dialog
npx shadcn@latest add table
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add checkbox
npx shadcn@latest add badge

# 6. Installer Lucide React pour les icônes

npm install lucide-react

# ========================================

# 🗄️ CONFIGURATION DE LA BASE DE DONNÉES

# ========================================

# 7. Initialiser Prisma (si pas encore fait)

npx prisma init

# 8. Configurer votre .env avec DATABASE_URL

# Exemple: DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# 9. Générer le client Prisma

npx prisma generate

# 10. Créer et appliquer les migrations

npx prisma migrate dev --name init

# 11. (Optionnel) Ouvrir Prisma Studio pour gérer la DB

npx prisma studio

# ========================================

# 🌱 SEED DE DONNÉES (Optionnel)

# ========================================

# 12. Créer un fichier seed pour ajouter des rôles de base

# Créer prisma/seed.ts avec le contenu ci-dessous, puis :

npx prisma db seed

# ========================================

# 🚀 DÉMARRER LE SERVEUR

# ========================================

# 13. Démarrer le serveur de développement

npm run dev
