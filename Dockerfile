FROM node:lts-alpine

# Crie um diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie os arquivos de configuração e pacotes para o diretório de trabalho
COPY package*.json ./
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Compile a aplicação
RUN npm run build

# Exponha a porta que a aplicação vai usar
EXPOSE 3000

# Defina o comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]