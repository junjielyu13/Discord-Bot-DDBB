FROM node:18.13.0 AS development


# Set working directory
WORKDIR /usr/src/app

# RUN mkdir -p /usr/share/man/man1

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    default-jre \
    libonig-dev \
    libzip-dev

# Install puppeteer and headless Chrome for pdf generation
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - 
RUN apt-get -f install
RUN apt-get update && apt-get install -y \
    nodejs \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    # libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget \
    libgbm-dev


# RUN npm install --global --unsafe-perm puppeteer
# RUN chmod -R o+rx /usr/lib/node_modules/puppeteer/.local-chromium

# # Clear cache
# RUN apt-get clean && rm -rf /var/lib/apt/lists/*



# # Extend timeout
# # RUN echo "request_terminate_timeout = 300" >> /usr/local/etc/php-fpm.d/docker.conf

# # Add user for laravel application
# RUN groupadd -g 1001 www
# RUN useradd -u 1001 -ms /bin/bash -g www www

# COPY package*.json ./
# RUN npm install glob rimraf
# RUN npm install --only=development
# COPY . .
# RUN npm run build

# # COPY --chown=www:www package*.json ./
# # COPY --chown=www:www . .


# RUN npm install
# RUN npm install glob rimraf
# # Change current user to www
# USER www

# Creates a "dist" folder with the production build
# RUN npm run build

# Expose port 3000
# EXPOSE 3000

# Creates a "dist" folder with the production build
#RUN npm run build

#Give the path of your endpoint
# CMD [ "npm", "run", "nodemon" ]


# Copy the package.jsons from host to container
# A wildcard is used to ensure both package.json AND package-lock.json are copied

RUN npm install -g npm@latest

COPY package*.json ./

# Here we install all the deps
RUN npm install
RUN npm install -g @nestjs/cli
RUN npm install prisma --save-dev

# Bundle app source / copy all other files
COPY . .

# Build the app to the /dist folder
# RUN npm run build


EXPOSE 3000



# Build another image named production
FROM node:18 AS production

# Set node env to prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set Working Directory
WORKDIR /thomas/src/app

# Copy all from development stage
COPY --from=development /usr/src/app/ .

EXPOSE 3000

# Run app
CMD [ "node", "dist/main" ]

# Example Commands to build and run the dockerfile
# docker build -t thomas-nest .
# docker run thomas-nest