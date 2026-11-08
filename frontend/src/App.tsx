import Navbar from "./components/Navbar/Navbar.tsx";
import AppCard from "./components/AppCard/AppCard.tsx";

export default function App() {

  return (
    <>
      <Navbar/>
      <ul className="app-list">
        <AppCard appTitle={"Test"} appUrl={"#"} appDescription={""}/>
      </ul>
    </>
  )
}

