import { NavLink as RouterNavLink } from 'react-router-dom';

import './Footer.css'

type LinksPropType = {
  oneday: boolean,
  sameday: boolean,
  search: boolean
}
const Footer = ({links}: {links?: LinksPropType}) => {
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
      {links?.search && <RouterNavLink to="/search">
        <i className="fa fa-search" />{' '}
        <span>Search</span>{' '}
      </RouterNavLink>
      }
      {links?.oneday && <RouterNavLink to="/oneday">
          <i className="fa fa-home" />{' '}
          <span>One Day</span>
        </RouterNavLink>
      }
      {links?.sameday &&  <RouterNavLink to="/sameday">
        {' '}
        <i className="fa fa-calendar-check" />
        <span>Same Day</span>
      </RouterNavLink>
      }
    </nav>
  );
};

export default Footer;

Footer.defaultProps = {
  links: {
    search: true,
    sameday: true,
    oneday: false
  }
};