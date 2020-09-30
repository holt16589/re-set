import React from 'react';
import { Row, Col } from 'react-bootstrap';
import 'components/SetlistResult/SetlistResult.css';

const setlistResult = (props) => {
        let styleClass = "setlistResult";
        let locationString = 'Unknown';
        let setMonth = '';
        let setDay = '';
        let setYear = '';

        //build string to display set location with Venue, City, State and Country
        if(props.venueName || props.cityName || props.countryName){
            locationString = props.venueName;
            if(props.cityName){
                locationString = locationString.concat(', ', props.cityName);
            }
            if(props.countryName){
                locationString = locationString.concat(', ', props.countryName);
            }
        }

        if(props.setDate){
            //parse the setlist date to display in a user friendly manner
            let splitDate = props.setDate.split("-");
            setDay = splitDate[0];
            let rawMonth = splitDate[1];
            setYear = splitDate[2];
            switch(rawMonth){
                case "01":
                    setMonth = "JAN";
                    break;
                case "02":
                    setMonth = "FEB";
                    break;
                case "03":
                    setMonth = "MAR";
                    break;
                case "04":
                    setMonth = "APR";
                    break;
                case "05":
                    setMonth = "MAY";
                    break;
                case "06":
                    setMonth = "JUN";
                    break;
                case "07":
                    setMonth = "JUL";
                    break;
                case "08":
                    setMonth = "AUG";
                    break;
                case "09":
                    setMonth = "SEP";
                    break;
                case "10":
                    setMonth = "OCT";
                    break;
                case "11":
                    setMonth = "NOV";
                    break;
                case "12":
                    setMonth = "DEC";
                    break;
                default:
                    setMonth = "UNK";
                    break;
            }
        }

        let isEmpty = props.setSize === 0;
        if(isEmpty){
            //reduce opacity for any empty sets and prevent user from clicking
            styleClass = "setlistResult emptySet";
        }



        return(
            <Row className="setRow mb-4" onClick={props.onClick}>
                <Col md={{ span: 6, offset: 3}} className={styleClass}>
                    <Row>
                        <Col lg={{ span: 3 }} md={{ span: 12 }}>
                        <div className="dateBlock">
                            <span className="month">{setMonth}</span>
                            <span className="day">{setDay}</span>
                            <span className="year">{setYear}</span>
                        </div>
                    </Col>

                    <Col lg={{ span: 9 }} md={{ span: 12 }}>
                        <span className="artistName">{props.artistName}</span>
                    <div className="venue">{locationString}</div>
                    <div className="numSongs">{props.setSize} songs</div>
                    </Col>
                    </Row>

                </Col>
            </Row>
        )
}

export default setlistResult;