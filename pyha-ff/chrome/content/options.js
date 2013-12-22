var m_prefs;
m_prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);


// выставляем настройки как они должны быть
function configsave() {
    m_prefs.setIntPref("extensions.pyha32.spams", document.getElementById('spamokno').checked ? '1' : '0');
    m_prefs.setIntPref("extensions.pyha32.themes", document.getElementById('spisak').checked ? '1' : '0');
    m_prefs.setIntPref("extensions.pyha32.skin", document.getElementById('skins').value);
    m_prefs.setCharPref("extensions.pyha32.mesto", document.getElementById('vibori').value);
    if (document.getElementById('reminderFox-group-position').selectedItem.value == 0) {
        m_prefs.setIntPref("extensions.pyha32.raspalaga", document.getElementById('reminderFox-text-position').value);
    }
    else {
        m_prefs.setIntPref("extensions.pyha32.raspalaga", -1);
    }
    m_prefs.setIntPref("extensions.pyha32.gourl", document.getElementById('actionclick').value);
    m_prefs.setIntPref("extensions.pyha32.page", document.getElementById('pagatoodna').checked ? '1' : '0');
    m_prefs.setIntPref("extensions.pyha32.time", document.getElementById('timerzz').value);
}

function initconfig() {
    document.getElementById('spamokno').checked = m_prefs.getIntPref("extensions.pyha32.spams");
    document.getElementById('spisak').checked = m_prefs.getIntPref("extensions.pyha32.themes");

    document.getElementById('skins').value = m_prefs.getIntPref("extensions.pyha32.skin");
    document.getElementById('timerzz').value = m_prefs.getIntPref("extensions.pyha32.time");
    document.getElementById('vibori').value = m_prefs.getCharPref("extensions.pyha32.mesto");


    if (m_prefs.getIntPref("extensions.pyha32.raspalaga") != -1) {
        document.getElementById('reminderFox-group-position').value = 0;
    } else {
        document.getElementById('reminderFox-group-position').selectedItem.value = -1;

    }
    if (m_prefs.getIntPref("extensions.pyha32.raspalaga") >= 0) {
        document.getElementById('reminderFox-text-position').value = m_prefs.getIntPref("extensions.pyha32.raspalaga");
    } else {
        document.getElementById('reminderFox-text-position').value = 0;

    }

    document.getElementById('actionclick').value = m_prefs.getIntPref("extensions.pyha32.gourl");
    document.getElementById('pagatoodna').checked = m_prefs.getIntPref("extensions.pyha32.page");

    izmenim_position();
}

function izmenim_position() {

    var panelka = document.getElementById('vibori').value;
    var win = getWindow();
    var bar = win.document.getElementById(panelka);

    if (!bar)
        kolvopozmax = 0;
    else {
        var len = bar.childNodes.length;
        kolvopozmax = len;
    }


    document.getElementById('kolvopoz').value = "(0-" + kolvopozmax + ")";

}

function getWindow() {
    //XXX may need to change this code if main window of a supported app is not "navigator:browser"
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
    var ww = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
    var top = wm.getMostRecentWindow("navigator:browser");
    if (!top) {
        top = wm.getMostRecentWindow("mail:3pane");
    }
    if (!top) {
        top = wm.getMostRecentWindow("mail:messageWindow");
    }
    if (!top) {
        top = wm.getMostRecentWindow("calendarMainWindow");
    }


    if (!top) {

        var guid;
        try {
            var app = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
            guid = app.ID;
        } catch (e) {
            var appBranch = reminderFox_prefs.getBranch(null);
            try {
                guid = appBranch.getCharPref("app.id");
            } catch (e) {
                guid = "{86c18b42-e466-45a9-ae7a-9b95ba6f5640}";
            }
            ;
        }
        ;

        switch (guid) {
            case "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}":
            case "{3db10fab-e461-4c80-8b97-957ad5f8ea47}":
            default:
                top = ww.openWindow(null, "chrome://browser/content/browser.xul", "_blank", "chrome,all,dialog=no", "about:blank");
                break;
            case "{86c18b42-e466-45a9-ae7a-9b95ba6f5640}":
                top = ww.openWindow(null, "chrome://navigator/content/navigator.xul", "_blank", "chrome,all,dialog=no", "about:blank");
                break;
        }
        ;
    }
    ;
    return top;
}


function PositionChanged() {
    var text = document.getElementById("reminderFox-text-position");
    var textValid = document.getElementById("reminderFox-text-position-valid");
    var group = document.getElementById("reminderFox-group-position");

    if (group.selectedIndex == 0) {
        text.setAttribute("disabled", "true");
        textValid.setAttribute("disabled", "true");
    }
    else {
        text.removeAttribute("disabled");
        textValid.removeAttribute("disabled");
    }
}

function updateButtons(aEvent) {
    // don't enable the apply button for button presses
    if (aEvent) {
        if ((aEvent.originalTarget.localName == "button") ||
            (aEvent.originalTarget.getAttribute("type") == "prof")) {
            return;
        }
    }

    document.getElementById("reminderFox-apply").removeAttribute("disabled");
}

function saveOptions() {
    if (document.getElementById("reminderFox-apply").getAttribute("disabled") != true &&
        document.getElementById("reminderFox-apply").getAttribute("disabled") != "true") {
        configsave();
        reminderFox_updateWindows();
    }
    document.getElementById("reminderFox-apply").setAttribute("disabled", true);
}

function saveOptionsAndClose() {
    configsave();
    window.close();
    if (document.getElementById("reminderFox-apply").getAttribute("disabled") != true &&
        document.getElementById("reminderFox-apply").getAttribute("disabled") != "true") {
        reminderFox_updateWindows();
    }

}

function reminderFox_updateWindows() {

    try {

        // update all of the browsers
        var windowEnumerator = reminderFox_getWindowEnumerator();

        while (windowEnumerator.hasMoreElements()) {
            var currentWindow = windowEnumerator.getNext();
            currentWindow.updater();
            ;
        }
    }
    catch (e) {
    }
}


function reminderFox_getWindowEnumerator() {
    var windowManager = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService();
    var windowManagerInterface = windowManager.QueryInterface(Components.interfaces.nsIWindowMediator);
    var windowEnumerator = windowManagerInterface.getEnumerator("navigator:browser");
    if (windowEnumerator.hasMoreElements()) {
        return windowEnumerator;
    }

    windowEnumerator = windowManagerInterface.getEnumerator("mail:3pane");
    if (windowEnumerator.hasMoreElements()) {
        return windowEnumerator;
    }

    windowEnumerator = windowManagerInterface.getEnumerator("mail:messageWindow");
    if (windowEnumerator.hasMoreElements()) {
        return windowEnumerator;
    }

    windowEnumerator = windowManagerInterface.getEnumerator("calendarMainWindow");
    if (windowEnumerator.hasMoreElements()) {
        return windowEnumerator;
    }


    return windowManagerInterface.getEnumerator("navigator:browser");

}
