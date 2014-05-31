	/*
	Objective: To perform a smoke test for Processor by processing a Reflowable PDF 
	Last Updated: May 30, 2014
	*/

	var url = "https://qa-1.chaucercloud.com/";
	var x = require('casper').selectXPath;
	var fileName='gettysburg.pdf';
	var username = 'admin';
	var password = 'books';
	var projectTitle = 'gettysburg'; 
	var bookPublisher = 'PDF Test'; 
	var bookAuthor = 'Shawn Shaligram'; 
	var coverImage = 'cover_pdf.png';


	//Begin CasperJs Test Suite
	casper.test.begin("Welcome to Chaucer", 6, function suite(test) {
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
				this.capture("screenshots/login_successfull.png", { top: 0, left:0,  width:1000, height:500});
				this.then(function() {
					this.evaluate(function() {
						document.getElementsByClassName('btn newProject')[0].click();
					});
				});
			});

			// Choose Target Book Type
			casper.waitForSelector("form#publication_form input[name='bookType[]']",
				function success() {
					this.click("form#publication_form input[name='bookType[]']");
				},
				function fail() {
					test.assertExists("form#publication_form input[name='bookType[]']");
				});

			casper.waitForSelector("#bookLayoutType8",
				function success() {
					this.then(function() {
						this.evaluate(function() {
							document.getElementById('bookLayoutType8').options[1].selected =true; 
							document.getElementById('bookTabLiType8').setAttribute('style', 'display: list-item;');
						});
					});
				},
				function fail() {
					test.assertExists("#bookLayoutType8");
				});
			
			// Enter Project Information		
			casper.waitFor(function check() {
				var ele = this.getElementAttribute('li[id="bookTabLiType8"]', 'style');
				if(ele == "display: list-item;") {
					return true;
				}
			}, function fillProjectInfo() {
				this.sendKeys("input[name='jform[publication_name]']", projectTitle);
				this.sendKeys("input[name='jform[publication_publisher]']", bookPublisher);
				this.sendKeys("input[name='jform[publication_authors]']", bookAuthor);
				this.capture('screenshots/enter_project_info.png', { top: 0, left:0,  width:1000, height:800});

			}, null, 10000);

			//Click on Reflowable Tab
			casper.waitForSelector("a[id='bookTabAhrefID_8']",
				function success() {
					test.assertExists("a[id='bookTabAhrefID_8']");
					this.click("a[id='bookTabAhrefID_8']");
				},
				function fail() {
					test.assertExists("a[id='bookTabAhrefID_8']");
				});

			// Upload the the PDF file and its cover image
			casper.then(function() {
				casper.page.uploadFile('a[id=upload8_browse]', fileName);
				casper.page.uploadFile('input[name=logo_8]', coverImage);
				test.assertExists("a[id=upload8_browse]");
				casper.waitFor(function saveProjectEnabled() {
					return this.evaluate(function() {
						return !(document.getElementById('saveProjectBtn').getAttribute('disabled') === "disabled");
					});
				}, function saveProject() {
					this.capture('screenshots/upload_successfull.png', { top: 0, left:0,  width:1500, height:1500});
					this.click('#saveProjectBtn');

					casper.waitFor(function checkSaveStatus() {
						return this.evaluate(function () {
							return document.querySelector('.newProject').innerHTML === "New Project";
						});
					}, function saveSuccess() {
						this.capture('screenshots/save_proj_success.png', { top: 0, left:0,  width:1500, height:1500});
					}, function saveFailure() {
						this.capture('screenshots/save_proj_failure.png', { top: 0, left:0,  width:1500, height:1500});
					},
					60000);
				}, function failedSaveProject() {
					this.capture('screenshots/upload_failure.png', { top: 0, left:0,  width:1500, height:1500});
				}, 9000);
			});

			// Back to Project Tracker and search for Project Title through the search form
			casper.waitForSelector("form[name=adminForm] input[name='searchProjects']",
				function success() {
					test.assertTitle("Chaucer", "Back to Project Tracker Page");
					this.sendKeys("input[name='searchProjects']", projectTitle);
					this.capture('screenshots/Before_SearchProject_Submit.png', { top: 0, left:0,  width:1500, height:1500});

					this.evaluate(function () {
						document.forms['book-manager'].submit();
					});
				},
				function fail() {
					test.assertExists("form[name=adminForm] input[name='searchProjects']");
				});

			// Wait for 20 seconds to verify processing
			casper.then(function() {
				this.wait(20000);
			});

			// Logic to look for DOM Nodes + their computed style 
			casper.waitForSelector("#bookListTable",
				function success() {
					var result = this.evaluate(function (projectTitle) {
						var title = document.querySelector("#bookListTable > tbody > tr > td .title-publisher > a");
						var textIsGettysburg = document.querySelector("#bookListTable > tbody > tr > td .title-publisher > a").text.trim() === "gettysburg";
						var controlsHidden = getComputedStyle(document.querySelector("#bookListTable > tbody > tr > td > .controls-container")).display === 'none';
						return textIsGettysburg && !controlsHidden;
					});

					if(result) {
						this.capture('screenshots/SearchProject_Success.png', { top: 0, left:0,  width:1500, height:1500});

					} else {
						this.capture('screenshots/SearchProject_Failure.png', { top: 0, left:0,  width:1500, height:1500});
					}
					test.assert(result);  

				}, function fail() {
					this.capture('screenshots/SearchProject_Failure.png', { top: 0, left:0,  width:1500, height:1500});

				});
		});

}).run(function() {
	test.done();
});
});
