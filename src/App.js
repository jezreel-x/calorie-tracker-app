// import logo from './logo.svg';
import './App.css';
import NutritionMeter from './NutritionMeter';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/*
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      */}
      <NutritionMeter />
    </div>
  );
}

export default App;
