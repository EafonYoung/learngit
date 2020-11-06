function getrequest(strParame) { 
	var args = new Object( ); 
	var query = location.search.substring(1); 

	var pairs = query.split("&"); // Break at ampersand 
	for(var i = 0; i < pairs.length; i++) { 
	var pos = pairs[i].indexOf('='); 
	if (pos == -1) continue; 
	var argname = pairs[i].substring(0,pos); 
	var value = pairs[i].substring(pos+1); 
	value = decodeURIComponent(unescape(value));
	args[argname] = value; 
	} 
	return args[strParame]; 
}

$(document).ready(function(){
	var data = {};
	data.devid = getrequest("devid");
	data.actid = getrequest("actid");
	data.luckyid = getrequest("luckyid");
	$.ajax({
		type:"POST",
		dataType:"json",
		url:"/lucky/play/getExchangeNum.action",
		contentType : "application/json; charset=UTF-8",
		sync : false,
		data : JSON.stringify(data),
		success:function(json){
			if(1==json.code){
				$("#redeemCode").attr("data-clipboard-text", json.num);
				$("#v_number").html(json.num);
			}
		}
	});
});