import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import GroceryInput from "./components/GroceryInput";
import GroceryList from "./components/GroceryList";

function App() {
  return (
    <div>
      <Header />
      <main style={{ padding: '1rem' }}>
        <GroceryInput />
        <GroceryList />
      </main>
      <Footer />
    </div>
  )
}

export default App
