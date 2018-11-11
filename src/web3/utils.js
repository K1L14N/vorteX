import targetLocation from "./index";

export const computeScore = location => {
    const maxDistance = Math.sqrt(
        Math.pow(256 - targetLocation.x, 2) +
            Math.pow(255 - targetLocation.y, 2)
    );
    return (
        100 -
        Math.floor(
            (100 *
                Math.sqrt(
                    Math.pow(location.x - targetLocation.x, 2) +
                        Math.pow(location.y - targetLocation.y, 2)
                )) /
                maxDistance
        )
    );
};

export const location = rawLocation => ({
    x: rawLocation[0],
    y: rawLocation[1]
});

export const computeShip = rawShip => {
    console.log(rawShip);
    return {
        location: location([rawShip[0], rawShip[1]]),
        initialLocation: location([rawShip[2], rawShip[3]]),
        taxPrice: rawShip[4]
    };
};
