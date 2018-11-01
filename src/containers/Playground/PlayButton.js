import { connect } from "react-redux";

import { join } from "../../redux/actions/ui";
import PlayButton from "../../components/Playground/PlayButton";

const mapDispatchToProps = {
    onClick: join
};

export default connect(
    undefined,
    mapDispatchToProps
)(PlayButton);
