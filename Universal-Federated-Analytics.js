/*
            .ooooo.        oooooooo
           d88" `88b      888    P88
           888            o888oo888
           888            888
           `"88888"       888
                                  
***********************************************************************************************************
Copyright 2024 by Cardinal Path.
Dual Tracking Federated Analytics: Google Analytics Government Wide Site Usage Measurement.
Author: Ahmed Awwad
27/06/2024 Version: 8.1
***********************************************************************************************************/
var tObjectCheck,
  _allowedQuerystrings = [],
  isSearch = false,
  oCONFIG = {
    GWT_GA4ID: ["G-CSLL4ZEK4L"],
    FORCE_SSL: !0,
    ANONYMIZE_IP: !0,
    AGENCY: "",
    SUB_AGENCY: "",
    VERSION: "20240627 v8.1 - GA4",
    SITE_TOPIC: "",
    SITE_PLATFORM: "",
    SCRIPT_SOURCE: "",
    URL_PROTOCOL: location.protocol,
    USE_MAIN_CUSTOM_DIMENSIONS: !0,
    MAIN_AGENCY_DIMENSION: "agency",
    MAIN_SUBAGENCY_DIMENSION: "subagency",
    MAIN_CODEVERSION_DIMENSION: "version",
    MAIN_SITE_TOPIC_DIMENSION: "site_topic",
    MAIN_SITE_PLATFORM_DIMENSION: "site_platform",
    MAIN_SCRIPT_SOURCE_URL_DIMENSION: "script_source",
    MAIN_URL_PROTOCOL_DIMENSION: "protocol",
    MAIN_INTERACTION_TYPE_DIMENSION: "interaction_type",
    MAIN_USING_PARALLEL_DIMENSION: "using_parallel_tracker",
    USE_PARALLEL_CUSTOM_DIMENSIONS: !1,
    PARALLEL_AGENCY_DIMENSION: "agency",
    PARALLEL_SUBAGENCY_DIMENSION: "subagency",
    PARALLEL_CODEVERSION_DIMENSION: "version",
    PARALLEL_SITE_TOPIC_DIMENSION: "site_topic",
    PARALLEL_SITE_PLATFORM_DIMENSION: "site_platform",
    PARALLEL_SCRIPT_SOURCE_URL_DIMENSION: "script_source",
    PARALLEL_URL_PROTOCOL_DIMENSION: "protocol",
    PARALLEL_INTERACTION_TYPE_DIMENSION: "interaction_type",
    PARALLEL_USING_PARALLEL_DIMENSION: "using_parallel_tracker",
    COOKIE_DOMAIN: location.hostname.replace(/^www\./, "").toLowerCase(),
    COOKIE_TIMEOUT: 63072e3,
    SEARCH_PARAMS: "q|query|nasaInclude|k|querytext|keys|qt|search_input|search|globalSearch|goog|s|gsearch|search_keywords|SearchableText|sp_q|qs|psnetsearch|locate|lookup|search_api_views_fulltext|keywords|request|_3_keywords|searchString",
    YOUTUBE: !1,
    YT_MILESTONE: 25, //accepts 10, 20, and 25
    AUTOTRACKER: !0,
    EXTS: "doc|docx|xls|xlsx|xlsm|ppt|pptx|exe|zip|pdf|js|txt|csv|dxf|dwgd|rfa|rvt|dwfx|dwg|wmv|jpg|msi|7z|gz|tgz|wma|mov|avi|mp3|mp4|csv|mobi|epub|swf|rar",
    SUBDOMAIN_BASED: !0,
    GA4_NAME: "GSA_GA4_ENOR",
    USE_CUSTOM_URL: !1,
    USE_CUSTOM_TITLE: !1,
    USING_PARALLEL_TRACKER: "no",
    ACTIVATE_DEV: !1
  };

  _updateConfig();
  _setEnvironment();

//*********GA4************
var head = document.getElementsByTagName("head").item(0);
var GA4Object = document.createElement("script");
GA4Object.setAttribute("type", "text/javascript");
GA4Object.setAttribute(
  "src",
  "https://www.googletagmanager.com/gtag/js?id=" + oCONFIG.GWT_GA4ID[0]
);
head.appendChild(GA4Object);
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag('set', {'cookie_flags': 'SameSite=Strict;Secure', 'transport_type': 'beacon'});
//*********GA4************



function _onEveryPage() {
  _payloadInterceptor();
  _defineCookieDomain();
  _defineAgencyCDsValues();
  _setAllowedQS();
  createTracker();
}
_onEveryPage();

function _defineCookieDomain() {
  /(([^.\/]+\.[^.\/]{2,3}\.[^.\/]{2})|(([^.\/]+\.)[^.\/]{2,4}))(\/.*)?$/.test(
    oCONFIG.SUBDOMAIN_BASED.toString()
  )
    ? ((oCONFIG.COOKIE_DOMAIN = oCONFIG.SUBDOMAIN_BASED.toLowerCase().replace(
      /^www\./i,
      ""
    )),
      (oCONFIG.SUBDOMAIN_BASED = !0))
    : !1 === oCONFIG.SUBDOMAIN_BASED
      ? ((oCONFIG.COOKIE_DOMAIN = document.location.hostname.match(
        /(([^.\/]+\.[^.\/]{2,3}\.[^.\/]{2})|(([^.\/]+\.)[^.\/]{2,4}))(\/.*)?$/
      )[1]),
        (oCONFIG.SUBDOMAIN_BASED = !0))
      : ((oCONFIG.COOKIE_DOMAIN = location.hostname
        .toLowerCase()
        .replace(/^www\./i, "")),
        (oCONFIG.SUBDOMAIN_BASED = !1));
}

function _defineAgencyCDsValues() {
  oCONFIG.AGENCY = oCONFIG.AGENCY || "unspecified:" + oCONFIG.COOKIE_DOMAIN;
  oCONFIG.SUB_AGENCY = oCONFIG.SUB_AGENCY || "" + oCONFIG.COOKIE_DOMAIN;
  oCONFIG.SITE_TOPIC =
    oCONFIG.SITE_TOPIC || "unspecified:" + oCONFIG.COOKIE_DOMAIN;
  oCONFIG.SITE_PLATFORM =
    oCONFIG.SITE_PLATFORM || "unspecified:" + oCONFIG.COOKIE_DOMAIN;
}

