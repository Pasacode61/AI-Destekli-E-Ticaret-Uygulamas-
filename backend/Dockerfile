# Development environment for Backend (Node.js/Express)
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json if they exist
COPY package*.json ./

# Install dependencies
RUN if [ -f package.json ]; then npm install; fi

# Install nodemon globally for hot reloading in development
RUN npm install -g nodemon

# Copy the rest of the project files
COPY . .

# Expose backend port
EXPOSE 5000

# Start development server
CMD ["npm", "run", "dev"]
