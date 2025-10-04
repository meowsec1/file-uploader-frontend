import Login from '../pages/Login.jsx';
import SignUp from '../pages/SignUp.jsx';
import Folders from '../pages/Folders/Folders.jsx';
import Folder from '../pages/Folder/Folder.jsx';
import SharedFolder from '../pages/SharedFolder/SharedFolder.jsx';

const router = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/folders",
    element: <Folders />,
  },
  {
    path: "/folders/:folderId",
    element: <Folder />
  },
  {
    path: "/share/:hash",
    element: <SharedFolder/>
  }
];

export default router;
