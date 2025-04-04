import { NavLink as RouterNavLink } from 'react-router-dom';
import './Header.css';
type LinksPropType = {
  oneday: boolean,
  sameday: boolean,
  search: boolean
}

const Header = ({ links = {
  search: true,
  sameday: true,
  oneday: false
} }: { links?: LinksPropType }) => {
  return (
    <nav className="navbar" id="top">
      {links?.search && <RouterNavLink to="/search" className="spaced-link">
        <i className="fa fa-search" />
        <span>{' Search'}</span>
      </RouterNavLink>
      }
      {links?.oneday && <RouterNavLink to="/oneday" className="spaced-link">
        <i className="fa fa-home" />
        <span>One Day</span>
      </RouterNavLink>
      }
      {links?.sameday && <RouterNavLink to="/sameday" className="spaced-link">

        <i className="fa fa-calendar-check" />
        <span>Same Day</span>
      </RouterNavLink>
      }
    </nav>
  );
};

export default Header;
