import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import logo from "./assets/Deliveroo_logo.svg.webp";

function App() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <>
      <header>
        <div className="logo-container">
          <img className="logo" src={logo} alt="Deliveroo" />
        </div>
      </header>

      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <main>
          <div className="hero-background">
            <section className="hero">
              <div className="col-hero-text">
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

          <section className="food-section">
            <div className="food-container">
              <div className="col-food">
                {data.categories.map((category, index) => {
                  if (category.meals.length > 0) {
                    return (
                      <div className="category" key={category.id ?? index}>
                        <h2>{category.name}</h2>

                        <div className="meals-container">
                          {category.meals.map((meal) => {
                            return (
                              <article className="meal-card" key={meal.id}>
                                <div className="meal-info">
                                  <h3>{meal.title}</h3>
                                  <p className="meal-description">
                                    {meal.description}
                                  </p>
                                  <p className="meal-price">{meal.price} €</p>
                                  {meal.popular && (
                                    <p className="meal-popular">Populaire</p>
                                  )}
                                </div>

                                {meal.picture && (
                                  <div className="meal-image">
                                    <img src={meal.picture} alt={meal.title} />
                                  </div>
                                )}
                              </article>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>

              <aside className="col-basket">
                <h3>Panier</h3>
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
