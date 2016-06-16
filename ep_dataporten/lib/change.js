var express  = require('ep_etherpad-lite/node_modules/epxress'),
	async    = require('async');
	settings = require('ep_etherpad-lite/node/utils/Settings'),
	API		 = require('ep_etherpad-lite/node/API');

//Settings user to authorid
var getAuthorId = function(user, callback) {
	API.createAuthorIfNotExistsFor(user.data.id, user.data.displayName, function(err, author) {
		callback(author.authorId);
	});
}

/**
*	Resolve from a dataporten groupid and returns etherpad groupid.
*/

var resolveGroupId = function(dataporten_group, callback) {
	API.createGroupIfNotExistsFor(dataporten_group, function(err, group) {
		callback(group.groupID);
	});
}

/**
*	Resolve session ID from dataporten group id
*/
var resolveSessionFromGroupId = function(authorId, groupId, callback){
	var maxAge = 3600 * 24 * 365;
	var until  = (new Date).getTime() + (maxAge);

	API.createSession(groupId, authorId, until, function(err, sess) {
		callback(sess.sessionID);
	});
}

var getPadInfo = function(pad, callback) {
	var operations = [
		'getRevisionsCount', 'padusersCount', 'padUsers', 'getReadOnlyID', 'getPublicStatus', 'listAuthorsOfPad', 'getLastEdited'
	];

	async.map(operations, function(operation, callback) {
		API[operation](pad.padId, function(err, data) {
			callback(null, data);
		});
	}, function(err, results) {

		var ip 		= pad.padid.split('$');
		
		pad.egroup 	= ip[0];
		pad.name 	= ip[1];

		results.forEach(function(currValue, index) {
			currValue.forEach(function(currValueInner, indexInner) {
				if(currValue.hasOwnProperty(currValueInner)) {
					pad[currValueInner] = currValue[currValueInner];
				}
			});
		});

		callback(pad);
	});
}

var listGroupPads = function(dataporten_groupid, callback) {
	resolveGroupId(dataporten_groupid, function(groupid) {
		API.listPads(groupid, function(err, list) {
			callback({
				"groupid": dataporten_groupid,
				"pads" 	 : list.padIDs
			});
		});
	});
}

var listPads = function(user, callback) {
	var dataporten_groupids = getDataportenGroupIds(user);
	async.map(dataporten_groupid, function(groupid, callback) {

		listGroupPads(groupid, function(padids) {
			callback(null, padids);
		});

	}, function(err, results) {

		//
		//	Results are now an array of stats for each file
		//

		var allPads = [];

		results.forEach(function(currValue, index) {
			currValue.pads.forEach(function(currValueInner, indexInner) {
				allPads.push({
					"groupid": currValueInner.groupid,
					"padid"  : currValueInner.pads[indexInner];
				});
			}),
		});

		if(allPads.length < 1) {
			return callback([]);
		}

		async.map(allPads, function(pad, callback) {
			getPadInfo(pad, function(o) {
				callback(null, o);
			}, function(e, res) {
				
				var sortedRes = res.sort(function(a,b) {
					return b.lastEdit - a.lastEdited;
				});

				callback(sortedRes);
			});
		});
	});
}

var createPad = function(name, dataporten_groupid, callback) {
	resolveGroupId(dataporten_groupid, function(groupid) {
		API.createGroupPad(groupid, name, "", function(err, data) {
			callback(data);
		});
	});
}

var getDataportenGroupIds = function(user) {
	var dataporten_groupids = [];

	user.groups.forEach(function(currValue, index) {
		dataporten_groupids.push(currValue.id);
	});
	return dataporten_groupids;
}

var getGroupIds = function(user, callback) {
	var dataporten_groupids = getDataportenGroupIds(user);
	getAuthorId(user, function(authorId) {
		async.map(dataporten_groupids, function(dataporten_groupid, callback) {
			resolveGroupId(dataporten_groupid, function(groupid) {
				callback(null, groupid);
			});
		}, function(err, results) {
			callback(results, authorId);
		});
	});
}

var getSession = function(user, callback) {
	getGroupIds(user, function(groupids, authorId) {
		async.map(groupids, function(groupid, callback) {
			resolveSessionFromGroupId(authorId, groupid, function(sessionid) {
				callback(null, sessionid);
			});
		}, function(err, results) {
			callback(results);
		});
	});
}

exports.getSession 	= getSession;
exports.createPad 	= creatPad;
exports.listPads 	= listPads;