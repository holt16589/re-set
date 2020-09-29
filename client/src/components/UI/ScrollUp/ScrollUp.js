import React, { Component } from 'react';
import 'components/UI/ScrollUp/ScrollUp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleUp } from '@fortawesome/free-solid-svg-icons'

class ScrollUp extends Component {

  scrollToTop = () => {
    window.scrollTo({top: 0, behavior: "smooth"})
  }
render(){
  return(
    <FontAwesomeIcon
    icon={faChevronCircleUp} id="scrollBtn" color="white" size="lg" onClick={this.scrollToTop}
  />
  )
}
}

export default ScrollUp;