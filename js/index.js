var isEmpty = function(str){
    return str==null || str=="" || str=="null" || str == "NULL" || typeof(str)=="undefined" || typeof(str) == "null";
};

var Val={
		//验证是否为手机号码
		isMobile:function(s){return this.test(s,/^1[34578]\d{9}$/)},  
		isNumber:function(s,d){return !isNaN(s.nodeType==1?s.value:s)&&(!d||!this.test(s,"^-?[0-9]*\\.[0-9]*$"))},
		isAddress:function(a){return this.test(a,/^[\u4e00-\u9fa5]/)},
		isEmpty:function(s){return !jQuery.isEmptyObject(s)},test:function(s,p){s=s.nodeType==1?s.value:s;return new RegExp(p).test(s)}
	};

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

//1实物，2虚拟
var jpType = 0;
var update = 0;


function info(content){
	layer.open({
	    content: content
	    ,btn: '确定'
	    ,shadeClose: false
	});
}

$(document).ready(function(){	
	var data = {};
	data.devid = getrequest("devid");
	data.actid = getrequest("actid");
	data.version = getrequest("version");
	data.pid = getrequest("id");
	queryUserInfo(data);
	
	$(".users").blur(function(){
		var uname = $(".users").val();
		if(1== jpType && isEmpty(uname)){
			$(".username_error").text("用户姓名不能为空");
		}else{
			$(".username_error").text("");
		}
	});
	
	$(".tel").blur(function(){
		var tel = $(".tel").val();
		if(1 == jpType && (isEmpty(tel) || !Val.isMobile(tel))){
			$(".phone_error").text("联系电话为空，或者非法");
		}else{
			$(".phone_error").text("");
		}
	});
	
	$(".addr").blur(function(){
		var addr = $(".addr").val();
		if(1 == jpType && (isEmpty(addr) || !Val.isAddress(addr))){
			$(".address_error").text("地址为空，或者非法");
		}else{
			$(".address_error").text("");
		}
	});
	
	$(".qqText2").blur(function(){
		var qq = $(".qqText2").val();
		if(2 == jpType){
			if(isEmpty(qq)){
				$(".qq_error2").text("QQ为空");
			}
			else if(!Val.isNumber(qq)){
				$(".qq_error2").text("QQ格式不正确");
			}
		}else{
			$(".qq_error2").text("");
		}
	});
});

var global_qq = '';
var global_tel = '';
var global_uname = '';
var global_addr = '';
function queryUserInfo(data){
	var devid=data.devid;
	var actid=data.actid;
	var luckyid=data.pid;
	$.ajax({
		type:"POST",
		dataType:"json",
		url:"/lucky/play/queryUserInfo.action",
		contentType : "application/json; charset=UTF-8",
		sync : false,
		data : JSON.stringify(data),
		success:function(json){
		 var code = json.code;
		 if(1 == code){
			 var data = json.data;
			 jpType = data.type;
			 update = data.update;
			 if(2 == jpType){
				$("#container_uname").css("display","none");
				//$("#container_tel").css("display","none");
				$("#container_addr").css("display","none");
				
				global_qq = data.qq;
				global_tel = data.phone;
				
				$(".qqText2").val(isEmpty(global_qq) ? "" : global_qq);
				$(".tel").val(isEmpty(global_tel) ? "" : global_tel);
				
				
				$("#tips").html("提示：您本次活动中奖的所有虚拟奖品将会统一充值到填写的QQ账号上，请确保账号的准确性");
			 }
			 else if(1 == jpType){
				$("#container_qq").css("display","none");
				
				global_uname = data.name;
				global_addr = data.address;
				global_tel = data.phone;
				
				$(".users").val(isEmpty(global_uname) ? "" : global_uname);
		        $(".tel").val(isEmpty(global_tel) ? "" : global_tel);
		        $(".addr").val(isEmpty(global_addr) ? "" : global_addr);
		        $("#tips").html("提示：您本次活动中奖的所有实物奖品将会统一发往填写的地址，请确保联系方式的准确性。");
			 }
			 else if(4 == jpType){
					location.href='/lucky/20190813-1.0/index-1.html?devid='+devid+"&actid="+actid+"&luckyid="+data.pid;
			 }else if(6== jpType){
				 $("#container_uname").css("display","none");
				 $("#container_addr").css("display","none");
				 $("#container_qq").css("display","none");
				 $(".tel").val(isEmpty(data.phone) ? "" : data.phone);
			 }
		 }
		 $(".submit").text("提交");
		 $(".submit").removeAttr("disabled");
		}
	});
}

function submit(){
	if(jpType == 1 && (update == 120 || update == 122)){
		info("最多只能修改一次联系方式");
		return;
	}
	else if(jpType == 2 && (update == 102 || update == 122)){
		info("最多只能修改一次联系方式");
		return;
	}
	var ischange = true;
	var check = true;
	var uname = $(".users").val();
	var tel = $(".tel").val();
	var addr = $(".addr").val();
	var qq = $(".qqText2").val();
	if(1 == jpType){
		if(isEmpty(uname)){
			$(".username_error").text("用户姓名不能为空");
			check = false;
		}
		else if(isEmpty(tel) || !Val.isMobile(tel)){
			$(".phone_error").text("联系电话为空，或者非法");
			check = false;
		}
		else if(isEmpty(addr) || !Val.isAddress(addr)){
			$(".address_error").text("地址为空，或者非法");
			check = false;
		}
		
		if(global_tel == tel && global_uname == uname && global_addr == addr){
			ischange = false;
		}
	}
	else if(2 == jpType){
		if(isEmpty(qq)){
			$(".qq_error2").text("QQ号不能为空");
			check = false;
		}
		else if(!Val.isNumber(qq)){
			$(".qq_error2").text("QQ号格式不正确");
			check = false;
		}
		else if(isEmpty(tel) || !Val.isMobile(tel)){
			$(".phone_error").text("联系电话为空，或者非法");
			check = false;
		}
		
		if(global_tel == tel && global_qq == qq){
			ischange = false;
		}
	}
	else if(4 == jpType){
		if(isEmpty(tel) || !Val.isMobile(tel)){
			$(".phone_error").text("联系电话为空，或者非法");
			check = false;
		}
	}
	
	if(!ischange && update>100){
		info("您没有修改任何信息");
		return;
	}
	
	if(check){
		var data = {};
		data.devid=getrequest("devid");
		data.version = getrequest("version");
		data.name=uname;
		data.phone=tel;
		data.qq=qq;
		
		data.actid = getrequest("actid");
		data.address=addr;
		data.ptype = jpType;
		$.ajax({
		   	type:"POST",
		   	dataType:"json",
		   	url:"/lucky/play/submit.action",
		   	contentType : "application/json; charset=UTF-8",
		   	sync : false,
		   	data : JSON.stringify(data),
		   	success: function (json) {
		           var code = json.code;
		           if(code == 1){
		        	   location.href = "./success.html?update="+json.update;
		           }else if(code == 2){
		        	   info("用户不存在");
		           }
		 	}
		});
	}
}