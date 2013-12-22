//
//  ЛЮБАБЫТНАЙ ВАРВАРЕ НОС ОТРВАЛЕ (чо тут забыл типа)
//
//////////////////////////////////////////////
//
//   всё что связанно с настройками ( устан,сохранение)
//
//////////////////////////////////////////////

var m_prefs;
m_prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);


function pyhaopt() {
    window.openDialog('chrome://pyhainformer/content/options.xul', "pyhaopt", 'chrome, modal, dialog, centerscreen');
}

//////////////////////////////////////////////
//
//   всё что связанно с интерфейсам
//
//////////////////////////////////////////////

function off() {
    if (document.getElementById('off').getAttribute("checked")) {
        clear();
        m_prefs.setIntPref("extensions.pyha32.onoff", 0);
        document.getElementById("status-icon").setAttribute("src", "chrome://pyhainformer/skin/" + myskin + "/off.png");
        document.getElementById('status').setAttribute("value", "выкл");
    } else {
        m_prefs.setIntPref("extensions.pyha32.onoff", 1);
        updater();
    }
}

function statusinbar(action, kolvo) {
    myskin = m_prefs.getIntPref("extensions.pyha32.skin");
    switch (action) {
        case 'loading' :
            document.getElementById("status-icon").setAttribute("src", "chrome://pyhainformer/skin/" + myskin + "/load.png");
            document.getElementById('status').setAttribute("value", "думаю");
            break;
        case 'spam' :
            document.getElementById("status-icon").setAttribute("src", "chrome://pyhainformer/skin/" + myskin + "/on.png");
            if (document.getElementById('sravnenie').value == kolvo) {
                document.getElementById('kolvosravnenie').setAttribute("value", 0);
            }
            else {
                document.getElementById('kolvosravnenie').setAttribute("value", 1);
            }
            document.getElementById('sravnenie').setAttribute("value", kolvo);
            document.getElementById('status').setAttribute("value", kolvo);
            break;
        case 'error' :
            document.getElementById("status-icon").setAttribute("src", "chrome://pyhainformer/skin/" + myskin + "/error.png");
            document.getElementById('status').setAttribute("value", "ашипка");
            break;
    }
}

function spamokno(koli) {
    if (document.getElementById('kolvosravnenie').value == 1 && m_prefs.getIntPref("extensions.pyha32.spams") == 1 && koli > 0) {
        var listener = {
            observe: function (subject, topic, data) {
                if (topic == 'alertclickcallback') {
                    clear();

                    if (m_prefs.getIntPref("extensions.pyha32.page") == 1 && document.getElementById('urlik').value != 0 && koli == 1) {
                        gBrowser.selectedTab = gBrowser.addTab(document.getElementById('urlik').value);
                        document.getElementById('urlik').setAttribute("value", 0);
                        clear();


                    }
                    else {
                        getBrowser().selectedTab = getBrowser().addTab("http://pyha.ru/forum/new");
                    }

                }
            }
        }
        var alertsService = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);
        alertsService.showAlertNotification("chrome://pyhainformer/skin/pyha.png", "Пыха информер", "Непрочитанных: " + koli, true, "pyha", listener);
    }
}

function alertokno(textik) {
    clear();
    statusinbar("error", 0);

    if (m_prefs.getIntPref("extensions.pyha32.spams") == 1) {
        var alertsService = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);
        alertsService.showAlertNotification("chrome://pyhainformer/skin/pyha.png", "Пыха ошибка", textik, false, "pyha");
    }

    if (m_prefs.getIntPref("extensions.pyha32.themes") == 1) {
        document.getElementById('moretip').setAttribute("hidden", false);
        textred = document.createElement("label");
        textred.setAttribute("value", textik);
        document.getElementById('moretip').appendChild(textred);
    }
}

function tooltipokno(spisak, kolvo) {
    if (m_prefs.getIntPref("extensions.pyha32.themes") == 1 && kolvo > 0) {
        document.getElementById('moretip').setAttribute("hidden", false);
        for (var i = 0; i < kolvo; i++) {
            var text = spisak[i]['name'];
            textred = document.createElement("label");
            textred.setAttribute("value", text);
            document.getElementById('moretip').appendChild(textred);
        }
    } else {
        document.getElementById('moretip').setAttribute("hidden", true);
    }
}

