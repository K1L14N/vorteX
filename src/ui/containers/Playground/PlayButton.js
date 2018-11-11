import { connect } from "react-redux";

import PlayButton from "../../components/Playground/PlayButton";

const mapDispatchToProps = {
    onClick: () => {
        console.log("join");
    }
};

export default connect(
    undefined,
    mapDispatchToProps
)(PlayButton);
