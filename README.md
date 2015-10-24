LoneWolf
===============
Adaptation du livre dont vous êtes le héros "Les Grottes de Kalte" par Joe Dever et Gary Chalk.
Réalisé par Thibault B. et Arnaud B. pour les laboratoires du module LOG4420 de l'Ecole Polytechnique de Montréal.

L'application Web utilise : NodeJS, Express et MongoDB.

------------------------------------------------------------------------------------
## Installer et lancer

* A la racine du dossier `npm start`.
* Rendez-vous `localhost:3000`.

## Informations supplémentaires
### Routes intéressantes

<html>

<table>

  <tr>
    <th>Exemple de routes</th>
    <th>Fonctionnalité</th>
  </tr>

  <tr>
    <td><code>/jeu/joueur</code></td>
    <td>Affiche les informations du joueur (stockée dans une session).</td>
  </tr>

  <tr>
    <td><code>/jeu/123</code></td>
    <td>Retourne un JSON contenant les informations de la page 123.</td>
  </tr>

  <tr>
    <td><code>/jeu/page/123</code></td>
    <td>Retourne le HTML de la page 123.</td>
  </tr>

  <tr>
    <td><code>/jeu/page/123/1</code></td>
    <td>Retourne le HTML de la section 1 de la page 123.</td>
  </tr>

   <tr>
    <td><code>/choixAleatoire/123</code></td>
    <td>Retourne la page accessible selon le nombre aléatoire obtenu pour la page 123.</td>
  </tr>

</table>