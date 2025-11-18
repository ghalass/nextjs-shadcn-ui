je veut faire une application de suivi et traitement des pannes sur mes engins miniers repartis sur plusieurs sites miniers,
ces anomalies parfois nécessites des pièces de rechange qui peut être disponibles ou pas.
ces pannes ont des types (mécanique, pneumatique, hydraulique ...etc) et origines (controle journalier, entretien systématique, inspection ...etc)
ces pannes seront traité par des techniciens
chaque engin doit avoir un nom et un site (position géographique)
ces pannes doivent avoir des niveaux d'urgences et date d'apparition et date d'exexution
merci de me proposer un schema.prisma avec commentaires pour les models manquant de mon schema ci-dessus
utilise cuid() pour les id au lieu de autoincrement()

// prisma/schema.prisma

generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

model User {
id String @id @default(cuid())
email String @unique
name String
password String
roles UserRole[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

// Relations
interventions Intervention[]

@@map("users")
}

model Role {
id String @id @default(cuid())
name String @unique
description String?
permissions RolePermission[]
users UserRole[]

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@map("roles")
}

model Permission {
id String @id @default(cuid())
name String @unique
description String?
action String
resourceId String

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

// Relations
resource Resource @relation(fields: [resourceId], references: [id], onDelete: Cascade)
rolePermissions RolePermission[]

@@map("permissions")
}

model UserRole {
id String @id @default(cuid())
userId String
roleId String
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@unique([userId, roleId])
@@map("user_roles")
}

model RolePermission {
id String @id @default(cuid())
roleId String
permissionId String
role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@unique([roleId, permissionId])
@@map("role_permissions")
}

model Site {
id String @id @default(cuid())
name String @unique
active Boolean @default(true)

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

// Relations
engins Engin[]
saisiehrms Saisiehrm[]
objectifs Objectif[]
interventions Intervention[]

@@map("sites")
}

model Resource {
id String @id @default(cuid())
name String @unique
label String

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

// Relations
permissions Permission[]

@@map("resources")
}

// MODÈLES POUR LA GESTION DES PANNES ET INTERVENTIONS

model Typepanne {
id String @id @default(cuid())
name String @unique
description String?

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

// Relations
pannes Panne[]
typepanneParc TypepanneParc[]

@@map("typepannes")
}

model OriginePanne {
id String @id @default(cuid())
name String @unique
description String?

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

// Relations
pannes Panne[]

@@map("origine_pannes")
}

model NiveauUrgence {
id String @id @default(cuid())
name String @unique
description String?
level Int // 1: Basse, 2: Moyenne, 3: Haute, 4: Critique
color String? // Couleur pour l'UI (ex: "#FF0000" pour rouge)

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

// Relations
pannes Panne[]

@@map("niveau_urgences")
}

model StatutIntervention {
id String @id @default(cuid())
name String @unique
description String?

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

// Relations
interventions Intervention[]

@@map("statut_interventions")
}

model Panne {
id String @id @default(cuid())
code String? @unique // Code unique pour référence
description String
dateApparition DateTime // Date de détection de la panne
dateExecution DateTime? // Date prévue pour l'intervention
dateCloture DateTime? // Date de résolution effective
observations String?
tempsArret Float? // Temps d'arrêt en heures
coutEstime Float? // Coût estimé de la réparation

// Relations
typepanneId String
originePanneId String
niveauUrgenceId String
enginId String
interventions Intervention[]
piecesDemandees PieceDemandee[]

typepanne Typepanne @relation(fields: [typepanneId], references: [id], onDelete: Restrict)
originePanne OriginePanne @relation(fields: [originePanneId], references: [id], onDelete: Restrict)
niveauUrgence NiveauUrgence @relation(fields: [niveauUrgenceId], references: [id], onDelete: Restrict)
engin Engin @relation(fields: [enginId], references: [id], onDelete: Restrict)

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
saisiehims Saisiehim[]

@@map("pannes")
}

model Intervention {
id String @id @default(cuid())
dateDebut DateTime // Date de début de l'intervention
dateFin DateTime? // Date de fin effective
descriptionTravaux String // Description détaillée des travaux
tempsPasse Float? // Temps passé en heures
observations String?

// Relations
panneId String
technicienId String // Utilisateur qui effectue l'intervention
siteId String
statutInterventionId String
piecesUtilisees PieceUtilisee[]

panne Panne @relation(fields: [panneId], references: [id], onDelete: Cascade)
technicien User @relation(fields: [technicienId], references: [id], onDelete: Restrict)
site Site @relation(fields: [siteId], references: [id], onDelete: Restrict)
statutIntervention StatutIntervention @relation(fields: [statutInterventionId], references: [id], onDelete: Restrict)

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@map("interventions")
}

// GESTION DES PIÈCES DE RECHANGE

model CategoriePiece {
id String @id @default(cuid())
name String @unique
description String?

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

// Relations
pieces Piece[]

@@map("categorie_pieces")
}

model Piece {
id String @id @default(cuid())
reference String @unique // Référence unique de la pièce
designation String
prixUnitaire Float?
stockActuel Int @default(0)
stockMinimum Int @default(5)
fournisseur String?

// Relations
categoriePieceId String
piecesDemandees PieceDemandee[]
piecesUtilisees PieceUtilisee[]

categoriePiece CategoriePiece @relation(fields: [categoriePieceId], references: [id], onDelete: Restrict)

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@map("pieces")
}

model PieceDemandee {
id String @id @default(cuid())
quantite Int
prix Float? // Prix au moment de la demande
observations String?

// Relations
panneId String
pieceId String

panne Panne @relation(fields: [panneId], references: [id], onDelete: Cascade)
piece Piece @relation(fields: [pieceId], references: [id], onDelete: Restrict)

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@unique([panneId, pieceId])
@@map("pieces_demandees")
}

model PieceUtilisee {
id String @id @default(cuid())
quantite Int
prix Float? // Prix effectif au moment de l'utilisation

// Relations
interventionId String
pieceId String

intervention Intervention @relation(fields: [interventionId], references: [id], onDelete: Cascade)
piece Piece @relation(fields: [pieceId], references: [id], onDelete: Restrict)

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@unique([interventionId, pieceId])
@@map("pieces_utilisees")
}

// MODÈLES EXISTANTS (MIS À JOUR AVEC CUID)

model Typeparc {
id String @id @default(cuid())
name String @unique

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

// Relations
parcs Parc[]

@@map("typeparcs")
}

model Parc {
id String @id @default(cuid())
name String @unique
typeparcId String
typeparc Typeparc @relation(fields: [typeparcId], references: [id], onDelete: Restrict)

// Relations
engins Engin[]
typesConsommationLub TypeconsommationlubParc[]
typepanneParc TypepanneParc[]
lubrifiantParc LubrifiantParc[]
objectifs Objectif[]

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@map("parcs")
}

model Typeconsommationlub {
id String @id @default(cuid())
name String @unique

// Relations
parcs TypeconsommationlubParc[]
saisielubrifiants Saisielubrifiant[]

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@map("typeconsommationlubs")
}

model TypeconsommationlubParc {
parcId String
typeconsommationlubId String
parc Parc @relation(fields: [parcId], references: [id], onDelete: Restrict)
typeconsommationlub Typeconsommationlub @relation(fields: [typeconsommationlubId], references: [id], onDelete: Restrict)

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@id([parcId, typeconsommationlubId])
@@map("typeconsommationlub_parc")
}

model Lubrifiant {
id String @id @default(cuid())
name String @unique
typelubrifiantId String
typelubrifiant Typelubrifiant @relation(fields: [typelubrifiantId], references: [id], onDelete: Restrict)

// Relations
saisielubrifiants Saisielubrifiant[]
lubrifiantParcs LubrifiantParc[]

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@map("lubrifiants")
}

model LubrifiantParc {
parcId String
lubrifiantId String
parc Parc @relation(fields: [parcId], references: [id], onDelete: Restrict)
lubrifiant Lubrifiant @relation(fields: [lubrifiantId], references: [id], onDelete: Restrict)

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@id([parcId, lubrifiantId])
@@map("lubrifiant_parc")
}

model Engin {
id String @id @default(cuid())
name String @unique
active Boolean @default(true)
parcId String
siteId String
initialHeureChassis Float? @default(0)

// Relations
parc Parc @relation(fields: [parcId], references: [id], onDelete: Restrict)
site Site @relation(fields: [siteId], references: [id], onDelete: Restrict)
saisiehrms Saisiehrm[]
saisiehim Saisiehim[]
pannes Panne[]

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@map("engins")
}

model TypepanneParc {
parcId String
typepanneId String
parc Parc @relation(fields: [parcId], references: [id], onDelete: Restrict)
typepanne Typepanne @relation(fields: [typepanneId], references: [id], onDelete: Restrict)

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@id([parcId, typepanneId])
@@map("typepanne_parc")
}

model Saisiehrm {
id String @id @default(cuid())
du DateTime
enginId String
siteId String
hrm Float

// Relations
engin Engin @relation(fields: [enginId], references: [id], onDelete: Restrict)
site Site @relation(fields: [siteId], references: [id], onDelete: Restrict)
saisiehim Saisiehim[]

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@unique([du, enginId])
@@map("saisiehrms")
}

model Saisiehim {
id String @id @default(cuid())
panneId String
him Float
ni Int
saisiehrmId String
enginId String?
obs String?

// Relations
panne Panne @relation(fields: [panneId], references: [id], onDelete: Restrict)
saisiehrm Saisiehrm @relation(fields: [saisiehrmId], references: [id], onDelete: Restrict)
engin Engin? @relation(fields: [enginId], references: [id], onDelete: Restrict)
saisielubrifiants Saisielubrifiant[]

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@unique([panneId, saisiehrmId])
@@map("saisiehims")
}

model Typelubrifiant {
id String @id @default(cuid())
name String @unique

// Relations
lubrifiants Lubrifiant[]

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@map("typelubrifiants")
}

model Saisielubrifiant {
id String @id @default(cuid())
lubrifiantId String
qte Float
obs String?
saisiehimId String
typeconsommationlubId String?

// Relations
lubrifiant Lubrifiant @relation(fields: [lubrifiantId], references: [id], onDelete: Restrict)
saisiehim Saisiehim @relation(fields: [saisiehimId], references: [id], onDelete: Restrict)
typeconsommationlub Typeconsommationlub? @relation(fields: [typeconsommationlubId], references: [id], onDelete: Restrict)

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@map("saisielubrifiants")
}

model Objectif {
id String @id @default(cuid())
annee Int
parcId String
siteId String
dispo Float?
mtbf Float?
tdm Float?
spe_huile Float?
spe_go Float?
spe_graisse Float?

// Relations
parc Parc @relation(fields: [parcId], references: [id], onDelete: Restrict)
site Site @relation(fields: [siteId], references: [id], onDelete: Restrict)

createdAt DateTime @default(now())
updatedAt DateTime? @updatedAt

@@unique([annee, parcId, siteId])
@@map("objectifs")
}

##################
me faire la page Niveau_urgencesPage qui gère l'Origine des niveau_urgences
avec fonctionnalités ci-dessous :

- utilise shadcn/ui avec thème adapté au mode "dark/light" uniquement
- utilise TanStack table
- utilise TanStack query (pour les query et mutations vers la API)
- utilise Yup, importe le à partir de "lib/yupFr.ts"
- utilise formik
- crée un fichier hook pour la gestion des requettes (dans le dossier hooks)
- Ui/UX amélioré
- recherche globale et recherche par colonne
- trie par colonne
- pagination (rajoute option afficher tout à la Sélection du nombre d'éléments par page)
- corrige tout les erreurs typage possibles
- rajoute l'option d'exporter en EXCEL (utilise librairie xlsx)
- crée tout les composants nécessaire (modals, ...etc)
- crée tout les endpoints nécessaire pour CRUD
- mon projet est nextjs
- utilise le shcema.prisma ci-dessus
- s'inspire de la page ci-dessous pour améliorer la proposition
