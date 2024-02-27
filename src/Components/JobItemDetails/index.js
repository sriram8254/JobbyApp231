import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaStar, FaSuitcase, FaExternalLinkAlt} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import './index.css'
import Header from '../Header'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class JobItemDetails extends Component {
  state = {
    jobData: '',
    skills: [],
    similarJobsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data1 = await response.json()

    if (response.ok === true) {
      const jobDetails = data1.job_details
      const similarJobs = data1.similar_jobs
      const {skills} = jobDetails

      const skillsList = skills.map(each => ({
        skillName: each.name,
        skillImageUrl: each.image_url,
      }))

      const similarJobsList = similarJobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      const data = data1.job_details
      const modifiedData = {
        companyLogoUrl: data.company_logo_url,
        companyWebSiteUrl: data.company_website_url,
        employmentType: data.employment_type,
        id: data.id,
        jobDescription: data.job_description,
        lifeAtCompany: {
          description: data.life_at_company.description,
          imageUrl: data.life_at_company.image_url,
        },
        location: data.location,
        packagePerAnnum: data.package_per_annum,
        rating: data.rating,
        title: data.title,
        skillList: skillsList,
        similarJobsList,
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobData: modifiedData,
        skills: skillsList,
        similarJobsList,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobsSuccesView = () => {
    const {jobData, skills, similarJobsList} = this.state
    const {
      companyLogoUrl,
      companyWebSiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobData
    return (
      <>
        <div className="job-item-detail-container">
          <div className="logo-title-rating-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
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
          <div className="desc-url-container">
            <h1 className="skills-heading">Description</h1>
            <div>
              <a className="visit" href={companyWebSiteUrl}>
                Visit
              </a>
              <FaExternalLinkAlt className="external-icon" />
            </div>
          </div>
          <p className="job-description">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-container">
            {skills.map(eachSkill => (
              <li className="skill-container" key={eachSkill.skillName}>
                <img
                  src={eachSkill.skillImageUrl}
                  alt={eachSkill.skillName}
                  className="skill-img"
                />
                <p className="skill-name">{eachSkill.skillName}</p>
              </li>
            ))}
          </ul>
          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="life-at-company-desc-img-container">
            <p className="life-at-company-desc">{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-company-img"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobsList.map(each => (
            <li className="similar-job-container" key={each.id}>
              <div className="logo-title-rating-container">
                <img
                  src={each.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div className="title-rating-container">
                  <h1 className="job-title">{each.title}</h1>
                  <div className="icon-rating-container">
                    <FaStar className="star-icon" />
                    <p className="job-rating">{each.rating}</p>
                  </div>
                </div>
              </div>
              <h1 className="similar-desc-heading">Description</h1>
              <p className="similar-job-desc">{each.jobDescription}</p>
              <div className="location-employmentType-container-similar">
                <div className="icon-location-container">
                  <IoLocationSharp className="location-employee-icon" />
                  <p className="location-employeeType-css">{each.location}</p>
                </div>
                <div className="icon-location-container">
                  <FaSuitcase className="location-employee-icon" />
                  <p className="location-employeeType-css">
                    {each.employmentType}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  onRetryJobsDetailsSimilarsClick = () => {
    this.getJobItemDetails()
  }

  renderLoadingView = () => (
    <div
      className="loader-container-similar-jobs-container"
      data-testid="loader"
    >
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsFailure = () => (
    <div className="jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-job-img"
      />
      <h1 className="failure-job-heading">Oops! Something Went Wrong</h1>
      <p className="failure-job-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-btn"
        type="button"
        onClick={this.onRetryJobsDetailsSimilarsClick}
      >
        Retry
      </button>
    </div>
  )

  renderOnApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsSuccesView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderJobsFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-bg-container">
          {this.renderOnApiStatus()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