function _setEnvironment(){
  if (document.location.href.match(/([?&])(dap-dev-env)([^&$]*)/i) || oCONFIG.ACTIVATE_DEV) {
    oCONFIG.GWT_GA4ID[0] = "G-9TNNMGP8WJ"; //Test Digital Analytics Program GA4
  }
}

function _cleanBooleanParam(a) {
  switch (a.toString().toLowerCase()) {
    case "true":
    case "on":
    case "yes":
    case "1":
      return !0;
    case "false":
    case "off":
    case "no":
    case "0":
      return !1;
    default:
      return a;
  }
}

function _isValidGA4Num(a) {
  a = a.toLowerCase();
  a = a.match(/^g\-([0-9a-z])+$/);
  return null !== a && 0 < a.length && a[0] !== oCONFIG.GWT_GA4ID[0].toLowerCase();
}

var d_c=1;
function _cleanGA4Value(t, a) {
  try {
    a = a.replace(/\s/g, '_').replace(/([^\w]+)/g, '').match(/[A-Za-z]\w*$/ig);
    return ((null !== a)? a[0].toLowerCase() : t==="d"? "custom_dimension_"+d_c++ : "dap_event");
  } catch (c) { }
}

function _updateConfig() {
  if ("undefined" !== typeof _fedParmsGTM) {
    var a = _fedParmsGTM.toLowerCase().split("&");
    oCONFIG.SCRIPT_SOURCE = "GTM";
  } else {
    var b = document.getElementById("_fed_an_ua_tag");
    _fullParams = b.src.match(/^([^\?]*)(.*)$/i)[2].replace("?", "");
    a = _fullParams.split("&");
    oCONFIG.SCRIPT_SOURCE = b.src.split("?")[0];
  }
  for (b = 0; b < a.length; b++)
    switch (
    ((_keyValuePair = decodeURIComponent(a[b].toLowerCase())),
      (_key = _keyValuePair.split("=")[0]),
      (_value = _keyValuePair.split("=")[1]),
      _key)
    ) {
       case "pua":
        for (var c = _value.split(","), d = 0; d < c.length; d++)
          _isValidGA4Num(c[d]) && ( oCONFIG.GWT_GA4ID.push(c[d].toUpperCase()), oCONFIG.USING_PARALLEL_TRACKER = "pua" );
        break; 
      case "pga4":
        for (var c = _value.split(","), d = 0; d < c.length; d++)
          _isValidGA4Num(c[d]) && ( oCONFIG.GWT_GA4ID.push(c[d].toUpperCase()), oCONFIG.USING_PARALLEL_TRACKER = "pga4" );
        break;
      case "agency":
        oCONFIG.AGENCY = _value.toUpperCase();
        break;
      case "subagency":
        oCONFIG.SUB_AGENCY = _value.toUpperCase();
        break;
      case "sitetopic":
        oCONFIG.SITE_TOPIC = _value;
        break;
      case "siteplatform":
        oCONFIG.SITE_PLATFORM = _value;
        break;
      case "parallelcd":
        _value = _cleanBooleanParam(_value);
        if (!0 === _value || !1 === _value)
          oCONFIG.USE_PARALLEL_CUSTOM_DIMENSIONS = _value;
        break;
      case "custurl":
        _value = _cleanBooleanParam(_value);
        if (!0 === _value || !1 === _value)
          oCONFIG.USE_CUSTOM_URL = _value;
        break;
      case "custitle":
        _value = _cleanBooleanParam(_value);
        if (!0 === _value || !1 === _value)
          oCONFIG.USE_CUSTOM_TITLE = _value;
        break;
      case "dapdev":
        _value = _cleanBooleanParam(_value);
        if (!0 === _value || !1 === _value)
          oCONFIG.ACTIVATE_DEV = _value;
        break;
      case "palagencydim":
        _value = _cleanGA4Value("d", _value);
        "" !== _value &&
          (oCONFIG.PARALLEL_AGENCY_DIMENSION = _value);
        break;
      case "palsubagencydim":
        _value = _cleanGA4Value("d", _value);
        "" !== _value &&
          (oCONFIG.PARALLEL_SUBAGENCY_DIMENSION = _value);
        break;
      case "palversiondim":
        _value = _cleanGA4Value("d", _value);
        "" !== _value &&
          (oCONFIG.PARALLEL_CODEVERSION_DIMENSION = _value);
        break;
      case "paltopicdim":
        _value = _cleanGA4Value("d", _value);
        "" !== _value &&
          (oCONFIG.PARALLEL_SITE_TOPIC_DIMENSION = _value);
        break;
      case "palplatformdim":
        _value = _cleanGA4Value("d", _value);
        "" !== _value &&
          (oCONFIG.PARALLEL_SITE_PLATFORM_DIMENSION = _value);
        break;
      case "palscriptsrcdim":
        _value = _cleanGA4Value("d", _value);
        "" !== _value &&
          (oCONFIG.PARALLEL_SCRIPT_SOURCE_URL_DIMENSION = _value);
        break;
      case "palurlprotocoldim":
        _value = _cleanGA4Value("d", _value);
        "" !== _value &&
          (oCONFIG.PARALLEL_URL_PROTOCOL_DIMENSION = _value);
        break;
      case "palinteractiontypedim":
        _value = _cleanGA4Value("d", _value);
        "" !== _value &&
          (oCONFIG.PARALLEL_INTERACTION_TYPE_DIMENSION = _value);
        break;
      case "cto":
        oCONFIG.COOKIE_TIMEOUT = parseInt(_value) * 2628000;		// = 60 * 60 * 24 * 30.4166666666667;
        break;
      case "sp":
        oCONFIG.SEARCH_PARAMS += "|" + _value.replace(/,/g, "|");
        break;
      case "exts":
        oCONFIG.EXTS += "|" + _value.replace(/,/g, "|");
        break;
      case "yt":
        _value = _cleanBooleanParam(_value);
        if (!0 === _value || !1 === _value) oCONFIG.YOUTUBE = _value;
        break;
      case "ytm":
        oCONFIG.YT_MILESTONE = ((/^(10|20|25)$/.test(_value) ? parseInt(_value) : 25));
        break;
      case "autotracker":
        _value = _cleanBooleanParam(_value);
        if (!0 === _value || !1 === _value) oCONFIG.AUTOTRACKER = _value;
        break;
      case "sdor":
        oCONFIG.SUBDOMAIN_BASED = _cleanBooleanParam(_value);
        break;
      default:
        break;
    }
}

