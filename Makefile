.PHONY: run
run:
	echo "http://localhost:8000/demo"
	python3 -m http.server

.PHONY: min
min:
	cat pedit.js | tr -d " \t\n\r" > pedit.min.js

.PHONY: assets
assets:
	base64 assets/icons.png
	base64 assets/unscii.png
