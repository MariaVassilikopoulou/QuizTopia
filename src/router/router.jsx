import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import QuizDetail from '../pages/QuizDetail'
import QuizList from '../pages/QuizList'
//import MapComponent from "../components/Map/MapComponent";
//import CreateAccount from "../components/Auth/CreateAccount";
//import SecretTunnel from "../components/Auth/SecretTunnel";
import QuizMap from '../components/Quiz/QuizMap'
const router= createBrowserRouter([
    {
        path:"/",
        element:<Home/>
    },
    {
        path:"/create",
        element: <Dashboard /> 
    },
    {
        path:"/details/:quizId",
        element:<QuizDetail />
    },
    {
        path:"/quizes",
        element: <QuizList /> 
    },
    {
        path:"/quiz/:userId/:quizId",
        element: <QuizMap /> 
    }
    
])

export default router;  