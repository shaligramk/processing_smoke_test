smoke_test
==========

The purpose of the smoke test here are twofold: one is to determine whether the application is ready for more in depth testing and secondly, to verify whether processing should not have been affected by the changes to the new build. If the smoke test fails, there is no point in running other functional tests.


PhantomJS is a 'headless' browser which means it is a normal browser stack that has been converted to run from the command line and to be scriptable through a JavaScript API.It runs without displaying any UI to the screen. It loads and navigates webpages in memory and logs the results. Since it is a full WebKit browser it supports modern features such as HTML5, SVG, Ajax, CSS selectors and so on. These qualities make it ideal for running automated tests.Casper is a testing framework built on top of Phantom. It provides a range of test-specific functionality that make writing tests easy and quick. These test-specific features include (start, waifFor, then,etc.) and also test concepts such as (assert, assertVisible,assertEquals,etc.) 