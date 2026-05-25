# ---------- Base Image ----------
FROM node:20-alpine

# ---------- Install Required Packages ----------
RUN apk add --no-cache wget

# ---------- App Directory ----------
WORKDIR /app

# ---------- Copy Package Files ----------
COPY package*.json ./

# ---------- Install Dependencies ----------
RUN npm install --omit=dev

# ---------- Copy Application Source ----------
COPY . .

# ---------- Environment Variables ----------
ENV NODE_ENV=production
ENV PORT=5000

# ---------- Expose Application Port ----------
EXPOSE 5000

# ---------- Health Check ----------
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1

# ---------- Start Application ----------
CMD ["npm", "start"]