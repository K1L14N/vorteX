import React from "react";
import { matchPath } from "react-router";
import { connect } from "react-redux";
import { push } from "connected-react-router";

import SidebarPlaygroundItem from "../../components/Sidebar/PlaygroundItem";
import { PLAYGROUND } from "../../constants/routes";

const PlaygroundItem = ({ selected, push }) => (
    <SidebarPlaygroundItem selected={selected} onClick={push} />
);

const mapStateToProps = state => ({
    selected: !!matchPath(state.router.location.pathname, { path: PLAYGROUND })
});

const mapDispatchToProps = {
    push: () => push(PLAYGROUND)
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlaygroundItem);
