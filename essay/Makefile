FN=dissertation

.PHONY: default clean clean-intermediate

default: $(FN).pdf clean-intermediate

$(FN).pdf: Makefile $(FN).tex *.sty bib.bib figures *.lst
	pdflatex $(FN).tex
	makeindex $(FN).nlo -s nomencl.ist -o $(FN).nls
	bibtex $(FN)
	pdflatex $(FN).tex
	pdflatex $(FN).tex

clean: clean-intermediate
	rm -rf $(FN).pdf
	
clean-intermediate:
	rm -rf $(FN).aux $(FN).log $(FN).out $(FN).bbl $(FN).blg $(FN).lof $(FN).lot $(FN).nlo $(FN).toc $(FN).ist $(FN).nls $(FN).ilg
