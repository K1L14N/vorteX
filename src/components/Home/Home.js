import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

import logo from "./logo.svg";

const styles = theme => ({
    home: {
        textAlign: "center"
    },
    homeLogo: {
        height: "80px"
    },
    homeHeader: {
        height: "150px",
        padding: "20px"
    },
    homeTitle: {
        fontSize: "1.5em"
    },
    homeIntro: {
        fontSize: "large"
    }
});

const Home = ({ classes }) => (
    <div className={classes.home}>
        <div className={classes.homeHeader}>
            <img src={logo} className={classes.homeLogo} alt="logo" />
            <h1 className={classes.homeTitle}>Start playing to VorteX Now !</h1>
        </div>
        <p className={classes.homeIntro}>
            You need to enable Metamask and configurate it on the Ropsten
            Network.
        </p>
    </div>
);

Home.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
