//添加tab页
function addTab(title, url) {
	if (!$("#tabs").tabs("exists", title)) {
		var iframe="<iframe name=\"mainFrame\"  frameborder=\"0\"  src=" + url + " style=\"width:100%;height:100%;\"></iframe>";
		$("#tabs").tabs("add", {
			title: title,
			content: iframe,
			closable: true,
			width: $("#mainPanle").width() - 10,
			height: $("#mainPanle").height() - 26
		});
	} else {
		$("#tabs").tabs("select", title);
	}
	tabClose();
}

//双击关闭tab页
function tabClose() {
	$(".tabs-inner").on("dblclick",function () {
		var title = $(this).children("span").text();
		$("#tabs").tabs("close", title);
	});

	$(".tabs-inner").bind("contextmenu", function (e) {
		$("#mm").menu("show", {
		   left: e.pageX,
		   top: e.pageY,
		});
		var title = $(this).children("span").text();
		$("#mm").data("currtab", title);
		return false;
	});
}

//绑定右键菜单事件
function closeTab(action)
{
    var alltabs = $("#tabs").tabs("tabs");
    var currentTab =$("#tabs").tabs("getSelected");
    var onlyOpenTitle= currentTab.panel("options").title;
	var allTabtitle = [];
    $.each(alltabs,function(i,n){
        allTabtitle.push($(n).panel("options").title);
    });

    switch (action) {
        //刷新
		case "refresh":
            var iframe = $(currentTab.panel("options").content);
            var src = iframe.attr("src");
            $("#tabs").tabs("update", {
                tab: currentTab,
                options: {
                    content: createFrame(src)
                }
            })
            break;
		//关闭当前
        case "close":
            var currtab_title = currentTab.panel("options").title;
            $("#tabs").tabs("close", currtab_title);
            break;
        //关闭全部
		case "closeall":
            $.each(allTabtitle, function (i, n) {
                if (n != onlyOpenTitle){
                    $("#tabs").tabs("close", n);
                }
            });
            break;
		//关闭除些之外的全部
        case "closeother":
            var currtab_title = currentTab.panel("options").title;
            $.each(allTabtitle, function (i, n) {
                if (n != currtab_title && n != onlyOpenTitle)
                {
                    $("#tabs").tabs("close", n);
                }
            });
            break;
		//当前页右侧全部关闭
        case "closeright":
            var tabIndex = $("#tabs").tabs("getTabIndex", currentTab);
            if (tabIndex == alltabs.length - 1){
                return false;
            }
            $.each(allTabtitle, function (i, n) {
                if (i > tabIndex) {
                    if (n != onlyOpenTitle){
                        $("#tabs").tabs("close", n);
                    }
                }
            });
            break;
		//当前页左侧全部关闭
        case "closeleft":
            var tabIndex = $("#tabs").tabs("getTabIndex", currentTab);
            if (tabIndex == 1) {
                return false;
            }
            $.each(allTabtitle, function (i, n) {
                if (i < tabIndex) {
                    if (n != onlyOpenTitle){
                        $("#tabs").tabs("close", n);
                    }
                }
            });
            break;
		//退出
        case "exit":
            $("#closeMenu").menu("hide");
            break;
    }
}

function tabCloseEven() {
    $("#mm").menu({
        onClick: function (item) {
            closeTab(item.id);
        }
    });
    return false;
}


/*
    该方法仅用于嵌入框架用
    @title:打开窗体的title
    @src:源文件的地址
    @options:window参数
*/
function openWindow(title, src, options) {
	var initPms = {
		zIndex: 9999,
		title: title,
		width: 750,
		height: 625,
		collapsible: false,
		minimizable: false,
		maximizable: true,
		draggable: true,
		shadow: true,
		modal: true,
		resizable: true,
		scrolling: false,
		onClose: function () {
			closeWindow();
		}
	};
	var pms = $.extend({}, initPms, options);
	var winData = $(window).data("winData");
	var num = 0;
	if (pms.fullScreen) {
		pms.width = $(window).width() - 200;
		pms.height = $(window).height() - 60;
	}
	if (winData) {
		num = winData.length;
	} else {
		winData = [];
	}
	var winId = "window" + new Date().getTime();
	var d = new Date();
	if (src.indexOf("?") > 0) {
		src += "&t=" + escape(d.getTime());
	} else {
		src += "?t=" + escape(d.getTime());
	}
	var w = $("<div id='" + winId + "' style='overflow:hidden;'></div>");
	var loading = $("<div class='open-window-loading'>正在处理，请稍候。。。</div>");
	w.append(loading);
	winData.push(w);
	$(window).data("winData", winData);
	w.window(pms);
	w.append("<iframe name='ifr" + winId + "' frameborder=\"0\" width=\"100%\" " + (pms.scrolling ? "" : "scrolling=\"no\"") + " height=\"100%\" src='" + src + "'></iframe>");
	//loading居中显示
	var top = 0, left = 0;
	left = (pms.width - loading.width()) / 2;
	top = (pms.height - loading.height()) / 2;
	loading.css({ top: top, left: left });
	//隐藏loading
	w.find("iframe").load(function () {
		$(this).prev().hide();
	});
}
/*
    关闭窗口
*/
function closeWindow(index) {
	var winData = $(window).data("winData");
	if (winData) {
		if (index != undefined) {
			winData[index].window("destroy");
			winData.splice(index, 1);
		} else {
			winData[winData.length - 1].window("destroy");
			winData.splice(winData.length - 1, 1);
		}
		$(window).data("winData", winData);
	}
}


/// <summary>创建编辑器</summary>
/// <param name="id" type="String">编辑器id</param>
/// <param name="full" type="Boolean">是否高级版本</param>
function createEditor(id, full) {
	var options = { wordCount: false, initialFrameWidth: 750, initialContent: '', autoHeightEnabled: false, filePath: "", enterTag: "br" };
	if (full) {
		options.toolbars = [['fullscreen', 'source', '|', 'undo', 'redo', '|',
				'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
				'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
				'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
				'directionalityltr', 'directionalityrtl', 'indent', '|',
				'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
				'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
				'ecimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'highlightcode', 'pagebreak', 'template', '|',
				'horizontal', 'date', 'time', 'spechars', '|',
				'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
				'preview', 'searchreplace']];
	} else {
		options.initialFrameWidth = '100%';
		options.toolbars = [['FullScreen', 'Source', 'Undo', 'Redo', 'Bold', 'fontfamily', 'fontsize', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'removeformat'
						, 'inserttable', 'deletetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'ecimage', 'attachment']];
	}
	return UE.getEditor(id, options);
}

$(document).ready(function(){
	//左侧菜单操作
	$(".easyui-accordion li a").on("click",function () {
		$(".easyui-accordion li").removeClass("selected");
		$(this).parent().addClass("selected");

	}).hover(function () {
		$(this).parent().addClass("hover");
	}, function () {
		$(this).parent().removeClass("hover");
	});
	
	//tab右键方法
	tabCloseEven();
	
});



