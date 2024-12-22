/* 드롭다운 페이드인 */
jQuery('.dropdown').on('show.bs.dropdown', function(e) {
    jQuery(this).find('.dropdown-menu').first().stop(true, true).fadeToggle(200);
});

jQuery('.dropdown').on('hide.bs.dropdown', function(e) {
    jQuery(this).find('.dropdown-menu').first().stop(true, true).fadeToggle(200);
});

jQuery('.btn-group').on('show.bs.dropdown', function(e) {
    jQuery(this).find('.dropdown-menu').first().stop(true, true).fadeToggle(200);
});

jQuery('.btn-group').on('hide.bs.dropdown', function(e) {
    jQuery(this).find('.dropdown-menu').first().stop(true, true).fadeToggle(200);
});
/* 드롭다운 페이드인 End */

/* 문단 왼쪽에 접힘 여부를 알려주는 화살표 추가 */
$(".wiki-heading").each(function () {
    // NOTE : 처음 모든 문단을 접는 설정은 리버티 스킨에 없기 때문에 고려하지 않음.
    $(this).prepend('<a class="wiki-heading-arrow"><i class="fa fa-chevron-down"></i></a> ')
        .find(".wiki-heading-arrow")
        .click(function (e) {
            e.preventDefault();
        });
})

$(".wiki-heading").click(function (e) {
    if (e.target.tagName === 'A') return;
    var paragraph = $(this).next();
    if (paragraph.is(':visible')) {
        $(this).find(".wiki-heading-arrow i").addClass("fa-chevron-down").removeClass("fa-chevron-up")
    } else {
        $(this).find(".wiki-heading-arrow i").addClass("fa-chevron-up").removeClass("fa-chevron-down")
    }
});
/* 문단 왼쪽에 접힘 여부를 알려주는 화살표 추가  END*/
if (pathname.indexOf("/w/") === 0) {
    if (hideopt1) $article.find("#wikiNoCategoryAlert").hide();
    $(".liberty").on("click", ".wiki-article #wikiNoCategoryAlert .close", function (event) {
        namu.setValue("hide_wikiNoCategoryAlert", true);
    });
    $(".liberty .wiki-article .alert:last").addClass("last");
} else if (pathname.indexOf("/history/") == 0) {
    if (hideopt2) $article.find("#historyForkSourceAlert").hide();

    $(".liberty").on("click", ".wiki-article #historyForkSourceAlert .close", function (event) {
        namu.setValue("hide_historyForkSourceAlert", true);
    });
} else if (pathname.indexOf("/login") == 0) {
    var $redirect = $article.find(".login-form input[name=redirect]");
    if (!$redirect.val()) $redirect.val(namu.pastURL.pathname);
} else if (pathname.indexOf("/settings") === 0) {
    setSettingsMenu();

    $(".liberty").on("change", ".settings-section .setting-item", function (event) {
        var val = getSettingValueFromTag($(this));

        var key = $(this).attr("data-key");
        namu.userSettings[key] = val;

        namu.saveUserSettings();
        preApplyLayoutCustom();
        postApplyLayoutCustom();
        applyUserCustom();
    });

    $(".liberty").on("click", ".settings-section #removeHelpAlertHide", function (event) {
        namu.setValue("hide_wikiNoCategoryAlert", false);
        namu.setValue("hide_historyForkSourceAlert", false);
        namu.setValue("hide_userDiscussAlert", false);
        alert("OK.");
    });

    $(".liberty").on("click", ".settings-section #removeAllSettings", function (event) {
        localStorage.setItem("namu.user_settings", "{}");
        namu.loadUserSettings();
        setSettingsMenu();
        alert("OK.");
    });

    if (namu.isMobile()) {
        $(".liberty .settings-section #fixedBody").hide();
        $(".liberty .settings-section #hideSidebar").hide();
        $(".liberty .settings-section #leftSidebar").hide();

        if (!namu.userSettings['footnote_type'] && namu.isMobile()) {
            var $fnSelect = $(".setting-item[data-key='footnote_type']");

            $fnSelect.children("option").removeAttr("selected");
            $fnSelect.children("option[value='popup']").attr("selected", true);

            $fnSelect.val('popup');
            $fnSelect.change();
        }
    }
}

if ($article.has(".site-notice").length) {
    $sidebar.addClass("has-site-notice");
} else {
    $sidebar.removeClass("has-site-notice");
}

applyUserCustom();

if (window.localStorage) {
    if (localStorage.getItem("namu.fork_alert") === null) {
        $("#fork-alert").show();
        $("#fork-alert-close").click(function () {
            $('#fork-alert').hide();
            localStorage.setItem("namu.fork_alert", true);
        });
    }
}

$("time").each(function () {
    var format = $(this).attr("data-format");
    var time = $(this).attr("datetime");
    if (!format || !time) return;
    $(this).text(formatDate(new Date(time), format));
});

$(".liberty .wiki-article code.syntax").each(function () {
    var $syntax = $(this);
    var $syntaxPre = $syntax.parent();

    $syntaxPre.wrap("<div class=\"syntax-wrapper\">");

    var $wrapper = $syntaxPre.parent();
    var $lines = $("<pre class=\"syntax-lines\">");

    $wrapper.prepend($lines);

    var lineCount = $syntax.text().split("\n").length;

    var lineStr = "";
    for (var i = 1; i <= lineCount; i++) {
        lineStr += i + ".\n";
    }
    $lines.text(lineStr);
});
if (namu.userSettings['hide_heading_content']) {
    $("div.wiki-heading-content").hide();
    $(".wiki-heading").addClass('wiki-heading-content-folded');
}
$(".wiki-heading").click(function () {
    var t = $(this);
    if (!t.next().is(':visible')) t.addClass('wiki-heading-content-folded');
    else t.removeClass('wiki-heading-content-folded');
});

