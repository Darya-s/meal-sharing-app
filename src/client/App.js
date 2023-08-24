import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header"
import MealList from "./components/MealList";
import Meal from "./components/Meal";
import { MealsProvider } from "./components/MealsContext";
import MainPage from "./components/MainPage";
import Footer from "./components/Footer";


function App() {
  return (
    <div className="wrapper">
      <Router>
      
          <Header />
     

        <div className="main">
          <MealsProvider>
            <Route exact path="/">
              <MainPage />
            </Route>

            <Route exact path="/meals">
              <MealList />
            </Route>
            <Route exact path="/meals/:id">
              <Meal />
            </Route>
          </MealsProvider>
        </div>
      
          <Footer />
      
      </Router>
    </div>
  );
}

export default App;
