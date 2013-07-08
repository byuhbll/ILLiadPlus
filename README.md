# ILLiadPlus

IlliadPlus.js is a Javascript "layer" used in conjuction with jQuery to enhance the main menu of the ILLiad's patron-facing web interace. It converts ILLiad's outstanding, checkout, and electronic delivery tables into more logical categories and provides direct access to edit, view, or cancel requests directly from the main menu. 

ILLiadPlus was created by Grant Zabriskie (@gzabrisk) and Joe Larson at the BYU Harold B. Lee Library. 

## Please note

* ILLiadPlus.js has only been tested with jQuery 1.7.1.
* ILLiadPlus.js has not been tested on any other system but BYU's own ILLiad instance (where it works great). You may find some BYU HBLL specific lableing in the JS and CSS which you will need to change to match your own organization and needs. It is very likely that you will have to make changes to the both the JS and CSS before it's working and looking right for your particular system.
* We cannot provide direct support at this time. Once you take this code into your hands, it's yours to use, customize, and troubleshoot. We wish you luck and hope you find ILLiadPlus to be a benfit to your users!

## Installation

Download jQuery (recommended version: 1.7.1) and reference it in you web pages' `<head>` code.  Then download the ILLiadPlus files and make sure that illiadplus.js and illiadplus.css are referenced in your web pages' `<head>` code. 

	<!DOCTYPE html>
	<head>
		<title>Your Site Title</title>

		<link rel="stylesheet" href="path/to/illiadplus.css" type="text/css" />	

		<script src="path/to/jquery.js"></script>
		<script src="path/to/illiadplus.js" type="text/javascript"></script>
	</head>

## Usage

ILLiadPlus.js is replaces the tables produced by the by ILLiad TABLE tags with more usable and functional HTML. The Javascript reads and stores the content of the tables and then reformats the data into a more helpful design. Essentially, the ILLiad TABLE tags act like an on-page database for Javascript to read and use. Weird, we know, but it works!

The BYU instance uses ILLiadPlus.js on following ILLiad templates in association with the following TABLE tags:

| Template                           | Tabel Tag Name             |
| ---------------------------------- | -------------------------- |
| ILLiadMainMenu.html                | ViewRenewCheckedOutItems   |
| ILLiadMainMenu.html                | ElectronicDelivery         |
| ILLiadMainMenu.html                | ViewOutstandingRequests    |
| ViewResubmitCancelledRequests.html | ViewResubmitCancelledItems |
| ViewRequestHistory.html            | ViewRequestHistory         |

The tables to be replaced must be surrounded by a container with an ID of "ill_requests," and each individual table must be surrounded by a container with the class of "tabledata." 

Each table must have certain parameters and labels as seen in the examples below. This is very important.

Lastly, you must include a reference to the `illplus_requests()` function before the table(s) you want to replace.

Here are examples from the BYU instance for each template:

### ILLiadMainMenu.html

	<div id="ill_requests">

		<nav id="ill_filters"></nav>

		<h1>My Requests</h1>

		<script type="text/javascript"> illplus_requests(); </script>
		
		<section class="tabledata">
			<h2 id="#checkedout">Checked Out Items</h2>
			<#TABLE name="ViewRenewCheckedOutItems" column="TransactionNumber:Request #" column="DocumentType:Type" column="Title" column="Author" column="TransactionStatus:Status" column="DueDate:Due Date" orderBy="DueDate ASC">
		</section>

		<section class="tabledata">
			<h2 id="#available">Electronic Items</h2>
			<#TABLE name="ElectronicDelivery" column="TransactionNumber:Request #" column="Type" column="PhotoArticleTitle:Title" column="PhotoArticleAuthor:Author" column="Status" column="Expires" column="PhotoJournalTitle:Journal" column="View" column="Delete">
		</section>

		<section class="tabledata">
			<h2 id="#inprocess">Outstanding Requests</h2>
			<#TABLE name="ViewOutstandingRequests" column="TransactionNumber:Request #" column="DocumentType:Type" column="Title" column="Author" column="TransactionStatus:Status" column="Date" orderBy="TransactionNumber DESC">
		</section>
	</div>

### ViewResubmitCancelledRequests.html 

	<div id="ill_requests">

		<h1>Cancelled Requests</h1>

		<script type="text/javascript"> illplus_requests(); </script>

		<section class="tabledata">
		  <#TABLE name="ViewResubmitCancelledItems" column="TransactionNumber:Request #" column="DocumentType:Type" column="Title" column="Author" column="TransactionStatus:Status" column="Date" orderBy="TransactionNumber DESC"></#TABLE>
		</section>
	</div>

### ViewRequestHistory.html

	<div id="ill_requests">

		<h1>Past Requests</h1>
		
		<script type="text/javascript"> illplus_requests(); </script>

		<section class="tabledata">
			<#TABLE name="ViewRequestHistory" column="TransactionNumber:Request #" column="DocumentType:Type" column="Title" column="Author" column="TransactionStatus:Status" column="Date" orderBy="TransactionNumber DESC">
		</section>
	</div>	
