.PHONY: github


all: github


github:
	ghp-import www
	git push origin gh-pages
