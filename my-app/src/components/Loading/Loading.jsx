import React from 'react'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import tabloLoader from "../../content/img/tabloLoader.gif"



const Loading = (props) => {


    return (

        <div style={{
            textAlign: 'center',
            position: 'absolute',
            color: 'white',
            bottom: 20,
            right: 20,
            fontSize: 22
        }}>
            <span>Загрузка</span> <img src={tabloLoader} alt=""/></div>
    )
};

export default compose(withRouter)(Loading);
