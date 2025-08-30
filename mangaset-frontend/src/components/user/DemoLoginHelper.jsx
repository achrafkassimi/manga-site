// src/components/auth/DemoLoginHelper.jsx - Quick Demo Login Helper
import React from 'react';
import { Card, Button, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const DemoLoginHelper = () => {
  const { login } = useAuth();

  const demoAccounts = [
    {
      username: 'demo_user',
      email: 'demo@mangaset.com',
      password: 'demo123',
      role: 'user',
      description: 'Utilisateur standard avec quelques favoris et historique'
    },
    {
      username: 'admin_demo',
      email: 'admin@mangaset.com',
      password: 'admin123',
      role: 'admin',
      description: 'Administrateur avec accès complet et statistiques avancées'
    }
  ];

  const handleDemoLogin = async (email, password) => {
    await login({ email, password });
  };

  return (
    <Card className="mt-4 border-info">
      <Card.Header className="bg-info text-white">
        <i className="fas fa-play me-2"></i>
        Comptes de démonstration
      </Card.Header>
      <Card.Body>
        <Alert variant="info" className="small">
          <i className="fas fa-info-circle me-2"></i>
          Utilisez ces comptes pour tester l'authentification sans créer de nouveau compte.
        </Alert>
        
        {demoAccounts.map((account, index) => (
          <div key={index} className="d-flex justify-content-between align-items-center p-3 border rounded mb-2">
            <div>
              <div className="fw-bold">
                {account.username}
                <Badge bg={account.role === 'admin' ? 'warning' : 'primary'} className="ms-2">
                  {account.role}
                </Badge>
              </div>
              <small className="text-muted">{account.email}</small>
              <div className="small text-muted mt-1">{account.description}</div>
            </div>
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => handleDemoLogin(account.email, account.password)}
            >
              <i className="fas fa-sign-in-alt me-1"></i>
              Tester
            </Button>
          </div>
        ))}
        
        <div className="mt-3 p-3 bg-light rounded">
          <h6 className="small fw-bold mb-2">
            <i className="fas fa-lightbulb me-2 text-warning"></i>
            Fonctionnalités de test disponibles:
          </h6>
          <ul className="small mb-0">
            <li>✅ <strong>Inscription</strong> - Créez de nouveaux comptes</li>
            <li>✅ <strong>Connexion</strong> - Authentification complète</li>
            <li>✅ <strong>Profil</strong> - Modification des informations</li>
            <li>✅ <strong>Préférences</strong> - Paramètres utilisateur</li>
            <li>✅ <strong>Mot de passe</strong> - Changement sécurisé</li>
            <li>✅ <strong>Tableau de bord</strong> - Statistiques et historique</li>
            <li>✅ <strong>Rôles</strong> - Utilisateur standard vs admin</li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DemoLoginHelper;