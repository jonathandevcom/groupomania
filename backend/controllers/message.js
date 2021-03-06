const db = require("../models/connect");
const { success, error } = require("../middleware/functions");
const fs = require('fs');

// Récupération de tous les messages
exports.getAllMessages = (req, res, next) => {
  if (req.query.max != undefined && req.query.max > 0) {
    db.query(
      "SELECT * FROM messages LIMIT 0, ?",
      [req.query.max],
      (err, result) => {
        if (err) {
          res.status(400).json(error(err.message));
        } else {
          res.status(200).json(success(result));
        }
      }
    );
  } else if (req.query.max != undefined) {
    res.status(404).json(error("Wrong max value"));
  } else {
    db.query("SELECT * FROM messages LEFT JOIN users ON messages.id_users_messages = users.id_users", (err, result) => {
      // SELECT * FROM messages LEFT JOIN users ON messages.id_users_messages = users.id
      if (err) {
        res.status(400).json(error(err.message));
      } else {
        res.status(200).json(success(result));
      }
    });
  }
};

// Création d'un message
exports.createOneMessage = (req, res) => {
  db.query(
    "INSERT INTO messages (id_users_messages, image, text) VALUES (?, ?, ?)",
    [
      req.body.id_users_messages, 
      `${req.protocol}://${req.get("host")}/images-gif/${req.file.filename}`,
      req.body.text,
    ],
    (err, result) => {
      if (err) {
        res.status(400).json(error(err.message));
      } else {
         res.status(201).json(success("Message added"));
      }
    }
  );
};

// suppression d'un message
exports.deleteOneMessage = (req, res) => {
  db.query(
    "SELECT * FROM messages WHERE id_messages = ?",
    [req.params.id],
    (err, result) => {
      console.log(result[0]);
      if (err) {
        res.status(400).json(error(err.message));
      } else {
        if (result[0] != undefined) {
          const filename = result[0].image.split('http://localhost:3000/images-gif/')[1];
          db.query(
            "DELETE messages, comments FROM messages LEFT JOIN comments ON messages.id_messages = comments.id_messages_comments WHERE id_messages = ? ",
            [req.params.id],
            (err, result) => {
              if (err) {
                res.status(400).json(error(err.message));
              } else {
                res.status(200).json(success("Message deleted"));
                fs.unlinkSync(`images-gif/${filename}`);
              }
            }
          );
        } else {
          res.status(404).json(error("Wrong id"));
        }
      }
    }
  );
};

// SELECT * 
// FROM messages 
// LEFT JOIN users ON messages.id_users_messages = users.id_users
// LEFT JOIN likes ON likes.id_users_likes = users.id_users

// SELECT SUM(likes) AS numberLikes FROM likes WHERE id_messages_likes