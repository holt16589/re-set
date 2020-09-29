import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Footer from 'components/Layout/Footer/Footer';
import 'components/About/About.css';

const about = () => {
        return(
                <React.Fragment>
<Container className = "about-section" fluid>
        <Row><Col>
           <h1>About</h1>
           <p>re-set allows you to browse artist's past concert setlists and convert them into Spotify playlists, whether you're re-living
               a past experience or getting ready for a future show. This is a personal project  I built to refine my skills working with REACT and APIs.</p>
               <p>-Kevin Holt</p>
               <Button className="about-button mr-3" href="https://github.com/holt16589/re-set" target="_blank">View on Github</Button>
               <Button className="about-button" href="https://kevinmholt.com/" target="_blank">About Me</Button>
        </Col></Row>
</Container>
<Footer />
</React.Fragment>
        )
}

export default about;