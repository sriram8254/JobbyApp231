import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import './index.css'
import Header from '../Header'
import JobItem from '../JobItem'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileData: '',
    checkList: [],
    radioValue: '',
    searchValue: '',
    jobsList: [],
    profileStatus: '',
    jobsStatus: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getProfileDetails = async () => {
    this.setState({profileStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    const profileDetails = data.profile_details
    if (response.ok === true) {
      const modifiedData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileData: modifiedData,
        profileStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileStatus: apiStatusConstants.failure})
    }
  }

  getJobsDetails = async () => {
    const {radioValue, checkList, searchValue} = this.state
    this.setState({jobsStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const checkListString = checkList.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkListString}&minimum_package=${radioValue}&search=${searchValue}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      const modifiedJobs = data.jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: modifiedJobs,
        jobsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsStatus: apiStatusConstants.failure})
    }
  }

  onRetryClick = () => {
    this.getProfileDetails()
  }

  renderProfileSuccess = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailure = () => (
    <div className="profile-failure-container">
      <button className="retry-btn" type="button" onClick={this.onRetryClick}>
        Retry
      </button>
    </div>
  )

  renderProfileLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileContainer = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccess()
      case apiStatusConstants.failure:
        return this.renderProfileFailure()
      case apiStatusConstants.inProgress:
        return this.renderProfileLoadingView()
      default:
        return null
    }
  }

  renderProfileFilterContainer = () => (
    <div className="profile-filters-container">
      {this.renderProfileContainer()}
      <hr className="profile-line" />
      <h1 className="group-heading">Type of Employment</h1>
      <ul className="options-items-container">
        {employmentTypesList.map(each => (
          <li className="item-container" key={each.employmentTypeId}>
            <input
              type="checkbox"
              id={each.employmentTypeId}
              className="check-box"
              value={each.employmentTypeId}
              onClick={this.onCheckClick}
            />
            <label className="label" htmlFor={each.employmentTypeId}>
              {each.label}
            </label>
          </li>
        ))}
      </ul>
      <hr className="profile-line" />
      <h1 className="group-heading">Salary Range</h1>
      <ul className="options-items-container">
        {salaryRangesList.map(each => (
          <li className="item-container" key={each.salaryRangeId}>
            <input
              type="radio"
              id={each.salaryRangeId}
              className="radio-box"
              name="radioButton"
              onChange={this.onRadioChange}
              value={each.salaryRangeId}
            />
            <label className="label" htmlFor={each.salaryRangeId}>
              {each.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  onCheckClick = event => {
    const checkValue = event.target.value
    const {checkList} = this.state
    if (!checkList.includes(checkValue)) {
      this.setState(
        prevState => ({
          checkList: [...prevState.checkList, checkValue],
        }),
        this.getJobsDetails,
      )
    } else {
      const newCheckList = checkList.filter(each => each !== checkValue)
      this.setState({checkList: newCheckList}, this.getJobsDetails)
    }
  }

  onRadioChange = event => {
    this.setState({radioValue: event.target.value}, this.getJobsDetails)
  }

  onSearchChange = event => {
    this.setState({searchValue: event.target.value})
  }

  onSearchBtnClick = () => {
    this.getJobsDetails()
  }

  renderJobItemsContainer = () => {
    const {jobsList} = this.state
    const elements =
      jobsList.length === 0 ? (
        <div className="no-jobs-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-img"
          />
          <h1 className="no-jobs-heading">No Jobs Found</h1>
          <p className="no-jobs-description">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      ) : (
        <ul className="job-items-container">
          {jobsList.map(eachJob => (
            <JobItem jobDetails={eachJob} key={eachJob.id} />
          ))}
        </ul>
      )
    return elements
  }

  onRetryJobsClick = () => {
    this.getJobsDetails()
  }

  renderJobsFailureContainer = () => (
    <div className="jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-job-img"
      />
      <h1 className="failure-job-heading">Oops! Something Went Wrong</h1>
      <p className="failure-job-description">
        we cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-btn"
        type="button"
        onClick={this.onRetryJobsClick}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container-jobs" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderByJobStatus = () => {
    const {jobsStatus} = this.state
    switch (jobsStatus) {
      case apiStatusConstants.failure:
        return this.renderJobsFailureContainer()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderJobItemsContainer()
      default:
        return null
    }
  }

  render() {
    const temp = ''
    const {searchValue} = this.state
    return (
      <>
        <Header />
        <div className="jobs-bg-container">
          <div className="search-container-mobile">
            <input
              type="search"
              className="input-search"
              placeholder="Search"
              onChange={this.onSearchChange}
              value={searchValue}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-button"
              onClick={this.onSearchBtnClick}
            >
              <BsSearch className="search-icon" />
              {temp}
            </button>
          </div>
          {this.renderProfileFilterContainer()}
          <div className="search-jobs-container">
            <div className="search-container">
              <input
                type="search"
                className="input-search"
                placeholder="Search"
                onChange={this.onSearchChange}
                value={searchValue}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onSearchBtnClick}
              >
                <BsSearch className="search-icon" />
                {temp}
              </button>
            </div>
            {this.renderByJobStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
