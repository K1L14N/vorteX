import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import { grey } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit
    }
});

const PlayButton = ({ classes, onClick }) => (
    <Button
        raised
        color={grey[500]}
        className={classes.button}
        onClick={onClick}
    >
        Go Play
    </Button>
);

PlayButton.propTypes = {
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
};

export default withStyles(styles)(PlayButton);
