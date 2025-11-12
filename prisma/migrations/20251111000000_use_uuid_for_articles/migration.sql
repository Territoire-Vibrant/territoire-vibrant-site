-- Ensure UUID generator available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- AlterTable
ALTER TABLE "Article"
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "ArticleTranslation"
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Drop indexes relying on slug
DROP INDEX IF EXISTS "ArticleTranslation_slug_idx";
DROP INDEX IF EXISTS "ArticleTranslation_locale_slug_key";

-- Remove slug column now that we use article UUIDs
ALTER TABLE "ArticleTranslation" DROP COLUMN IF EXISTS "slug";
