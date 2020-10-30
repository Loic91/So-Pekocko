//CE MIDDLEWARE VERIFIE LE "TOKEN" ENVOYE PAR L'APPLICATION FRONTED AVEC SA REQUÊTE. IL VERIFIE QU'IL S'AGIT BIEN D'UN "TOKEN" VALABLE ET QUE LE L'"ID" du "USER" CORRESPOND BIEN A CELUI QUI EST ENCODE DANS LE TOKEN.
//AUTREMENT DIT, CE MIDDLEWARE PROTEGE LES ROUTES SELECTIONNEES ET VERIFIE QUE L'UTILISATEUR SOIT AUTHENTIFIE AVANT D'AUTORISER L'ENVOI DE SES REQUÊTES.

const jwt = require('jsonwebtoken'); //On récupère le package "jsonwebtoken" pour vérifier les token

module.exports = (req, res, next) => { //On exporte un middleware classique
  //Etant donné que de nombreux problèmes peuvent se produire, nous insérons tout à l'intérieur d'un bloc try...catch
  try {
    const token = req.headers.authorization.split(' ')[1]; //Ici on crée une constante à partir de la requête, les "headers" de la requête et le header "authorization". On "split" cela autour de l'espace,cela va retourner un tableau avec "bearer" en premier élément et le token en deuxième élément. On récupère simplement le "deuxième" élément de ce tableau ([1]).
    //Autrement dit : on extrait le token du header Authorization de la requête entrante. La fonction split pour récupérer tout après l'espace dans le header
    const decodedToken = jwt.verify(token, 'udl*VFMnxp5Crly-({'); //Ici on vérifie le token. En utilisans la fonction verify pour décoder notre token.
    //Une fois le token décodé, celui-ci devient un "objet javascript"
    const userId = decodedToken.userId; //On extrait l'ID utilisateur de notre token
    if (req.body.userId && req.body.userId !== userId) { //Si la demande contient un ID utilisateur, nous le comparons à celui extrait du token. S'ils sont différents, nous générons une erreur. Dans le cas contraire, si tout fonctionne et que notre utilisateur est authentifié. Nous passons l'exécution à l'aide de la fonction next() .
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!') //En cas de problème d'authentification
    });
  }
};