/*
Author: Shawn Shaligram
Objective: The purpose of this script is to perform a smoke test Reflowable PDF's
Last Updated: May 26, 2014
*/

var url = "https://qa-pearson.chaucercloud.com/";
var fileName='time.idml';
var username = 'shawn';
var password = 'nayana';
var projectTitle = 'Inside the Red Border - Shawn'; 
var bookPublisher = 'IDML Test'; 
var bookAuthor = 'Shawn Shaligram'; 
var childProcess = require('child_process');
var coverImage = 'cover_idml.png';


casper.test.begin("Welcome to Chaucer", 5, function suite(test) {
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
		
		// Fill out Project Information		
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

		}, null, 9000);

		//Click on Reflowable Tab
		casper.waitForSelector("a[id='bookTabAhrefID_8']",
			function success() {
				test.assertExists("a[id='bookTabAhrefID_8']");
				this.click("a[id='bookTabAhrefID_8']");
			},
			function fail() {
				test.assertExists("a[id='bookTabAhrefID_8']");
			});

		// Upload the Inside the Red Border - Reflowable File
		casper.then(function() {
			casper.page.uploadFile('a[id=upload8_browse]', fileName);
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
						return document.querySelector(".span7 > #success-div > h4");
					});
				}, function saveSuccess() {
					this.capture('screenshots/save_proj_success.png', { top: 0, left:0,  width:1500, height:1500});
				}, function saveFailure() {
					this.capture('screenshots/save_proj_failure.png', { top: 0, left:0,  width:1500, height:1500});
				},
				90000);

			}, function failedSaveProject() {
				this.capture('screenshots/upload_failure.png', { top: 0, left:0,  width:1500, height:1500});
			}, 9000);

		});


	//Wait for Processing to complete and validate processing
		casper.waitForSelector(".btn-primary",
			function success() {
				test.assertSelectorHasText('h4' , 'Processing complete');
				this.capture('screenshots/processing_screen.png', { top: 0, left:0,  width:1500, height:1500});
			},
			function fail() {
				test.assertExists(".btn-primary");
			});
	});

}).run(function() {
	test.done();
});
});
