
import { useLocation } from 'react-router-dom';
import {CustomCenter} from '../../../components/CustomComp'
import AuthPage from '../../../components/auth/AuthPage'

const Login = () => {

  const location = useLocation();
    const pathname = location.pathname;

  const headingText= pathname.includes("interviewer") ? "Login to take the interviews of the candidate " :'Login to explore the exciting features of InterViewPlat';
  return (
    <CustomCenter>
        <AuthPage headingText={headingText} />
    </CustomCenter>
  )
}

export default Login