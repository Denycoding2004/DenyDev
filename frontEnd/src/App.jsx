import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Clientdashboard from "./Clientdashboard";
import PostJob from "./Postjob";
import ClientProfile from "./ClientPofile";
import ClientMessages from "./ClientMessages";
import Clientprojects from "./Clientprojects";
import Freelancerdashboard from "./Freelancerdashboard";
import Freelancerheader from "./Freelancerheader";
import Freelancermessage from "./Freelancermessage";
import Freelancerproject from "./Freelancerproject";
import Freelancerprofile from "./Freelancerprofile";
import FreelancerDetail from "./FreelancerDetail";
import ViewProject from "./ViewProject";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/clientdashboard" element={<Clientdashboard />} />
          <Route path="/postjob" element={<PostJob />} />
          <Route path="/clientprofile" element={<ClientProfile />} />
          <Route path="/clientmessages" element={<ClientMessages />} />
          <Route path="/clientprojects" element={<Clientprojects />} />
          <Route
            path="/freelancerdashboard"
            element={<Freelancerdashboard />}
          />
          <Route path="/freelancerheader" element={<Freelancerheader />} />
          <Route path="/freelancermessage" element={<Freelancermessage />} />
          <Route path="/freelancerproject" element={<Freelancerproject />} />
          <Route path="/freelancerprofile" element={<Freelancerprofile />} />
          <Route path="/freelancer/:userId" element={<FreelancerDetail />} />
          <Route path="/project/:projectId" element={<ViewProject />} />
          <Route
            path="/freelancermessage/:clientId?"
            element={<Freelancermessage />}
          />
          <Route
            path="/clientmessages/:freelancerId?"
            element={<ClientMessages />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