function _sendEvent(a, b) {
  var send_to = "";
  for (var g = 0; g < oCONFIG.GWT_GA4ID.length; g++) {
    try {
      send_to += oCONFIG.GA4_NAME + g + ",";
    }
    catch (er) { }
  }
  var c = _piiRedactor(_objToQuery(b), "json");
  c = _queryToJSON(c);
  c = _unflattenJSON(c);
  c.send_to = send_to.replace(/.$/, "");
  c.event_name_dimension = a;
  gtag("event", a, c); 
}

function gas4(a, b) {
  if (void 0 !== a && "" !== a && void 0 !== b && 'object' === typeof b) {
    a = _cleanGA4Value("e", a);
      if ("page_view" === a.toLowerCase())
          try {
              if(Object.keys(b).length !== 0){
                var ur = ((b.page_location)? b.page_location: location.href);
                  b.page_location = _URIHandler(_scrubbedURL(ur)).split(/[#]/)[0];
                  b.page_title = ((b.page_title) ? b.page_title : document.title);
                  _sendEvent("page_view", b), ((isSearch)?(_sendViewSearchResult({search_term: isSearch})) : '');
              }
          } catch (n) { }
      else
          try {
            var e_n= ((/((email|telephone|image|cta|navigation|faq|accordion)_)?click|file_download|view_search_results|video_(start|pause|progress|complete|play)|official_USA_site_banner_click|form_(start|submit|progress)|content_view|social_share|error|sort|filter|was_this_helpful_submit/gi.test(a))? a : 'dap_event');
            if(Object.keys(b).length !== 0){_sendEvent(e_n, b);}
            else{_sendEvent(e_n);}
          } catch (n) { }
  }
}

function gas(a, b, c, d, f, e, h) {
  if (
    void 0 !== a &&
    "" !== a &&
    void 0 !== b &&
    "" !== b &&
    void 0 !== c &&
    "" !== c
  )
    if ("pageview" === b.toLowerCase())
      try {
        c = _URIHandler(_scrubbedURL(c)).split(/[#]/)[0];
        _sendEvent("page_view", {page_location : c, page_title: void 0 === d || "" === d ? document.title : d}),
        ((isSearch)? _sendViewSearchResult({search_term : isSearch}) : '' );

      } catch (n) { }
    else if ("event" === b.toLowerCase() && void 0 !== d && "" !== d)
      try {
        var g = !1;
        void 0 !== h &&
          "boolean" === typeof _cleanBooleanParam(h) &&
          (g = _cleanBooleanParam(h));
        _sendEvent("dap_event", {
          event_category: c,
          event_action: d,
          event_label: void 0 === f ? "" : f,
          event_value: void 0 === e || "" === e || isNaN(e) ? 0 : parseInt(e),
          non_interaction: g,
        });
      } catch (n) { }
    else if (-1 != b.toLowerCase().indexOf("dimension"))
      try {
      } catch (n) { }
    else if (-1 != b.toLowerCase().indexOf("metric"))
      try {
       
      } catch (n) { }
}



function _sendViewSearchResult(a) {
  _sendEvent("view_search_results", a), isSearch = !1;
}

function _isExcludedReferrer() {
  if ("" !== document.referrer) {
    var a = document.referrer
      .replace(/https?:\/\//i, "")
      .split("/")[0]
      .replace(/^www\./i, "");
    return oCONFIG.SUBDOMAIN_BASED
      ? -1 != a.indexOf(oCONFIG.COOKIE_DOMAIN)
        ? !0
        : !1
      : a === oCONFIG.COOKIE_DOMAIN
        ? !0
        : !1;
  }
}

function createTracker(a) {
  var m, n, o = /^\/.*$/i;
  try { m = ((oCONFIG.USE_CUSTOM_URL && o.test(custom_dap_data.url)) ? location.protocol + "//" + location.hostname + custom_dap_data.url.replace(location.protocol + "//" + location.hostname, "") : document.location.href); n = ((oCONFIG.USE_CUSTOM_TITLE) ? custom_dap_data.title : document.title); } catch (error) { m = document.location.href; n = document.title; }
  var c = m.split(document.location.hostname)[1];
  -1 !== document.title.search(/404|not found/i) && 
  (c = ("/vpv404/" + c).replace(/\/\//g, "/") + ((document.referrer) ? "/" + document.referrer : document.referrer));
  var p = ((-1 !== document.title.search(/404|not found/ig))? document.location.protocol + "//" + document.location.hostname + c : m);
  var ur = _URIHandler(_scrubbedURL(p)); 
  var r =  {};
  for (var b = 0; b < oCONFIG.GWT_GA4ID.length; b++) {
    if (b === 0) {
      r = {
        groups: oCONFIG.GA4_NAME + b,
        cookie_expires: parseInt(oCONFIG.COOKIE_TIMEOUT),
        //ignore_referrer: (_isExcludedReferrer() ? true : false),
        page_location: ur,
        page_title: n,
        [oCONFIG.MAIN_AGENCY_DIMENSION]: oCONFIG.AGENCY.toUpperCase(),
        [oCONFIG.MAIN_SUBAGENCY_DIMENSION]: oCONFIG.SUB_AGENCY.toUpperCase(),
        [oCONFIG.MAIN_SITE_TOPIC_DIMENSION]: oCONFIG.SITE_TOPIC.toLowerCase(),
        [oCONFIG.MAIN_SITE_PLATFORM_DIMENSION]: oCONFIG.SITE_PLATFORM.toLowerCase(),
        [oCONFIG.MAIN_SCRIPT_SOURCE_URL_DIMENSION]: oCONFIG.SCRIPT_SOURCE.toLowerCase(),
        [oCONFIG.MAIN_CODEVERSION_DIMENSION]: oCONFIG.VERSION.toLowerCase(),
        [oCONFIG.MAIN_URL_PROTOCOL_DIMENSION]: oCONFIG.URL_PROTOCOL.toLowerCase(),
        [oCONFIG.MAIN_USING_PARALLEL_DIMENSION]: oCONFIG.USING_PARALLEL_TRACKER.toLowerCase()
      };
      ((document.referrer && -1 !== document.referrer.search(location.hostname))? (r.page_referrer = _scrubbedURL(document.referrer)) : document.referrer);
      var rr = _piiRedactor(_objToQuery(r), "default");
      rr = _queryToJSON(rr);
      rr = _unflattenJSON(rr);
      gtag("config", oCONFIG.GWT_GA4ID[b], rr);
    }
    else if (b > 0 && oCONFIG.USE_PARALLEL_CUSTOM_DIMENSIONS) {
      r = {
        groups: oCONFIG.GA4_NAME + b,
        cookie_expires: parseInt(oCONFIG.COOKIE_TIMEOUT),
        //ignore_referrer: (_isExcludedReferrer() ? true : false),
        page_location: ur,
        page_title: n,
        [oCONFIG.PARALLEL_AGENCY_DIMENSION]: oCONFIG.AGENCY.toUpperCase(),
        [oCONFIG.PARALLEL_SUBAGENCY_DIMENSION]: oCONFIG.SUB_AGENCY.toUpperCase(),
        [oCONFIG.PARALLEL_SITE_TOPIC_DIMENSION]: oCONFIG.SITE_TOPIC.toLowerCase(),
        [oCONFIG.PARALLEL_SITE_PLATFORM_DIMENSION]: oCONFIG.SITE_PLATFORM.toLowerCase(),
        [oCONFIG.PARALLEL_SCRIPT_SOURCE_URL_DIMENSION]: oCONFIG.SCRIPT_SOURCE.toLowerCase(),
        [oCONFIG.PARALLEL_CODEVERSION_DIMENSION]: oCONFIG.VERSION.toLowerCase(),
        [oCONFIG.PARALLEL_URL_PROTOCOL_DIMENSION]: oCONFIG.URL_PROTOCOL.toLowerCase(),
        [oCONFIG.PARALLEL_USING_PARALLEL_DIMENSION]: oCONFIG.USING_PARALLEL_TRACKER.toLowerCase()
      };
      ((document.referrer && -1 !== document.referrer.search(location.hostname))? (r.page_referrer = _scrubbedURL(document.referrer)) : document.referrer);
      var rr = _piiRedactor(_objToQuery(r), "default");
      rr = _queryToJSON(rr);
      rr = _unflattenJSON(rr);
      gtag("config", oCONFIG.GWT_GA4ID[b], rr);
    }
    else {
      r =  {
        groups: oCONFIG.GA4_NAME + b,
        cookie_expires: parseInt(oCONFIG.COOKIE_TIMEOUT),
        //ignore_referrer: (_isExcludedReferrer() ? true : false),
        page_location: ur,
        page_title: n
      };
      ((document.referrer && -1 !== document.referrer.search(location.hostname))? (r.page_referrer = _scrubbedURL(document.referrer)) : document.referrer);
      var rr = _piiRedactor(_objToQuery(r), "default");
      rr = _queryToJSON(rr);
      rr = _unflattenJSON(rr);
      gtag("config", oCONFIG.GWT_GA4ID[b], rr);
    }
  }
  ((isSearch)? _sendViewSearchResult({search_term: isSearch}) : "");
  //window.fetch = wf;
}

function _initAutoTracker() {
  var _isDownload = function (a) {
    var ex = a.href.toLowerCase().replace(/[#?&].*/, '').split(a.hostname)[1].split("."); var ext = ex[ex.length - 1];
    if (ext.match(new RegExp("^(" + oCONFIG.EXTS + ")$")) != null) {
      return ext;
    }
    else {
      return false;
    }
  };
  var _enforeLower = function (j) {
    try {
      var d = JSON.stringify(j);
      return JSON.parse(d.toLowerCase());
    } catch (error) { }
  };

  var _eventHandler = function (event) {
    try {
      if ("mousedown" === event.type || ("keydown" === event.type && 13 === event.keyCode)) {
        if (event.target.nodeName === 'A' || event.target.closest('a') !== null) {
          var b = oCONFIG.COOKIE_DOMAIN, c = "";
          var d = "",
            f = "",
            e = /^mailto:[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/i,
            h =
              /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i,
            i = "",
            t = "",
            l = {},
            g = /^(tel:)(.*)$/i;
          var a = event.target.closest('a');
          if ("mousedown" === event.type) {
            t = "Mouse Click";
          }
          else if ("keydown" === event.type && 13 === event.keyCode) {
            t = "Enter Key Keystroke";
          }

          if (e.test(a.href) || h.test(a.href) || g.test(a.href)) {
            try {
              h.test(a.href)
                ? ((f = a.hostname.toLowerCase().replace(/^www\./i, "")), (i = "l"))
                : e.test(a.href)
                  ? ((f = a.href.split("@")[1].toLowerCase()), (i = "m"))
                  : g.test(a.href) && ((f = a.href), (f = f.toLowerCase()), (i = "t"));
            } catch (k) {
              //continue;
            }
          }

          if (oCONFIG.SUBDOMAIN_BASED ? -1 !== f.indexOf(b) : f === b) {
            if ("m" === i) {
              c = a.href.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/);
              l = { link_id: a.id, link_url: c[0], link_domain: c[0].split("@")[1], link_text: a.text.replace(/(?:[\r\n]+)+/g, "").trim(), link_classes: a.className, interaction_type: t };
              _sendEvent("email_click", _enforeLower(l));
            }
            /*else if("t"===i){
              l = {link_id: a.id, link_url: a.href.split("tel:")[1], link_text: a.text.replace(/(?:[\r\n]+)+/g, "").trim(), link_classes: a.className, interaction_type: t};
              _sendEvent("telephone_click", l);
            }*/
            else {
              if ("l" === i && _isDownload(a)) {
                c = a.pathname.split(/[#?&?]/)[0];
                d = _isDownload(a);
                l = { file_name: c, file_extension: d, link_text: a.text.replace(/(?:[\r\n]+)+/g, "").trim(), link_id: a.id, link_url: a.href.replace(/[#?&].*/, ""), link_domain: a.hostname.replace(/^www\./i, ""), interaction_type: t };
                _sendEvent("file_download", _enforeLower(l));
              }
              else if ("l" === i && !_isDownload(a)) {
                //internal link tracking; 
                /*c = a.closest('section'); var s_n = (('object' === typeof c)? (c.id? c.id : c.className) : '');
                l = { link_id: a.id, link_url: a.href, link_domain: a.hostname.replace(/^www\./i, ""), link_text: a.text.replace(/(?:[\r\n]+)+/g, "").trim(), link_classes: a.className, interaction_type: t, section:  s_n, menu_type: 'all' };
                _sendEvent("navigation_click", _enforeLower(l));*/
              }
            }
          }
          else {
            if ("l" === i && _isDownload(a)) {
              c = a.pathname.split(/[#?&?]/)[0];
              d = _isDownload(a);
              l = { file_name: c, file_extension: d, link_text: a.text.replace(/(?:[\r\n]+)+/g, "").trim(), link_id: a.id, link_url: a.href.replace(/[#?&].*/, ""), link_domain: a.hostname.replace(/^www\./i, ""), outbound: true, interaction_type: t };
              _sendEvent("file_download", _enforeLower(l));
            }
            else if ("l" === i && !_isDownload(a)) {
              l = { link_id: a.id, link_url: a.href.replace(/[#?&].*/, ""), link_domain: a.hostname.replace(/^www\./i, ""), link_text: a.text.replace(/(?:[\r\n]+)+/g, "").trim(), link_classes: a.className, outbound: true, interaction_type: t };
              _sendEvent("click", _enforeLower(l));
            }
            else if ("m" === i) {
              c = a.href.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/);
              l = { link_id: a.id, link_url: c[0], link_domain: c[0].split("@")[1], link_text: a.text.replace(/(?:[\r\n]+)+/g, "").trim(), link_classes: a.className, outbound: true, interaction_type: t };
              _sendEvent("email_click", _enforeLower(l));
            }
            else if ("t" === i) {
              l = { link_id: a.id, link_url: a.href.split("tel:")[1], link_text: a.text.replace(/(?:[\r\n]+)+/g, "").trim(), link_classes: a.className, interaction_type: t };
              _sendEvent("telephone_click", _enforeLower(l));
            }
          }
        }
      }

    } catch (error) {

    }
  };

  (document.addEventListener ? document.addEventListener("mousedown", _eventHandler, false) : (document.attachEvent && document.attachEvent("onmousedown", _eventHandler)));
  (document.addEventListener ? document.addEventListener("keydown", _eventHandler, false) : (document.attachEvent && document.attachEvent("onkeydown", _eventHandler)));
}

// START YT TRACKER //
if (oCONFIG.YOUTUBE) {
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  var videoArray = [];
  var playerArray = [];
  var _buckets = [];

  var _milestoneController = oCONFIG.YT_MILESTONE; /* accepted values 10, 20 or 25 */
  var ytUtils = [];


  onYouTubeIframeAPIReady = function () {
    for (var i = 0; i < videoArray.length; i++) {
      playerArray[i] = new YT.Player(videoArray[i], {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
          'onError': onPlayerError
        }
      });
    }
  };
  onPlayerReady = function (event) { };
  onPlayerError = function (event) {
    _sendEvent('video_error', { videotitle: ((event.target.playerInfo !== undefined) ? event.target.playerInfo.videoData.title : event.target.getVideoData().title) });
  };
  
  onPlayerStateChange = function (event) {
    try {
      var videoIndex = 0, video_id = ((event.target.playerInfo !== undefined) ? event.target.playerInfo.videoData.video_id : event.target.getVideoData().video_id);
      for (var o = 0; o < videoArray.length; o++) {
        if (videoArray[o] == video_id) {
          videoIndex = o;
        }
      }
      var cTime = ((playerArray[videoIndex].playerInfo !== undefined) ? Math.round(playerArray[videoIndex].playerInfo.currentTime) : Math.round(playerArray[videoIndex].getCurrentTime()));
      var vDuration = ((playerArray[videoIndex].playerInfo !== undefined) ? Math.round(playerArray[videoIndex].playerInfo.duration) : Math.round(playerArray[videoIndex].getDuration()));
      var p = {
        video_current_time: cTime,
        video_duration: vDuration,
        video_percent: ((cTime / vDuration) * 100).toFixed(),
        video_provider: "youtube",
        video_title: ((playerArray[videoIndex].playerInfo !== undefined) ? playerArray[videoIndex].playerInfo.videoData.title : playerArray[videoIndex].getVideoData().title),
        video_id: ((playerArray[videoIndex].playerInfo !== undefined) ? playerArray[videoIndex].playerInfo.videoData.video_id : playerArray[videoIndex].getVideoData().video_id),
        video_url: ((playerArray[videoIndex].playerInfo !== undefined) ? playerArray[videoIndex].playerInfo.videoUrl : playerArray[videoIndex].getVideoUrl())
      };
      if (event.data == YT.PlayerState.PLAYING && p.video_percent == 0) {
        _sendEvent('video_start', p);
        cCi = 0;
        if (_milestoneController) {
          ytUtils.push([videoIndex, function (videx) {
            for (var b = 1; b <= (100 / _milestoneController); b++) {
              ((100 / _milestoneController === 4 && b === 100 / _milestoneController) ? _buckets[b - 1] = { id: videoIndex, milestone: 95, triggered: false } : ((_milestoneController * b !== 100) ? _buckets[b - 1] = { id: videoIndex,  milestone: _milestoneController * b, triggered: false } : ''));
            }
            setInterval(function () {
              var cTimeP = ((playerArray[videoIndex].playerInfo !== undefined) ? Math.round(playerArray[videoIndex].playerInfo.currentTime) : Math.round(playerArray[videoIndex].getCurrentTime()));
              var vDurationP = ((playerArray[videoIndex].playerInfo !== undefined) ? Math.round(playerArray[videoIndex].playerInfo.duration) : Math.round(playerArray[videoIndex].getDuration()));
              var y = {
                video_current_time: cTimeP,
                video_duration: vDurationP,
                video_percent: ((cTimeP / vDurationP) * 100).toFixed(),
                video_provider: "youtube",
                video_title: ((playerArray[videoIndex].playerInfo !== undefined) ? playerArray[videoIndex].playerInfo.videoData.title : playerArray[videoIndex].getVideoData().title),
                video_id: ((playerArray[videoIndex].playerInfo !== undefined) ? playerArray[videoIndex].playerInfo.videoData.video_id : playerArray[videoIndex].getVideoData().video_id),
                video_url: ((playerArray[videoIndex].playerInfo !== undefined) ? playerArray[videoIndex].playerInfo.videoUrl : playerArray[videoIndex].getVideoUrl())
              };
              if (y.video_percent <= _buckets[_buckets.length - 1] && cCi < _buckets.length) {
                if (y.video_percent >= _buckets[cCi].milestone && !_buckets[cCi].triggered && _buckets[videoIndex].id === videoIndex) {
                  _buckets[cCi].triggered = true; y.video_percent = _buckets[cCi].milestone; y.video_current_time = Math.round((y.video_duration / _buckets.length) * (cCi + 1)); _sendEvent("video_progress", y); cCi++;
                }
              }
            }, ((playerArray[videoIndex].playerInfo !== undefined) ? Math.round(playerArray[videoIndex].playerInfo.duration) : Math.round(playerArray[videoIndex].getDuration())) / _buckets.length);
          }]);
          ytUtils[ytUtils.length - 1][1](videoIndex);
        }
      }
      else if (event.data == YT.PlayerState.PLAYING) { _sendEvent("video_play", p); }
      if (event.data == YT.PlayerState.ENDED) { _sendEvent("video_complete", p); }
      if (event.data == YT.PlayerState.PAUSED) { _sendEvent("video_pause", p); }

    } catch (error) {

    }

  };
  youtube_parser = function (e) { var t = e.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/); if (t && 11 == t[2].length) return t[2] };
  IsYouTube = function (u) { var e = u.match(/(.*)(youtu\.be\/|youtube(\-nocookie)?\.([A-Za-z]{2,4}|[A-Za-z]{2,3}\.[A-Za-z]{2})\/)(watch|embed\/|vi?\/)?(\?vi?=)?([^#&\?\/]{11}).*/); return null != e && e.length > 0 };
  YTUrlHandler = function (t) { return t = t.replace(/origin\=(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})\&?/gi, "origin=" + document.location.protocol + "//" + document.location.host), stAdd = "", adFlag = !1, -1 == t.indexOf("https") && (t = t.replace("http", "https")), -1 == t.indexOf("?") && (stAdd = "?flag=1"), -1 == t.indexOf("enablejsapi") && (stAdd += "&enablejsapi=1", adFlag = !0), -1 == t.indexOf("origin") && (stAdd += "&origin=" + document.location.protocol + "//" + document.location.host, adFlag = !0), 1 == adFlag ? t + stAdd : t };
  _initYouTubeTracker = function () {
    var i = 0;
    var allIframes = document.getElementsByTagName('iframe');
    for (var iframe = 0; iframe < allIframes.length; iframe++) {
      var video = allIframes[iframe];
      var _thisSrc = video.src;
      if (IsYouTube(_thisSrc)) {
        allIframes[iframe].src = YTUrlHandler(_thisSrc);
        var youtubeid = youtube_parser(_thisSrc);
        videoArray[i] = youtubeid;
        allIframes[iframe].setAttribute('id', youtubeid);
        i++;
      }
    }
  };
}
// END YT TRACKER //

// GA4 Payload Interceptor
function _payloadInterceptor() {
  window._isRedacted = window._isRedacted || false;
  if (!window._isRedacted) {
    window._isRedacted = !0;
    try {
      var pl = window.navigator.sendBeacon;
      var ga4_props = oCONFIG.GWT_GA4ID.join("|");
      window.navigator.sendBeacon = function () {
        if (arguments && arguments[0].match(/google-analytics\.com.*v\=2\&/i) && arguments[0].match(new RegExp(ga4_props))) {
          var endpoint = arguments[0].split('?')[0], query = arguments[0].split('?')[1];
          var beacon = {
            endpoint: endpoint, query: _piiRedactor(query, "ga4"), events: []
          };
          if (arguments[1]) {
            arguments[1].split("\r\n").forEach(function (event) {
              beacon.events.push(_piiRedactor(event, "ga4"));
            });
          }
          arguments[0] = [beacon.endpoint, beacon.query].join('?');
          if (arguments[1] && beacon.events.length > 0) {
            beacon.events.join("\r\n");
            arguments[1] = beacon.events.join("\r\n");
          }
        }
        return pl.apply(this, arguments);
      };
    } catch (e) { return pl.apply(this, arguments); }
  }
}
// End GA4 Payload Interceptor

function _unflattenJSON(data) {
  try {
    if (Object(data) !== data || Array.isArray(data))
      return data;
    var result = {}, cur, prop, idx, last, temp;
    for (var p in data) {
      cur = result, prop = "", last = 0;
      do {
        idx = p.indexOf(".", last);
        temp = p.substring(last, idx !== -1 ? idx : undefined);
        cur = cur[prop] || (cur[prop] = (!isNaN(parseInt(temp)) ? [] : {}));
        prop = temp;
        last = idx + 1;
      } while (idx >= 0);
      cur[prop] = data[p];
    }
    return result[""];

  } catch (error) {
  }
}
function _flattenJSON(data) {
  try {
    var result = {};
    function recurse(cur, prop) {
      if (Object(cur) !== cur) {
        result[prop] = cur;
      } else if (Array.isArray(cur)) {
        for (var i = 0, l = cur.length; i < l; i++)
          recurse(cur[i], prop ? prop + "." + i : "" + i);
        if (l == 0)
          result[prop] = [];
      } else {
        var isEmpty = true;
        for (var p in cur) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + "." + p : p);
        }
        if (isEmpty)
          result[prop] = {};
      }
    }
    recurse(data, "");
    return result;
  } catch (error) {
  }
}

function _objToQuery(obj) {
  return Object.keys(obj).reduce(function (str, key, i) {
    var delimiter, val;
    delimiter = (i === 0) ? '' : '&';
    key = encodeURIComponent(key);
    val = encodeURIComponent(obj[key]);
    return [str, delimiter, key, '=', val].join('');
  }, '');
}
function _queryToJSON(qs) {
  var pairs = qs.split('&');
  var result = {};
  pairs.forEach(function(p) {
      var pair = p.split('=');
      var key = pair[0];
      var value = decodeURIComponent(pair[1] || '');

      if( result[key] ) {
          if( Object.prototype.toString.call( result[key] ) === '[object Array]' ) {
              result[key].push( value );
          } else {
              result[key] = [ result[key], value ];
          }
      } else {
          result[key] = value;
      }
  });

  return JSON.parse(JSON.stringify(result));
};

var piiRegex = [];
function _piiRegexReset() {
  window.piiRegex = [{
    name: 'EMAIL',
    regex: /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/gi
  }, {
    name: 'TEL',
    regex: /((tel|(tele)?phone|mob(ile)?|cell(ular)?)\=)?((\+\d{1,2}[\s\.\-]?)?\d{3}[\s\.\-]\d{3}[\s\.\-]\d{4})([^\&\s\?\/]*)/gi
  }, {
    name: 'SSN',
    regex: /((full)?(([\-\_])?)?ssn\=)?(\d{3}([\s\.\-\+]|%20)\d{2}([\s\.\-\+]|%20)\d{4})([^\&\s\?\/]*)/ig
  }, {
    name: 'NAME',
    regex: /((first|last|middle|sur|f|l|user)([\-\_])?)?name\=([^\&\s\?\/]*)/ig
  }, {
    name: 'PASSWORD',
    regex: /(((confirm([\-\_])?)?password)|passwd|pwd)\=([^\&\s\?\/]*)/ig
  }, {
    name: 'ZIP',
    regex: /(post(al)?[\s]?code|zip[\s]?code|zip)\=([^\&\s\?\/]*)/gi
  }, {
    name: 'ADDRESS',
    regex: /add(ress)?([1-2])?\=([^\&\s\?\/]*)/ig
  }];
}

// Payload Redactor
function _piiRedactor(payload, type) {
  try {
    var checkParams = "dl|dr|dt|dt|en|ep.|up.|uid";
    var UncheckParams = "ep.agency||ep.subagency|ep.site_topic|ep.site_platform|ep.script_source|ep.version|ep.protocol";
    payload = (("object" === typeof payload && /json|default/.test(type))? (_flattenJSON(payload), payload = _objToQuery(payload)): payload);
    _piiRegexReset();
  
    var _allowedQs = _allowedQuerystrings.toString().replace(/\,/g, "=|") + "=";
    var _hitPayloadParts = payload.split('&');
    for (var i = 0; i < _hitPayloadParts.length; i++) {
      var newQueryString = '';
      var _param = _hitPayloadParts[i].split('=');
      var _para = (_param.length>2)?_param.slice(1).join("="):_param[1]; _param.splice(2); _param[1]  = _para;
      var _val;
      try {
        _val = decodeURIComponent(decodeURIComponent(_param[1]));
      } catch (e) {
        _val = decodeURIComponent(_param[1]);
      }

      if (( _param[0].match(new RegExp(checkParams)) != null || /query|json/ig.test(type) ) && _val.indexOf('?') > -1) {
        var paramArray = _val.split('?').splice(1).join('&').split('&');
        var paramSubArray = [];
        // loop through the parameters in the search query string to see if there are sub-parameters, and build the paramSubArray
        for (pa = 0; pa < paramArray.length; pa++) {
          // account for sub-parameters within parameters in the URL
          if (paramArray[pa].indexOf('?') > -1) {
            paramSubArray.push(paramArray[pa].split('?')[1]);
          }
        }
        paramArray = paramArray.concat(paramSubArray);
        // Build a new query string out of all allowed parameters
        for (var ix = 0; ix < paramArray.length; ix++) {
          if (paramArray[ix].toLowerCase().match(new RegExp(_allowedQs)) != null) {
            newQueryString += paramArray[ix] + '&';
          }
        }
        _val = _val.replace(/\?.*/, '?' + newQueryString.replace(/\&$/, ''));
      }

      if (type === 'json') {
        window.piiRegex.push(
        {
          name: 'DOB',
          regex: /(((birth)?date|dob)\=)(19|20)\d\d([\s\.\/\-]|%20)(0?[1-9]|1[012])([\s\.\/\-]|%20)(0?[1-9]|[12][0-9]|3[01])([^\&\s\?\/]*)/ig,
          format: 'YYYY-MM-DD'
        }, {
          name: 'DOB',
          regex: /(((birth)?date|dob)\=)(19|20)\d\d([\s\.\/\-]|%20)(0?[1-9]|[12][0-9]|3[01])([\s\.\/\-]|%20)(0?[1-9]|1[012])([^\&\s\?\/]*)/ig,
          format: 'YYYY-DD-MM'
        }, {
          name: 'DOB',
          regex: /(((birth)?date|dob)\=)(0?[1-9]|[12][0-9]|3[01])([\s\.\/\-]|%20)(0?[1-9]|1[012])([\s\.\/\-]|%20)(19|20)\d\d([^\&\s\?\/]*)/ig,
          format: 'DD-MM-YYYY'
        }, {
          name: 'DOB',
          regex: /(((birth)?date|dob)\=)(0?[1-9]|1[012])([\s\.\/\-]|%20)(0?[1-9]|[12][0-9]|3[01])([\s\.\/\-]|%20)(19|20)\d\d([^\&\s\?\/]*)/ig,
          format: 'MM-DD-YYYY'
        });
      }
      else if (type === 'query' || (type === 'json' && /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/.test(_val))) {
        window.piiRegex.push(
          {
            name: 'TEL',
            regex: /((tel|(tele)?phone|mob(ile)?|cell(ular)?)\=)?((\+\d{1,2}[\s\.\-]?)?\d{3}[\s\.\-]?\d{3}[\s\.\-]?\d{4})([^\&\s\?\/]*)/gi
          }, {
            name: 'SSN',
            regex: /((full)?(([\-\_])?)?ssn\=)?(\d{3}([\s\.\-\+]|%20)?\d{2}([\s\.\-\+]|%20)?\d{4})([^\&\s\?\/]*)/ig
          }, {
          name: 'DOB',
          regex: /(((birth)?date|dob)\=)?(19|20)\d\d([\s\.\/\-]|%20)(0?[1-9]|1[012])([\s\.\/\-]%20)(0?[1-9]|[12][0-9]|3[01])([^\&\s\?\/]*)/ig,
          format: 'YYYY-MM-DD'
        }, {
          name: 'DOB',
          regex: /(((birth)?date|dob)\=)?(19|20)\d\d([\s\.\/\-]|%20)(0?[1-9]|[12][0-9]|3[01])([\s\.\/\-]|%20)(0?[1-9]|1[012])([^\&\s\?\/]*)/ig,
          format: 'YYYY-DD-MM'
        }, {
          name: 'DOB',
          regex: /(((birth)?date|dob)\=)?(0?[1-9]|[12][0-9]|3[01])([\s\.\/\-]|%20)(0?[1-9]|1[012])([\s\.\/\-]|%20)(19|20)\d\d([^\&\s\?\/]*)/ig,
          format: 'DD-MM-YYYY'
        }, {
          name: 'DOB',
          regex: /(((birth)?date|dob)\=)?(0?[1-9]|1[012])([\s\.\/\-]|%20)(0?[1-9]|[12][0-9]|3[01])([\s\.\/\-]%20)(19|20)\d\d([^\&\s\?\/]*)/ig,
          format: 'MM-DD-YYYY'
        });
      }

      if (( _param[0].match(new RegExp(checkParams)) != null && _param[0].match(new RegExp(UncheckParams)) != null ) || /query|json|default/ig.test(type)) {
        piiRegex.forEach(function (pii) {
          _val = _val.replace(pii.regex, '[REDACTED_' + pii.name + ']');
        });
        _param[1] = encodeURIComponent(_val.replace(/\?$/, '')) || _val.replace(/\?$/, '');
        _hitPayloadParts[i] = _param.join('=');
      }
    }
    _piiRegexReset();
    return _hitPayloadParts.join("&");
  } catch (error) {
  }
}
// End Payload Redactor
function _initIdAssigner() {
  for (var a = document.getElementsByTagName("a"), b = 0; b < a.length; b++) {
    var c = a[b].getAttribute("id");
    (null !== c && "" !== c && void 0 !== c) ||
      a[b].setAttribute("id", "anch_" + b);
  }
}

function _initBannerTracker() {
  try {
    var acord = document.querySelector('section.usa-banner button.usa-accordion__button');
    if (acord) {
      acord.addEventListener('click', function (e) {
        gas4("official_usa_site_banner_click", {link_text: e.target.textContent.trim(), section: "header"});
      });
    }

  } catch (error) {

  }
}
// ************ GA4 ************

function _URIHandler(a) {
  var b = new RegExp("([?&])(" + oCONFIG.SEARCH_PARAMS + ")(=[^&]+)", "i");
  b.test(a) && (a = a.replace(b, "$1query$3"), isSearch = a.match(/([?&])(query\=)([^&#?]*)/i)[3] );
  return a;
}

function _scrubbedURL(z) {
  RegExp.escape = function (s) { return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); };
  var n = new RegExp(`^(https?:\\/\\/(www\\.)?)?${RegExp.escape(document.location.hostname.replace(/^www\\./, ""))}`, "ig"),
    t = "",
    o = ((n.test(z)) ? z : document.location.protocol + "//" + document.location.hostname + z).toLowerCase(),
    a = o.split("?")[0],
    r = o.split("?").length > 1
      ? (o
        .split("?")[1]
        .split("&")
        .forEach(function (o, i) {
          _allowedQuerystrings.indexOf(o.split("=")[0]) > -1 && (t = t + "&" + o);
        }),
        t.length > 0 ? a + "?" + _piiRedactor(t.substring(1),"query") : a)
      : a;
  return r;
}

function _setAllowedQS() {
  var queries = {
    "default": ["utm_id", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_source_platform", "utm_creative_format", "utm_marketing_tactic", "gbraid", "wbraid", "_gl", "gclid", "dclid", "gclsrc", "affiliate", "dap-dev-env", "v"],
    "gsa": ["challenge", "state"],
    "dhs": ["appreceiptnum"],
    "doc": ["station", "meas", "start", "atlc", "epac", "cpac", "basin", "fdays", "cone", "tswind120", "gm_track", "50wind120", "hwind120", "mltoa34", "swath", "radii", "wsurge", "key_messages", "inundation", "rainqpf", "ero", "gage", "wfo", "spanish_key_messages", "key_messages", "sid", "lan", "office", "pil"],
    "hhs": ["s_cid", "selectedFacets"],
    "hud": ["PostID"],
    "nasa": ["feature", "ProductID", "selectedFacets"],
    "nps": ["gid", "mapid", "site", "webcam", "id"],
    "nsf": ["meas", "start", "atlc", "epac", "cpac", "basin", "fdays", "cone", "tswind120", "gm_track", "50wind120", "hwind120", "mltoa34", "swath", "radii", "wsurge", "key_messages", "inundation", "rainqpf", "ero", "gage", "wfo", "spanish_key_messages", "key_messages", "sid"],
    "va": ["id"],
    "dod": ["p"],
    "opm": ["l", "soc", "jt", "j", "rmi", "smin", "hp", "g", "d", "a"]
  };
  _allowedQuerystrings = queries.default.concat(queries[oCONFIG.AGENCY.toLowerCase()]).concat(oCONFIG.SEARCH_PARAMS.toLowerCase().split("|"));
}

function _setUpTrackers() {
  //createTracker(!1);
  oCONFIG.ENHANCED_LINK ? _initIdAssigner() : "";
  oCONFIG.AUTOTRACKER ? _initAutoTracker() : "";
  oCONFIG.YOUTUBE ? _initYouTubeTracker() : "";
  _initBannerTracker(); 
}

function _setUpTrackersIfReady() {
  return (("interactive" === document.readyState || "complete" === document.readyState) ? (_setUpTrackers(), !0) : !1);
}
_setUpTrackersIfReady() || (document.addEventListener ? document.addEventListener("DOMContentLoaded", _setUpTrackers) : document.attachEvent && document.attachEvent("onreadystatechange", _setUpTrackersIfReady));
