import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import PlayButton from "../../containers/Playground/PlayButton";

const styles = theme => ({
    playground: {
        textAlign: "center"
    },
    playgroundHeader: {
        height: "150px",
        padding: "20px"
    },
    playgroundTitle: {
        fontSize: "1.5em"
    },
    playgroundIntro: {
        fontSize: "large",
        color: "blue"
    }
});

const Playground = ({ classes, gameOver }) => (
    <div className={classes.playground}>
        <h1>Playground</h1>
        <PlayButton />
    </div>
);

Playground.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Playground);
