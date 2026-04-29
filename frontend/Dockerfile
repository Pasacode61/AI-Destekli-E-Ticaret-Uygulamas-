# Development environment for Frontend (React/Vite)
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json if they exist
COPY package*.json ./

# Install dependencies (conditional to avoid errors if package.json is missing initially)
RUN if [ -f package.json ]; then npm install; fi

# Copy the rest of the project files
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start Vite dev server exposing to network
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
