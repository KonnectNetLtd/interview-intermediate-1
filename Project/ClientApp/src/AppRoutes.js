import { Home } from "./components/Home";
import { Report } from "./components/Report";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/reports',
    element: <Report />
  }
];

export default AppRoutes;
