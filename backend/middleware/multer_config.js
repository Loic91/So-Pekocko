//CE MIDDLEWARE PERMET LA CONFIGURATION DE MULTER EN PERMETTANT D'ACCEPTER LES FICHIERS ENTRANT

const multer = require('multer'); //Ici on importe le package "multer"

//Ici on crée un dictionnaire (qui est lui-même un objet)
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Ici on crée un objet de configuration pour "multer".
//Nous créons une constante storage , à passer à multer comme configuration, qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants.
//On utilise une fonction de multer : "diskStorage" pour dire qu'on va enregistrer sur le disque.
const storage = multer.diskStorage({ //L'objet de configuration qu'on passe à "diskStorage" a besoin de 2 éléments :
  destination: (req, file, callback) => { //la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images
    callback(null, 'images'); //dans la "destination" on appelle directement le "callback" en passant en premier argument : "null" pour indiquer qu'il n'y a pas eu d'erreur à ce niveau et le nom du dossier en deuxième argument.
  },
  //la fonction "filename" explique à "multer" quel nom de fichier utiliser.
  filename: (req, file, callback) => { //La fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier. Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée.
    const name = file.originalname.split(' ').join('_'); //On utilise la méthode "split()" pour supprimer les espaces qui peuvent apparaitre dans le nom et la méthode "join()" les remplace par des underscores. (la méthode split(), "split" autour des espace et crée un tableau avec les différents mots du fichier)
    const extension = MIME_TYPES[file.mimetype]; //Ici on crée l'extension du fichier, c'est l'élément de notre dictionnaire qui correspond au "mymetype" du fichier envoyé par le "fronted".
    callback(null, name + Date.now() + '.' + extension); //On appelle le "callback". Le premier argument "null" indique qu'il n'y a pas d'erreur. Ensuite on crée le "filename" entier. Le "timestamp" "Date.now()" permet de le rendre le plus unique possible. Suivit d'un point (.) et de l'extension du fichier nous permet de générer un nom de fichier suffisament unique.
  }
});

module.exports = multer({storage: storage}).single('image'); //Ici on exporte l'élément "multer" entièrement configuré, on lui passe notre constante "storage" et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image.

//GRÂCE A CE MIDDLEWARE "MULTER" QUI NOUS PERMET DE GERER LES FICHIERS ENTRANT, IL FAUT MA1INTENANT APPLIQUER CE MIDDLEWARE AUX ROUTES CONCERNEES :
//DEPUIS LE DOSSIER "ROUTES", FICHIER "STUFF.JS" ON IMPORTE CE MIDDLEWARE.
//DEPUIS LE DOSSIER "CONTROLLERS", FICHIER "STUFF.JS" POUR RAJOUTER/MODIFIER LA LOGIQUE DE LA CREATION D'OBJET DANS LA BAS DE DONNEE (createSauce).
//DANS "APP.JS" ON DIT A L'APPLICATION "EXPRESS" DE SERVIR LE "DOSSIER IMAGES" LORSQU'ON FERA UNE REQUÊTE A "/images", ON CREE UN MIDDLEWARE. 