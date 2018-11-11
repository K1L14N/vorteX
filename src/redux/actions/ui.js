export const OPEN_SIDEBAR = "OPEN_SIDEBAR";
export const CLOSE_SIDEBAR = "CLOSE_SIDEBAR";
export const ROPSTEN_DISCONNECT = "ROPSTEN_DISCONNECT";
export const ROPSTEN_CONNECT = "ROPSTEN_CONNECT";

export const openSidebar = () => ({
    type: OPEN_SIDEBAR
});

export const closeSidebar = () => ({
    type: CLOSE_SIDEBAR
});

export const ropstenDisconnect = () => ({
    type: ROPSTEN_DISCONNECT
});

export const ropstenConnect = () => ({
    type: ROPSTEN_CONNECT
});