function clear() {
    document.getElementById('urlik').setAttribute("value", 0);
    document.getElementById('status').setAttribute("value", "*");
    var container = document.getElementById("moretip");
    for (i = container.childNodes.length; i > 0; i--) {
        container.removeChild(container.childNodes[0]);
    }
    document.getElementById('moretip').setAttribute("hidden", true);
}

// переход
function gotoURL(utiputi) {

    //if (utiputi.button == 0 && m_prefs.getIntPref("extensions.pyha32.onoff") == 1) {
    if (utiputi.button == 0) {

        if (m_prefs.getIntPref("extensions.pyha32.page") == 1 && document.getElementById('urlik').value != 0) {
            gBrowser.selectedTab = gBrowser.addTab(document.getElementById('urlik').value);
            clear();
        } else {
            clear();
            var regexp = /(pyha.ru)|(about:blank)/i;
            var pyhaurl = "http://pyha.ru/forum/";
            switch (m_prefs.getIntPref("extensions.pyha32.gourl")) {
                case 0 :
                    statusinbar("loading", 0);
                    include();
                    break;
                case 1 :
                    break;
                case 2 :
                    pyhaurl = "http://pyha.ru/";
                    break;
                case 3 :
                    pyhaurl = "http://pyha.ru/forum/new";
                    break;
                default :
                    var default_flag = '1';
                    statusinbar("loading", 0);
                    include();
            }
            if (!default_flag) {
                if (regexp.test(gBrowser.currentURI.spec)) {
                    gBrowser.selectedTab = gBrowser.loadURI(pyhaurl);
                }
                else {
                    gBrowser.selectedTab = gBrowser.addTab(pyhaurl);
                }
            }
        }
    }
}

// собачимся
function include() {
    var url = ('http://pyha.ru/forum/informer/');
    //var url = ('http://pyha.loc/forum/informer/');

    http_request = false;
    if (window.XMLHttpRequest) {
        http_request = new XMLHttpRequest();
        if (http_request.overrideMimeType) {
            http_request.overrideMimeType('text/xml');
        }
    }
    else if (window.ActiveXObject) {
        try {
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                http_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            }
        }
    }
    if (!http_request) {
        alertokno('в рот мне ноги ашибка соединялки.');
        return false;
    }
    http_request.onreadystatechange = myHandler;
    http_request.open('GET', url, true);
    http_request.send(null);
}

function myHandler() {
    if (http_request.readyState == 4) {
        if (http_request.status == 200) {
            core();
        }
        else {
            alertokno('Пыха в дауне!!!');
        }
    }
}

// ядро
function core() {
    var code = http_request.responseText;
    if (code.search(/pyha-informer-status/) >= 0)
    {
        var r = JSON.parse(code);
        if (r['count'] == 1) {
            document.getElementById('urlik').setAttribute("value", 'http://pyha.ru' + r['topics'][0]['url']);
        }
        statusinbar("spam", r['count']);
        spamokno(r.count);
        tooltipokno(r['topics'], r['count']);
    }
    else
    {
        alertokno("Залогинься");
    }
}

window.addEventListener("load", updater, false);

// обновлялка
function updater() {
    reminderFox_moveBox();

    clear();
    if (m_prefs.getIntPref("extensions.pyha32.onoff") == 1) {
        clear();
        statusinbar("loading", 0);
        include();
        var newtime = m_prefs.getIntPref("extensions.pyha32.time") * 60000;
        window.setTimeout("updater()", newtime);
    }
    else {
        document.getElementById('off').setAttribute("checked", true);
        document.getElementById("status-icon").setAttribute("src", "chrome://pyhainformer/skin/" + m_prefs.getIntPref("extensions.pyha32.skin") + "/off.png");
        document.getElementById('status').setAttribute("value", "выкл");
    }
}

function reminderFox_moveBox() {
    // создадим обжект
    var toolbar = document.getElementById(m_prefs.getCharPref("extensions.pyha32.mesto"));

    var box = document.getElementById("reminderFox-statusLabel");
    var position = m_prefs.getIntPref("extensions.pyha32.raspalaga");
    box.parentNode.removeChild(box);

    reminderFox_insertAtIndex(toolbar, box, position);
}

function reminderFox_insertAtIndex(aParent, aChild, aIndex) {
    var children = aParent.childNodes;

    if ((children.length == 0) || (aIndex >= children.length) || (aIndex < 0)) {
        aParent.appendChild(aChild);
    }
    else {
        aParent.insertBefore(aChild, children[aIndex]);
    }
}