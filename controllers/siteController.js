const mongoose = require('mongoose');
const moment = require("moment");
var QRCode = require('qrcode')

let Schema = mongoose.Schema;

// Definition de mon schéma
let siteSchema = new Schema({
 name : String,
});

// Associe mon schéma à la variable => Operation
let Operation = mongoose.model("domaines", siteSchema);

// L'adresse de mon serveur
let dbUrl = "mongodb://localhost:27017/site";
const db = mongoose.connection;

const controller = {};

controller.formulaire = (req, res) => {
  res.render('site', {page:'Site', menuId:'site'});
};

controller.list = (req, res) => {
  // Connection à ma BDD
  mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  // Vérification si erreurs
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function() {

    // Requête .find sur mon schema
    Operation.find((err, result) => {
      if (err) throw err;
      // Renvoie les documents (que je défini "result") qui correspondent à mon schéma sur la vue "index"
      res.render("index", {
        page:result, menuId:'home'
      });
    });
  });
};

// controller.pagination = (req, res, next) => {
//   // Connection à ma BDD
//   mongoose.connect(dbUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });
//   // Vérification si erreurs
//   db.on("error", console.error.bind(console, "connection error:"));
//   db.once("open", function() {

//     //pagination
//     var perPage = 5;
//     var page = req.params.page || 1;

//     Operation.find({})
//         .skip((perPage * page) - perPage)
//         .limit(perPage)
//         .exec(function(err, result) {
//           Operation.count().exec(function(err, count) {
//                 if (err) return next(err)
//                 res.render("/", {
//                     site: result,
//                     current: page,
//                     pages: Math.ceil(count / perPage)
//                 })
//                 console.log(site);
//                 console.log(current);
//                 console.log(pages);
//             })
//         })
//   });
// };

controller.pagination = (req, res) => {
  // Connection à ma BDD
  mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  // Vérification si erreurs
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function() {

    //pagination
    var perPage = 3;
    var page = req.params.page || 1;

    var opts = {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      quality: 0.3,
      margin: 1,
      color: {
        dark:"#010599FF",
        light:"#FFBF60FF"
      }
    }    

    Operation
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, result) {
          console.log("result: "+result[0].name);
          Operation.count().exec(function(err, count) {
                if (err) return next(err)
                //var qcode = result.name;
                console.log("qcode: "+count);
                QRCode.toDataURL(result[0].name, {type:'image/jpeg'}, function (err, url) {
                if (err) throw err
                  res.render("url", {
                      url: result,
                      current: page,
                      pages: Math.ceil(count / perPage),
                      qrcode: url,
                      page:'Url', menuId:'url'
                  }) 
                })
            })
            
        })
  });
};

controller.save = (req, res) => {
  try {
    mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function() {
      // Déclaration de mon objet qui prend pour attributs les éléments de mon body
      let operationAjout = new Operation({
        name: req.body.name,
        
      });
      // Sauvegarde de mon objet et redirection sur la route '/'
      operationAjout.save(err => {
        if (err) throw err;
        console.log("1 document inserted");
        res.redirect("/url/1");
      });
    });
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }
};

controller.url = (req, res) => {
  try {
    mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function() {
      // Requete pour trouver l'operation qui correspond à l'id récuperer dans l'url
      Operation.findById(req.params.id, (err, result) => {
        res.redirect(result.name);
        db.close();
      });
    });
  } catch (err) {
    if (err) {
      console.log(err);
      console.log("err");
    }
  }
}; 
  


module.exports = controller;