if (namu.userSettings['show_folding']) {
    $("dl.wiki-folding dd").show();
}
$('[data-toggle="tooltip"]').tooltip();
}

function docEncode(title) {
if (title === '..') return '..%20';
if (title === '.') return '.%20';
return encodeURIComponent(title).replace(/%2F/g, '/');
}

function pjaxCall(url) {
if ($.support.pjax && 0) {
    $.pjax({
        url: url,
        container: ".liberty .wiki-article"
    });
} else {
    location.href = url;
}
}

function applyPJAX() {
return;
$.pjax.defaults.timeout = 0;
if (isMSIE()) $.pjax.defaults.cache = false;
$(document).on(
    "click",
    ".liberty a:not(" +
        "[data-npjax]," +
        ".wiki-link-external" +
        ")",
    function (event) {
        $.pjax.click(event, { container: ".liberty .wiki-article" });
    });

NProgress.configure({ showSpinner: false });

$(document).on('pjax:beforeSend', function () {
    namu.pastURL.href = document.location;
});

$(document).on('pjax:beforeReplace', function () {
    beforePageLoad();
});

$(document).on('pjax:send', function () {
    NProgress.start();
});

$(document).on('pjax:end', function () {
    namu.currentURL.href = document.location;
    NProgress.done();
    onPageLoad();
});
}

function applyPopoverFootnote() {
$(".liberty").on("click", ".popover .popover-title .close", function (event) {
    var $p = $(this).parent().parent(), $l = $("a[aria-describedby=\"" + $p.attr("id") + "\"]");
    $l.popover('hide');
    $(".liberty").focus();
    return false;
});

$(".liberty .wiki-article .wiki-fn-content").each(function (item) {
    var target = $(this).attr('href');
    target = target.replace("#", "");

    var $tmp = $("span[class=target][id=\"" + target + "\"]").parent().clone();
    $tmp.children("span[class=target]").remove();
    $tmp.children("a[href^='#rfn-']").remove();

    if (namu.isMobile()) {
        $(this).attr("href", "#");
    }
    $(this).attr("title", "");

    var close_html = '<a class="close" href="#">&times;</a>';

    $(this).popover({
        animation: false,
        container: ".wiki-article",
        trigger: (namu.isMobile() ? "focus" : "focus hover"),
        title: "각주: " + $(this).text() + (namu.isMobile() ? close_html : ""),
        content: $tmp.html(),
        html: true,
        placement: "top",
        template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });

    $(this).on('shown.bs.popover', function () {
        var po_id = $(this).attr("aria-describedby");
        if (!po_id) { return; }

        var $po = $("div#" + po_id + ".popover"),
            $arrow = $po.children(".popover-arrow"),
            $win = $("body");

        var t_of = $(this).offset(),
            t_w = this.offsetWidth;

        var tr = $po.css("transform"),
            tr_a = tr.match(/matrix\((.+)\)/)[1].split(', ');

        if (parseInt(tr_a[4]) < 15) {
            tr_a[4] = t_of.left + (t_w / 2) - 14;

            $po.css("transform", "matrix(" + tr_a.join(', ') + ")");
            $arrow.css("left", "14px");
        } else if (parseInt(tr_a[4]) + parseInt($po.width()) > parseInt($win.width())) {
            tr_a[4] = t_of.left - $po.width() + (t_w / 2) + 14;

            $po.css("transform", "matrix(" + tr_a.join(', ') + ")");
            $arrow.css("left", "auto");
            $arrow.css("right", "7px");
        }
    });

    if (namu.isMobile()) {
        $(this).click(function (event) {
            $(this).focus();
            event.preventDefault();
            return false;
        });
    }
});
}

function applyPopupFootnote() {
$(".liberty .wiki-article .wiki-fn-content").click(function () {
    var target = $(this).attr('href');
    target = target.replace("#", "");

    var $tmp = $("span[class=target][id=\"" + target + "\"]").parent().clone();
    $tmp.children("span[class=target]").remove();
    $tmp.children("a[href^='#rfn-']").remove();

    var close_html = '<a class="close" href="#">&times;</a>';

    var pop = window.open("", "wiki_fn", "menubar=no, status=no, toolbar=no, location=no, resizable=yes, height=300, width=600");
    pop.document.write('<html><head><title>각주: ' + $(this).text() + '</title><style>body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; } a.close { display: block; text-align: right; text-decoration: none; color: #000; }</style></head><body><a href="#" class="close" onclick="window.close(); return false;">&times;</a><p>' + $tmp.html() + '</p></body></html>');
    pop.document.close();
    pop.focus();
    return false;
});
}

function applyUserCustom() {
if (namu.userSettings['custom_css']) {
    var $css = $("<style id='user-custom-css' type='text/css'>").text(namu.userSettings['custom_css']);
    $("head").append($css);
}

if (namu.userSettings['custom_js']) {
    try {
        eval(namu.userSettings['custom_js']);
    } catch (e) { }
}
}
