.PHONY : wsm-bandwidth

DIRS=$(wildcard workspaces/*-raw)
RUNS=$(DIRS:workspaces/%=charts/%)
TARGETS=$(RUNS:-raw=-wsm-bandwidth-2d.json) $(RUNS:-raw=-wsm-bandwidth-3d.json)

default:
	echo $(TARGETS)

wsm-bandwidth : charts/0821-front-wsm-bandwidth-2d.json charts/0821-front-wsm-bandwidth-3d.json

charts/%-wsm-bandwidth-2d.json : workspaces/%-raw/log/tx workspaces/%-ictl-cl1/log/tx workspaces/%-ictl-cl4/log/tx
	../chart-utils/main.js --names 'Raw' 'Raw Compressed' 'ICTL CL=4' --paths $? --chart wsm-bandwidth-2d > $@

charts/%-wsm-bandwidth-3d.json : workspaces/%-raw/log/tx workspaces/%-ictl-cl1/log/tx workspaces/%-ictl-cl4/log/tx
	../chart-utils/main.js --names 'Raw' 'Raw Compressed' 'ICTL CL=4' --paths $? --chart wsm-bandwidth-3d > $@

charts/% : charts

charts:
	mkdir -p charts

