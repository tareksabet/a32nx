class CDUCfdsAvionicsMenu {
    static ShowPage(mcdu) {
        mcdu.clearDisplay();
        mcdu.setTemplate([
            ["AVIONICS STATUS", "1", "2"],
            [""],
            ["NO GPCU DATA"],
            [""],
            ["ADF 1 (CLASS 3)"],
            [""],
            ["FMGC"],
            [""],
            ["VHF"],
            [""],
            ["AIDS"],
            [""],
            ["<RETURN[color]cyan", "PRINT*[color]cyan"]
        ]);

        mcdu.leftInputDelay[5] = () => {
            return mcdu.getDelaySwitchPage();
        };

        mcdu.onLeftInput[5] = () => {
            CDUCfdsMainMenu.ShowPage(mcdu);
        };

        // PAGE SWITCHING
        mcdu.onPrevPage = () => {
            CDUCfdsAvionicsMenu.ShowPage2(mcdu);
        };
        mcdu.onNextPage = () => {
            CDUCfdsAvionicsMenu.ShowPage2(mcdu);
        };
    }

    static ShowPage2(mcdu) {
        mcdu.clearDisplay();
        mcdu.setTemplate([
            ["AVIONICS STATUS", "2", "2"],
            [""],
            ["NO ILS DATA"],
            [""],
            ["DMC (CLASS 3)"],
            [""],
            [""],
            [""],
            [""],
            [""],
            [""],
            [""],
            ["<RETURN[color]cyan", "PRINT*[color]cyan"]
        ]);

        mcdu.leftInputDelay[5] = () => {
            return mcdu.getDelaySwitchPage();
        };

        mcdu.onLeftInput[5] = () => {
            CDUCfdsMainMenu.ShowPage(mcdu);
        };

        // PAGE SWITCHING
        mcdu.onPrevPage = () => {
            CDUCfdsAvionicsMenu.ShowPage(mcdu);
        };
        mcdu.onNextPage = () => {
            CDUCfdsAvionicsMenu.ShowPage(mcdu);
        };
    }
}
