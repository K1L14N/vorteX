import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    playground: {
        textAlign: "center"
    },
    playgroundLogo: {
        height: "80px"
    },
    playgroundHeader: {
        height: "150px",
        padding: "20px"
    },
    playgroundTitle: {
        fontSize: "1.5em"
    },
    playgroundIntro: {
        fontSize: "large"
    }
});

const Playground = ({ classes }) => (
    <div className={classes.playground}>
        <h1>Playground</h1>
    </div>
);

Playground.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Playground);
