import logo from './logo.svg';
import './App.css';
import ConsumerHomePage from './components/ConsumerHomePage';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import ConsumerRequestPage from './components/ConsumerRequestPage';


function App() {

  const router = createBrowserRouter([
    {
      path:"/",
      element: <ConsumerHomePage />
    },
    {
      path:"/request",
      element: <ConsumerRequestPage />
    }]);

  return (
    <div className="App">
    <RouterProvider router={router} />
    </div>
  );

}

export default App;
