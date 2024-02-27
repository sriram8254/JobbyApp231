import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {IoHomeSharp} from 'react-icons/io5'
import {FaSuitcase} from 'react-icons/fa'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const temp = ''

const Header = props => {
  const onLogOut = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <>
      <nav className="nav-bg-container">
        <Link to="/" className="link-css">
          <li className="listlogo">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="header-logo"
            />
          </li>
        </Link>
        <ul className="links-container">
          <Link to="/" className="link-css">
            <li className="link-item">
              <p className="link-css">Home</p>
            </li>
          </Link>
          <Link to="/jobs" className="link-css">
            <li className="link-item">
              <p className="link-css">Jobs</p>
            </li>
          </Link>
        </ul>

        <button className="logout-btn" type="button" onClick={onLogOut}>
          Logout
        </button>
      </nav>
      <nav className="mobile-nav-bg-container">
        <Link to="/" className="link-css">
          <li className="listlogo">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="mobile-header-logo"
            />
          </li>
        </Link>
        <ul className="links-container-mobile">
          <Link to="/" className="link-css">
            <li className="link-item">
              <IoHomeSharp />
            </li>
          </Link>
          <Link to="/jobs" className="link-css">
            <li className="link-item">
              <FaSuitcase />
            </li>
          </Link>
          <li className="link-item">
            <button
              className="logout-btn-mobile"
              type="button"
              onClick={onLogOut}
            >
              <FiLogOut /> {temp}
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default withRouter(Header)
