import { connect } from "react-redux";

import Playground from "../../components/Playground/Playground";

const mapStateToProps = state => ({
    gameOver: state.status.game.gameOver
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Playground);
