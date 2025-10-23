# Environment Variables

## Required Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# Database
DATABASE_URL="mongodb://127.0.0.1:27017/prompt_demo?replicaSet=rs0"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-min-32-chars-long"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Stripe (Production only - leave empty for demo mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Cloudinary (Production only - leave empty for demo mode)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Clerk (Production only - leave empty for demo mode)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# Elasticsearch (Optional - falls back to Prisma search if not configured)
ELASTICSEARCH_NODE="http://localhost:9200"
ELASTICSEARCH_API_KEY=""

# Demo Mode (set to true for development without external services)
NEXT_PUBLIC_DEMO_MODE="true"
```

## Elasticsearch Setup (Optional)

The search functionality works in two modes:

### 1. Database Search (Default - No Setup Required)
If Elasticsearch is not configured, the app automatically falls back to Prisma database search.

### 2. Elasticsearch Search (Recommended for Production)
For enhanced search with fuzzy matching and better performance:

1. **Install Elasticsearch locally**:
   ```bash
   # Using Docker
   docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:8.11.0
   ```

2. **Update .env.local**:
   ```bash
   ELASTICSEARCH_NODE="http://localhost:9200"
   ELASTICSEARCH_API_KEY=""  # Leave empty for local dev
   ```

3. **Sync your data**:
   ```bash
   npm run sync:elastic
   ```

## Testing

To test if Elasticsearch is working:
```bash
curl http://localhost:9200
```

If it's not running, the app will gracefully fall back to database search.

