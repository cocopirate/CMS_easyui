//打开一个窗口
function windowOpen(obj){
	var searchStr=obj.substring(1,obj.length);
	if(searchStr=='advanced-search' || searchStr=='advanced-search2'){
		advancedSearchInit(obj);
	}
	$(obj).window('open');
}

//关闭一个窗口
function windowClose(obj){
	if(!obj){
		obj='#advanced-search';
	}
	$(obj).window('close');
}

//创建搜索条件
function createSearchItems(dataTable,obj){
	var html=[];
	html.push('<div class="search-items"><span class="search-items-current">当前搜索条件（<em onclick="clearSearchItems(this)">清空</em>）</span><ul>');
	html.push('<li><span>品牌不包含：<strong>金龙鱼</strong></span><a href="javascript:;" class="search-item-delete" onclick="deleteSearchItem(this)"></a></li>');
	html.push('<li><span>品牌不包含：<strong>金龙鱼</strong></span><a href="javascript:;" class="search-item-delete" onclick="deleteSearchItem(this)"></a></li>');
	html.push('<li><span>品牌不包含：<strong>金龙鱼</strong></span><a href="javascript:;" class="search-item-delete" onclick="deleteSearchItem(this)"></a></li>');
	html.push('<li><span>品牌不包含：<strong>金龙鱼</strong></span><a href="javascript:;" class="search-item-delete" onclick="deleteSearchItem(this)"></a></li>');
	html.push('<li><span>品牌不包含：<strong>金龙鱼</strong></span><a href="javascript:;" class="search-item-delete" onclick="deleteSearchItem(this)"></a></li>');
	html.push('</ul></div>');
	//添加到list页面
	$(dataTable).parent().prev('.toolbar').append(html.join(''));
	$(dataTable).datagrid('reload');
	//关闭弹出框
	windowClose(obj);
}

//清空搜索条件
function clearSearchItems(obj){
	$(obj).parent().parent().hide();
	$(obj).parents('.toolbar').next().children('.datagrid-f').datagrid('reload');
}

//删除条件项
function deleteSearchItem(obj){
	console.log($('.search-items li').length);
	if($('.search-items li').length==1){
		$(obj).parents('.search-items').hide();
		$(obj).parents('.toolbar').next().children('.datagrid-f').datagrid('reload');
	}else{
		$(obj).parent().remove();
	}
}

//高级搜索页面初始高度计算
function getSearchH(){
	var h=$('.advanced-search').parent().height();
	$('.advanced-search').height(h-60);
}

function advancedSearchInit(obj){
	var w=$('body').width();
	var h=$('body').height();
	$(obj).window({
		title: '高级搜索',
		width:700,
		height:400,
		closed: true,
		resizable:false,
		collapsible: false,
		minimizable: false,
		maximizable: false,
		closable: true,
		modal: true,
		left:(w-720)/2,
		top:(h-400)/2
	});
}


//窗口改变大小tab宽度变化(左右tab形式)
function resizeTab(obj){
	var h=$('body').height();
	if($('.tabs-wrap').length>0){
		var w=$('body').width();
		$('.r-tabs, .tabs-wrap').height(h);
		$('.r-tabs').width(w-150);
		$('.tabs-panels-left').width(w-150);
		$(obj).datagrid({
			width:w-150,
			height:h
		}); 
	}
}

//内容页初始度计算
function getH(obj,paddingH){
	var h=$('body').height();
	$(obj).height(h-parseInt(paddingH));
}



