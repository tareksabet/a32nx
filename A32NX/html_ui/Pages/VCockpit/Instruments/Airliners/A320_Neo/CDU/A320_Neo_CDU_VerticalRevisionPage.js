class CDUVerticalRevisionPage {
    static ShowPage(mcdu, waypoint) {
        const waypointInfo = waypoint.infos;
        if (waypointInfo instanceof WayPointInfo) {
            mcdu.clearDisplay();
            mcdu.page.Current = mcdu.page.VerticalRevisionPage;
            let waypointIdent = "---";
            if (waypoint) {
                waypointIdent = waypoint.ident;
            }
            let coordinates = "---";
            if (waypointInfo.coordinates) {
                coordinates = waypointInfo.coordinates.toDegreeString();
            }
            const efob = "---.-";
            const extra = "---.-";
            const climbSpeedLimit = "250";
            const climbAltLimit = "FL100";
            let speedConstraint = 0;
            if (waypoint.speedConstraint > 10) {
                speedConstraint = waypoint.speedConstraint.toFixed(0);
            }
            let altitudeConstraint = "";
            switch (waypoint.legAltitudeDescription) {
                case 1: {
                    altitudeConstraint = this.formatFl(Math.round(waypoint.legAltitude1), mcdu.transitionAltitude);
                    break;
                }
                case 2: {
                    altitudeConstraint = "+" + this.formatFl(Math.round(waypoint.legAltitude1), mcdu.transitionAltitude);
                    break;
                }
                case 3: {
                    altitudeConstraint = "-" + this.formatFl(Math.round(waypoint.legAltitude1), mcdu.transitionAltitude);
                    break;
                }
                case 4: {
                    if (waypoint.legAltitude1 < waypoint.legAltitude2) {
                        altitudeConstraint = "+" + this.formatFl(Math.round(waypoint.legAltitude1), mcdu.transitionAltitude)
                            + "/-" + this.formatFl(Math.round(waypoint.legAltitude2), mcdu.transitionAltitude);
                    } else {
                        altitudeConstraint = "+" + this.formatFl(Math.round(waypoint.legAltitude2), mcdu.transitionAltitude)
                            + "/-" + this.formatFl(Math.round(waypoint.legAltitude1), mcdu.transitionAltitude);
                    }
                    break;
                }
            }
            mcdu.setTemplate([
                ["VERT REV AT " + waypointIdent],
                [" EFOB=" + efob, "EXTRA=" + extra],
                [""],
                [" CLB SPD LIM", ""],
                [climbSpeedLimit + "/" + climbAltLimit + "[color]magenta", "RTA>"],
                [" SPD CSTR", "ALT CSTR "],
                [speedConstraint ? speedConstraint + "[color]magenta" : "*[\xa0\xa0\xa0][color]cyan", altitudeConstraint ? altitudeConstraint + "[color]magenta" : "[\xa0\xa0\xa0\xa0]*[color]cyan"],
                ["", ""],
                ["", ""],
                [""],
                ["<WIND", "STEP ALTS>"],
                [""],
                ["<RETURN"]
            ]);
            mcdu.onLeftInput[0] = () => {}; // EFOB
            mcdu.onRightInput[0] = () => {}; // EXTRA
            mcdu.onLeftInput[1] = () => {}; // CLB SPD LIM
            mcdu.onRightInput[1] = () => {}; // RTA
            mcdu.onLeftInput[2] = async (value) => {
                if (isFinite(value)) {
                    if (value >= 0) {
                        // NYI
                    }
                }
                mcdu.showErrorMessage("NOT YET IMPLEMENTED");
                setTimeout(() => {
                    mcdu.showErrorMessage("");
                }, 1000);
            }; // SPD CSTR
            mcdu.onRightInput[2] = (value) => {
                if (value === FMCMainDisplay.clrValue) {
                    mcdu.removeWaypoint(fpIndex, () => {
                        mcdu.updateConstraints();
                        CDUFlightPlanPage.ShowPage(mcdu, offset);
                    });
                }

                const PLUS_REGEX = /\+\d+/g;
                const MINUS_REGEX = /\-\d+/g;

                let altitude;
                let code;

                if (value.match(MINUS_REGEX)) {
                    code = 3;
                    altitude = value.split('-')[1];
                } else if ((value.match(PLUS_REGEX))) {
                    code = 2;
                    altitude = value.split('+')[1];
                } else {
                    code = 1;
                    altitude = value;
                }
                altitude = parseInt(altitude);
                if (isFinite(altitude)) {
                    if (altitude >= 0) {
                        mcdu.flightPlanManager.setLegAltitudeDescription(waypoint, code);
                        mcdu.flightPlanManager.setWaypointAltitude((altitude < 1000 ? altitude * 100 : altitude) / 3.28084, mcdu.flightPlanManager.indexOfWaypoint(waypoint), () => {
                            mcdu.updateConstraints();
                            this.ShowPage(mcdu, waypoint);
                        });
                    }
                } else {
                    mcdu.showErrorMessage("INVALID ENTRY");
                }
            }; // ALT CSTR
            mcdu.onLeftInput[4] = () => {}; // WIND
            mcdu.onRightInput[4] = () => {}; // STEP ALTS
            mcdu.onLeftInput[5] = () => {
                CDUFlightPlanPage.ShowPage(mcdu);
            };
        }
    }

    static formatFl(constraint, transAlt) {
        if (transAlt >= 100 && constraint > transAlt) {
            return "FL" + Math.round(constraint / 100);
        }
        return constraint;
    }
}
