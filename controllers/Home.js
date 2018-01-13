var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new (require("../models/ContentModel"));

module.exports = BaseController.extend({
	name: "Home",
	content: null,
	run: function(req, res, next) {
		model.setDB(req.db);
		var self = this;
		this.getContent(function() {
			var v = new View(res, 'home');
			v.render(self.content);
		})
	},
	getContent: function(callback) {
		var self = this;
		this.content = {};
		model.getlist(function(err, records) {
			if(records.length > 0) {
				self.content.bannerTitle = records[0].title;
				self.content.bannerText = records[0].text;
			}
			model.getlist(function(err, records) {
				var blogArticles = '';
				if(records.length > 0) {
					var to = records.length < 5 ? records.length : 4;
					for(var i=0; i<to; i++) {
						var record = records[i];
						blogArticles += '\
							<div class="item__blog">\
								<a class="blog__item-name" href="/blog/' + record.ID + '">' + record.title + '</a>\
								<hr class="blog__hr" />\
								<img class="blog__item-img" src="' + record.picture + '" alt="" />\
								<p class="author">By admin</p>\
	                        </div>\
						';
					}
				}
				self.content.blogArticles = blogArticles;
				callback();
			}, { type: 'blog' });
		}, { type: 'home' });
	}
});