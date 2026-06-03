FROM node:22-alpine
WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy application files
COPY . .

# Expose port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Run the application
CMD ["node", "server.js"]
