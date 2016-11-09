var $, jQuery;
var $ = require('ep_etherpad-lite/static/js/rjquery').$;

var postAceInit = function(hook_name, context){

	$(document).ready(function() {

		$("#chaticon").hide();
		$("#titlecross").hide();
		$("#titlesticky").hide();

		$("#users").show();

		var t = '<div id="poweredByConnect"><span class="pbcd"></span>Powered by <strong>Dataporten</strong></div>';

		$("ul.menu_left").append(t); // .append(t2);


	});


}




exports.postAceInit = postAceInit;




