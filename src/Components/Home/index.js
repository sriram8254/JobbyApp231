import {Link} from 'react-router-dom'
import './index.css'
import Header from '../Header'

const Home = () => (
  <div className="home-header-bg-container">
    <Header />
    <div className="home-bg-container">
      <h1 className="home-heading">Find The Job That Fits Your Life</h1>
      <p className="home-description">
        Millions of people are searching for jobs, salary information, company
        reviews. Find the job that fits your abilities and potential.
      </p>
      <Link to="/jobs" className="link-css">
        <button type="button" className="job-btn">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default Home
