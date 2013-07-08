/*
 * Name:		ILLiadPlus.js
 *
 * Desciption:	A javascript layer to enhance the usability of the ILLiad homepage interface
 *
 * Creators:	Grant Zabriskie, Joe Larson at Brigham Young Univeristy
 *
 * Updated:		July 5, 2013
 * 
 * Requires:	jQuery (http://jquery.com/)
 *
 * Note:		BYU or the Harold B. Library cannot provide support for ILLiadPlus.js or 
 *				push upgrades to suport your instance of ILLiad. We maintain this code for 
 *				our own system. Once you take this code into your own hands, it's yours to 
 *				use, customize, and troubleshoot. We hope you find it benficial, though!
 */

var records = [];

function illplus_requests() {

	/////////////////////////////////////////////////////
	// Grab var from URL ////////////////////////////////
	/////////////////////////////////////////////////////
	
	function getUrlVar(key) {
		var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
		return result && result[1] || "";
	}

	$(document).ready(function() {

		/////////////////////////////////////////////////////
		// Convert ILLiad status to user-friendly status ////
		/////////////////////////////////////////////////////

		function getNewStatus(status) {
			
			var newStatus;

			// remove "until ##/##/##" from renewal-related statuses below
			// trim any whitespace or blank characters (needed for Downloadable items below)
			var cleanStatus = status.replace(/until\s\d{2}\/\d{2}\/\d{2}/g, "").trim();

			switch (cleanStatus) {
				case "Checked Out to Customer" :
					newStatus = "Checked out to you";
					break;
				case "Renewed by Customer" :
				case "Renewed by ILL Staff" :
				case "Awaiting Renewal OK Processing" :
				case "Awaiting Denied Renewal Processing" :
					newStatus = "Renewal in process";
					break;
				case "In Faculty Delivery" :
					newStatus = "Pending office delivery";
					break;
				case "Customer Notified via E-Mail" :
					newStatus = "Pick-up at Circulation Desk";
					break;
				case "In Special Collections" :
					newStatus = "Use in Special Collections";
					break;
				case "In Family History Library" :
					newStatus = "Use in Family History Library";
					break;
				case "" : //Downloadable items don't have visiable statuses through the tables
				case "Delivered to Web" :
					newStatus = "Available for download";
					break;
				case "Awaiting Copyright Clearance" :
				case "Awaiting Request Processing" :
				case "Awaiting Document Delivery Processing" :
					newStatus = "Awaiting processing";
					break;
				case "Awaiting DD Stacks Searching" :
				case "In Document Delivery Print Queue" :
				case "In DD Stacks Searching" :
				case "Awaiting Doc Del Scanning" :
				case "Awaiting Doc Del Customer Contact" :
				case "Awaiting Article Printing" :
				case "Awaiting Aux Processing" :
				case "Awaiting Book Printing" :
				case "Awaiting Distance Education Processing" :
				case "Awaiting El Del Scanning" :
				case "Awaiting HBLL Processing" :
				case "Finished Aux Requests" :
					newStatus = "In HBLL processing";
					break;
				case "Cancelled by ILL Staff" :
				case "Cancelled by Customer" :
					newStatus = "Cancelled";
					break;
				case "Request Finished" :
					newStatus = "Request closed";
					break;
				default :
					newStatus = "In process";
					break;
			}
			
			return newStatus;
		}


		/////////////////////////////////////////////////////
		// Determine section of user-friendly status ////////
		/////////////////////////////////////////////////////

		function getSection(newStatus) {

			var section;

			var checkedOutStatusList = new Array('Checked out to you', 'Renewal in process');
			var availableStatusList = new Array('Pending office delivery', 'Pick-up at Circulation Desk', 'Use in Special Collections', 'Use in Family History Library', 'Available for download');
			var inProcessStatusList = new Array('Awaiting processing', 'In HBLL processing', 'In process');
			var cancelledStatusList = new Array('Cancelled');
			var pastStatusList = new Array('Request closed');

			if($.inArray(newStatus, checkedOutStatusList) > -1) {
				section = "checkedout";
			} else if($.inArray(newStatus, availableStatusList) > -1) {
				section = "available";
			} else if($.inArray(newStatus, inProcessStatusList) > -1) {
				section = "inprocess";
			} else if($.inArray(newStatus, cancelledStatusList) > -1) {
				section = "cancelled";
			} else if($.inArray(newStatus, pastStatusList) > -1) {
				section = "past";
			}

			return section;
		}
		

		//////////////////////////////////////////////////////////////////////
		// Return string of option links associated with item status and id	//
		//////////////////////////////////////////////////////////////////////

		function getOptions(newStatus, id) {

			var viewLink = 'illiad.dll?Action=10&Form=63&&Value=' + id;
			var editLink = 'illiad.dll?Action=20&Form=63&Value=' + id;
			var resubmitLink = 'illiad.dll?Action=11&Form=71&Value=' + id;
			var renewLink = 'illiad.dll?Action=11&Form=67&Value=' + id;
			var cancelLink =  'illiad.dll?Action=21&Type=10&Value=' + id;
			var downloadLink = 'illiad.dll?Action=10&Form=75&Value=' + id;
			var deleteLink = 'illiad.dll?Action=22&Type=11&Value=' + id;

			var view= '<a href="' + viewLink + '">View</a>';
			var edit = '<a href="' + editLink + '">Edit</a>';
			var renew = '<a href="' + renewLink + '">Renew</a>';
			var resubmit = '<a href="' + resubmitLink + '">Resubmit</a>';
			var cancel = '<a class="cancel_link" href="' + cancelLink + '">Cancel</a>';
			var download = '<a href="' + downloadLink + '">Download</a>';
			var deleteDownload = '<a href="' + deleteLink + '">Delete</a>';
			
			var result = "";

			switch (newStatus) {
				case "Awaiting processing":
					result += view + " | " + edit + " | " + cancel; break;
				case "In process":
				case "Renewal in process":
					result += view + " | " + cancel; break;
				case "Checked out to you":
					result += view + " | " + renew; break;
				case "In HBLL processing":
					result += view; break;
				case "Available for download":
					result += view + " | " + download + " | " + deleteDownload; break;
				case "Cancelled":
					result += view + " | " + resubmit; break;
			}

			return result;
		}

		
		//////////////////////////////////////////////////////
		// Append section of records according to ////////////
		//////////////////////////////////////////////////////
		
		function appendSection(section) {

			// Set Title
			var title;

			switch (section) {
				case "inprocess":
					title = "In Process"; break;
				case "available":
					title = "Available for Use"; break;
				case "checkedout":
					title = "Checked out to You"; break;
				case "cancelled":
					title = "Cancelled"; break;
				case "past":
					title = "Past"; break;
			}

			// Generate HTML
			var result = "";
			result += "<section id='" + section + "' class='ill_requests'>";
			result += "<h2>" + title + "</h2>";

			result += "<ul>";

			for(i = 0; i < records.length; i++) {
				if(records[i].section == section) {
					result += "<li id='" + records[i].id + "' class='ill_request'>";
					result += "<div class='ill_type " + records[i].typeClass + "'>" + records[i].type + "</div>";
					result += "<h3><a href='illiad.dll?Action=10&Form=63&Value=" + records[i].id + "'>" + records[i].title + "</a></h3>";
					if(records[i].author.trim() !== "") {
						result += "<div class='ill_request_author'>by <b>" + records[i].author + "</b></div>";
					} else { }
					result += "<div class='ill_request_options'><span class='ill_request_status'>" + records[i].status + "</span> " + getOptions(records[i].status, records[i].id) + "</div>";
					if (records[i].date !== "") {
						// set dateType to "expires", "due", or ""
						var dateType = "";
						switch (records[i].status) {
							case "Available for download":
								dateType = "expires"; break;
							case "Checked out to you":
							case "Pick-up at Circulation Desk":
								dateType = "due"; break;
						}
						result += '<div class="ill_request_date">' + dateType + ' <b>' + records[i].date + '</b></div>';
					}
					result += "<div class='ill_request_number'>#" + records[i].id + "</div>";
				}
			}

			result += "</ul>";
			result += "</section>";

			$("#ill_requests").append(result);
		}
		

		//////////////////////////////////////////////////////
		// Replace tables with awesome helpful lists /////////
		//////////////////////////////////////////////////////
	
		// create records array

		// start count used by each function below
		var count = 0;

		// Create object database from tables
		$("tr").each(function(){

			// set undefined attribute to empty string
			function undefinedToString (a) {
				if (a === undefined) {
					return "";
				} else {
					return a;
				}
			}


			if(!$(this).html().match("(<th>)")){
				matches = $(this).text().trim().split('\n');
				records[count] = {};
				records[count].id = matches[0];
				records[count].type = undefinedToString(matches[1]);
				records[count].typeClass = matches[1].toLowerCase().split(' ').join('');
				records[count].status = getNewStatus(matches[4]);
				records[count].statusOld = matches[4];
				if (records[count].status == "Available for download") {
					records[count].typeClass = 'download'; records[count].type = 'Download';
				}
				records[count].title = matches[2];
				records[count].author = matches[3];
				records[count].section = getSection(records[count].status);
				records[count].date = undefinedToString(matches[5]);
				records[count].journal = undefinedToString(matches[6]);
				count++;
			}
		});

		// out with the old
		$('.tabledata').hide();

		// in with the new
		var formNumber = getUrlVar('Form');

		if (formNumber == 70) {  // canceled items

			appendSection("cancelled");

		} else if (formNumber == 68) {  // canceled items

			appendSection("past");

		} else { // main menu

			appendSection("checkedout");
			appendSection("available");
			appendSection("inprocess");

			var html = "";

			html += '<ul>';
			html += '<li><a class="selected" href="#all">Total Requests</a></li>';
			html += '<li><a href="#checkedout">Checked Out</a></li>';
			html += '<li><a href="#available">Available</a></li>';
			html += '<li><a href="#inprocess">In Process</a></li>';
			html += '</ul>';

			$("nav#ill_filters").prepend(html);

			// Count requests and show number in Total filter
			$("#ill_filters a[href='#all']").prepend("<b>" + count + "</b> ");

			// Count requests for each section and show in respective filter
			$("#ill_requests .ill_requests").each(function() {
				var id = $(this).attr("id");
				var num = $(this).find("li").length;
				$("#ill_filters a[href='#" + id + "']").prepend("<b>" + num + "</b> ");
			});

			// Filter sections by filter buttons
			$("#ill_filters a").click(function() {

				var section = $(this).attr("href");

				if (!$(this).hasClass("selected")) {
					$("#ill_filters a").removeClass("selected");
					$(this).addClass("selected");
					
					if (section != "#all") {
						$("#ill_requests section").hide();
						$("#ill_requests " + section).show();
					} else {
						$("#ill_requests .ill_requests").show();
					}
				}

				return false;
			});

			// Confirm cancel link
			$(".cancel_link").click(function() {
				var conf = confirm('Are you sure you want to cancel this request?\nClick OK to continue with cancellation.');
				if (conf === true) {
					return true;
				} else {
					return false;
				}
			});

			// Highlight added item
			if ($("#status span").has("a").length) {
				var status = $('#status span').text();
				var statusRequestNumber = status.match(/\d{7}/)[0];

				$(".ill_request").each(function() {
					var requestNumber = $(this).attr('id');

					if(statusRequestNumber == requestNumber) {
						$(this).addClass('highlight');
					}
				});

				$("#status a").click(function() {
					$("#" + statusRequestNumber).ScrollTo();
					return false;
				});
			}


		}

		// Add "no requests" message to sections without items
		$("#ill_requests .ill_requests").each(function() {
			var id = $(this).attr("id");
			var num = $(this).find("li").length;

			if (num === 0) {
				$(this).find("ul").remove();

				var message = "No items here";
				
				switch (id) {
					case "checkedout" :
						message = "No items checked out. Items will appear here when you have them in your possession."; break;
					case "available" :
						message = "No items available for use. Items will appear here when they are ready for you to use."; break;
					case "inprocess" :
						message = "No items in process. Items will appear here when you make a new request."; break;
					case "past" :
						message = "No past items. Items will appear here when you return items you've checked out."; break;
					case "cancelled" :
						message = "No cancelled items."; break;
				}

				$(this).append("<div class='ill_empty_notice'>" + message + "</div>");

			}
		});
		
	});
}
