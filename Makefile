default:
	browserify main.js -o public/js/bundle.js

develop:
	budo editor.js:public/js/bundle.js --serve js/bundle.js --host 127.0.0.1 --live --open --dir ./public -v

publish:
	git subtree push --prefix public origin gh-pages
	@echo ""
	@echo "--------------------------------------------"
	@echo 'Go to: http://gamemash.github.io/wolfenstein/'
