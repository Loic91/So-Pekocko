//Serveur Node
//La fonction "require" est un moyen pour inclure des modules qui existe dans des fichiers séparés. La fonctionnalité de base de "require" est qu'il lit un fichier javascript, l'exécute, puis retourne l'objet exporté. 
//https://nodejs.org/en/knowledge/getting-started/what-is-require/
const http = require('http'); //On importe la package HTTP de Node. Il permet le développement de serveur HTTP, et permet l’exécution de JavaScript côté serveur. https://fr.wikipedia.org/wiki/Node.js
const app = require('./app'); //Ici on importe notre application via le "./app" qui permet d'accéder au fichier "app.js"

//La fonction "normalizePort" renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne.
const normalizePort = val => {
  const port = parseInt(val, 10);

  //La fonction "isNaN()" permet de déterminer si une valeur est NaN (Not a Number)
  //Ici on dit que si le "port" n'est pas un nombre alors il doit retourner un "string" (chaine de caractères)
  if (isNaN(port)) { 
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000'); //Le serveur doit attendre et recevoir les requêtes envoyées. On utilise par défaut le port 3000, mais dans le cas où le port 3000 n'est pas disponible on utilise une variable 'environnement' au cas où l'environnement sur lequel tourne le serveur nous envoi un port à utiliser on utilisera le port "process.env.PORT"  mais par défaut c'est le port 3000.
app.set('port', port); //Avant de faire tourner l'application via le serveur, on doit lui dire sur quel "port" elle doit tourner. On dit qu'on "set" le "port" (Ex: app.set('port', 3000) ) et on lui dit sur quel port elle doit tourner.

//La fonction "errorHandler" recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur.
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); //On exécute notre objet "http" et on appelle la méthode "createServer" du package "HTTP". Elle transforme notre ordinateur en serveur HTTP. Elle prend comme argument la fonction qui sera appelé à chaque requête reçue par le serveur. Cette fonction reçoit deux arguments : la requête et la réponse. (Ex: createServer((req, res) =>{) Dans notre cas, la fonction appelle "app" et récupère les informations contenues dans "app.js". 
//Elle récupère la requête et la réponse

//La méthode "on()" attache un ou plusieurs gestionnaires d'événements pour les éléments sélectionnés. https://www.w3schools.com/jquery/event_on.asp 
//Elle consigne ici le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
