import { createBrowserRouter,RouterProvider, Navigate } from "react-router-dom";
import Home from "./page/Home";
import Depenses from "./page/Depenses";
import Inventory from "./page/Inventory";
import Order from "./page/Order";


function App() {

  const router_fr = createBrowserRouter([
    {
      path: "/",
      element:<Home />
    },
    {
      path: "/depenses",
      element:<Depenses />
    },
    {
      path: "/inventory",
      element:<Inventory />
    },
    {
      path: "/order",
      element:<Order />
    }
  ])
  return (
      <div>
        <RouterProvider router = {router_fr} />  
      </div>
  );
}

export default App;
