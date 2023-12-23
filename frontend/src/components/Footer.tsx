import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { STORAGE_KEY } from '../constants';
import pkg from '../../package.json';
import './Footer.css'

type LinksPropType = {
  upload: boolean,
  media: boolean,
  logs: boolean,
  oneday: boolean
}

const Footer = ({ links }: { links?: LinksPropType }) => {
  const usersFullname = window.localStorage.getItem('user-name') || '';
  const navigate = useNavigate();
  const doLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-light bg-light text-left footer">
        {links?.upload && <RouterNavLink to="/upload" className="spaced-link">
          <i className="fa fa-file-upload" />
          <span className="nav-text">Upload Pix</span>
        </RouterNavLink>
        }
        {links?.media && <RouterNavLink to="/media" className="spaced-link">
          <i className="fa fa-portrait" />
          <span className="nav-text">Media</span>
        </RouterNavLink>
        }
        {links?.logs && <RouterNavLink to="/logs" className="spaced-link">
          <i className="fa fa-clipboard-list" />
          <span className="nav-text">Logs</span>
        </RouterNavLink>
        }
        {links?.oneday && <RouterNavLink to="/oneday" className="spaced-link">
          <i className="fa fa-home" />
          <span className="nav-text">One Day</span>
        </RouterNavLink>
        }
        <button
          onClick={() => doLogout()}
          className="btn-margin plainLink"
          type="button"
        >
          <i className="fa fa-sign-out" />
          <span className="nav-text">Log Out</span>
        </button>
        <span className="footer-version">v{pkg.version}</span>
      </nav>
      <div>{usersFullname}</div>
    </>
  );
};

export default Footer;

Footer.defaultProps = {
  links: {
    upload: true,
    media: true,
    logs: true,
    oneday: false
  }
};
