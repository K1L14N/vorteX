import { connect } from "react-redux";
import { push } from "connected-react-router";

import Banner from "../../components/Home/Banner";
import { PLAYGROUND } from "../../constants/routes";

const mapStateToProps = state => ({
    onRopsten: state.ui.metamask.onRopsten
});

const mapDispatchToProps = {
    onClick: () => push(PLAYGROUND)
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Banner);
