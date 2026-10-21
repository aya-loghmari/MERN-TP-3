
const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

// GET : Tous les utilisateurs
router.get("/", userController.getUsers);

// GET : Un utilisateur par ID
router.get("/:id", userController.getUserById);

// POST : Creer un utilisateur
router.post("/", userController.createUser);

// DELETE : Supprimer un utilisateur
router.delete("/:id", userController.deleteUser);

module.exports = router;
