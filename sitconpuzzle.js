/* Additional Code for SITCON puzzle */
used = {
	'operator': {
		"+" : 0,
		"-" : 0,
		"*" : 0,
		"/" : 0,
		"=" : 0,
		"==" : 0,
		"!=" : 0,
		">" : 0,
		"<" : 0
	},
	'keyword': {
		'while': 0,
		'if': 0
	},
	'number': {

	},
	'variable': {

	}
}

function parse(){
	//Do the styling
	//$('textarea').hide();
	//$('code').html($('textarea').val()).show();
	used = {
		'operator': {
			"+" : 0,
			"-" : 0,
			"*" : 0,
			"/" : 0,
			"=" : 0,
			"==" : 0,
			"!=" : 0,
			">" : 0,
			"<" : 0
		},
		'keyword': {
			'while': 0,
			'if': 0
		},
		'number': {

		},
		'variable': {

		}
	}
	Prism.highlightAll();
	calculate_used_variable();
	handle_negative_number();

	console.table(used);

	render_table();
}

function handle_negative_number(){
	$('.operator').each(function(){
		if($(this).text().trim() == '-' && $(this).next().hasClass('number')){
			var curdom = this;
			while(curdom != curdom.parentNode.firstElementChild){ //check if is the first child
				if($.trim(curdom.previousSibling.textContent) != ''){ //Check if is empty
					if($.trim(curdom.previousSibling.textContent) == "="
						|| $.trim(curdom.previousSibling.textContent) == "["
						|| $.trim(curdom.previousSibling.textContent) == "("
						|| $.trim(curdom.previousSibling.textContent) == ","){ // Check if is negative number
						
						used['number'][$(this).next().text()] --;
						if('-' + $(this).next().text() in used['number']){
							used['number']['-' + $(this).next().text()] ++;
						}else{
							used['number']['-' + $(this).next().text()] = 1;
						}

						used['operator']['-']--;

						$(this).next().text('-' + $(this).next().text());

						$(this).remove();
					}

					break;
				}else{
					curdom = curdom.previousSibling;
				}
			}
		}
	});
}

function calculate_used(content, type){
	if(type != 'operator' && type != 'keyword' && type != 'number')
		return false;

	if(typeof type == 'object'){
		type = type[0];
	}

	if(content in used[type]){
		//console.log(content + '' + type + ' is found');
		used[type][content]++;
	}else{
		//console.log(content + '' + type + ' is not found');

		if(type == 'number'){
			used[type][content] = 1;
		}
	}
}

function calculate_used_variable(){
	$('code').contents().filter(function() { return this.nodeType == 3; }).each(function(){
		if($(this).text().trim() != '' && $(this).next().text().trim() != '(' ){
			$(this).text().trim().split("\n").forEach(function(element) {
				//if(blacklist.indexOf(element.trim()) > -1)
				//	return;

				if(element.trim() in used['variable']){
					used['variable'][element.trim()]++;
				}else{
					used['variable'][element.trim()] = 1;
				}
			});
		}
	});
}

function render_table(){
	$('table').empty();
	for (var key in used['operator']) {
		if (used['operator'].hasOwnProperty(key) && used['operator'][key] > 0) {
			$('[data-cat=operator]').append('<tr><td>'+key+'</td><td><b>'+used['operator'][key]+'</b></td></tr>');
		}
	}
	for (var key in used['keyword']) {
		if (used['keyword'].hasOwnProperty(key) && used['keyword'][key] > 0) {
			$('[data-cat=keyword]').append('<tr><td>'+key+'</td><td><b>'+used['keyword'][key]+'</b></td></tr>');
		}
	}

	var number_total=0;
	for (var key in used['number']) {
		if (used['number'].hasOwnProperty(key) && used['number'][key] > 0) {
			$('[data-cat=number]').append('<tr><td>'+key+'</td><td><b>'+used['number'][key]+'</b></td></tr>');
			number_total ++;
		}
	}
	//$('[data-cat=number]').append('<tr class="active"><td>Total</td><td><b>'+number_total+'</b></td></tr>');
	if(number_total > 0){
		$('[data-cat=number]').append('<tr class="active"><td>Total</td><td><b>1</b>（一張常數可用無限多次）</td></tr>');
	}else{
		$('[data-cat=number]').append('<tr class="active"><td>Total</td><td><b>0</b></td></tr>');
	}

	var variable_total=0;
	for (var key in used['variable']) {
		if (used['variable'].hasOwnProperty(key) && used['variable'][key] > 0) {
			$('[data-cat=variable]').append('<tr><td>'+key+'</td><td><b>'+used['variable'][key]+'</b></td></tr>');
			variable_total ++;
		}
	}
	$('[data-cat=variable]').append('<tr class="active"><td>Total</td><td><b>'+variable_total+'</b></td></tr>');
}
function loaddata(){
	if(window.localStorage["data"]){
		$('#editor').text(window.localStorage["data"]);
	}
}
function savedata(code){
	window.localStorage["data"] = code;
}