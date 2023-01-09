# Iniciando o Crud Soccer App 

## 👨‍💻 Scripts Disponíveis 

No projeto você pode rodar:

### `npm install`
Para abaixar as dependências.

### `npm start`

Inicia a aplicação no modo único de desenvolvimento.\
Abra [http://localhost:3000/api/v1/stadiums](http://localhost:3000/api/v1/stadiums) para ver se está carregando o json.\
As operações atualizam o json.\
Você poderá ver muitos logs de desenvolvimento no console. 

<br></br>

## 🧅 Divisão de códigos

- `server.js`
> Ficará ouvindo a porta 3000 e carrega o `app.js`
- `app.js` 
> É a parte principal da aplicação e carrega os middlewares como express, morgan para logs mais especificos, rateLimit para definir uma simplória defesa contra ataques de "Denial-of-service".
- `stadiumRoutes.js` 
> Contem o controle do fluxo dos middlewares das rotas para operações do modelo "stadium".
- `stadiumController.js`
> Contém a logica do CRUD, toda alteração será salvo de forma persistente local no arquivo chamado `stadiums-simple.json`
- `stadiums-simple.json`
> São os dados fictícios em formato json, é referênciada pela constante `sourceDirectory`.

<br></br>

## 📩 Configuração do Postman
![image](https://user-images.githubusercontent.com/88854160/211227551-03658c4d-383b-4d33-8905-9793a404459c.png)
> Em uma workspace, `Importe` o arquivo `CRUD-Soccer.postman_collection.json`, que contém o jogo de consultas básicas para testar o back.

<br></br>

## 🦟 Erros conhecidos
- `code: 'EADDRINUSE', errno: -4091,`
> Vai acontecer se algum outro processo esteja utiliando a porta 3000.
