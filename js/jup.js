
var JUP = (typeof JUP == "undefined") ? {} : JUP;

JUP.toHTML = function(structure) {

	function isArray(obj) {
	    return obj.constructor == Array;					
	}
	
	function isObject(obj) {
	    return obj.constructor == Object;					
	}					
	
	function isString(s) {
		return s.constructor == String;
	}
	
	var markup = [];
	var attributes = [];
	var selfClosing = false;
	
	var resolve = function(val) {
		
		var tag = null;
		

		for(var i=0; i < val.length; i++) {

			if(isString(val)) { // this must be a value
				markup.push(val);								
				break;
			}

			if(isString(val[i]) && i == 0) { // this must be a tag, its in the first position								

				switch(val[i]) {
					case "area":
					case "base":
					case "basefont":
					case "br":
					case "hr":
					case "input":
					case "img":
					case "link":
					case "meta":
						selfClosing = true;
					break;
				}

				// check to see if this array has any objects in it (check for attributes).
				for(var j=0; j < val.length-1; j++) {

					if(isObject(val[j])) { // this must be an attribute object

						var a = val[j]; 

						for (var v in a) {
							attributes.push(" " + v + "='" + a[v] + "'");
						}
					}								
				}
				
				var close = selfClosing ? "/" : "";
				
				if(attributes.length > 0) {
					markup.push("<" + val[i] + attributes.join("") + close + ">");
					attributes = [];
					tag = val[i];
					continue;
				}
				
				markup.push("<" + val[i] + close +">");
				tag = val[i];					
				continue;
			}
			
			resolve(val[i]); // this must be a child.

			if(i == val.length-1 && tag !== null && !selfClosing)
			markup.push("</" + tag + ">");

		}
	};

	resolve(structure);
	return markup.join("");
};
