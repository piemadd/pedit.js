.PHONY: replit
replit:
	cat pedit.js | tr -d " \t\n\r" > pedit.min.js
