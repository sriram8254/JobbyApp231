import {Link} from 'react-router-dom'
import {FaStar, FaSuitcase} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails
  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="job-container">
        <div className="logo-title-rating-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-rating-container">
            <h1 className="job-title">{title}</h1>
            <div className="icon-rating-container">
              <FaStar className="star-icon" />
              <p className="job-rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-employmentType-package-container">
          <div className="location-employmentType-container">
            <div className="icon-location-container">
              <IoLocationSharp className="location-employee-icon" />
              <p className="location-employeeType-css">{location}</p>
            </div>
            <div className="icon-location-container">
              <FaSuitcase className="location-employee-icon" />
              <p className="location-employeeType-css">{employmentType}</p>
            </div>
          </div>
          <p className="package-description">{packagePerAnnum}</p>
        </div>
        <hr className="job-hr-css" />
        <h1 className="description-heading">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
