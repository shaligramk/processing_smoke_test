CasperJs Smoke Test
==========

The purpose of the smoke test here are twofold: one is to determine whether the application is ready for more in depth testing and secondly, to verify whether processing should not have been affected by the changes to the new build. If the smoke test fails, there is no point in running other functional tests.

Getting Started
====================

1. Instructions to install Casper and Phantom can be found here:

http://docs.casperjs.org/en/latest/installation.html

2. Clone from here:
	https://github.com/shaligramk/smoke_test

3. Setup file structure locally:
	In your root directory, add the sample PDF and IDML files and cover images in addition to the smoke tests.

4. Download ePub Check .jar file to the root directory:
	https://github.com/IDPF/epubcheck/releases  – version ePubcheck 3.0.1

5. Variables:

	a. Change URL for each build
	b. Enter Credentials
	c. Verify paths for fileName and coverImage are congruent. 
	
6. In the Terminal:
	Navigate to the root directory.
	Type
		`casperjs test <filename> --verbose  --xunit=log.xml`

License
====================
MD Smoke Test is released under the [MIT License](http://opensource.org/licenses/MIT)
