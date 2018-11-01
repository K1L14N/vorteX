import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const styles = themes => ({
    banner: {
        textAlign: "center"
    }
});

const Banner = ({ classes, onClick, onRopsten }) => {
    if (onRopsten) {
        return <Button onClick={onClick}>Play now</Button>;
    }
    return (
        <div className="classes.banner">
            You need to enable Metamask and configurate it on the Ropsten
            Network
        </div>
    );
};

Banner.propTypes = {
    classes: PropTypes.object.isRequired,
    onRopsten: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};
export default withStyles(styles)(Banner);
