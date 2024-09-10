<h2>Ferramentas Necessárias:</h2> 
<ul> 
  <li>NestJS / Node.js</li> 
  <li>PostgreSQL</li> 
</ul> 

<h2>Como Executar:</h2> 
<p> 
  Para começar, crie um arquivo chamado <code>.env</code> na pasta raiz do projeto. Em seguida, 
  localize o arquivo <strong>.env.exemplo</strong> na mesma pasta, copie o conteúdo desse arquivo 
  e cole no seu novo arquivo <code>.env</code>. </p> 
  <p> Após configurar o arquivo <code>.env</code>, 
  instale as dependências do projeto executando: </p> <pre><code>npm install</code></pre> 
    <p> 
      Em seguida, execute as migrations do banco de dados com o comando: 
    </p> <pre><code>npx prisma migrate dev --name nome-da-migration</code></pre> 
    <p> Por fim, inicie o servidor com: </p> <pre><code>npm run start</code></pre> <p> Agora, seu projeto deve estar rodando corretamente. 
</p>
  
  <h2>Ferramentas Usadas no Projeto:</h2>
  <ul>
      <li><img align="center" alt="php" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"> PostgreSQL; </li>
      <li><img align="center" alt="php" height="30" width="40" src="https://img.icons8.com/color/48/000000/docker.png"> Docker (em breve);</li>
      <li><img align="center" alt="php" height="30" width="40" src="https://i.ibb.co/Nn2Zqmj/github-1.png"> GIT;</li>
      <li> <img align="center" alt="php" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg" /> NestJS;</li>
      <li><img align="center" alt="php" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" /> TypeScript</li>
    <li><img align="center" alt="php" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg" /> Prisma;</li>
    <li><img align="center" alt="php" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" /> S3 (em breve);</li>
  </ul>
