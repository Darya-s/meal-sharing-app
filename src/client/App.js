import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { MealsProvider } from './components/MealsContext';
import MainPage from './components/MainPage';
import Meal from './components/Meal';
import MealList from './components/MealList';
import Footer from './components/Footer';

function App() {
  return (
    <div className="wrapper">
      <Router>
        <Header />
        <div className="main">
          <MealsProvider>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/meals" element={<MealList />} />
              <Route path="/meals/:id" element={<Meal />} />
            </Routes>
          </MealsProvider>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
