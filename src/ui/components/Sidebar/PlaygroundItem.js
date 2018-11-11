import React from "react";
import PropTypes from "prop-types";

import ExploreIcon from "@material-ui/icons/Explore";

import ListItem1 from "../UI/ListItem/1";

const SidebarPlaygroundItem = ({ onClick, selected }) => (
    <ListItem1
        icon={<ExploreIcon />}
        text="Playground"
        onClick={onClick}
        selected={selected}
    />
);

SidebarPlaygroundItem.propTypes = {
    selected: PropTypes.bool,
    onClick: PropTypes.func.isRequired
};

export default SidebarPlaygroundItem;
