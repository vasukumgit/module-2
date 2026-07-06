import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./Home";
import Otp from "./components/auth/Otp";
import LoginEmail from "./components/auth/LoginEmail";
import LoginPhone from "./components/auth/LoginPhone";
import SignupEmail from "./components/auth/SignupEmail";
import SignupPhone from "./components/auth/SignupPhone";
import Dashboard from "./components/dashboard/Dashboard";
import Templates from "./components/dashboard/Templates/Templates";
import TemplatesInner from "./components/dashboard/Templates/TemplatesInner";
import Workspace from "./components/dashboard/Projects/Projects";
import TrashView from "./components/dashboard/TrashView/TrashView";
import Pricing from "./Pages/Pricing";
import Createdesign from "./components/dashboard/Createdesign/Createdesign";
import AdminLayout from "./components/layout/AdminLayout";
import WebsiteLayout from "./components/layout/WebsiteLayout";
import WithoutHeader from "./components/layout/WithoutHeader";
import ProfileSetting from "./components/dashboard/AccountCentre/ProfileSetting/ProfileSetting";
import Starred from "./components/dashboard/StarredPage/Starred";
import AppSetting from "./components/dashboard/AccountCentre/AppSetting/AppSetting";
import TeamManagementContent from "./components/dashboard/AccountCentre/TeamManagement/TeamManagement";
import ManageSubscriptions from "./components/dashboard/AccountCentre/ManageSubscriptions/ManageSubscriptions";
import AboutApp from "./components/dashboard/AccountCentre/AboutApp/AboutApp";
import Folder from "./components/dashboard/Projects/ProjectFolder/Folder";
import Editor from "./components/editorPanel/Editor";

function App() {
  // const location = useLocation();
  // const hideHeaderRoutes = [
  //   "/login",
  //   "/signup",
  //   "/otp",
  //   "/login-email",
  //   "/signup-phone",
  //   "/signup-email",
  //   "/login-phone",
  //   "/dashboard",
  //   "/pricing",
  //   "/templates",
  //   "/editor",
  // ];

  return (
    <>
      {/* {!hideHeaderRoutes.includes(location.pathname) && <Header />} */}

       

      <Routes>
        {/* <Route path="/editor" element={<Editor />} /> */}
       <Route path="/editor/:projectId" element={<Editor />} />
        {/* if you want websiter header please use this */}
        <Route element={<WebsiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/createdesign" element={<Createdesign />} />
        </Route>
        {/* if you dont want use this */}
        <Route element={<WithoutHeader />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/login-email" element={<LoginEmail />} />
          <Route path="/login-phone" element={<LoginPhone />} />
          <Route path="/signup-email" element={<SignupEmail />} />
          <Route path="/signup-phone" element={<SignupPhone />} />
          <Route path="/pricing" element={<Pricing />} />
        </Route>
        {/* this is admin panel */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates-inner" element={<TemplatesInner />} />
          <Route path="/projects" element={<Workspace />} />
          <Route path="/trash" element={<TrashView />} />
          <Route path="/starred" element={<Starred />} />
          <Route path="/profile-settings" element={<ProfileSetting />} />
          <Route path="/app-settings" element={<AppSetting />} />
          <Route path="/team-management" element={<TeamManagementContent />} />
          <Route path="/manage-subscription" element={<ManageSubscriptions />} />
          <Route path="/about" element={<AboutApp />} />
          {/* <Route Path="/folders" element={<Folder/>}/> */}
         <Route path="/projects/folders" element={<Folder/>}/>

        </Route>
      </Routes>
    </>
  );
}
export default App;

// export default function App() {
//   return (
//     <Router>
//       <Layout />
//     </Router>
//   );
// }
