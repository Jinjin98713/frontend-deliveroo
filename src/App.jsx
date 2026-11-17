import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import logo from "./assets/Deliveroo_logo.svg.webp";
import placeholderMeal from "./assets/placeholder-meal.png";

function App() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    console.log("useEffect");
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3000/");
      // console.log(response.data);
      setData(response.data);
      // passer isLoading à false une fois les données récupérées :
      setIsLoading(false);
    };

    fetchData();
    // le deuxième argument du useEffect est appelé tableau de dépendances !
  }, []);

  // On initialise le sous-total à 0
  let subtotal = 0;

  // On parcourt tous les plats du panier
  for (let i = 0; i < cart.length; i++) {
    // On récupère le plat à la position i
    const meal = cart[i];

    // On convertit son prix en nombre
    const price = Number(meal.price);

    // On calcule le prix selon la quantité
    const totalMeal = price * meal.quantity;

    // On ajoute le résultat au sous-total
    subtotal = subtotal + totalMeal;
  }

  // Frais de livraison : 2,50 € si le panier contient au moins un plat
  const deliveryFee = cart.length > 0 ? 2.5 : 0;

  // Calcul du total de la commande
  const total = subtotal + deliveryFee;

  return (
    <>
      <header>
        {/* Affichage du logo Deliveroo */}
        <div className="logo-container">
          <img className="logo" src={logo} alt="Deliveroo" />
        </div>
      </header>

      {/* 
  Opérateur ternaire :
  - Si isLoading est true : on affiche "Chargement..."
  - Sinon : on affiche le contenu de la page
*/}
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <main>
          {/* Section présentant le restaurant */}
          <div className="hero-background">
            <section className="hero">
              <div className="col-hero-text">
                {/* On récupère les informations du restaurant depuis l'API */}
                <h1>{data.restaurant.name}</h1>
                <p>{data.restaurant.description}</p>
              </div>

              <div className="col-hero-img">
                <img
                  src={data.restaurant.picture}
                  alt="Table avec des plats du restaurant"
                />
              </div>
            </section>
          </div>

          {/* Section contenant les catégories, les plats et le panier */}
          <section className="food-section">
            <div className="food-container">
              <div className="col-food">
                {/*
            PREMIER .map()

            On parcourt le tableau data.categories provenant de l'API.

            - category : représente la catégorie actuelle
            - index : représente sa position dans le tableau
          */}
                {data.categories.map((category, index) => {
                  /*
              On vérifie que la catégorie contient au moins un plat.

              category.meals est un tableau.
              .length donne le nombre d'éléments de ce tableau.

              Si le tableau est vide, on n'affiche pas cette catégorie.
            */
                  if (category.meals.length > 0) {
                    return (
                      <div className="category" key={category.id ?? index}>
                        {/*
                    key permet à React d'identifier les éléments de la liste.

                    ?? signifie :
                    - utiliser category.id s'il n'est ni null ni undefined
                    - sinon utiliser index

                    Dans notre backend, les catégories n'ont pas d'id.
                    C'est donc index qui est utilisé.
                  */}

                        {/* Affichage du nom de la catégorie */}
                        <h2>{category.name}</h2>

                        <div className="meals-container">
                          {/*
                      DEUXIÈME .map()

                      On parcourt le tableau meals de la catégorie actuelle.

                      - meal : représente un plat de cette catégorie

                      Pour chaque plat, on retourne une carte HTML.
                    */}
                          {category.meals.map((meal) => {
                            return (
                              <article
                                /* ici je gère avec .some() si le plat sélectionné est déjà présent dans le panier avec son id.
                              si oui on ajoute la classe "meal-card-selected" avec une bordure tant que le plat est dans le panier
                              sinon, aucunes classes. */
                                className={`meal-card ${
                                  cart.some((item) => item.id === meal.id)
                                    ? "meal-card-selected"
                                    : ""
                                }`}
                                key={meal.id}
                                onClick={() => {
                                  // Étape 1 : création d'une copie du tableau cart
                                  // On utilise le spread operator pour ne pas modifier directement le state React
                                  const copy = [...cart];

                                  // Étape 2 : rechercher si le plat sélectionné existe déjà dans le panier
                                  // .find() parcourt le tableau et retourne le premier plat ayant le même id
                                  // Si aucun plat ne correspond, existingMeal vaudra undefined
                                  const existingMeal = copy.find((item) => {
                                    return item.id === meal.id;
                                  });

                                  // Étape 3 : gérer les deux situations
                                  if (existingMeal) {
                                    // Le plat existe déjà dans le panier

                                    // .findIndex() récupère la position du plat dans le tableau
                                    const index = copy.findIndex((item) => {
                                      return item.id === meal.id;
                                    });

                                    // On remplace le plat par une copie de celui-ci
                                    // ...existingMeal conserve ses propriétés (id, title, price, etc.)
                                    // quantity augmente de 1 à chaque nouveau clic
                                    // On évite ainsi de modifier directement l'objet du state
                                    copy[index] = {
                                      ...existingMeal,
                                      quantity: existingMeal.quantity + 1,
                                    };
                                  } else {
                                    // Le plat n'existe pas encore dans le panier

                                    // On crée un nouvel objet avec toutes les propriétés du plat
                                    // et on ajoute une propriété quantity initialisée à 1
                                    const newMeal = {
                                      ...meal,
                                      quantity: 1,
                                    };

                                    // .push() ajoute le nouveau plat à la fin de notre copie du tableau
                                    copy.push(newMeal);
                                  }

                                  // Étape 4 : mise à jour du state
                                  // React reçoit le nouveau tableau et actualise l'affichage du panier
                                  setCart(copy);
                                }}
                              >
                                {/* Informations du plat */}
                                <div className="meal-info">
                                  <h3>{meal.title}</h3>

                                  <p className="meal-description">
                                    {meal.description}
                                  </p>
                                  <div className="meal-price-container">
                                    <p className="meal-price">{meal.price} €</p>

                                    {/*
                              Affichage conditionnel avec &&

                              Si meal.popular est true :
                              on affiche "Populaire".

                              Sinon, on n'affiche rien.
                            */}
                                    {meal.popular && (
                                      <p className="meal-popular">
                                        ★ Populaire
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/*
                            Affichage conditionnel de l'image.

                            Certains plats n'ont pas de propriété picture.

                            Si meal.picture existe et contient une valeur
                            truthy, on affiche l'image.

                            Sinon, on ne crée pas cet élément HTML.
                          */}

                                <div className="meal-image">
                                  <img
                                    src={meal.picture || placeholderMeal}
                                    alt={meal.title}
                                  />
                                </div>
                              </article>
                            );
                          })}

                          {/* Fin du deuxième .map() : liste des plats */}
                        </div>
                      </div>
                    );
                  }

                  // Si la catégorie est vide, aucun élément JSX n'est retourné.
                })}

                {/* Fin du premier .map() : liste des catégories */}
              </div>
              {/* Panier statique : sa logique sera ajoutée plus tard */}

              <aside className="col-basket">
                <h3>Panier</h3>

                {/* Bouton de validation du panier */}
                <button
                  className="basket-validate"
                  disabled={cart.length === 0}
                >
                  Valider mon panier
                </button>

                {/* Affichage des plats ajoutés au panier */}
                <div className="basket-meals">
                  {cart.map((meal) => {
                    return (
                      <div className="basket-item" key={meal.id}>
                        {/* Boutons pour modifier la quantité du plat */}
                        <div className="basket-quantity">
                          <button
                            onClick={() => {
                              // Étape 1 : créer une copie du tableau cart
                              const copy = [...cart];

                              // Étape 2 : retrouver la position du plat dans le panier
                              const index = copy.findIndex((item) => {
                                return item.id === meal.id;
                              });

                              // Étape 3 : vérifier la quantité du plat
                              if (meal.quantity > 1) {
                                // On crée une copie du plat avec une quantité diminuée de 1
                                copy[index] = {
                                  ...meal,
                                  quantity: meal.quantity - 1,
                                };
                              } else {
                                // Si la quantité vaut 1, on supprime le plat du tableau
                                copy.splice(index, 1);
                              }

                              // Étape 4 : mettre à jour le state
                              setCart(copy);
                            }}
                          >
                            -
                          </button>

                          <span>{meal.quantity}</span>

                          <button
                            onClick={() => {
                              // Étape 1 : créer une copie du tableau cart
                              const copy = [...cart];

                              // Étape 2 : retrouver la position du plat dans le panier
                              const index = copy.findIndex((item) => {
                                return item.id === meal.id;
                              });

                              // Étape 3 : remplacer le plat par une copie
                              // dont la quantité est augmentée de 1
                              copy[index] = {
                                ...meal,
                                quantity: meal.quantity + 1,
                              };

                              // Étape 4 : mettre à jour le state
                              setCart(copy);
                            }}
                          >
                            +
                          </button>
                        </div>

                        {/* Nom du plat */}
                        <p className="basket-meal-title">{meal.title}</p>

                        {/* Prix du plat multiplié par sa quantité */}
                        <span className="basket-meal-price">
                          {(Number(meal.price) * meal.quantity).toFixed(2)} €
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Récapitulatif des montants du panier */}
                <div className="basket-summary">
                  <div className="basket-summary-row">
                    <p>Sous-total</p>
                    <p>{subtotal.toFixed(2)} €</p>
                  </div>

                  <div className="basket-summary-row">
                    <p>Frais de livraison</p>
                    <p>{deliveryFee.toFixed(2)} €</p>
                  </div>

                  <div className="basket-total">
                    <p>Total</p>
                    <p>{total.toFixed(2)} €</p>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </main>
      )}

      <footer></footer>
    </>
  );
}

export default App;
