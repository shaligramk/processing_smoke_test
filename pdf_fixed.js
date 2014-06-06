	/*
	Objective: To perform a smoke test for Processor by processing a Fixed PDF 
	Last Updated: June 3, 2014
	*/

	var url = "https://stage-pearson.chaucercloud.com/";
	var x = require('casper').selectXPath;
	var fileName ='reading.pdf';
	var username = '';
	var password = '';
	var currDt = new Date();
	var projectTitle = 'act' + currDt.getTime(); 
	var bookPublisher = 'PDF Fixed Test'; 
	var bookAuthor = 'Shawn Shaligram'; 
	var coverImage = 'cover_flpdf.png';
	var consoleOutput = require('utils');

	//Begin CasperJs Test Suite
	casper.test.begin("Welcome to Chaucer", 9, function suite(test) {
		casper.start(url, function(){
			test.assertHttpStatus(200, "Login Screen has loaded");
			test.assertExists('form[action="/component/users/"]', "Login Form has been found");
			this.fill('form', {
				username: username,
				password: password
			},true);   
			this.then(function() {
				this.evaluate(function() {
					document.querySelector('button').click();
				});

			// Add Project Information
			this.then(function() {
				this.then(function() {
					this.evaluate(function() {
						document.getElementsByClassName('btn newProject')[0].click();
					});
				});
			});

			// Choose Target Book Type - Fixed
			casper.waitForSelector("form#publication_form input[id='bookTypeSelection9']",
				function success() {
					this.click("form#publication_form input[id='bookTypeSelection9']");
				},
				function fail() {
					test.assertExists("form#publication_form input[id='bookTypeSelection9']");
				});

			casper.waitForSelector("#bookLayoutType9",
				function success() {
					this.then(function() {
						this.evaluate(function() {
							document.getElementById('bookLayoutType9').options[1].selected = true; 
							document.getElementById('bookTabLiType9').setAttribute('style', 'display: list-item;');
						});
					});
				},
				function fail() {
					test.assertExists("#bookLayoutType9");
				});
			
			// Enter Project Information		
			casper.waitFor(function check() {
				var ele = this.getElementAttribute('li[id="bookTabLiType9"]', 'style');
				if(ele == "display: list-item;") {
					return true;
				}
			}, function fillProjectInfo() {
				this.sendKeys("input[name='jform[publication_name]']", projectTitle);
				this.sendKeys("input[name='jform[publication_publisher]']", bookPublisher);
				this.sendKeys("input[name='jform[publication_authors]']", bookAuthor);
				this.capture('screenshots/enter_project_info.png', { top: 0, left:0,  width:1000, height:800});

			}, null, 15000);

			//Click on Fixed Tab
			casper.waitForSelector("a[id='bookTabAhrefID_9']",
				function success() {
					test.assertExists("a[id='bookTabAhrefID_9']");
					this.click("a[id='bookTabAhrefID_9']");
				},
				function fail() {
					test.assertExists("a[id='bookTabAhrefID_9']");
				});

			// Upload the the PDF file and its cover image
			casper.then(function() {
				casper.page.uploadFile('a[id=upload9_browse]', fileName);
				casper.page.uploadFile('input[name=logo_9]', coverImage);
				test.assertExists("a[id=upload9_browse]");
				casper.waitFor(function saveProjectEnabled() {
					return this.evaluate(function() {
						return !(document.getElementById('saveProjectBtn').getAttribute('disabled') === "disabled");
					});
				}, function saveProject() {
					this.capture('screenshots/upload_successfull.png', { top: 0, left:0,  width:1500, height:1500});
					this.click('#saveProjectBtn');
				});
			});

			// Back to Project Tracker and search for Project Title through the search form
			casper.waitForSelector("form[name=adminForm] input[name='searchProjects']",
				function success() {
					test.assertTitle("Chaucer", "Back to Project Tracker Page");
					this.sendKeys("input[name='searchProjects']", projectTitle);
					this.evaluate(function () {
						document.forms['book-manager'].submit();
					});
				},
				function fail() {
					test.assertExists("form[name=adminForm] input[name='searchProjects']");
				});

			// Wait for 25 seconds to make sure the DOM nodes and their computed styles have been set
			casper.then(function() {
				this.wait(15000);
			});

			// Look for DOM Nodes + their computed style 
			casper.waitForSelector("#bookListTable",
				function success() {
					var result = this.evaluate(function (projectTitle) {
						__utils__.echo("projectTitle = " + projectTitle);
						var title = document.querySelector("#bookListTable > tbody > tr > td .title-publisher > a");
						var textisGWR = document.querySelector("#bookListTable > tbody > tr > td .title-publisher > a").text.trim() === projectTitle;
						var controlsHidden = getComputedStyle(document.querySelector("#bookListTable > tbody > tr > td > .controls-container")).display === 'none';
						return textisGWR && !controlsHidden;
					}, projectTitle);
					test.assert(result);  
				});	
		});	

			// Enter the book editor by clicking on the 'Edit Book'
			this.then(function() {
				this.evaluate(function() {
					document.querySelector('.edit-book').click();
				});

			//Wait for the Book Editor to load	
			casper.then(function() {
				this.wait(15000);
			});	

			// Wait for the book to load
			this.then(function() {
				test.assertExists('iframe[id="page-frame"]', "Book Editor iFrame found");
				this.capture('screenshots/book_editor.png', { top: 0, left:0,  width:1500, height:1500});
			});	
		});

		//Return to Project Tracker
		casper.waitForSelector(x("//a[normalize-space(text())='Chaucer']"),
			function success() {
				this.click(x("//a[normalize-space(text())='Chaucer']"));
				this.wait(5000);
			},
			function fail() {
				test.assertExists(x("//a[normalize-space(text())='Chaucer']"));
			});	

		// On Project Tracker to click on Export
		casper.waitForSelector("form[name=adminForm] input[name='searchProjects']",
			function success() {
				test.assertTitle("Chaucer", "Book Editor Back to the Project Tracker");
				this.capture('screenshots/book_editor_to_project_tracker.png', { top: 0, left:0,  width:1500, height:1500});
			},
			function fail() {
			});

		//Click on the Export Modal
		casper.waitForSelector(x("//a[normalize-space(text())='Export']"),
			function success() {
				test.assertExists(x("//a[normalize-space(text())='Export']"));
				this.click(x("//a[normalize-space(text())='Export']"));
			},
			function fail() {
				test.assertExists(x("//a[normalize-space(text())='Export']"));
			});

		// Run Child Process which in turn runs ePub Check 















	}).run(function() {
		test.done();
	});
});
