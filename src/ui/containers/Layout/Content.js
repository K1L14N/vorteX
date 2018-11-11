import React from "react";
import { Route, Switch } from "react-router";

import Home from "../../components/Home/Home";
import Playground from "../../components/Playground/Playground";
import NoWhere from "../../components/NoWhere/NoWhere";
import { HOME, PLAYGROUND } from "../../constants/routes";

const LayoutContent = () => (
    <Switch>
        <Route path={HOME} exact component={Home} />
        <Route path={PLAYGROUND} exact component={Playground} />
        <Route component={NoWhere} />
    </Switch>
);

export default LayoutContent;
