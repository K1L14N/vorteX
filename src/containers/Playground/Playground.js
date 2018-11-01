import { connect } from "react-redux";

import { join } from "../../redux/actions/ui";
import Playground from "../../components/Playground/Playground";

const mapStateToProps = state => ({
    gameOver: state.ui.game.gameOver
});

const mapDispatchToProps = {
    onClick: join
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Playground);
