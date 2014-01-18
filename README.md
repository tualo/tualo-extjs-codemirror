Description
===========

tualo-extjs-codemirror is route for module express.js, that adds all needed files for the Tualo.form.field.Codemirror component files as a route.
Note: This module is just a wrapper of the original codemirror source.

Using
=====

Node part:

	var express = require('express');
	var codemirror = require('tualo-extjs-codemirror');
	...
	app = express();
	app.use(codemirror.middleware);
	
	// codemirror.javascripts 
	// codemirror.stylesheets 

Browser part:

	<link rel="stylesheet" href="/codemirror/lib/codemirror.css">
	<script src="/codemirror/lib/codemirror.js"></script>
