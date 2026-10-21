const User = require('../models/userModel');
const Article = require('../models/articleModel');

// 1. Créer un nouvel utilisateur (POST /api/users)
const createUser = async (req, res) => {
  try {
    const { name, email, age, role, bio, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Le nom et l'email sont requis"
      });
    }

    // Vérification de doublon d'email
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(409).json({
        message: 'Cet email est deja utilise'
      });
    }

    const user = await User.create({
      name,
      email,
      age,
      role,
      bio,
      phone
    });

    res.status(201).json(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};

// 2. Obtenir tous les utilisateurs (GET /api/users)
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Obtenir un utilisateur par son identifiant (GET /api/users/:id)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur non trouve'
      });
    }

    res.status(200).json(user);
  
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Identifiant de ressource invalide (format ObjectId attendu)'
      });
    }

    res.status(500).json({ message: err.message });
  }

};

// 4. Supprimer un utilisateur uniquement s'il n'a aucun article
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur non trouve'
      });
    }

    // Vérifier si l'utilisateur a publié des articles
    const article = await Article.findOne({
      author: req.params.id
    });

    if (article) {
      return res.status(400).json({
        message: 'Impossible de supprimer un utilisateur ayant des articles publies'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Utilisateur supprime avec succes'
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Identifiant de ressource invalide (format ObjectId attendu)'
      });
    }

    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  deleteUser
};