import React from 'react'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import tabloLoader from "../../content/img/tabloLoader.gif"


const Loading = (props) => {


    return (

        <div style={{
            backgroundColor: '#2A2B2B',
            width: '100vw',
            height: '100vh'
        }}>
            <div style={{
                textAlign: 'center',
                position: 'absolute',
                color: 'white',
                bottom: 20,
                right: 20,
                fontSize: 22,
            }}>
                Загрузка

                <img src={tabloLoader} alt=""/>
            </div>
        </div>
    )
};

export default compose(withRouter)(Loading);
